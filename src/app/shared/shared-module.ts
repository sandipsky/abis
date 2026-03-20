import { NgModule } from '@angular/core';
import { Filter } from './components/filter/filter';
import { Paginator } from './components/pagination/pagination';
import { Table } from './components/table/table';
import { Menu } from './components/menu/menu';

@NgModule({
  declarations: [],
  imports: [
    Filter,
    Paginator,
    Table,
    Menu
  ],
  exports: [
    Filter,
    Paginator,
    Table,
    Menu
  ]
})
export class SharedModule { }
