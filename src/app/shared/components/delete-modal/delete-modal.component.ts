import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteModalComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteModalComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);

  deleteItem() {
    this.closeDialog(true);
  }

  public closeDialog(isDeleted: boolean = false) {
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this.dialogRef.close(isDeleted);
    }, 300);
  }
}
