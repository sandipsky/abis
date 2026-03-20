import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { SortEvent } from '../sortable-directive/sortable-header.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { Menu } from '../menu/menu';
import { FormsModule } from '@angular/forms';
// import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-table',
  imports: [CommonModule,
    FormsModule,
    Menu, MatTooltipModule],
  templateUrl: './table.html',
  standalone: true
})
export class Table {
  @Input() tableHeaders: any[] = [];
  @Input() tableData: any[] = [];
  @Input() filterData: any = {
    pageIndex: 0,
    pageSize: 25
  };
  @Input() actions: string[] = [];
  @Input() actionMode: string = 'inline';
  @Input() hasEditPermission: boolean = true;
  @Input() hasChangePermission: boolean = true;
  @Input() hasCopyPermission: boolean = true;
  @Input() hasDeletePermission: boolean = true;
  @Input() hasDeactivatePermission = true;
  @Input() hasReactivatePermission = true;
  @Input() hasHistoryPermission = true;
  @Input() hasAddUserPermission = true;
  @Input() hasCancelPermission = true;
  @Input() hasPurchasePermission = true;
  @Input() hasSalesPermission = true;
  @Input() hasHoldPermission = true;
  @Input() hasPendingPermission = true;
  // @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @Output() onCopy = new EventEmitter<any>();
  @Output() onStatusChange = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onViewHistory = new EventEmitter<any>();
  @Output() onAddUser = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Output() onPurchase = new EventEmitter<any>();
  @Output() onSales = new EventEmitter<any>();
  @Output() onHold = new EventEmitter<any>();
  @Output() onPending = new EventEmitter<any>();

  dateType: 'AD' | 'BS' = 'BS';
  configSubscription!: Subscription;
  companyDetails: any;

  // constructor(private configService: ConfigServiceService, public dateService: DateService) { }

  ngOnInit() {
    // this.configSubscription = this.configService.companyDetails$.subscribe((c) => {
    //   this.dateType = c?.calendar_format;
    //   this.companyDetails = c;
    // });
  }

  onSort(event: any) {
    // this.sortChange.emit(event);
  }

  ngOnDestory() {
    this.configSubscription.unsubscribe();
  }

}
