import { Component, computed, inject, input, output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';

import { Menu } from '../menu/menu';
import { SortEvent } from '../../models/sort.model';
import { ConfigurationService } from '../../services/configuration.service';
import { DateService } from '../../services/date.service';
import { AmountPipe } from "../../pipes/amount-pipe";
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, MatTooltipModule, AmountPipe, Button],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  // Services
  private configService = inject(ConfigurationService);
  private dateService = inject(DateService);

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
  sortChange = output<SortEvent>();
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

  // Derived State / Reactive Config
  // Converts the Observable configuration to a Signal automatically
  // private configData = toSignal(this.configService.configuration$);
  
  // Computed property that updates whenever the config signal changes
  // dateType = computed(() => this.configData()?.dateType ?? 'BS');

  onSort(event: any) {
    this.sortChange.emit(event);
  }
}