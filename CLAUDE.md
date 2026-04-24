# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` / `ng serve` — run dev server at http://localhost:4200 (dev configuration, with `front1.abisplus.local` as an allowed host).
- `ng build` — production build to `dist/` (default config is `production`; budgets: initial 500kB warn / 1MB error, per-component style 4kB warn / 8kB error).
- `npm run watch` — incremental dev build.
- `ng test` — run Vitest unit tests. There are currently no `.spec.ts` files in `src/` and the Angular schematics are configured with `skipTests: true`, so new code is not scaffolded with tests by default.
- `ng generate component <path/name>` — scaffold a component. Schematics default to SCSS styles and skip tests for components, classes, directives, guards, interceptors, pipes, resolvers, and services.

TypeScript is ~5.9, Angular is 21.1 with the new `@angular/build:application` builder. Code style is enforced by Prettier (`printWidth: 100`, `singleQuote: true`, `parser: angular` for `.html`) configured inline in `package.json`.

## Architecture

This is an ERP-style Angular 21 SPA (`abis`) that talks to a REST backend configured in [src/environments/environment.ts](src/environments/environment.ts) (currently `http://182.93.83.242:9007`, no production environment file). Fiscal year `2082-83` is used throughout the login flow — this is a Nepali-calendar product (see `np-datepicker-angular` and the Nepali date picker styles in [src/styles.scss](src/styles.scss)).

### Bootstrap and global providers

[src/main.ts](src/main.ts) bootstraps the standalone `App` component with [src/app/app.config.ts](src/app/app.config.ts), which wires:
- `provideRouter(routes)` — see [src/app/app.routes.ts](src/app/app.routes.ts).
- `provideHttpClient(withInterceptors([authInterceptor]))` — functional interceptor at [src/app/auth/auth.interceptor.ts](src/app/auth/auth.interceptor.ts) that attaches `Authorization: Bearer <token>` from `localStorage`.
- `provideToastr()` — `ngx-toastr` is the app-wide notification system; components typically inject `ToastrService` directly.

The root `App` component calls [ConfigurationService.loadSavedPreferences()](src/app/shared/services/configuration.service.ts) on construction to restore `theme` (0 = dark) and `accent` (0 = blue, 1 = green) from `localStorage` by toggling `dark-theme` / `accent-*` classes on `document.body`. Any new theme / palette work must go through this service so the class toggles stay consistent.

### Routing

Two-level routing in [src/app/app.routes.ts](src/app/app.routes.ts):
- Authenticated shell: `path: ''` with `component: Layout`, guarded by `authGuard`. All feature routes are its children.
- Feature route groups are composed by spreading module-level route arrays (e.g. `...masterRoutes`, `...settingsRoutes`) — follow this pattern when adding a new feature area rather than inlining routes in `app.routes.ts`.
- `/login` is guarded by `loginGuard` (redirects already-authenticated users).
- `**` redirects to `/dashboard`.

All feature components are lazy-loaded via `loadComponent: () => import(...).then(m => m.X)`. Components are standalone (no `NgModule` declarations); the only surviving module is [src/app/shared/shared-module.ts](src/app/shared/shared-module.ts), which simply re-exports four shared standalone components (`Filter`, `Paginator`, `Table`, `Menu`) for convenient bulk import.

### Auth

[AuthService](src/app/auth/auth.service.ts) is localStorage-backed: `token` and `fiscalYear` keys. `isAuthenticated()` only checks for presence of `token`. `authGuard` returns a `UrlTree` to `/login` when unauthenticated; `loginGuard` mirrors this for the login page. There is no refresh-token flow and `userPermissionList()` currently returns `[]` (see the permission hooks in `GeneralMaster` — they are already wired but gated on this empty list).

### Generic master pattern

Simple lookup tables (Units, Packings, Tax Types, Category) are all thin wrappers around [GeneralMaster](src/app/modules/master/general-master/general-master.ts). A new master is one file that renders:

```html
<app-general-master endPoint="units" masterName="Unit"
  createMasterPermissionName="CreateUnits" editMasterPermissionName="EditUnits"
  deleteMasterPermissionName="DeleteUnits" exportMasterPermissionName="ExportUnits">
</app-general-master>
```

`GeneralMaster` uses signal-based state (`signal`, `computed`, `input.required`, `input`) and `ChangeDetectionStrategy.OnPush`. It calls `MasterService.getMasterList(filter, endPoint)` → `POST /master/<endPoint>/view` with `{ filter, pagination, sortDTO }`. Tax Type is special-cased with an extra `tax_rate` column/filter inside `tableHeaders` / `filterColumns` computed. Add/edit opens `MastersInlineModalComponent` as a right-drawer dialog (`panelClass: ['slide-left', 'drawer-right']`) — reuse that modal/drawer pattern for consistency.

[MasterService](src/app/modules/master/master.service.ts) is a grab-bag of endpoints under `/master/*` plus a few ad-hoc helpers (`apiUnitMasterAdd`, `apiURLDivisionList`, `apiUrl`). There is historical duplication (`addUnitMaster` vs. `createMaster`/`updateMaster`, commented-out `masterModel` import) — prefer the newer `createMaster` / `updateMaster` / `deleteMaster` / `getMasterDetail` quartet over the older `add*` methods when adding new screens. File uploads go through `addProductUnitMaster`, which builds a `FormData` with a `file` field and a `product` JSON `Blob`.

### Shared building blocks

- [shared/components](src/app/shared/components/) — `table`, `pagination`, `filter`, `menu`, `delete-modal`, `accordion`, `calculator`, `activity-log`, `range-print`, `loading-spinner`, plus a `ui/` subtree with reusable form primitives (`text-input`, `select-input`, `date-input`, `radio-input`, `checkbox-input`, `toggle-input`, `upload-input`), `button`, `icon`. Prefer these over raw HTML / Angular Material inputs.
- [shared/directives](src/app/shared/directives/) — `date-input`, `number-input`, `form-validation`, `sortable`.
- [shared/pipes](src/app/shared/pipes/) — `amount-pipe`, `date-pipe`, `filter-pipe`.
- [shared/services](src/app/shared/services/) — `configuration.service` (theme/accent), `breadcrumb.service`, `date.service` (BS/AD conversion surface), `dropdown.service`, `excel.service`, `pdf.service`, `spinner.service` (global loading flag observed by `LoadingSpinner`), `websocket.service`.

### Feature areas

`src/app/modules/` contains: `dashboard`, `products`, `master` (units/packings/tax-types/category/general-master), `settings` (configuration, document-number-scheme), `sales` (customers), `purchase` (vendors, purchase-entry, purchase-return), `accounting` (master-account), `user`, `roles-permission`. When adding a new feature, follow the `<feature>/<feature>.routes.ts` + spread-into-`app.routes.ts` convention used by `master` and `settings`.

### Styling

SCSS with CSS variables. [src/styles.scss](src/styles.scss) forwards partials from [src/scss/](src/scss/) (`_colors`, `_button`, `_chip`, `_modal`, `_utils`, `_bootstrap`, `_section`, `_form`, `_table`) plus the `ngx-toastr` and `@ng-select` themes. Theme (`dark-theme`) and accent (`accent-blue`, `accent-green`, `accent-red`) are body classes — reference colors via CSS custom properties (`var(--primary-color)`, `var(--separator-color)`, `var(--bg-lightest-color)`, etc.) rather than hard-coded hexes so both theme and accent switches keep working. A `@media print` block hides sidebar/header/filter/paginator — add `print-hidden` to anything that shouldn't print.

### Conventions to follow

- New components: standalone, `ChangeDetectionStrategy.OnPush`, signals (`signal`, `computed`, `input`, `input.required`, `output`) instead of `@Input`/`@Output` decorators.
- Inject dependencies with `inject(X)` on a private field; constructors are typically empty.
- Tests are intentionally absent — do not scaffold `.spec.ts` files unless the user asks.
