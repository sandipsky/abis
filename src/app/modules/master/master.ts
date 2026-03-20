import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import masterData from './master-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master',
  imports: [RouterModule, CommonModule],
  templateUrl: './master.html',
  styleUrl: './master.scss',
})
export class Master {
  masterData = masterData

  activeParentIndex = 0;
  activeChildIndex = 0;

  filteredData: any[] = [];
  operationList: any[] = [];

  get selectedParent() {
    return this.filteredData[this.activeParentIndex];
  }

  constructor(private router: Router, public authService: AuthService,
  ) {
    this.operationList = this.authService.userPermissionList();
  }

  ngOnInit() {
    this.filterData();
    console.log(this.masterData)
    this.handleRouteOnLoad();
  }

  filterData() {
    this.filteredData = this.masterData
      .map(parent => ({
        ...parent,
        children: parent.children.filter(child =>
          this.operationList.includes(child.permission) || true
        )
      }))
      .filter(parent => parent.children.length > 0);

    console.log(this.filteredData)
  }

  handleRouteOnLoad() {
    const currentUrl = this.router.url;

    let found = false;

    for (let i = 0; i < this.filteredData.length; i++) {
      const parent = this.filteredData[i];

      for (let j = 0; j < parent.children.length; j++) {
        const child = parent.children[j];

        if (currentUrl.includes(child.link)) {
          this.activeParentIndex = i;
          this.activeChildIndex = j;
          found = true;
          break;
        }
      }

      if (found) break;
    }

    if (!found) {
      this.setDefaultRoute();
    }
  }

  setDefaultRoute() {
    for (let i = 0; i < this.filteredData.length; i++) {
      const parent = this.filteredData[i];

      if (parent.children.length > 0) {
        this.activeParentIndex = i;
        this.activeChildIndex = 0;

        this.router.navigate([parent.children[0].link]);
        return;
      }
    }
  }

  selectParent(index: number) {
    this.activeParentIndex = index;

    const parent = this.filteredData[index];

    if (parent.children.length > 0) {
      this.activeChildIndex = 0;
      this.router.navigate([parent.children[0].link]);
    }
  }

  selectChild(index: number, link: string) {
    this.activeChildIndex = index;
    this.router.navigate([link]);
  }
}
