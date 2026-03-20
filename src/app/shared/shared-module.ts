import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSectionComponent } from './components/filter/filter';
import { PaginatorComponent } from './components/pagination/pagination';
import { Table } from './components/table/table';
import { MenuComponent } from './components/menu/menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FilterSectionComponent,
    PaginatorComponent,
    Table,
    MenuComponent
  ]
})
export class SharedModule { }
