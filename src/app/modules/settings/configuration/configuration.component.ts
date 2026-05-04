// import { Component, Optional } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ConfigServiceService } from './config-service.service';
// import { ToastrService } from 'ngx-toastr';
// import { Subscription } from 'rxjs';
// import { AuthService } from '../auth/auth.service';
// import { SpinnerService } from 'src/app/services/spinner-service/spinner.service';
// import { environment } from 'src/environments/environment';
// import { AddConfigComponent } from './add-config-setup/add-config-setup.component';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// @Component({
//   selector: 'app-configuration',
//   templateUrl: './configuration.component.html',
//   styleUrls: ['./configuration.component.scss']
// })
// export class ConfigurationComponent {
//   public configSubscription!: Subscription;

//   public configurationTableData: any;
//   setupItems: any[] = [
//         { name: 'company_name', type: 'input' },
//         { name: 'company_reg_type', valueList: [{ id: "PAN", name: "PAN" }, { id: "VAT", name: "VAT" }], type: 'radio' },
//         { name: 'company_reg', type: 'input' },
//         { name: 'company_contact', type: 'input' },
//         { name: 'company_address', type: 'input' },
//         { name: 'company_email', type: 'input' },
//         { name: 'calendar_type', valueList: [{ id: "AD", name: "AD" }, { id: "BS", name: "BS" }], type: 'radio' },
//         { name: 'default_rounding', type: 'toggle' },

//       ]

//   public operationList: any = [];



//   constructor(
//     private fb: FormBuilder,
//     private configurationService: ConfigServiceService,
//     private toastr: ToastrService,
//     public authService: AuthService,
//     public dialog: MatDialog,
//     @Optional() private dialogRef: MatDialogRef<any>,
//     public loaderService: SpinnerService
//   ) { }

//   ngOnInit(): void {
//     this.getAllConfigList();
//     this.operationList = this.authService.userPermissionList()
//   }

//   public getAllConfigList(): void {
//     this.isLoading = true;

//     this.configSubscription = this.configurationService.getAllConfigData()
//       .subscribe({
//         next: (res: any[]) => {
//           this.isLoading = false;

//           const apiMap = new Map(res.map(r => [r.name, r]));

//           this.setupItems = this.setupItems.map((group: any) => {
//             return {
//               ...group,
//               items: group.items.map((item: any) => {
//                 const apiItem = apiMap.get(item.name);

//                 const merged = {
//                   ...item,
//                   ...(apiItem || {})
//                 };

//                 let displayValue = merged.value;

//                 if (merged.type === 'toggle') {
//                   displayValue = merged.value == '1' ? 'Yes' : 'No';
//                 }

//                 else if (merged.type === 'radio' || merged.type === 'dropdown') {
//                   const match = merged.valueList?.find((v: any) => v.id == merged.value);
//                   displayValue = match ? match.name : merged.value;
//                 }

//                 return {
//                   ...merged,
//                   displayValue
//                 };
//               })
//             };
//           });

//           this.configurationTableData = this.setupItems.flatMap((g: any) => g.items);

//           console.log(this.setupItems)

//           const imgName = res?.find((item: any) => item?.name == 'logo')?.value;

//           if (imgName) {
//             this.showImagePlaceholder = false
//             this.imagefileUrl = this.imagebaseUrl + imgName;
//           }
//           else {
//             this.showImagePlaceholder = true
//             this.imagefileUrl = null;

//           }
//         },

//         error: (err) => {
//           this.isLoading = false;
//           this.toastr.error(err);
//         }
//       });
//   }

//   onEdit() {
//     this.dialogRef = this.dialog.open(AddConfigComponent, {
//       panelClass: ['drawer-right', 'slide-left'],
//       enterAnimationDuration: '0ms',
//       exitAnimationDuration: '0ms',
//       disableClose: true,
//       data: this.setupItems[this.selectedTabIndex]?.items
//     });

//     this.dialogRef.backdropClick().subscribe(() => {
//       this.closeDialog();
//     });

//     this.dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.getAllConfigList();
//       }
//     });
//   }

//   closeDialog() {
//     this.dialogRef.removePanelClass('slide-left');
//     this.dialogRef.addPanelClass('slide-left-close');

//     setTimeout(() => {
//       this.dialogRef.close();
//     }, 400);
//   }

//   ngOnDestroy() {
//     this.configSubscription.unsubscribe();
//   }
// }
