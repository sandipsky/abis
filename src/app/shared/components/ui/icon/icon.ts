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
      [style.--icon-stroke-width]="strokeWidth()"
      [style.--size]="size()"
      [innerHTML]="svgContent()">
    </span>
  `,
  styles: `
    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--icon-color);
    }
    ::ng-deep svg {
      width: var(--size);
      height: var(--size);
    }
    ::ng-deep .icon-stroke {
      stroke-width: var(--icon-stroke-width);
      vector-effect: non-scaling-stroke;
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
  strokeWidth = input<string | number>(1.5);

  svgContent = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const iconName = this.name();

      if (!iconName) return;

      // ✅ reuse existing request or cached stream
      if (!Icon.cache.has(iconName)) {
        const request$ = this.http
          .get(`/svg/${iconName}.svg`, { responseType: 'text' })
          .pipe(
            map(svg => {
              const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
              const svgEl = doc.documentElement;

              svgEl.removeAttribute('width');
              svgEl.removeAttribute('height');

              const elements = [svgEl, ...Array.from(svgEl.querySelectorAll('*'))];
              elements.forEach(el => {
                const stroke = el.getAttribute('stroke');
                const fill = el.getAttribute('fill');

                if (stroke && stroke !== 'none') {
                  el.setAttribute('stroke', 'currentColor');
                  el.classList.add('icon-stroke');
                }
                if (fill && fill !== 'none') {
                  el.setAttribute('fill', 'currentColor');
                }
              });

              return this.sanitizer.bypassSecurityTrustHtml(svgEl.outerHTML);
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