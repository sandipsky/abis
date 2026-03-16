import { Component } from '@angular/core';
import { FilterSectionComponent } from '../../shared/components/filter/filter';
import { PaginatorComponent } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-dashboard',
  imports: [FilterSectionComponent, PaginatorComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
