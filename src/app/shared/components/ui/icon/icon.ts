import { Component, input, signal, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="icon-container"
      [style.--icon-color]="color()"
      [style.--size]="size()"
      [innerHTML]="svgContent()">
    </span>
  `,
  styles: `
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ::ng-deep svg {
      width: var(--size);
      height: var(--size);
    }
    ::ng-deep svg path {
      stroke: var(--icon-color);
    }
  `
})
export class Icon {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  // ✅ cache of observables (NOT values)
  private static cache = new Map<string, any>();

  name = input.required<string>();
  size = input<string>('20px');
  color = input<string>('currentColor');

  svgContent = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const iconName = this.name();

      if (!iconName) return;

      // ✅ reuse existing request or cached stream
      if (!Icon.cache.has(iconName)) {
        const request$ = this.http
          .get(`assets/svg/${iconName}.svg`, { responseType: 'text' })
          .pipe(
            map(svg => {
              // optional cleanup
              const cleaned = svg
                .replace(/width="[^"]*"/g, '')
                .replace(/height="[^"]*"/g, '')
                .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');

              return this.sanitizer.bypassSecurityTrustHtml(cleaned);
            }),
            // 🔥 THIS is the key: caches + shares request
            shareReplay(1)
          );

        Icon.cache.set(iconName, request$);
      }

      // ✅ subscribe to cached observable
      Icon.cache.get(iconName).subscribe((res: SafeHtml) => {
        this.svgContent.set(res);
      });
    });
  }
}