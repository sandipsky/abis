import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { NepaliDatepickerModule } from 'np-datepicker-angular';
import { ToastrService } from 'ngx-toastr';
// import { NepaliDatepickerService } from 'np-datepicker-angular';
// import { ConfigServiceService } from 'src/app/configuration/config-service/config-service.service';
// import { DateService } from 'src/app/services/date.service';
// import { DropdownsService } from 'src/app/services/dropdowns.service';
// import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-range-print',
  templateUrl: './range-print.html',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NepaliDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangePrintComponent {

  private _toastr = inject(ToastrService);
  private _fb = inject(FormBuilder);
  public dialog = inject(MatDialog);
  public dialogRef = inject(MatDialogRef<RangePrintComponent>);
  public data = inject(MAT_DIALOG_DATA);

  // private dropDownService = inject(DropdownsService);
  // private printService = inject(PrintService);
  // public dateService = inject(DateService);
  // public nepaliDateService = inject(NepaliDatepickerService);
  // private configService = inject(ConfigServiceService);

  /* ---------------- SIGNAL STATE ---------------- */

  partyList = signal<any[]>([]);
  accountPartyList = signal<any[]>([]);
  hqList = signal<any[]>([]);
  hqDropdownList = signal<any[]>([]);
  divisionList = signal<any[]>([]);
  divisionDropdownList = signal<any[]>([]);
  invoiceList = signal<any[]>([]);
  invoiceIds = signal<any[]>([]);

  isSearching = signal(false);
  isLoading = signal(false);

  searchTerm = signal('');
  searchTimer: any;

  companyDetails = signal<any>(null);

  /* ---------------- STATIC DATA ---------------- */

  printTypes = [
    "Sales",
    "Sales Return",
    "BDE",
    "Packing Slip",
    "Purchase",
    "Purchase Return",
    "Payment",
    "Debit Note",
    "Credit Note",
  ];

  partyTypes = ["Customer", "Vendor"];
  accounting = ["Payment", "Debit Note", "Credit Note"];

  printForm: FormGroup = this._fb.group({
    type: [],
    partyId: [],
    partyType: ['Customer'],
    hqId: [],
    divisionId: [],
    fromDate: [],
    toDate: [],
    fromId: [],
    toId: [],
    noOfPrint: [1]
  });

  constructor() {
    this.getDivisionList();
    this.getPartyList();
  }

  get f() {
    return this.printForm.controls;
  }

  setFromDate(e: any) {
    this.f['fromDate'].setValue(e);
  }

  setToDate(e: any) {
    this.f['toDate'].setValue(e);
  }

  onSearch(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTerm.set(event.target.value.trim());
    this.isSearching.set(true);

    this.searchTimer = setTimeout(() => {
      if (this.searchTerm() !== '') {
        if (this.f['type'].value == 'Purchase' || this.f['type'].value == 'Purchase Return') {
          // this.dropDownService.getVendorDropdown(this.searchTerm()).subscribe((result: any) => {
          //   this.partyList.set(result);
          //   this.isSearching.set(false);
          // });
        }
        else {
          // this.dropDownService.getCustomerDropdown(this.searchTerm()).subscribe((result: any) => {
          //   this.partyList.set(result);
          //   this.isSearching.set(false);
          // });
        }
      }
      else {
        this.isSearching.set(false);
      }
    }, 1000);

  }

  onSearchInvoice(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTerm.set(event.target.value.trim());
    this.isSearching.set(true);
    this.searchTimer = setTimeout(() => {

      if (this.searchTerm() !== '') {

        let type = this.f['type'].value;

        if (type == 'Packing Slip') {
          type = 'Sales';
        }
        // this.dropDownService.getInvoicesList(
        //   this.f['partyId'].value,
        //   this.f['hqId'].value,
        //   this.f['divisionId'].value,
        //   type,
        //   this.searchTerm()
        // ).subscribe({
        //   next: (res: any) => {
        //     this.invoiceList.set(res);
        //     this.isSearching.set(false);
        //   },
        //   error: (err) => {
        //     this._toastr.error(err);
        //     this.isSearching.set(false);
        //   },
        // });
      }
      else {
        this.isSearching.set(false);
      }
    }, 1000);
  }

  getPartyList() {
    // this.dropDownService.getPartyAccounts().subscribe({
    //   next: (res: any) => {
    //     this.accountPartyList.set(res);
    //   },
    //   error: (err) => { this._toastr.error(err) },
    // })
  }

  getDivisionList() {
    // this.dropDownService.getDivisionDropdown().subscribe({
    //   next: (res: any) => {
    //     this.divisionList.set(res);
    //   },
    //   error: (err) => {
    //     this._toastr.error(err)
    //   },
    // })
  }

  getCustomerDivisions(event: any) {
    if (!event) {
      this.hqDropdownList.set([]);
      this.divisionDropdownList.set([]);
      this.f['hqId'].setValue(null);
      this.f['divisionId'].setValue(null);
      return;
    }

    if (this.f['type'].value == 'Purchase' || this.f['type'].value == 'Purchase Return') {
      return;
    }

    // this.dropDownService.getDivisionDropdownCustomer(event?.id).subscribe({
    //   next: (res: any) => {
    //     this.divisionDropdownList.set(res);
    //   },
    //   error: (err) => {
    //     this._toastr.error(err)
    //   },
    // });
  }

  getAccountDivisions(event: any) {
    if (!event) {
      this.hqDropdownList.set([]);
      this.divisionDropdownList.set([]);

      this.f['hqId'].setValue(null);
      this.f['divisionId'].setValue(null);

      return;
    }

    if (this.f['type'].value == 'Purchase' || this.f['type'].value == 'Purchase Return') {
      return;
    }

    // this.dropDownService.getDivisionDropdownAccount(event?.id).subscribe({
    //   next: (res: any) => {
    //     this.divisionDropdownList.set(res);
    //   },
    //   error: (err) => {
    //     this._toastr.error(err)
    //   },
    // });
  }

  onChangeDivision(event: any) {
    if (!event) {
      this.f['hqId']?.setValue(null);
      this.hqDropdownList.set([]);
    }
    else {
      const hq = [{ id: event.hq_id, name: event.hq_name }];
      this.hqDropdownList.set(hq);
      this.f['hqId']?.setValue(event.hq_id);
      // this.getSalesInvoices();
    }
  }

  onChangeType(e: any) {
    this.printForm.patchValue({
      partyId: null,
      hqId: null,
      divisionId: null,
      fromDate: null,
      toDate: null,
      fromId: null,
      toId: null,
      partyType: (e == 'Purchase' || e == 'Purchase Return') ? 'Vendor' : 'Customer'
    });

    this.partyList.set([]);
    this.invoiceList.set([]);
  }

  onChangePartyType(e: any) {
    this.printForm.patchValue({
      partyId: null,
      hqId: null,
      divisionId: null,
      fromDate: null,
      toDate: null,
      fromId: null,
      toId: null,
    });
    this.partyList.set([]);
    this.invoiceList.set([]);
  }

  onSubmit() {
    this.printForm.markAllAsTouched();
    if (this.printForm.invalid) return;
    
    if (this.printForm.value.fromDate > this.printForm.value.toDate) {
      this._toastr.error('From Date Cannot be Greater than To Date');
      return;
    }

    if (this.printForm.value.fromId > this.printForm.value.toId) {
      this._toastr.error('From Invoice Cannot be Greater than To Invoice');
      return;
    }

    if (this.printForm.value.noOfPrint < 1) {
      this._toastr.error('No of copies should be greater than 0');
      return;
    }

    switch (this.printForm.value.type) {
      case 'Sales':
        this.printSales(this.printForm.value);
        break;

      case 'Sales Return':
        this.printSalesReturn(this.printForm.value);
        break;

      case 'Sales Order':
        this.printSalesOrder(this.printForm.value);
        break;

      case 'Packing Slip':
        this.printPackingSlip(this.printForm.value);
        break;

      case 'Purchase':
        this.printPurchase(this.printForm.value);
        break;

      case 'Purchase Return':
        this.printPurchaseReturn(this.printForm.value);
        break;

      case 'BDE':
        this.printBDE(this.printForm.value);
        break;

      case 'Payment':
        this.printPayment(this.printForm.value);
        break;

      case 'Debit Note':
        this.printDebitNote(this.printForm.value);
        break;

      case 'Credit Note':
        this.printCreditNote(this.printForm.value);
        break;

      case 'Material Issue':
        this.printMaterialIssue(this.printForm.value);
        break;

      case 'Material Issue Return':
        this.printMaterialIssueReturn(this.printForm.value);
        break;

      case 'Finish Good':
        this.printFinishGood(this.printForm.value);
        break;

      default:
        break;
    }
  }

  printSales(data: any) {
    // this.isLoading = true;
    // this.printService.rangePrintSales(data).subscribe({
    //   next: (res: any) => {
    //     var file = new Blob([res], { type: 'application/pdf' })
    //     var fileURL = URL.createObjectURL(file);
    //     var newWindow = window.open(fileURL);

    //     if (newWindow != null) {
    //       newWindow.onload = () => {
    //         newWindow?.print();
    //       };
    //     }
    //     var pdfFile = document.createElement('a');
    //     pdfFile.href = fileURL;
    //     pdfFile.target = '_blank';
    //     pdfFile.download = `SalesDetails.pdf`;
    //     document.body.appendChild(pdfFile);
    //     pdfFile.click();
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     // this.toastr.error(err.message);
    //     this.toastr.error('Current settings result in print size greater than 200. Please readjust your current setting.');
    //     this.isLoading = false;
    //   },
    // });
  }

  printSalesReturn(data: any) {
    // this.isLoading = true;
    // this.printService.rangePrintSalesReturn(data).subscribe({
    //   next: (res: any) => {
    //     var file = new Blob([res], { type: 'application/pdf' })
    //     var fileURL = URL.createObjectURL(file);
    //     var newWindow = window.open(fileURL);
    //     if (newWindow != null) {
    //       newWindow.onload = () => {
    //         newWindow?.print();
    //       };
    //     }
    //     var pdfFile = document.createElement('a');
    //     pdfFile.href = fileURL;
    //     pdfFile.target = '_blank';
    //     pdfFile.download = `SalesReturns.pdf`;
    //     document.body.appendChild(pdfFile);
    //     pdfFile.click();
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     // this.toastr.error(err.message);
    //     this.toastr.error('Current settings result in print size greater than 200. Please readjust your current setting.');
    //     this.isLoading = false;
    //   },
    // });
  }

  printPackingSlip(data: any) {
    // this.isLoading = true;
    // this.printService.getPackingSlipDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printPackingSlip(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err.message);
    //     this.isLoading = false;
    //   },
    // });
  }

  printSalesOrder(data: any) {
    // this.isLoading = true;
    // this.printService.getSalesOrderDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printSalesOrder(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printPurchase(data: any) {
    // this.isLoading = true;
    // this.printService.getPurchaseDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printPurchase(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printPurchaseReturn(data: any) {
    // this.isLoading = true;
    // this.printService.getPurchaseReturnDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printPurchaseReturn(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printBDE(data: any) {
    // this.isLoading = true;
    // this.printService.getBDEDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printBDE(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printPayment(data: any) {
    // this.isLoading = true;
    // this.printService.getPaymentDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printPayment(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printDebitNote(data: any) {
    // this.isLoading = true;
    // this.printService.getDebitNoteDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printDebitNote(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printCreditNote(data: any) {
    // this.isLoading = true;
    // this.printService.getCreditNoteDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printCreditNote(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printMaterialIssue(data: any) {
    // this.isLoading = true;
    // this.printService.getMaterialIssueDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printMaterialIssue(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printMaterialIssueReturn(data: any) {
    // this.isLoading = true;
    // this.printService.getMaterialIssueReturnDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printMaterialIssueReturn(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  printFinishGood(data: any) {
    // this.isLoading = true;
    // this.printService.getFinishGoodDetailList(data).subscribe({
    //   next: (res: any) => {
    //     if (res?.success == false) {
    //       res?.messages?.forEach((message: any) => {
    //         this.toastr.error(message?.message);
    //       })
    //       this.isLoading = false;
    //       return;
    //     }
    //     this.printService.printFinishGoodsReceipt(res, this.printForm.value.noOfPrint);
    //     this.isLoading = false;
    //     this.dialog.closeAll();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err);
    //     this.isLoading = false;
    //   },
    // });
  }

  closeDialog() {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }

}