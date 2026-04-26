import { NgModule } from '@angular/core';
import { Table } from './components/ui/table/table';
import { Menu } from './components/ui/menu/menu';
import { Button } from './components/ui/button/button';
import { Paginator } from './components/ui/pagination/pagination';
import { Filter } from './components/ui/filter/filter';

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
