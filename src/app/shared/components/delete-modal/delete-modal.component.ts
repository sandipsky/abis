import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Button } from '@/shared/components/button/button';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteModalComponent {
  private readonly _dialogRef = inject(MatDialogRef<DeleteModalComponent>);
  private readonly _data = inject(MAT_DIALOG_DATA);

  deleteItem() {
    this.closeDialog(true);
  }

  public closeDialog(isDeleted: boolean = false) {
    this._dialogRef.removePanelClass('slide-up');
    this._dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this._dialogRef.close(isDeleted);
    }, 300);
  }
}
