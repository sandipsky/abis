import { NgModule } from '@angular/core';
import { Table } from './components/table/table';
import { Menu } from './components/menu/menu';
import { Button } from './components/button/button';
import { Paginator } from './components/pagination/pagination';
import { Filter } from './components/filter/filter';

@NgModule({
  declarations: [],
  imports: [
    Filter,
    Paginator,
    Table,
    Menu,
    Button
  ],
  exports: [
    Filter,
    Paginator,
    Table,
    Menu,
    Button
  ]
})
export class SharedModule { }
