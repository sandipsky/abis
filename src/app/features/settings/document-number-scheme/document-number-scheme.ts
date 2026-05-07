import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

import { SharedModule } from '@/shared/shared-module';
import { DocumentNumberSchemeService } from '@/features/settings/document-number-scheme/document-number-scheme.service';
import { IDocumentNumberScheme } from '@/features/settings/document-number-scheme/document-number-scheme.model';

@Component({
  selector: 'app-document-number-scheme',
  templateUrl: './document-number-scheme.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentNumberScheme implements OnInit {
  private _documentNumberService = inject(DocumentNumberSchemeService);
  private _dialog = inject(MatDialog);
  private _dialogRef: MatDialogRef<unknown> | null = null;

  formTitle = '';
  documentNumberView = signal<IDocumentNumberScheme | null>(null);

  private _documentNumbers = toSignal(this._documentNumberService.documentNumbers$, {
    initialValue: [] as IDocumentNumberScheme[],
  });

  documentNumberList = computed<IDocumentNumberScheme[]>(() => {
    const items = this._documentNumbers();
    const fiscalYear = localStorage.getItem('fiscalYear');
    if (!fiscalYear) return items;

    const startYear = String(fiscalYear).split('-')[0];
    const endYear = String(Number(startYear) + 1);
    return items.map(doc => ({
      ...doc,
      prefix: fiscalYear + doc.prefix,
      start_date: startYear + doc.start_date,
      end_date: endYear + doc.end_date,
    }));
  });

  @ViewChild('modal', { static: true }) modal!: TemplateRef<unknown>;

  ngOnInit(): void {
    this._documentNumberService.getDocumentNumbers().subscribe();
  }

  viewBillingTerm(documentNumber: IDocumentNumberScheme): void {
    this.formTitle = 'View';
    this.documentNumberView.set({ ...documentNumber });

    if (documentNumber.url) {
      this._documentNumberService.getCurrentNumber(documentNumber.url).subscribe(res => {
        const current = this.documentNumberView();
        if (current) {
          this.documentNumberView.set({ ...current, current_no: res });
        }
      });
    }

    this._dialogRef = this._dialog.open(this.modal, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
    });

    this._dialogRef.backdropClick().subscribe(() => {
      this.closeDialog();
    });
  }

  closeDialog() {
    if (!this._dialogRef) return;
    this._dialogRef.removePanelClass('slide-up');
    this._dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this._dialogRef?.close();
    }, 400);
  }
}
