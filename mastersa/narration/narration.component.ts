import { Component } from '@angular/core';
import { GeneralMasterComponent } from "../general-master/general-master.component";

@Component({
  selector: 'app-headquarters',
  template: `<app-general-master endPoint="narrations" masterName="Narration" createMasterPermissionName="CreateNarrations" editMasterPermissionName="EditNarrations" deleteMasterPermissionName="DeleteNarrations" exportMasterPermissionName="ExportNarrations"></app-general-master>`,
  imports: [GeneralMasterComponent],
  standalone: true
})
export class NarrationComponent { }

