import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@/shared/shared-module';
import { SpinnerService } from '@/shared/services/spinner.service';
import { DocumentNumberSchemeService } from './document-number-scheme.service';
import { IDocumentNumberScheme } from './document-number-scheme.model';

@Component({
  selector: 'app-document-number-scheme',
  templateUrl: './document-number-scheme.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentNumberScheme implements OnInit {
  private _documentNumberService = inject(DocumentNumberSchemeService);
  private _spinnerService = inject(SpinnerService);

  documentNumberList = signal<IDocumentNumberScheme[]>([]);

  readonly tableHeaders = signal([
    { name: 'SN', property: 'sn', sort: false },
    { name: 'Name', property: 'name', sort: false },
    { name: 'Prefix', property: 'prefix', sort: false },
    { name: 'Start Number', property: 'start_no', sort: false },
    { name: 'End Number', property: 'end_no', sort: false },
    { name: 'Length', property: 'body_length', sort: false },
  ]);

  ngOnInit(): void {
    this.getDocumentNumberList();
  }

  getDocumentNumberList(): void {
    this._spinnerService.setSpinner(true);
    this._documentNumberService.getDocumentNumberList().subscribe({
      next: (res: IDocumentNumberScheme[]) => {
        this.documentNumberList.set(res || []);
        this._spinnerService.setSpinner(false);
      },
    });
  }
}
