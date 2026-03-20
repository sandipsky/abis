import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-headquarters',
  template: `<app-general-master endPoint="hqs" masterName="Headquarter" createMasterPermissionName="CreateHeadquarter" editMasterPermissionName="EditHeadquarter" deleteMasterPermissionName="DeleteHeadquarter" exportMasterPermissionName="ExportHeadquarter"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class HeadquartersComponent { }

