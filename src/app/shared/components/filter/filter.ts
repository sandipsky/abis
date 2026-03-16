import { Component, ChangeDetectionStrategy, signal, input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NepaliDatepickerModule } from 'np-datepicker-angular';
import { MenuComponent } from '../menu/menu';

@Component({
  selector: 'filter-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NepaliDatepickerModule, MenuComponent],
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent {
  // --- Inputs & Outputs (Signal-based) ---
  filterColumns = input<any[]>([]);
  searchBy = input<string>('');
  fromDate = input<string>('');
  toDate = input<string>('');
  showFromDate = input<boolean>(true);
  showToDate = input<boolean>(true);

  onFilterChange = output<any[]>();
  onFromDateChange = output<any>();
  onToDateChange = output<any>();

  // --- View Queries (Signal-based) ---
  filterDropdown = viewChild<MenuComponent>('filterDropdown');

  // --- Internal State (Signals) ---
  filterList = signal<any[]>([]);
  searchText = signal<string>('');
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);
  dateType = signal<'AD' | 'BS'>('BS');
  userList = signal<any[]>([]);
  
  private lastFilterStr = signal<string>('');
  private repeatCount = signal<number>(0);
  private searchTimer: any;

  applyFilter() {
    const newFilters: any[] = [];

    this.filterColumns().forEach(filter => {
      if (filter.value) {
        newFilters.push({
          filterName: filter.name,
          formcontrolName: filter.formcontrolName,
          displayValue: (filter.type === 'select' || filter.type === 'search-select')
            ? filter.data?.find((item: any) => item.id == filter.value)?.name
            : filter.value,
          value: filter.value
        });
      }
    });

    const currentFilterStr = JSON.stringify(newFilters);

    // Toggle-to-reset logic preserved from your original code
    if (currentFilterStr === this.lastFilterStr()) {
      this.repeatCount.update(n => n + 1);
    } else {
      this.repeatCount.set(1);
      this.lastFilterStr.set(currentFilterStr);
    }

    if (this.repeatCount() === 2) {
      // this.removeAllFilter();
      // this.repeatCount.set(0);
      // this.lastFilterStr.set('');
    } else {
      this.filterList.set(newFilters);
    }

    this.closeDropdown();
    this.emitFilterList();
  }

  onSearch() {
    const text = this.searchText();
    const activeSearchFilter = {
      formcontrolName: this.searchBy(),
      displayValue: text,
      type: 'search',
      value: text
    };

    this.filterList.update(list => {
      // Remove existing search filter
      const filtered = list.filter(f => f.type !== 'search');
      // Add new one if text isn't empty
      return text ? [...filtered, activeSearchFilter] : filtered;
    });

    this.emitFilterList();
  }

  removeFilter(filter: any) {
    this.filterList.update(list => list.filter(item => item !== filter));
    
    // Update the underlying column value
    const col = this.filterColumns().find(c => c.name === filter.filterName);
    if (col) col.value = null;

    this.emitFilterList();
  }

  removeAllFilter() {
    this.filterList.set([]);
    this.filterColumns().forEach(item => item.value = null);
    this.searchText.set('');
    this.emitFilterList();
  }

  emitFilterList() {
    const mapped = this.filterList().map(f => ({
      field: f.formcontrolName,
      value: f.value ? String(f.value) : '',
      displayValue: f.displayValue
    }));
    this.onFilterChange.emit(mapped);
  }

  getUsers(event: any) {
    clearTimeout(this.searchTimer);
    const val = event.target.value.trim();
    this.searchTerm.set(val);
    this.isSearching.set(true);

    // Mocking the async search
    this.searchTimer = setTimeout(() => {
      this.isSearching.set(false);
      // Logic for service call would go here, updating userList.set(results)
    }, 1000);
  }

  closeDropdown() {
    this.filterDropdown()?.close();
  }

  setFromDate(e: any) { this.onFromDateChange.emit(e); }
  setToDate(e: any) { this.onToDateChange.emit(e); }
}