import { Component } from '@angular/core';
import { GeneralMaster } from '../general-master/general-master';


@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="packings" masterName="Packing" createMasterPermissionName="CreatePackings" editMasterPermissionName="EditPackings" deleteMasterPermissionName="DeletePackings" exportMasterPermissionName="ExportPackings"></app-general-master>`,
  imports: [GeneralMaster],
  standalone: true
})
export class Packings { }

