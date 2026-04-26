import { NgModule } from '@angular/core';
import { Filter } from './components/filter/filter';
import { Paginator } from './components/pagination/pagination';
import { Table } from './components/table/table';
import { Menu } from './components/menu/menu';
import { Button } from './components/ui/button/button';

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
