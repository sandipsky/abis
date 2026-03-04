import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  @Input() mode: 'left' | 'right' = 'left';
  @Input() closeOnItemClick = true;
  @Input() contentMode = false;
  @ViewChild('content') content!: ElementRef<HTMLElement>;

  isOpen = false;
  openTop = false;

  constructor(private host: ElementRef) { }

  toggle(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      setTimeout(() => this.calculatePosition());
    }
  }

  private calculatePosition(): void {
    if (!this.content) return;

    const rect = this.content.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    this.openTop = spaceBelow < 120;
  }

  close(): void {
    this.isOpen = false;
    this.openTop = false;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.host.nativeElement.contains(event.target) &&
      !target.closest('.ng-dropdown-panel')) {
      this.close();
    }
  }
}
