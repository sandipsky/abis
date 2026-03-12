import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
import { Subscription } from 'rxjs';
// import { DropdownsService } from 'src/app/services/dropdowns.service';
import { NepaliDatepickerModule } from 'np-datepicker-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu';

@Component({
  selector: 'filter-section',
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss'],
  standalone: true,
  imports: [NepaliDatepickerModule, NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MenuComponent]
})
export class FilterSectionComponent {
  filterList: any[] = [];
  lastFilter: any = null;
  repeatCount: number = 0;
  searchText: string = '';
  searchTerm: string = '';
  isSearching: boolean = false;
  searchTimer: any;
  dateType = 'BS';
  configSubscription!: Subscription;

  userList: any[] = [];

  @Input() filterColumns: any[] = [];
  @Input() searchBy: string = '';
  @Input() fromDate: string = '';
  @Input() toDate: string = '';
  @Input() showFromDate: boolean = true;
  @Input() showToDate: boolean = true;

  @Output() onFilterChange: EventEmitter<any[]> = new EventEmitter();
  @Output() onFromDateChange: EventEmitter<any> = new EventEmitter();
  @Output() onToDateChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterDropdown') filterDropdown!: MenuComponent;

  // constructor(private configService: ConfigServiceService, private dropDownService: DropdownsService) { }

  ngOnInit() {
  }

  applyFilter() {
    this.filterList = [];

    this.filterColumns.forEach(filter => {
      if (filter.value) {
        let activeFilter = {
          filterName: filter.name,
          formcontrolName: filter.formcontrolName,
          displayValue: filter.type == 'select' || filter.type == 'search-select'
            ? filter?.data?.find((item: any) => item?.id == filter?.value)?.name
            : filter.value,
          value: filter.value
        };
        this.filterList.push(activeFilter);
      }
    });


    if (JSON.stringify(this.filterList) === JSON.stringify(this.lastFilter)) {
      this.repeatCount++;
    } else {
      this.repeatCount = 1;
    }


    if (this.repeatCount === 2) {
      this.filterList = [];
      this.lastFilter = null;
      this.repeatCount = 0;
    } else {
      this.lastFilter = [...this.filterList];
    }

    this.closeDropdown();
    this.emitFilterList();
  }

  setFromDate(e: any) {
    this.onFromDateChange.emit(e);
  }

  setToDate(e: any) {
    this.onToDateChange.emit(e);
  }

  onSearch() {

    let activeFilter = {
      formcontrolName: this.searchBy,
      displayValue: this.searchText,
      type: 'search',
      value: this.searchText
    }

    if (this.filterList.some(item => item.type == 'search')) {
      this.filterList = this.filterList.filter(filter => filter.type != 'search');
      this.filterList.push(activeFilter);
    }
    else {
      this.filterList.push(activeFilter);
    }
    if (this.searchText == '' || this.searchText == null) {
      this.filterList = this.filterList.filter(filter => filter.type != 'search');
    }
    this.emitFilterList();
  }

  closeDropdown() {
    this.filterDropdown.close();
  }

  removeFilter(filter: any) {
    this.filterList = this.filterList.filter(item => item != filter);
    this.filterColumns.forEach(item => {
      if (item.name == filter.filterName) {
        item.value = null;
      }
    });
    this.emitFilterList();
  }

  removeAllFilter() {
    this.filterList = [];
    this.filterColumns.forEach(item => item.value = null);
    this.emitFilterList();
  }

  emitFilterList() {
    let finalList: any[] = [];
    this.filterList.forEach(filter => {
      finalList.push({
        field: filter.formcontrolName,
        value: filter?.value ? String(filter.value) : '',
        displayValue: filter?.displayValue
      })
    })
    this.onFilterChange.emit(finalList);
  }

  getUsers(event: any, type?: string) {
    clearTimeout(this.searchTimer);
    this.searchTerm = event.target.value.trim();
    this.isSearching = true;
    this.userList = [];
    // this.searchTimer = setTimeout(() => {
    //   if (this.searchTerm !== '') {
    //     this.isSearching = true;
    //     this.dropDownService.getAllRepresentativeDropDown(this.searchTerm, 0, 0).subscribe((result: any) => {
    //       this.userList = result.filter((it: any) => it?.name?.toLowerCase()?.includes(this.searchTerm?.toLowerCase()));
    //       this.isSearching = false;
    //     });
    //   }
    //   else {
    //     this.isSearching = false;
    //   }
    // }, 1000);
  }
}
