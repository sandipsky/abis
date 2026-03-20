import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-product-category',
  template: `<app-general-master endPoint="transport" masterName="Transport" createMasterPermissionName="CreateTransport" editMasterPermissionName="EditTransport" deleteMasterPermissionName="DeleteTransport" exportMasterPermissionName="ExportTransport"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class TransportComponent { }

