import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import sidebarData from './sidebar-data';

@Component({
  selector: 'app-sidebar',
  imports: [MatTooltipModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarData = sidebarData;
}
