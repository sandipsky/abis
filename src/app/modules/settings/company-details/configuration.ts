// import { ChangeDetectionStrategy, Component, Optional, signal, computed } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { Subscription } from 'rxjs';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ConfigurationService } from '../../../shared/services/configuration.service';
// import { AuthService } from '../../../auth/auth.service';
// import { SpinnerService } from '../../../shared/services/spinner.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { environment } from '../../../../environments/environment';

// @Component({
//   selector: 'app-configuration',
//   templateUrl: './configuration.html',
//   styleUrls: ['./configuration.scss'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, NgSelectModule],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class Configuration {

//   public configSubscription!: Subscription;

//   setupItems = signal<any[]>([
//     {
//       name: 'General Settings',
//       items: [
//         { name: 'Calendar Type', valueList: [{ id: "1", name: "AD" }, { id: "0", name: "BS" }], type: 'radio' },
//         { name: 'Language', valueList: [{ id: "1", name: "English" }, { id: "0", name: "Nepali" }], type: 'radio' },
//         { name: 'Theme', valueList: [{ id: "1", name: "English" }, { id: "0", name: "Nepali" }], type: 'radio' },
//         { name: 'Accent Color', valueList: [{ id: "1", name: "English" }, { id: "0", name: "Nepali" }], type: 'radio' },
//       ]
//     },
//     {
//       name: 'Company Profile',
//       items: [
//         { name: 'logo', type: 'image' },
//         { name: 'company_name', type: 'input' },
//         { name: 'company_reg_type', valueList: [{ id: "PAN", name: "PAN" }, { id: "VAT", name: "VAT" }], type: 'radio' },
//         { name: 'company_reg', type: 'input' },
//         { name: 'company_contact', type: 'input' },
//         { name: 'company_address', type: 'input' },
//         { name: 'company_email', type: 'input' },
//       ]
//     },

//     {
//       name: "Transaction",
//       items: [
//         { name: 'product_valuation_method', valueList: [{ id: "LIFO", name: "LIFO" }, { id: "FIFO", name: "FIFO" }, { id: "FEFO", name: "FEFO" }], type: 'radio' },
//         { name: "Show Expiry Date", type: "toggle" },
//         { name: "Show Manufacturing Date", type: "toggle" },

//       ],
//     },
//   ]);

//   public operationList: any = [];

//   editMode = signal<boolean>(false);

//   selectedTabIndex = signal<number>(0);
//   selectedImg = signal<{ file: File | null, url: string, name: string } | null>(null);

//   selectedGroup = computed(() => {
//     return this.setupItems()[this.selectedTabIndex()] || null;
//   });

//   constructor(
//     private configurationService: ConfigurationService,
//     private toastr: ToastrService,
//     public authService: AuthService,
//     public dialog: MatDialog,
//     @Optional() private dialogRef: MatDialogRef<any>,
//     public spinnerService: SpinnerService,
//   ) { }

//   ngOnInit(): void {
//     this.getAllConfigList();
//     this.operationList = this.authService.userPermissionList();
//   }

//   selectTab(index: number) {
//     this.selectedTabIndex.set(index);
//   }

//   getAllConfigList(): void {
//     this.configurationService.getAllConfigData()
//       .subscribe({
//         next: (res: any[]) => {

//           const apiMap = new Map(res.map(r => [r.name, r]));

//           const temp = this.setupItems().map((group: any) => {
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

//           this.setupItems.set(temp);

//           const imgName = res?.find((item: any) => item?.name == 'logo')?.value;
//           if (imgName) {
//             fetch(`${environment.apiUrl}/master/${imgName}`, {
//               headers: { Authorization: `Bearer ${this.authService.getToken()}` }
//             })
//               .then(resp => resp.blob())
//               .then(blob => {
//                 this.selectedImg.set({
//                   file: null,
//                   url: URL.createObjectURL(blob),
//                   name: imgName,
//                 });
//               });
//           }
//         },

//         error: (err: any) => {
//           this.toastr.error(err);
//         }
//       });
//   }

//   onSelectImage(event: any): void {
//     if (!event.target.files) {
//       this.selectedImg.set(null);
//       return;
//     }

//     let file = event.target.files[0];
//     const fileExtension = file.name.split('.').pop()?.toLowerCase();

//     if (!['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
//       this.toastr.error(
//         'Please upload only jpg, jpeg, png or pdf files',
//         'Error',
//         { closeButton: true }
//       );
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       this.toastr.error("File size exceeds 5MB limit", 'Error', { closeButton: true });
//       this.selectedImg.set(null);
//       return;
//     }

//     try {
//       if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
//         this.selectedImg.set({
//           file: file,
//           url: URL.createObjectURL(file),
//           name: file.name,
//         });
//       }
//       else {
//         this.selectedImg.set(null);
//       }
//     } catch (error) {
//       this.toastr.error("Failed to compress image", 'Error');
//     }
//   }

//   saveImage() {
//     if (this.selectedImg == null) {
//       return
//     }

//     let formData = new FormData();

//     if (this.selectedImg != null) {
//       formData.append('file', this.selectedImg()?.file as File);
//     }
//     this.configurationService.setCompanyImage(formData)
//       .subscribe(
//         {
//           next: (res: any) => {
//             if (res?.success == true) {
//               res?.messages?.forEach((message: any) => {
//                 this.toastr.success(message.message, 'Success', {
//                   closeButton: true,
//                 });
//               })
//             }
//             else {
//               res?.messages?.forEach((message: any) => {
//                 this.toastr.error(message.message, 'Error', {
//                   closeButton: true,
//                 });
//               });
//             }
//           },
//           error: (err) => {
//             err?.error?.messages?.forEach((message: any) => {
//               this.toastr.error(message.message, 'Error', {
//                 closeButton: true,
//               });
//             });
//           },
//         }
//       )
//   }

//   saveConfiguration() {
//     this.configurationService.addConfiguration(this.selectedGroup().items.filter((it: any) => it.name != 'logo'))
//       .subscribe(
//         {
//           next: (res) => {
//             if (res.success == true) {
//               this.toastr.success(res?.messages[0]?.message);
//               this.editMode.set(false);
//             }
//             else {
//               this.toastr.error(res?.messages[0]?.message);
//             }
//           },
//           error: (err) => {
//             this.toastr.error(err);
//           },
//         }
//       )

//     this.saveImage();
//   }
// }