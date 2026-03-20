import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../../modules/master/master.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {
  endPoint: string = '';
  id: any;
  isMultiple: boolean = false;
  type: any;

  constructor(
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    private masterService: MasterService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.endPoint = data.endPoint;
    this.id = data.id;
    this.type = data.type;
  }

  deleteItem() {
    this.masterService.deleteUnit(this.endPoint, this.id).subscribe({
      next: (res: any) => {
        res.messages.forEach((message: any) => {
          if (res.status == true || res.title == 'Success') {
            this.toastr.success(message.message, res.title, {
              closeButton: true,
            });
            this.dialogRef.close(true);
          } else {
            this.toastr.error(message.message, res.title, {
              closeButton: true,
            });
          }
        });
      },

      error: (err: any) => {
        this.toastr.error(err.message, 'Error', {
          closeButton: true,
        });
      },
    })
  }

  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this.dialogRef.close();
    }, 300);
  }
}
