// import { Component, Inject, inject } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/shared/shared/shared.module';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
// import { environment } from 'src/environments/environment';
// import { AuthService } from 'src/app/auth/auth.service';
// import { catchError, forkJoin, of } from 'rxjs';

// @Component({
//   selector: 'app-transaction',
//   imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, SharedModule],
//   templateUrl: './add-config-setup.html',
//   styleUrl: './add-config-setup.scss',
//   standalone: true
// })
// export class AddConfigComponent {
//   isLoading = false;
//   selectedImg: any;
//   selectedData: any;

//   constructor(
//     private configurationService: ConfigServiceService,
//     private toastr: ToastrService,
//     private dialogRef: MatDialogRef<any>,
//     private fb: FormBuilder,
//     public authService: AuthService,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) { }

//   ngOnInit() {
//     this.selectedData = this.data?.map((item: any) => {
//       if (item.type === 'toggle') {
//         return {
//           ...item,
//           value: item.value === "1" || item.value === 1 || item.value === true
//         };
//       }
//       return item;
//     });;

//     const imgName = this.selectedData?.find((item: any) => item?.name == 'logo')?.value;
//     if (imgName) {
//       fetch(`${environment.apiUrl}/master/${imgName}`, {
//         headers: { Authorization: `Bearer ${this.authService.getToken()}` }
//       })
//         .then(resp => resp.blob())
//         .then(blob => {
//           this.selectedImg = {
//             file: null,
//             url: URL.createObjectURL(blob),
//             name: imgName,
//           };
//         });
//     }

//   }

//   public onSelectImage(event: any): void {
//     if (!event.target.files) {
//       this.selectedImg = null;
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
//       this.selectedImg = null;
//       return;
//     }

//     this.selectedImg = {
//       file: file,
//       url: URL.createObjectURL(file),
//       name: file.name,
//     };
//   }

//   clearImage() {
//     this.selectedImg = null;
//   }

//   saveImage() {

//     if (this.selectedImg == null) {
//       return
//     }

//     this.isLoading = true;
//     let formData = new FormData();

//     if (this.selectedImg != null) {
//       formData.append('file', this.selectedImg.file);
//     }

//     console.log(this.selectedImg.name)
//     this.isLoading = true;
//     this.configurationService.setCompanyImage(formData)
//       .subscribe(
//         {
//           next: (res: any) => {
//             if (res?.success == true) {
//               this.isLoading = false;
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
//               this.isLoading = false;
//             }
//           },
//           error: (err) => {
//             err?.error?.messages?.forEach((message: any) => {
//               this.toastr.error(message.message, 'Error', {
//                 closeButton: true,
//               });
//             });
//             this.isLoading = false;
//           },
//         }
//       )
//   }

//   saveConfiguration() {
//     this.isLoading = true;

//     const payload = this.selectedData
//       .filter((it: any) => it.name != 'logo')
//       .map((item: any) => {
//         if (item.type === 'toggle') {
//           return {
//             ...item,
//             value: item.value ? "1" : "0"
//           };
//         }
//         return item;
//       });

//     this.configurationService.addBulkConfiguration(payload)
//       .subscribe({
//         next: (res) => {
//           if (res.success == true) {
//             this.toastr.success(res?.messages[0]?.message);
//             this.closeDialog(true);
//           } else {
//             this.toastr.error(res?.messages[0]?.message);
//           }
//           this.isLoading = false;
//         },
//         error: (err) => {
//           this.toastr.error(err);
//           this.isLoading = false;
//         },
//       });

//     this.saveImage();
//   }


//   public closeDialog(data?: any) {
//     this.dialogRef.removePanelClass('slide-left');
//     this.dialogRef.addPanelClass('slide-left-close');

//     setTimeout(() => {
//       if (data) {
//         this.dialogRef.close(data);
//       }
//       else {
//         this.dialogRef.close();
//       }
//     }, 400);
//   }
// }
