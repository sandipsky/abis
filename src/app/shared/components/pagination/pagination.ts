import { Component, input, output, computed, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-paginator',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  standalone: true,
  imports: [CommonModule, Menu],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paginator {
  // Inputs as Signals
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  length = input<number>(0);
  
  // Model signals allow two-way binding and are writable
  pageSize = model<number>(10);
  pageIndex = model<number>(0);

  // Output using the new output API
  pageChange = output<{ pageIndex: number; pageSize: number; length: number }>();

  // Derived state: Total Pages
  totalPages = computed(() => {
    const len = this.length();
    const size = this.pageSize();
    return len > 0 ? Math.ceil(len / size) : 1;
  });

  // Derived state: Visible Page Numbers
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex() + 1;

    let start = Math.max(current - 2, 1);
    let end = start + 4;

    if (end > total) {
      end = total;
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Derived state: Range Label
  itemsInView = computed(() => {
    if (this.length() === 0) return 0;
    const remainingItems = this.length() - (this.pageIndex() * this.pageSize());
    return Math.min(this.pageSize(), remainingItems);
  });

  private emitChange() {
    this.pageChange.emit({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      length: this.length()
    });
  }

  onchangePageOption(size: number) {
    this.pageSize.set(size);
    this.pageIndex.set(0); // Reset to first page when size changes
    this.emitChange();
  }

  onPrevAndNext(direction: 'prev' | 'next') {
    this.pageIndex.update(idx => direction === 'prev' ? idx - 1 : idx + 1);
    this.emitChange();
  }

  goFirstPage() {
    this.pageIndex.set(0);
    this.emitChange();
  }

  goLastpage() {
    this.pageIndex.set(this.totalPages() - 1);
    this.emitChange();
  }

  goToPage(index: number) {
    this.pageIndex.set(index);
    this.emitChange();
  }
}