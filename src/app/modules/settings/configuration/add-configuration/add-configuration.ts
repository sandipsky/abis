import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../../../../shared/services/configuration.service';
import { AuthService } from '../../../../auth/auth.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './add-configuration.html',
  styleUrl: './add-configuration.scss',
  standalone: true
})
export class AddConfiguration {
  isLoading = false;
  selectedImg: any;
  selectedData: any;

  constructor(
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.selectedData = this.data;

    const imgName = this.selectedData?.find((item: any) => item?.name == 'logo')?.value;
    if (imgName) {
      fetch(`${environment.apiUrl}/master/${imgName}`, {
        headers: { Authorization: `Bearer ${this.authService.getToken()}` }
      })
        .then(resp => resp.blob())
        .then(blob => {
          this.selectedImg = {
            file: null,
            url: URL.createObjectURL(blob),
            name: imgName,
          };
        });
    }

  }

  public onSelectImage(event: any): void {
    if (!event.target.files) {
      this.selectedImg = null;
      return;
    }

    let file = event.target.files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
      this.toastr.error(
        'Please upload only jpg, jpeg, png or pdf files',
        'Error',
        { closeButton: true }
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error("File size exceeds 5MB limit", 'Error', { closeButton: true });
      this.selectedImg = null;
      return;
    }

    try {
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        this.selectedImg = {
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
        };
      }
      else {
        this.selectedImg = null;
      }
    } catch (error) {
      this.toastr.error("Failed to compress image", 'Error');
    }
  }

  clearImage() {
    this.selectedImg = null;
  }

  saveImage() {

    if (this.selectedImg == null) {
      return
    }

    this.isLoading = true;
    let formData = new FormData();

    if (this.selectedImg != null) {
      formData.append('file', this.selectedImg);
    }
    this.isLoading = true;
    this.configurationService.setCompanyImage(formData)
      .subscribe(
        {
          next: (res: any) => {
            if (res?.success == true) {
              this.isLoading = false;
              res?.messages?.forEach((message: any) => {
                this.toastr.success(message.message, 'Success', {
                  closeButton: true,
                });
              })
            }
            else {
              res?.messages?.forEach((message: any) => {
                this.toastr.error(message.message, 'Error', {
                  closeButton: true,
                });
              });
              this.isLoading = false;
            }
          },
          error: (err) => {
            err?.error?.messages?.forEach((message: any) => {
              this.toastr.error(message.message, 'Error', {
                closeButton: true,
              });
            });
            this.isLoading = false;
          },
        }
      )
  }

  public saveConfiguration() {
    this.isLoading = true;

    this.configurationService.addConfiguration(this.selectedData.filter((it: any) => it.name != 'logo'))
      .subscribe(
        {
          next: (res) => {
            if (res.success == true) {
              this.toastr.success(res?.messages[0]?.message);
              this.closeDialog(true);
              this.isLoading = false;
            }
            else {
              this.isLoading = false;
              this.toastr.error(res?.messages[0]?.message);
              this.isLoading = false;
            }
          },
          error: (err) => {
            this.toastr.error(err);
            this.isLoading = false;
          },
        }
      )

    this.saveImage();
  }


  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close(data);
      }
      else {
        this.dialogRef.close();
      }
    }, 400);
  }
}
