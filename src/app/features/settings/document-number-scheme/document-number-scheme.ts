import { ChangeDetectionStrategy, Component, Inject, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@/shared/shared-module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-document-number-scheme',
  templateUrl: './document-number-scheme.html',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentNumberScheme {
  formTitle = '';
  length: number = 0;
  operationList: any = [];
  documentNumberList: any[] = [
    {
      id: 1,
      module: "Purchase",
      name: "Local Purchase",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PE-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/purchaseEntries/purchaseEntryNumber/false'
    },
    {
      id: 2,
      module: "Purchase",
      name: "Import Purchase",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PEI-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/purchaseEntries/purchaseEntryNumber/true'

    },
    {
      id: 3,
      module: "Purchase",
      name: "Additional Purchase Details",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PEA-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/master/purchaseBillingTermNumber'
    },
    {
      id: 4,
      module: "Purchase Order",
      name: "Purchase Order",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PO-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/purchaseOrder/orderNumber'
    },
    {
      id: 5,
      module: "Purchase Return",
      name: "Local Purchase Return",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PR-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/purchaseReturns/purchaseReturnNumber/false'
    },
    {
      id: 6,
      module: "Purchase Return",
      name: "Import Purchase Return",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PRI-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/purchaseReturns/purchaseReturnNumber/true'
    },
    {
      id: 7,
      module: "Purchase Return",
      name: "Additional Purchase Return Details",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PRA-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/master/purchaseReturnBillingTermNumber'
    },
    {
      id: 8,
      module: "Sales",
      name: "Sales Entry",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|SI-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/salesEntries/salesInvoiceNumber'
    },
    {
      id: 9,
      module: "Sales Return",
      name: "Sales Return",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|SR-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/salesReturns/salesReturnNumber'
    },
    {
      id: 10,
      module: "Sales Order",
      name: "Sales Order",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|SO-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/salesOrder/salesInvoiceNumber'
    },
    {
      id: 11,
      module: "BDE",
      name: "BDE",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|BDE-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/expiries/expiryNumber'
    },
    {
      id: 12,
      module: "Stock Adjustment",
      name: "Stock Adjustment",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|SA-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/stockAdjustments/stockAdjustmentNumber'
    },
    {
      id: 13,
      module: "Material Issue",
      name: "Material Issue",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|MI-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/materialIssues/materialIssueNumber'
    },
    {
      id: 14,
      module: "Material Issue Return",
      name: "Material Issue Return",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|MIR-",
      body_length: "6",
      total_length: "18",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/materialIssuesReturn/materialIssueNumber'
    },
    {
      id: 15,
      module: "Finish Goods Receipt",
      name: "Finish Goods Receipt",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|FG-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/finishGoods/finishGoodNumber/false'
    },
    {
      id: 15,
      module: "Advance Goods Receipt",
      name: "Advance Goods Receipt",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|AG-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/finishGoods/finishGoodNumber/true'
    },
    {
      id: 16,
      module: "Physical Stock Master",
      name: "Physical Stock Master",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|PS-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/physicalStocks/physicalStockNumber'
    },
    {
      id: 17,
      module: "Journal Entry",
      name: "Journal Entry",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|J-",
      body_length: "6",
      total_length: "16",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/journalEntries/journalNumber'
    },
    {
      id: 18,
      module: "Payment",
      name: "Payment",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|P-",
      body_length: "6",
      total_length: "16",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/payments/paymentNumber'
    },
    {
      id: 19,
      module: "Debit Note",
      name: "Debit Note",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|DN-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/debitNotes/debitNoteNumber'
    },
    {
      id: 20,
      module: "Credit Note",
      name: "Credit Note",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|CN-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/creditNotes/creditNoteNumber'
    },
    {
      id: 21,
      module: "Voucher",
      name: "Cash Voucher",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|CV-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/vouchers/voucherNumber/true'
    },
    {
      id: 22,
      module: "Voucher",
      name: "Bank Voucher",
      start_date: "-04-01",
      end_date: "-03-32",
      numbering_style: "Auto",
      prefix: "|BV-",
      body_length: "6",
      total_length: "17",
      start_no: "1",
      end_no: "999999",
      current_no: "",
      url: environment.apiUrl + '/vouchers/voucherNumber/false'
    }
  ];
  backupData: any = [];
  moduleList: any = [];
  numberingList: any = [];
  documentNumberId: any;
  documentNumberView: any;

  filterColumns: any[] = [];
  filterList: any[] = [];

  documentNumberForm: FormGroup;
  searchText: string = '';

  @Input() filterData: any[] = [];

  @ViewChild('modal', { static: true }) modal!: TemplateRef<any>;
  @ViewChild('delete', { static: true }) delete!: TemplateRef<any>;

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    @Optional() private _dialogRef: MatDialogRef<any>,
    private _http: HttpClient,
  ) {
    this.documentNumberForm = this._fb.nonNullable.group({
      id: [],
      module: [, Validators.required],
      name: [, Validators.required],
      start_date: [, Validators.required],
      end_date: [, Validators.required],
      numbering_style: [, Validators.required],
      prefix: [, Validators.required],
      body_length: [, Validators.required],
      total_length: [, Validators.required],
      start_no: [, Validators.required],
      end_no: [, Validators.required],
      current_no: [],
    }
    );
  }


  get f() { return this.documentNumberForm.controls; }

  ngOnInit(): void {
    const fiscalYear = localStorage.getItem('fiscalYear');

    if (fiscalYear) {
      const startYear = String(String(fiscalYear).split('-')[0]);
      const endYear = String(Number(startYear) + 1);
      this.documentNumberList.forEach(doc => {
        doc.prefix = fiscalYear + doc.prefix;
        doc.start_date = startYear + doc.start_date;
        doc.end_date = endYear + doc.end_date;
      });
    }

    this.documentNumberList = this.filterData?.length
      ? this.documentNumberList.filter((item: any) =>
        this.filterData.includes(item.name)
      )
      : this.documentNumberList;
    this.backupData = this.documentNumberList;

  }

  viewBillingTerm(documentNumber: any): void {
    this.formTitle = 'View';
    this.documentNumberView = documentNumber;
    this._http.get(documentNumber?.url, { responseType: 'text' }).subscribe((res: string) => {
      this.documentNumberView.current_no = res;
    });

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
    this._dialogRef.removePanelClass('slide-up');
    this._dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      this._dialogRef.close();
    }, 400);
  }
}
