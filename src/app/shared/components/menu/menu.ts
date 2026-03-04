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
export class MenuComponent {
  mode = input<'left' | 'right'>('left');
  closeOnItemClick = input(true);
  contentMode = input(false);
  showActiveState = input(true);

  content = viewChild<ElementRef<HTMLElement>>('content');

  isOpen = signal(false);
  openTop = signal(false);

  private host = inject(ElementRef);

  toggle(): void {
    this.isOpen.update(open => !open);

    if (this.isOpen()) {
      requestAnimationFrame(() => this.calculatePosition());
    }
  }

  private calculatePosition(): void {
    const contentEl = this.content()?.nativeElement;
    if (!contentEl) return;

    const rect = contentEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    this.openTop.set(spaceBelow < 120);
  }

  close(): void {
    this.isOpen.set(false);
    this.openTop.set(false);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInside = this.host.nativeElement.contains(target);
    const isDropdownPanel = target.closest('.ng-dropdown-panel');

    if (!isInside && !isDropdownPanel) {
      this.close();
    }
  }
}