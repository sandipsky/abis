import { Component, ElementRef, HostListener, signal, input, viewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Menu {
  mode = input<'left' | 'right'>('left');
  closeOnItemClick = input(true);
  contentMode = input(false);
  showActiveState = input(true);
  menuStyle = signal<{ top: string; left: string }>({ top: '0px', left: '0px' });
  isReady = signal(false);
  isOpen = signal(false);

  content = viewChild<ElementRef<HTMLElement>>('content');

  private _host = inject(ElementRef);

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.isOpen.set(true);
      requestAnimationFrame(() => {
        this.calculatePosition();
        this.isReady.set(true);
      });
    }
  }

  calculatePosition(): void {
    const hostRect = this._host.nativeElement.getBoundingClientRect();
    const contentEl = this.content()?.nativeElement;

    if (!contentEl) return;

    const dropdownHeight = contentEl.offsetHeight;
    const dropdownWidth = contentEl.offsetWidth;
    const spaceBelow = window.innerHeight - hostRect.bottom;
    const spaceAbove = hostRect.top;

    let top = hostRect.bottom + 6;
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      top = hostRect.top - dropdownHeight - 6;
    }

    let left = hostRect.left;

    if (this.mode() === 'right') {
      left = hostRect.right - dropdownWidth;
    }

    this.menuStyle.set({
      top: `${top}px`,
      left: `${left}px`
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.isReady.set(false);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInside = this._host.nativeElement.contains(target);
    const isDropdownPanel = target.closest('.ng-dropdown-panel');

    if (!isInside && !isDropdownPanel) {
      this.close();
    }
  }
}