import { ChangeDetectionStrategy, Component, ElementRef, Inject, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { DateService } from '@/shared/services/date.service';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { ExcelService } from '@/shared/services/excel.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MasterService } from '@/features/master/master.service';
import { PurchaseEntryService } from '../purchase-entry.service';
import { ConfigurationService } from '@/features/settings/configuration/configuration.service';
import { AmountPipe } from '@/shared/pipes/amount-pipe';
import { NepaliDatepickerModule } from 'np-datepicker-angular';

@Component({
  selector: 'app-add-purchase-entry',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AmountPipe, NgSelectModule, NepaliDatepickerModule],
  templateUrl: './add-purchase-entry.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPurchaseEntry {
  purchaseEntryForm: FormGroup;
  isLoading = false;
  companyDetails: any;
  showPage = 'form';
  isImport = false;

  vendorList: any[] = [];
  operationList: Array<string> = [];
  divisionList: any[] = [];
  productList: any[] = [];
  transctionTypes = [
    'Cash',
    'Credit'
  ];
  discountTypes = [
    '%',
    'flat'
  ];
  purchaseOrderList: any[] = [];
  billingTermList: any[] = [];
  accountDropdownList: any[] = [];
  taxList: Array<any> = [];

  isSearching: boolean = false;
  searchTimer: any;
  searchTerm: string = '';
  requiredDivision = false;
  editAmount: boolean = true;
  allowNetAmountRounding: boolean = true;
  additionalPurchaseNumber: string = '';
  allowEditBilling: boolean = false;
  showAdditionalPurchase: boolean = false;
  dateType: 'AD' | 'BS' = 'BS';

  vendorDetail: any;
  todayDate: any;
  selectedPurchaseEntry: any;
  selectedFile: any;

  @ViewChild('partyInput') partyInput!: NgSelectComponent;

  @ViewChildren('productInput') productInputs!: QueryList<NgSelectComponent>;
  @ViewChildren('unitInput') unitInputs!: QueryList<NgSelectComponent>;
  @ViewChildren('taxInput') taxInputs!: QueryList<NgSelectComponent>;
  @ViewChildren('batchInput') batchInputs!: QueryList<ElementRef>;
  @ViewChildren('qtyInput') qtyInputs!: QueryList<ElementRef>;
  @ViewChildren('freeInput') freeInputs!: QueryList<ElementRef>;
  @ViewChildren('rateInput') rateInputs!: QueryList<ElementRef>;
  @ViewChildren('expiryInput') expiryInputs!: QueryList<ElementRef>;
  @ViewChildren('mrpInput') mrpInputs!: QueryList<ElementRef>;
  @ViewChildren('spInput') spInputs!: QueryList<ElementRef>;
  @ViewChildren('mfgInput') mfgInputs!: QueryList<ElementRef>;
  @ViewChildren('tpInput') tpInputs!: QueryList<ElementRef>;
  @ViewChildren('rowAmountInput') rowAmountInputs!: QueryList<ElementRef>;

  @ViewChildren('termInput') termInputs!: QueryList<NgSelectComponent>;
  @ViewChildren('ledgerInput') ledgerInputs!: QueryList<NgSelectComponent>;
  @ViewChildren('amountInput') amountInputs!: QueryList<ElementRef>;

  @ViewChild('confirm', { static: true }) confirm!: TemplateRef<any>;

  focusedRowIndex: any;

  updatedIds: any[] = [];
  deletedIds: any[] = [];
  pendingDeletedIds: any[] = [];

  subTotal: number = 0;
  discountType: string = 'percentage';
  discountValue: number = 0;
  discountPercent: number = 0;
  discountAmount: number = 0;
  nonTaxableAmount: number = 0;
  taxableAmount: number = 0;
  tax: number = 0;
  rounding: number = 0;
  grandTotal: number = 0;
  additionalTotal: number = 0;
  roundedTotal: number = 0;

  constructor(
    private masterService: MasterService,
    private purchaseService: PurchaseEntryService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    public confirmDialogRef: MatDialogRef<any>,
    private dropdown: DropdownsService,
    private configService: ConfigurationService,
    private fb: FormBuilder,
    public dateService: DateService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.purchaseEntryForm = this.fb.nonNullable.group({
      purchaseInfo: this.fb.group({
        id: [],
        vendor_id: [, Validators.required],
        date: [, Validators.required],
        system_pe_no: [],
        order_no: [],
        bill_date: [, Validators.required],
        bill_no: [, Validators.required],
        transaction_type: ['Credit', Validators.required],
        rounded: false,
        division_id: [],
        master_purchase_order_ids: []
      }),
      productInfo: new FormArray([]),
      tableInfo: this.fb.group({
        discount_type: ['%'],
        remarks: [''],
        discount_value: [0],
        discount: [0],
        rounding: [0],
        non_taxable_amount: [0],
        taxable_amount: [0],
        total_tax: [0],
        sub_total: [0],
        grand_total: [0],
      }),
      additionalInfo: new FormArray([])
    });

    this.isImport = data?.isImport || false;

    // if (data?.purchaseOrderId) {
    //   this.purchaseService.getPurchaseOrderById(data?.purchaseOrderId).subscribe({
    //     next: async (res) => {
    //       this.vendorList = [];
    //       this.vendorList.push({ id: res.vendor_id, name: res.vendor_name })
    //       this.purchaseOrderList = [];
    //       this.getPurchaseOrderDropdownList(res.vendor_id, res.division_id);
    //       this.purchaseEntryForm.get('purchaseInfo')?.patchValue({
    //         division_id: res.division_id,
    //         vendor_id: res.vendor_id,
    //         master_purchase_order_ids: [Number(data?.purchaseOrderId)]
    //       });
    //       this.getVendorInformations(res?.vendor_id, true);
    //       const result: any = await firstValueFrom(this.purchaseService.getPurchaseOrderInfo(res?.id));
    //       this.patchProductData(result, res.system_order_no);
    //     },

    //     error: (err: any) => {
    //       this.toastr.error(err.message, 'Error', {
    //         closeButton: true,
    //       });
    //     },
    //   });
    //   return;
    // }

    // if (data?.formData?.id) {
    //   if (data.isView == true) {
    //     this.showPage = 'view';
    //     this.getPurchaseDetail(data?.formData?.id);
    //     return;
    //   }
    //   this.showPage = 'edit';
    //   this.purchaseService.getPurchaseEnties(data?.formData?.id).subscribe({
    //     next: (res: any) => {
    //       this.isImport = res?.is_import || false;
    //       if (res.system_bt_no == null || res.system_bt_no == '') {
    //         this.getAdditionalPurchaseNumber();
    //       }
    //       else {
    //         this.additionalPurchaseNumber = res.system_bt_no;
    //       }
    //       const orders = res.master_purchase_orders.split(", ");
    //       const result = res.master_purchase_order_ids.map((id: number, index: number) => ({
    //         id,
    //         name: orders[index] || ""
    //       }));
    //       this.getPurchaseOrderDropdownList(res.vendor_id, res.division_id, result);
    //       const processPurchaseEntries = async () => {
    //         for (let index = 0; index < res.purchaseEntries.length; index++) {
    //           const item = res.purchaseEntries[index];
    //           const result: any = await firstValueFrom(this.masterService.getMasterDetail(item.product_id, 'products'));

    //           if (!this.productList.some(it => it.id == item.product_id)) {
    //             this.productList.push({ id: item.product_id, name: item.product_name });
    //           }

    //           let unitList = [];

    //           if (result.primary_unit_id != null) {
    //             unitList.push({
    //               id: result.primary_unit_id,
    //               name: result.primary_unit_name,
    //               is_primary: true
    //             });
    //           }

    //           if (result.secondary_unit_id != null) {
    //             unitList.push({
    //               id: result.secondary_unit_id,
    //               name: result.secondary_unit_name,
    //               is_primary: false
    //             });
    //           }

    //           let bonusInfos = result?.bonus_infos?.map((itm: any) => {
    //             itm.bonus_percentage = Number(((itm?.bonus_quantity || 0) / (itm?.min_quantity || 1)));
    //             return itm;
    //           })?.sort((a: any, b: any) => b?.min_quantity - a?.min_quantity) || [];

    //           item.unitList = this.deepClone(unitList);
    //           item.allow_batch = result.is_batch_available;
    //           item.allow_expiry = result.has_expiry_date;
    //           item.allow_mfg = result.has_manufacturing_date;
    //           item.bonus_infos = this.deepClone(bonusInfos);
    //           item.total_amount = parseFloat((item?.amount || (item.rate * item.quantity)).toFixed(2));
    //           item.unit_id = item.selected_unit_id;
    //           item.quantity_secondary = parseFloat((item.quantity / (item.unit_per_packing || 1)).toFixed(2));
    //           item.free_quantity_secondary = parseFloat((item.free_quantity / (item.unit_per_packing || 1)).toFixed(2));
    //           item.rate_secondary = parseFloat((item.rate * (item.unit_per_packing || 1)).toFixed(2));
    //           item.selling_price_secondary = parseFloat((item.selling_price * (item.unit_per_packing || 1)).toFixed(2));
    //           item.trade_price_secondary = parseFloat((item.trade_price * (item.unit_per_packing || 1)).toFixed(2));
    //           item.total_amount_secondary = parseFloat((item?.amount || (item.rate_secondary * item.quantity_secondary)).toFixed(2));

    //           this.addProductInfo();
    //           this.productInfo.controls[index].patchValue(item);

    //           if (result.product_type == 'Service Item') {
    //             this.productInfo.controls[index]?.get('unit_id').clearValidators();
    //             this.productInfo.controls[index]?.get('unit_id').updateValueAndValidity();
    //           }
    //           else {
    //             this.productInfo.controls[index]?.get('unit_id').setValidators([Validators.required]);
    //             this.productInfo.controls[index]?.get('unit_id').updateValueAndValidity();
    //           }
    //         }
    //       };

    //       processPurchaseEntries();
    //       let tt = res.grand_total;
    //       res?.purchaseBillingTerms?.forEach((item: any, index: number) => {
    //         this.addAdditionalInfo();
    //         this.additionalInfo.controls[index].patchValue(item);
    //         let amount = item.amount;
    //         let sign = item.sign_value;
    //         if (sign == -1) {
    //           tt = tt - amount;
    //         }
    //         else {
    //           tt = tt + amount;
    //         }
    //         this.additionalInfo.controls[index].patchValue({ net_amount: tt })
    //       });

    //       if (res?.purchaseBillingTerms?.length == 0) {
    //         this.addAdditionalInfo();
    //       }
    //       else {
    //         this.showAdditionalPurchase = true;
    //       }


    //       this.vendorList = [];
    //       this.subTotal = res.sub_total;
    //       this.vendorList.push({ id: res.vendor_id, name: res.vendor_name })
    //       this.purchaseEntryForm.get('purchaseInfo')?.patchValue(res);
    //       this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ master_purchase_order_ids: res.master_purchase_order_ids.map((item: any) => Number(item)) });
    //       this.purchaseEntryForm.get('tableInfo')?.patchValue(res)

    //       this.vendorDetail = res.vendor;
    //       if (res.discount_type == '%') {
    //         let dis = (res.discount / res.sub_total) * 100;
    //         this.purchaseEntryForm.get('tableInfo')?.patchValue({ discount_value: Number(dis.toFixed(2)) })
    //       } else {
    //         this.purchaseEntryForm.get('tableInfo')?.patchValue({ discount_value: Number(res.discount.toFixed(2)) })
    //       }
    //       this.discountAmount = res.discount;
    //       this.nonTaxableAmount = res.non_taxable_amount;
    //       this.taxableAmount = res.taxable_amount;
    //       this.tax = res.total_tax;
    //       this.rounding = res.rounding;
    //     },
    //     error: (err) => {
    //       this.toastr.error(err)
    //     },
    //   })
    // }

  }

  ngOnInit() {
    this.getCompanyInfo();
    this.allowNetAmountRounding = this.operationList?.includes('ModifyNetAmount');
    if (this.showPage == 'form') {
      this.getPurchaseNumber();
      this.getAdditionalPurchaseNumber();
      this.addProductInfo();
      this.addAdditionalInfo();
    }
    this.getTaxInformation();
  }

  get f() { return this.purchaseEntryForm.controls; }

  get fPurchase() {
    return this.purchaseEntryForm.controls;
  }

  get fProd() {
    return (this.purchaseEntryForm.get('productInfo') as FormGroup).controls;
  }

  get fVendor() {
    return (this.purchaseEntryForm.get('purchaseInfo') as FormGroup).controls;
  }

  get fTable() {
    return (this.purchaseEntryForm.get('tableInfo') as FormGroup).controls;
  }

  get productInfo(): any {
    return this.purchaseEntryForm.get('productInfo') as FormArray;
  }

  get additionalInfo(): any {
    return this.purchaseEntryForm.get('additionalInfo') as FormArray;
  }

  getTaxInformation() {
    this.dropdown.getMasterDropdown('taxtype', 'active').subscribe({
      next: (res: any) => {
        this.taxList = res;
      },
      error: (err) => {
        this.toastr.error(err)
      },
    })
  }

  getPurchaseOrderDetail(event: any) {
    // if (event == undefined || event.length == 0) {
    //   this.productInfo.clear();
    //   this.addProductInfo();
    //   this.calculateSubTotal();
    // }
    // else {
    //   let ids = event.map((item: any) => item.id);
    //   this.purchaseService.getPurchaseOrderInfo(ids).subscribe({
    //     next: (res: any) => {
    //       this.productInfo.clear();
    //       this.addProductInfo();
    //       this.patchProductData(res);
    //     },
    //     error: (err) => {
    //       this.toastr.error(err)
    //     },
    //   })
    // }
  }

  getPurchaseDetail(purchaseId: number) {
    // this.purchaseService.getPurchaseEntiesForView(purchaseId).subscribe({
    //   next: (res: any) => {
    //     this.selectedPurchaseEntry = res;
    //     this.isImport = res?.is_import || false;
    //     res.purchaseEntries.forEach((entry: any) => {
    //       if (entry.is_primary == false) {
    //         entry.free_quantity_secondary = parseFloat((entry.free_quantity / (entry.unit_per_packing || 1)).toFixed(2));
    //         entry.rate_secondary = parseFloat((entry.rate * (entry.unit_per_packing || 1)).toFixed(2));
    //         entry.selling_price_secondary = parseFloat((entry.selling_price * (entry.unit_per_packing || 1)).toFixed(2));
    //         entry.trade_price_secondary = parseFloat((entry.trade_price * (entry.unit_per_packing || 1)).toFixed(2));
    //         entry.quantity_secondary = parseFloat((entry.quantity / (entry.unit_per_packing || 1)).toFixed(2));
    //       }
    //     })

    //     if (res?.purchaseBillingTerms?.length > 0) {
    //       this.showAdditionalPurchase = true;
    //     }
    //     else {
    //       this.showAdditionalPurchase = false;
    //     }

    //     this.calculateAddtionalNetAmount();
    //     this.vendorDetail = res.vendor;
    //   },
    //   error: (err) => {
    //     this.toastr.error(err)
    //   },
    // })
  }

  async patchProductData(data: any[] = [], order_no?: string) {
    // this.productInfo.clear();
    // for (let item of data) {
    //   let id = item.purchase_order_id || item.id;
    //   const result: any = await firstValueFrom(this.dropdown.getProductsByTypeDivision('purchasable', item.product_name, this.fVendor['division_id'].value));

    //   if (!this.productList.some((prod: any) => prod.id === item.product_id)) {
    //     this.productList = [...this.productList, ...result];
    //   }

    //   if (result != null && result?.length > 0) {
    //     this.addProductInfo();
    //     let i = this.productInfo.length - 1;
    //     this.productInfo.controls[i].get('product_id').setValue(item.product_id);
    //     let quantity_secondary = parseFloat((item.quantity / (item.unit_per_packing || 1)).toFixed(2));
    //     this.productInfo.controls[i].get('quantity').setValue(item.quantity);
    //     this.productInfo.controls[i].get('quantity_secondary').setValue(quantity_secondary);
    //     this.productInfo.controls[i]?.patchValue({ rate: item.rate })
    //     this.productInfo.controls[i]?.patchValue({ rate_secondary: parseFloat((item.rate * (item.unit_per_packing || 1)).toFixed(2)) })
    //     this.getProductDetail(result[0], i, true);
    //     this.productInfo.controls[i]?.patchValue({ unit_id: item.selected_unit_id });
    //     this.productInfo.controls[i]?.patchValue({ unit_name: item.selected_unit_name });
    //     this.productInfo.controls[i]?.patchValue({ purchase_order_id: id });
    //     this.productInfo.controls[i]?.patchValue({ is_primary: item.is_primary });
    //   }
    // }
  }

  addProductInfo() {
    this.productInfo.push(
      this.fb.nonNullable.group({
        id: [],
        index: [],
        product_name: [],
        product_code: [],
        product_id: [, Validators.required],
        master_purchase_entry_id: [],
        tax_type_id: [],
        unit_id: [, Validators.required],
        unit_name: [],
        unitList: [],
        is_primary: [false],
        packing_name: [],
        batch: [],
        expiry_date: [],
        quantity: [, Validators.required],
        quantity_secondary: [, Validators.required],
        free_quantity: [],
        free_quantity_secondary: [],
        rate: [, Validators.required],
        rate_secondary: [, Validators.required],
        mrp: [],
        selling_price: [],
        selling_price_secondary: [],
        trade_price: [],
        trade_price_secondary: [],
        total_amount: [],
        total_amount_secondary: [],
        tax: [],
        type: [],
        mfg_date: [],
        tax_rate: [],
        sub_discount: [],
        sub_tax: [],
        unit_per_packing: [],
        allow_expiry: [true],
        allow_batch: [true],
        allow_mfg: [true],
        bonus_infos: [],
        purchase_order_id: []
      })
    )
  }

  convertTo(control_from: string, control_to: string, to: string, index: number) {
    if (control_from == 'quantity' || control_from == 'quantity_secondary' || control_from == 'free_quantity' || control_from == 'free_quantity_secondary') {
      if (to == 'Secondary') {
        let qty = parseFloat((this.productInfo.controls[index]?.get(control_from)?.value / (this.productInfo.controls[index]?.get('unit_per_packing')?.value || 1)).toFixed(2));
        this.productInfo.controls[index]?.get(control_to)?.setValue(qty);
      }
      else {
        let qty = parseFloat((this.productInfo.controls[index]?.get(control_from)?.value * (this.productInfo.controls[index]?.get('unit_per_packing')?.value || 1)).toFixed(2));
        this.productInfo.controls[index]?.get(control_to)?.setValue(qty);
      }
    }
    else {
      if (to == 'Secondary') {
        let value = parseFloat((this.productInfo.controls[index]?.get(control_from)?.value * (this.productInfo.controls[index]?.get('unit_per_packing')?.value || 1)).toFixed(2));
        this.productInfo.controls[index]?.get(control_to)?.setValue(value);
      }
      else {
        let value = parseFloat((this.productInfo.controls[index]?.get(control_from)?.value / (this.productInfo.controls[index]?.get('unit_per_packing')?.value || 1)).toFixed(2));
        this.productInfo.controls[index]?.get(control_to)?.setValue(value);
      }
    }
    this.getTotalCalculated(index);
  }

  onDeleteRow(index: number) {
    this.productInfo.controls[index].get('id').value != null && this.deletedIds.push(this.productInfo.controls[index].get('id').value);
    if (this.productInfo.length == 1) {
      this.productList = [];
      this.purchaseEntryForm.get('productInfo')?.reset()
      this.calculateSubTotal();
    }
    else {
      setTimeout(() => {
        this.productInfo.removeAt(index);
        this.calculateSubTotal();
      }, 100);
    }
  }

  calculateSubTotal() {
    this.subTotal = 0;
    this.purchaseEntryForm.get('productInfo')?.value.forEach((item: any) => {
      this.subTotal += (item.total_amount || 0);
    });
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ sub_total: this.subTotal });
    this.calculateDiscount();
  }

  calculateDiscount() {
    this.discountAmount = 0;
    this.discountValue = this.purchaseEntryForm.get('tableInfo')?.value.discount_value;
    if (this.purchaseEntryForm.get('tableInfo')?.value.discount_type == '%') {
      this.discountAmount = Number(this.subTotal * (this.discountValue / 100));
      this.discountPercent = this.discountValue;
    } else {
      this.discountAmount = this.discountValue;
      this.discountPercent = (this.discountAmount / this.subTotal) * 100;
    }
    this.calculateNonTaxableAmount();
    this.calculateTaxableAmount();
    this.calculateTax();
    this.calculateRound();

    this.discountAmount = parseFloat(Number(this.discountAmount).toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ discount: this.discountAmount })
  }

  calculateNonTaxableAmount() {
    this.nonTaxableAmount = 0;
    this.purchaseEntryForm.get('productInfo')?.value.forEach((item: any) => {
      if (item.tax_type_id == null || item.tax_type_id == '' || item.tax_type_id == undefined) {
        this.nonTaxableAmount += item.total_amount;
      }
    });
    const discount = parseFloat((this.nonTaxableAmount * ((this.discountPercent || 0) / 100)).toFixed(2));
    this.nonTaxableAmount = parseFloat(this.nonTaxableAmount.toFixed(2)) - discount;
    this.nonTaxableAmount = parseFloat(this.nonTaxableAmount.toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ non_taxable_amount: this.nonTaxableAmount })
  }

  calculateTaxableAmount() {
    this.taxableAmount = 0;
    this.purchaseEntryForm.get('productInfo')?.value.forEach((item: any) => {
      if (!(item.tax_type_id == null || item.tax_type_id == '' || item.tax_type_id == undefined)) {
        this.taxableAmount += item.total_amount;
      }
    });
    const discount = parseFloat((this.taxableAmount * ((this.discountPercent || 0) / 100)).toFixed(2));
    this.taxableAmount = parseFloat(this.taxableAmount.toFixed(2)) - discount;
    this.taxableAmount = parseFloat(this.taxableAmount.toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ taxable_amount: this.taxableAmount })
  }

  calculateTax() {
    this.tax = 0;
    let discountedProductTotal = 0;
    this.purchaseEntryForm.get('productInfo')?.value.forEach((item: any) => {
      if (item.tax_type_id != null || item.tax_type_id != undefined) {
        discountedProductTotal =
          item.total_amount - parseFloat((item.total_amount * ((this.discountPercent || 0) / 100)).toFixed(2));
        this.tax += discountedProductTotal * (item?.tax_rate / 100);
      }
    });
    this.tax = parseFloat(this.tax.toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ total_tax: this.tax });
  }

  calculateRound() {
    this.grandTotal = 0;
    this.grandTotal =
      Number(this.nonTaxableAmount) +
      Number(this.taxableAmount) +
      Number(this.tax);
    if (this.purchaseEntryForm.get('purchaseInfo')?.value.rounded == true && !this.allowNetAmountRounding) {
      this.rounding = Math.round(this.grandTotal) - this.grandTotal;
      this.rounding = parseFloat(this.rounding.toFixed(2));
      this.roundedTotal = this.rounding + this.grandTotal;
    } else if (this.purchaseEntryForm.get('purchaseInfo')?.value.rounded == false && this.allowNetAmountRounding) {
      this.rounding = 0;
      this.roundedTotal = this.grandTotal;
    }
    else {
      this.rounding = 0;
      this.roundedTotal = this.grandTotal;
    }

    if (this.purchaseEntryForm.get('purchaseInfo')?.value.rounded == true) {
      this.rounding = Math.round(this.grandTotal) - this.grandTotal;
      this.rounding = parseFloat(this.rounding.toFixed(2));
      this.roundedTotal = this.rounding + this.grandTotal;
    }
    else {
      this.rounding = 0;
      this.roundedTotal = this.grandTotal;
    }

    this.roundedTotal = parseFloat(this.roundedTotal.toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ grand_total: this.roundedTotal });
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ rounding: this.rounding });
    this.calculateAddtionalNetAmount();
  }

  onChangeGrandTotal() {
    this.grandTotal = 0;
    if (this.showPage == 'form') {
      this.grandTotal =
        Number(this.nonTaxableAmount) +
        Number(this.taxableAmount) +
        Number(this.tax);
    }
    else {
      this.grandTotal = Number(this.fTable['non_taxable_amount'].value) +
        Number(this.fTable['taxable_amount'].value) +
        Number(this.fTable['total_tax'].value);
    }

    this.rounding = this.purchaseEntryForm.get('tableInfo')?.value.grand_total - this.grandTotal;
    this.rounding = parseFloat(this.rounding.toFixed(2));
    this.purchaseEntryForm.get('tableInfo')?.patchValue({ rounding: this.rounding });
    this.calculateAddtionalNetAmount();
  }

  getTotalCalculated(index: number) {
    let total = Number(this.productInfo.controls[index].value.quantity * this.productInfo.controls[index].value.rate)
    let total_secondary = Number(this.productInfo.controls[index]?.value.quantity_secondary * this.productInfo.controls[index]?.value.rate_secondary)

    this.productInfo.controls[index]?.patchValue({ total_amount: Number(total.toFixed(2)) });
    this.productInfo.controls[index]?.patchValue({ total_amount_secondary: Number(total_secondary.toFixed(2)) });
    // debugger;
    this.calculateSubTotal();
    this.productInfo.controls[index].get('id').value != null && this.updatedIds.push(this.productInfo.controls[index].get('id').value);
  }

  onChangeRowTotal(index: number) {
    let rate = Number(this.productInfo.controls[index].value.total_amount / (this.productInfo.controls[index].value.quantity || 1))
    let rate_secondary = Number(this.productInfo.controls[index]?.value.total_amount / (this.productInfo.controls[index]?.value.quantity_secondary || 1))

    this.productInfo.controls[index]?.patchValue({ rate: Number(rate.toFixed(2)) });
    this.productInfo.controls[index]?.patchValue({ rate_secondary: Number(rate_secondary.toFixed(2)) });
    // debugger;
    this.calculateSubTotal();
    this.productInfo.controls[index].get('id').value != null && this.updatedIds.push(this.productInfo.controls[index].get('id').value);
  }

  onChangeUnit(event: any, index: number) {
    if (event == undefined) {
      this.productInfo.controls[index]?.patchValue({ unit_name: null });
      this.productInfo.controls[index]?.patchValue({ is_primary: false });
    }
    else {
      this.productInfo.controls[index]?.patchValue({ unit_name: event.primary_unit_name });
      this.productInfo.controls[index]?.patchValue({ is_primary: event.is_primary });
    }
    this.focusIn('qty', index);
  }

  openInlineProductDialog(name: string, index: number) {
    
  }

  getProductDetail(event: any, index: number, fromOrder?: boolean) {
    if (event == undefined) {
      this.productInfo.controls[index]?.reset();
      this.calculateSubTotal();
    }
    else if (event.id == undefined) {
      this.openInlineProductDialog(event.name, index)
      return;
    }
    else {
      this.productInfo.controls[index]?.patchValue({ product_name: event.name })
      this.masterService.getMasterDetail(event.id, 'products').subscribe({
        next: (res: any) => {
          let unitList = [];

          if (res.primary_unit_id != null) {
            unitList.push({
              id: res.primary_unit_id,
              name: res.primary_unit_name,
              is_primary: true
            });
          }
          if (res.secondary_unit_id != null) {
            unitList.push({
              id: res.secondary_unit_id,
              name: res.secondary_unit_name,
              is_primary: false
            })
          };
          let bonusInfos = res?.bonus_infos?.map((item: any) => {
            item.bonus_percentage = Number(((item?.bonus_quantity || 0) / (item?.min_quantity || 1)));
            return item;
          })?.sort((a: any, b: any) => b?.min_quantity - a?.min_quantity) || [];

          this.productInfo.controls[index]?.patchValue({ product_name: event.name });
          this.productInfo.controls[index]?.patchValue({ unitList: this.deepClone(unitList) });
          if (fromOrder != true) {
            this.productInfo.controls[index]?.patchValue({ unit_id: this.companyDetails?.default_unit_purchase == 'Secondary' ? (res.secondary_unit_id != null ? res.secondary_unit_id : res.primary_unit_id) : res.primary_unit_id });
            this.productInfo.controls[index]?.patchValue({ is_primary: this.companyDetails?.default_unit_purchase == 'Secondary' ? (res.secondary_unit_id != null ? false : true) : true });
          }

          this.productInfo.controls[index]?.patchValue({ allow_batch: res.is_batch_available });
          this.productInfo.controls[index]?.patchValue({ allow_expiry: res.has_expiry_date });
          this.productInfo.controls[index]?.patchValue({ allow_mfg: res.has_manufacturing_date });
          this.productInfo.controls[index]?.patchValue({ bonus_infos: this.deepClone(bonusInfos) });

          if (res.is_primary == false) {
            let qty = this.productInfo.controls[index]?.get('quantity_secondary').value
            qty != null && this.productInfo.controls[index]?.patchValue({ quantity: Number((qty * (res.unit_per_packing || 1)).toFixed(2)) })
          }
          else {
            let qty = this.productInfo.controls[index]?.get('quantity').value
            qty != null && this.productInfo.controls[index]?.patchValue({ quantity_secondary: Number((qty / (res.unit_per_packing || 1)).toFixed(2)) })
          }

          if (fromOrder == true) {
            this.calculateBonusQty(index);
          }

          this.productInfo.controls[index]?.patchValue({ product_code: res.product_code })
          this.productInfo.controls[index]?.patchValue({ packing_name: res.packing_name })
          this.productInfo.controls[index]?.patchValue({ unit_per_packing: (res.unit_per_packing || 1) })
          if (fromOrder != true) {
            this.productInfo.controls[index]?.patchValue({ rate: res.cost_price })
            this.productInfo.controls[index]?.patchValue({ rate_secondary: parseFloat((res.cost_price * (res.unit_per_packing || 1)).toFixed(2)) })
          }
          this.productInfo.controls[index]?.patchValue({ cost_price: res.cost_price })
          this.productInfo.controls[index]?.patchValue({ mrp: res.mrp })
          this.productInfo.controls[index]?.patchValue({ selling_price: res.selling_price })
          this.productInfo.controls[index]?.patchValue({ selling_price_secondary: parseFloat((res.selling_price * (res.unit_per_packing || 1)).toFixed(2)) })
          this.productInfo.controls[index]?.patchValue({ trade_price: res.trade_price })
          this.productInfo.controls[index]?.patchValue({ trade_price_secondary: parseFloat((res.trade_price * (res.unit_per_packing || 1)).toFixed(2)) })

          if (res.tax_type_id != null && this.isImport != true) {
            this.productInfo.controls[index]?.patchValue({ tax_type_id: res.tax_type_id })
            this.productInfo.controls[index]?.patchValue({ tax_rate: this.taxList.find(tax => tax.id == res.tax_type_id)?.rate })
            this.productInfo.controls[index]?.patchValue({ tax: this.taxList.find(tax => tax.id == res.tax_type_id)?.name })
          }
          else {
            this.productInfo.controls[index]?.patchValue({ tax_type_id: null })
            this.productInfo.controls[index]?.patchValue({ tax_rate: null })
            this.productInfo.controls[index]?.patchValue({ tax: null })
          }

          if (res.product_type == 'Service Item') {
            this.productInfo.controls[index]?.get('unit_id').clearValidators();
            this.productInfo.controls[index]?.get('unit_id').updateValueAndValidity();
            this.productInfo.controls[index].get('allow_batch').value == true ? this.focusIn('batch', index) : this.productInfo.controls[index].get('allow_expiry').value == true ? this.focusIn('expiry', index) : this.focusIn('qty', index)
          }
          else {
            this.productInfo.controls[index]?.get('unit_id').setValidators([Validators.required]);
            this.productInfo.controls[index]?.get('unit_id').updateValueAndValidity();
            this.focusIn('unit', index);
          }

          this.getTotalCalculated(index);
        },
        error: (err) => {
          this.toastr.error(err)
        },
      });
    }

  }

  calculateBonusQty(index: number) {
    let bonus_infos = this.productInfo.controls[index]?.get('bonus_infos')?.value || [];
    let qty = this.productInfo.controls[index]?.get('quantity')?.value;
    let qty_secondary = this.productInfo.controls[index]?.get('quantity_secondary')?.value;
    let bonus = 0;
    let bonus_secondary = 0;

    for (const item of bonus_infos) {
      if (qty >= item.min_quantity) {
        bonus = Number((qty * item.bonus_percentage).toFixed(2));
        bonus_secondary = Number((qty_secondary * item.bonus_percentage).toFixed(2));
        break;
      }
    }

    this.productInfo.controls[index]?.patchValue({ free_quantity: bonus });
    this.productInfo.controls[index]?.patchValue({ free_quantity_secondary: bonus_secondary });
  }

  focusIn(control: string, index: number) {
    switch (control) {
      case "product":
        this.addProductInfo();
        setTimeout(() => {
          const productInput = this.productInputs.toArray()[this.productInfo.controls.length - 1];
          if (productInput) {
            productInput.focus();
          }
        }, 100);
        break;

      case "batch":
        setTimeout(() => {
          const unitInput = this.unitInputs.toArray()[index];
          if (unitInput) {
            unitInput.close();
          }
          const batchInput = this.batchInputs.toArray()[index];
          if (batchInput) {
            batchInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "expiry":
        setTimeout(() => {
          const unitInput = this.unitInputs.toArray()[index];
          if (unitInput) {
            unitInput.close();
          }
          const expiryInput = this.expiryInputs.toArray()[index];
          if (expiryInput) {
            expiryInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "mfg":
        setTimeout(() => {
          const unitInput = this.unitInputs.toArray()[index];
          if (unitInput) {
            unitInput.close();
          }
          const mfgInput = this.mfgInputs.toArray()[index];
          if (mfgInput) {
            mfgInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "sp":
        setTimeout(() => {
          const spInput = this.spInputs.toArray()[index];
          if (spInput) {
            spInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "tp":
        setTimeout(() => {
          const tpInput = this.tpInputs.toArray()[index];
          if (tpInput) {
            tpInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "mrp":
        setTimeout(() => {
          const mrpInput = this.mrpInputs.toArray()[index];
          if (mrpInput) {
            mrpInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "qty":
        const unitInput = this.unitInputs.toArray()[index];
        if (unitInput) {
          unitInput.close();
        }
        setTimeout(() => {
          const qtyInput = this.qtyInputs.toArray()[index];
          if (qtyInput) {
            qtyInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "free":
        setTimeout(() => {
          const freeInput = this.freeInputs.toArray()[index];
          if (freeInput) {
            freeInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "rate":
        setTimeout(() => {
          const rateInput = this.rateInputs.toArray()[index];
          if (rateInput) {
            rateInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "tax":
        setTimeout(() => {
          const taxInput = this.taxInputs.toArray()[index];
          if (taxInput) {
            taxInput.focus();
          }
        }, 100);
        break;

      case "unit":
        setTimeout(() => {
          const unitInput = this.unitInputs.toArray()[index];
          if (unitInput) {
            unitInput.focus();
          }
        }, 100);
        break;

      default:
        break;

      case "rowamount":
        setTimeout(() => {
          const rowAmountInput = this.rowAmountInputs.toArray()[index];
          if (rowAmountInput) {
            rowAmountInput.nativeElement.focus();
          }
        }, 100);
        break;

      case "term":
        this.addAdditionalInfo();
        setTimeout(() => {
          const termInput = this.termInputs.toArray()[this.additionalInfo.controls.length - 1];
          if (termInput) {
            termInput.focus();
          }
        }, 100);
        break;

      case "ledger":
        setTimeout(() => {
          const termInput = this.termInputs.toArray()[index];
          if (termInput) {
            termInput.close();
          }
          const ledgerInput = this.ledgerInputs.toArray()[index];
          if (ledgerInput) {
            ledgerInput.focus();
          }
        }, 100);
        break;

      case "amount":
        setTimeout(() => {
          const ledgerInput = this.ledgerInputs.toArray()[index];
          if (ledgerInput) {
            ledgerInput.close();
          }
          const amountInput = this.amountInputs.toArray()[index];
          if (amountInput) {
            amountInput.nativeElement.focus();
          }
        }, 100);
        break;
    }
  }

  onFocus(index: number) {
    this.focusedRowIndex = index;
  }

  onBlur() {
    this.focusedRowIndex = null;
  }

  getCompanyInfo() {
    
  }

  setPostingDate(e: any) {
    this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ date: e });
  }

  setBillDate(e: any) {
    this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ bill_date: e });
  }

  onChangeDivision(event: any) {
    if (event == undefined) {
      return;
    }
    else {
      let discount = this.vendorDetail?.discount_details?.find((item: any) => item.division_id == this.fVendor['division_id'].value)?.discount;
      this.purchaseEntryForm.get('tableInfo')?.patchValue({ discount_type: '%', discount_value: discount || 0 })
      this.calculateDiscount();
      this.getPurchaseOrderDropdownList(this.fVendor['vendor_id']?.value, this.fVendor['division_id']?.value);
    }
  }

  clearProductList() {
    this.productList = [];
    this.purchaseEntryForm.get('productInfo')?.reset()
  }

  getPurchaseNumber(): void {
    // this.purchaseService.getPurchaseNo(this.isImport).subscribe((res: string) => {
    //   this.fVendor['system_pe_no'].setValue(res);
    // })
  }

  getAdditionalPurchaseNumber(): void {
    
  }

  getPurchaseOrderDropdownList(vendorId?: number, divisionId?: number, result?: any[]) {
    // this.dropdown.getPurchaseOrderDropdown(vendorId, divisionId).subscribe({
    //   next: (res: any) => {
    //     if (result != undefined && result?.length > 0) {
    //       this.purchaseOrderList = [...result, ...res];
    //     }
    //     else {
    //       this.purchaseOrderList = [...res];
    //     }
    //   },
    //   error: (err) => {
    //     this.toastr.error(err)
    //   },
    // })
  }

  openInlineVendorDialog(name: string) {
    // const dialogRef = this.dialog.open(AddVendorsComponent, {
    //   panelClass: ['fullscreen', 'slide-up'],
    //   enterAnimationDuration: '0ms',
    //   exitAnimationDuration: '0ms',
    //   disableClose: true,
    //   data: {
    //     formData: {
    //       name: name,
    //     }
    //   }
    // });

    // dialogRef.backdropClick().subscribe(() => {
    //   dialogRef.removePanelClass('slide-up');
    //   dialogRef.addPanelClass('slide-down');

    //   setTimeout(() => {
    //     dialogRef.close();
    //   }, 400);
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.vendorList = [result, ...this.vendorList]
    //     this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ vendor_id: result.id })
    //     this.getVendorInformation(result)
    //   }
    //   else {
    //     this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ vendor_id: null })
    //     this.vendorList = [...this.vendorList]
    //   }
    // });
  }

  getVendorInformations(id: number, fromOrder?: boolean) {
    // this.dropdown.getIndividualVendorInformationDropDown(id).subscribe({
    //   next: (res: any) => {
    //     this.vendorDetail = res;
    //     if (fromOrder == true) {
    //       let discount = this.vendorDetail?.discount_details?.find((item: any) => item.division_id == this.fVendor['division_id'].value)?.discount;
    //       this.purchaseEntryForm.get('tableInfo')?.patchValue({ discount_type: '%', discount_value: discount || 0 })
    //       this.calculateDiscount();
    //     }
    //   },
    //   error: (err) => {
    //     this.toastr.error(err)
    //   },
    // })
  }

  getVendorInformation(event: any) {
    if (event == undefined) {
      let invoiceNo = this.fVendor['system_pe_no'].value;
      this.fVendor['system_pe_no']?.setValue(invoiceNo);
      this.addProductInfo();
      return;
    }

    if (event.id == undefined) {
      this.openInlineVendorDialog(event.name)
      return;
    }

    if (event !== undefined) {
      this.masterService.getMasterDetail(event?.id, 'vendors').subscribe({
        next: (res: any) => {
          this.vendorDetail = res;
          this.purchaseEntryForm.get('purchaseInfo')?.patchValue({ vendor_id: this.vendorDetail.id })
        },
        error: (err) => {
          this.toastr.error(err)
        },
      });
    }

  }

  onAddAccount(event: any, mode: string, index: number) {
    // if (event != undefined && event.id == undefined) {
    //   const dialogRef = this.dialog.open(AddMasterAccountComponent, {
    //     panelClass: ['fullscreen', 'slide-up'],
    //     enterAnimationDuration: '0ms',
    //     exitAnimationDuration: '0ms',
    //     disableClose: true,
    //     data: {
    //       formData: {
    //         name: name,
    //       }
    //     }
    //   });

    //   dialogRef.afterClosed().subscribe(async result => {
    //     if (result) {
    //       const datas: any = await firstValueFrom(this.dropdown.getMasterAccountsBilling());
    //       this.accountDropdownList = datas;
    //       if (datas.some((item: any) => item.id == result.id)) {
    //         if (mode == 'form') {
    //           this.additionalInfo.controls[index].get('credit_account_id').setValue(result.id);
    //         } else {
    //           this.selectedPurchaseEntry.purchaseBillingTerms[index].credit_account_id = result.id;
    //         }
    //       }
    //       else {
    //         if (mode == 'form') {
    //           this.additionalInfo.controls[index].get('credit_account_id').setValue(null);
    //         } else {
    //           this.selectedPurchaseEntry.purchaseBillingTerms[index].credit_account_id = null;
    //         }
    //       }
    //     } else {
    //       this.accountDropdownList = [...this.accountDropdownList];
    //       if (mode == 'form') {
    //         this.additionalInfo.controls[index].get('credit_account_id').setValue(null);
    //       } else {
    //         this.selectedPurchaseEntry.purchaseBillingTerms[index].credit_account_id = null;
    //       }
    //     }
    //   });
    // }
  }

  onSearch(event: any, type?: string) {
    // clearTimeout(this.searchTimer);
    // this.searchTerm = event.target.value.trim();

    // this.isSearching = true;
    // this.searchTimer = setTimeout(() => {
    //   if (this.searchTerm !== '') {
    //     if (type == 'product') {
    //       this.dropdown.getProductsByTypeDivision('purchasable', this.searchTerm, this.fVendor['division_id'].value).subscribe((result: any) => {
    //         this.productList = result.map((product: any) => {
    //           product.product_name = product.name;
    //           return product;
    //         });
    //         this.isSearching = false;
    //       });
    //     }
    //     else {
    //       this.dropdown.getVendorDropdown(this.searchTerm).subscribe((result: any) => {
    //         this.vendorList = result;
    //         this.isSearching = false;
    //       });
    //     }
    //   }
    //   else {
    //     this.isSearching = false;
    //   }
    // }, 1000);
  }

  showConfirm() {
    this.purchaseEntryForm.markAllAsTouched();
    if (this.purchaseEntryForm.invalid) {
      return;
    }

    this.confirmDialogRef = this.dialog.open(this.confirm, {
      panelClass: 'slide-up',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: {
        name: "Purchase Order",
        mode: "Cancel"
      }
    });

    this.confirmDialogRef.backdropClick().subscribe(() => {
      this.closeConfirmDialog();
    });

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveForm();
      }
      else {
        this.closeConfirmDialog();
      }
    });
  }

  closeConfirmDialog() {
    this.confirmDialogRef.removePanelClass('slide-up');
    this.confirmDialogRef.addPanelClass('slide-down');

    setTimeout(() => {
      this.confirmDialogRef.close();
    }, 400);
  }

  addAdditionalInfo() {
    if (this.showPage == 'view') {
      this.selectedPurchaseEntry?.purchaseBillingTerms?.push({
        id: null,
        billing_term_id: null,
        credit_account_id: null,
        sign_value: null,
        amount: null,
        net_amount: null,
        free_quantity_costing: false,
        stock_valuation: true
      });
    }
    else {
      this.additionalInfo.push(
        this.fb.nonNullable.group({
          id: [],
          billing_term_id: [],
          credit_account_id: [],
          sign_value: [],
          amount: [],
          net_amount: [],
          free_quantity_costing: [false],
          stock_valuation: [true]
        })
      )
    }
  }

  removeAdditionalInfo(i: number) {
    if (this.showPage == 'view') {
      if (this.selectedPurchaseEntry?.purchaseBillingTerms?.length == 1) {
        this.selectedPurchaseEntry.purchaseBillingTerms = this.selectedPurchaseEntry?.purchaseBillingTerms?.filter((item: any, index: number) => index != i);
        this.selectedPurchaseEntry?.purchaseBillingTerms?.push({
          id: null,
          billing_term_id: null,
          credit_account_id: null,
          sign_value: null,
          amount: null,
          net_amount: null,
          free_quantity_costing: false,
          stock_valuation: true,
        });
      }
      else {
        this.selectedPurchaseEntry.purchaseBillingTerms = this.selectedPurchaseEntry?.purchaseBillingTerms?.filter((item: any, index: number) => index != i);
      }
    }
    else {
      if (this.additionalInfo.length == 1) {
        this.purchaseEntryForm.get('additionalInfo')?.reset();
      }
      else {
        this.additionalInfo.removeAt(i);
      }
    }
  }

  onChangeTerm(event: any, i: number) {
    // if (event != undefined && event.id == undefined) {
    //   const dialogRef = this.dialog.open(AddPurchaseBillingTermComponent, {
    //     panelClass: ['slide-up'],
    //     enterAnimationDuration: '0ms',
    //     exitAnimationDuration: '0ms',
    //     disableClose: true,
    //     data: {
    //       formData: {
    //         name: event?.name,
    //       }
    //     }
    //   });

    //   dialogRef.afterClosed().subscribe(async result => {
    //     if (result) {
    //       this.billingTermList = [result, ...this.billingTermList];
    //       if (this.showPage == 'form') {
    //         this.additionalInfo.controls[i].get('billing_term_id').setValue(result.id);
    //       } else {
    //         this.selectedPurchaseEntry.purchaseBillingTerms[i].billing_term_id = result.id;
    //       }
    //       this.onChangeTerm(result, i);
    //       this.getAccountDropdown();
    //     } else {
    //       this.billingTermList = [...this.billingTermList];
    //       if (this.showPage == 'form') {
    //         this.additionalInfo.controls[i].get('billing_term_id').setValue(null);
    //       } else {
    //         this.selectedPurchaseEntry.purchaseBillingTerms[i].billing_term_id = null;
    //       }
    //     }
    //   });
    //   return;
    // }

    // if (this.showPage == 'view') {
    //   this.selectedPurchaseEntry.purchaseBillingTerms[i].sign_value = event.rate;
    //   this.selectedPurchaseEntry.purchaseBillingTerms[i].free_quantity_costing = event.free_quantity_costing;
    //   this.selectedPurchaseEntry.purchaseBillingTerms[i].stock_valuation = event.stock_valuation;
    // }
    // else {
    //   this.additionalInfo.controls[i]?.patchValue({ sign_value: event.rate });
    //   this.additionalInfo.controls[i]?.patchValue({ free_quantity_costing: event.free_quantity_costing });
    //   this.additionalInfo.controls[i]?.patchValue({ stock_valuation: event.stock_valuation });
    // }
  }

  calculateAddtionalNetAmount() {
    if (this.showPage == 'view') {
      let grand_total = this.selectedPurchaseEntry?.grand_total || 0;
      let total = grand_total;
      this.selectedPurchaseEntry?.purchaseBillingTerms?.forEach((item: any, index: number) => {
        let amount = item?.amount;
        let sign = item?.sign_value;
        if (sign == -1) {
          total = total - amount;
        }
        else {
          total = total + amount;
        }
        item.net_amount = total;
      })
    }
    else {
      let grand_total = this.fTable['grand_total'].value || 0;
      let total = grand_total;
      this.additionalInfo.controls.forEach((item: any, index: number) => {
        let amount = this.additionalInfo.controls[index].value.amount;
        let sign = this.additionalInfo.controls[index].value.sign_value;
        if (sign == -1) {
          total = total - amount;
        }
        else {
          total = total + amount;
        }
        this.additionalInfo.controls[index].patchValue({ net_amount: total })
      })
    }

  }

  saveBillingTermView() {
    // let billingTerms: any[] = [];
    // this.selectedPurchaseEntry?.purchaseBillingTerms?.forEach((item: any) => {
    //   if (item.credit_account_id != null && item.billing_term_id != null) {
    //     billingTerms.push({
    //       id: Number(item.id) || null,
    //       credit_account_id: Number(item.credit_account_id),
    //       credit_account_name: this.accountDropdownList.find(itt => itt.id == Number(item.credit_account_id))?.name || '',
    //       billing_term_id: Number(item.billing_term_id),
    //       billing_term_name: this.billingTermList.find(itt => itt.id == Number(item.billing_term_id))?.name || '',
    //       amount: Number(item.amount) || 0,
    //       sign_value: Number(item.sign_value),
    //       free_quantity_costing: item.free_quantity_costing,
    //       stock_valuation: item.stock_valuation,
    //     });
    //   }
    // });

    // this.isLoading = true;
    // this.purchaseService.updateBillingTermsPurchase(billingTerms, this.selectedPurchaseEntry.id).subscribe(
    //   {
    //     next: (res: any) => {
    //       if (res?.success == true) {
    //         this.isLoading = false;
    //         this.allowEditBilling = false;
    //         res?.messages?.forEach((message: any) => {
    //           this.toastr.success(message.message, 'Success', {
    //             closeButton: true,
    //           });
    //         })
    //       }
    //       else {
    //         res?.messages?.forEach((message: any) => {
    //           this.toastr.error(message.message, 'Error', {
    //             closeButton: true,
    //           });
    //         });
    //         this.isLoading = false;
    //       }
    //     },
    //     error: (err) => {
    //       err?.error?.messages?.forEach((message: any) => {
    //         this.toastr.error(message.message, 'Error', {
    //           closeButton: true,
    //         });
    //       });
    //       this.isLoading = false;
    //     },
    //   }
    // )
  }

  saveForm() {
    this.purchaseEntryForm.markAllAsTouched();
    if (this.purchaseEntryForm.invalid) {
      return;
    }

    if (!(this.fVendor['date'].value >= this.fVendor['bill_date'].value)) {
      this.toastr.error(
        'Bill Date Cannot be greater than Posting Date',
        'Error',
        {
          closeButton: true,
        }
      );
      return;
    }
    if (
      this.fVendor['date'].value > this.todayDate
    ) {
      this.toastr.error('Future Date Selected!', 'Error', {
        closeButton: true,
      });
      return;
    }

    if (
      this.purchaseEntryForm.get('tableInfo')?.value.grand_total <= 0
      && this.companyDetails?.zero_value_purchase != 1
    ) {
      this.toastr.error('Grand Total Cannot Be Zero or negative', 'Error', {
        closeButton: true,
      });
      return;
    }


    let modifiedEntries: any = [];
    this.purchaseEntryForm.get('productInfo')?.value.forEach((item: any) => {
      modifiedEntries.push({
        id: Number(item.id) || null,
        product_id: Number(item.product_id) || null,
        batch: item.batch || null,
        expiry_date: item.expiry_date || null,
        tax_type_id: Number(item.tax_type_id) || null,
        quantity: Number(item.quantity),
        free_quantity: this.companyDetails.is_free_sample == '1' ? Number(item.free_quantity) || 0 : 0,
        selected_unit_id: Number(item.unit_id) || null,
        rate: Number(item.rate) || 0,
        amount: Number(item.total_amount) || 0,
        selling_price: Number(item.selling_price),
        mrp: Number(item.mrp),
        trade_price: Number(item.trade_price),
        mfg_date: item.mfg_date || null,
        type: item.type,
        is_primary: item.is_primary,
        unit_per_packing: item.unit_per_packing || 1,
        purchase_order_id: Number(item.purchase_order_id) || null,
      });
    });

    if (modifiedEntries?.some((entries: any) => entries.quantity == 0)) {
      this.toastr.error('Quantity cannot be zero', 'Error', {
        closeButton: true,
      });
      return;
    }

    let billingTerms: any[] = [];
    this.purchaseEntryForm.get('additionalInfo')?.value.forEach((item: any) => {
      if (item.credit_account_id != null && item.billing_term_id != null) {
        billingTerms.push({
          id: Number(item.id) || null,
          credit_account_id: Number(item.credit_account_id),
          billing_term_id: Number(item.billing_term_id),
          sign_value: Number(item.sign_value),
          amount: Number(item.amount) || 0,
          free_quantity_costing: item.free_quantity_costing,
          stock_valuation: item.stock_valuation,
        });
      }
    });

    this.isLoading = true;

    let finalData: any = {
      purchaseEntries: modifiedEntries,
      purchaseBillingTerms: billingTerms,
      ...this.purchaseEntryForm.get('purchaseInfo')?.value,
      ...this.purchaseEntryForm.get('tableInfo')?.value,
      updated_ids: [...new Set(this.updatedIds)],
      deleted_ids: [...new Set(this.deletedIds)],
      is_import: this.isImport,
      additional_amount: this.additionalInfo?.controls[this.additionalInfo?.controls?.length - 1]?.get('net_amount')?.value || this.purchaseEntryForm.get('tableInfo')?.value.grand_total
    };

    const request$ = this.data?.formData?.id
      ? this.purchaseService.updatePurchaseEntry(finalData, this.data?.formData?.id)
      : this.purchaseService.createPurchaseEntry(finalData);

    request$.subscribe({
      next: (res: any) => {
        if (res?.success == true) {
          this.isLoading = false;
          this.closeDialog(res);
          // this.closeConfirmDialog();
          res?.messages?.forEach((message: any) => {
            this.toastr.success(message.message, 'Success', {
              closeButton: true,
            });
          });

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
    })
  }

  public closeDialog(data?: any) {
    this.dialogRef.removePanelClass('slide-left');
    this.dialogRef.addPanelClass('slide-left-close');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close({
          id: this.data?.formData?.id || data?.post_data_id,
        });
      }
      else {
        this.dialogRef.close();
      }

    }, 400);
  }

  getPDF() {

  }

  exportExcelForView() {

  }

  deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Array) {
      const arrCopy: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = this.deepClone(obj[i]);
      }
      return arrCopy;
    }

    if (obj instanceof Object) {
      const objCopy: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          objCopy[key] = this.deepClone(obj[key]);
        }
      }
      return objCopy;
    }

    return obj;
  }
}
