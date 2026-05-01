import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Menu } from '@/shared/components/menu/menu';
import { ISortEvent } from '@/shared/models/sort.model';
import { AmountPipe } from "@/shared/pipes/amount-pipe";
import { Button } from '@/shared/components/button/button';
import { SortableHeaderDirective } from '@/shared/directives/sortable';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, MatTooltipModule, AmountPipe, Button, SortableHeaderDirective],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  // Inputs as Signals
  tableHeaders = input<any[]>([]);
  tableData = input<any[]>([]);
  filterData = input<any>({ pageIndex: 0, pageSize: 25 });
  actions = input<string[]>([]);

  // Permissions as Signals (with default values)
  hasEditPermission = input(true);
  hasChangePermission = input(true);
  hasDeletePermission = input(true);
  hasCancelPermission = input(true);
  hasPurchasePermission = input(true);
  hasSalesPermission = input(true);
  hasHoldPermission = input(true);
  hasPendingPermission = input(true);

  // Outputs
  sortChange = output<ISortEvent>();
  onEdit = output<any>();
  onChange = output<any>();
  onCopy = output<any>();
  onStatusChange = output<any>();
  onView = output<any>();
  onDelete = output<any>();
  onViewHistory = output<any>();
  onAddUser = output<any>();
  onCancel = output<any>();
  onPurchase = output<any>();
  onSales = output<any>();
  onHold = output<any>();
  onPending = output<any>();

  private readonly chipClasses = ['info', 'warn', 'warn', 'cancel'];

  chipClass(index: number): string {
    return this.chipClasses[index % this.chipClasses.length];
  }

  onSort(event: any) {
    this.sortChange.emit(event);
  }
}