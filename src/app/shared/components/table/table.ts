import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { SharedModule } from "../../shared/shared/shared.module";
// import { SortEvent } from '../sortable-directive/sortable-header.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
import { Subscription } from 'rxjs';
import { MenuComponent } from '../menu/menu';
import { FormsModule } from '@angular/forms';
// import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-table',
  imports: [CommonModule,
    FormsModule,
    //  SharedModule,
    MenuComponent, MatTooltipModule],
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

  getRemainingNames(items: any[]): string {
    return items
      .slice(2)
      .map(i => i.name)
      .join(', ');
  }

  isCheckboxDisabled(row: any, property: string): boolean {
    const isActive = row[property];
    if (isActive && !this.hasDeactivatePermission) {
      return true;
    }
    if (!isActive && !this.hasReactivatePermission) {
      return true;
    }
    return false;
  }

  onToggle(event: Event, row: any, property: string) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked && !this.hasReactivatePermission) {
      event.preventDefault();
      return;
    }

    if (!checked && !this.hasDeactivatePermission) {
      event.preventDefault();
      return;
    }

    row[property] = checked;
    this.onStatusChange.emit(row);
  }

  transform(value: string): string {
    if (value == null || value == '') {
      return '';
    }
    let date = value?.split(' ')[0] || '';
    let time = value?.split(' ')[1]?.split('.')[0];
    let formattedTime = this.formateTime(time);
    return `${date}, ${formattedTime}`;
  }

  formateTime(time: any) {
    if (time == null || time == '') {
      return '';
    }
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let formattedHours = +hours;
    if (formattedHours >= 12) {
      period = 'PM';
      formattedHours = formattedHours === 12 ? formattedHours : formattedHours - 12;
    }
    formattedHours = formattedHours === 0 ? 12 : formattedHours; // Convert 0 to 12 for 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
  }

  ngOnDestory() {
    this.configSubscription.unsubscribe();
  }

}
