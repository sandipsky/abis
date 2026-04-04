import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../master/master.service';
import { DropdownsService } from '../../../shared/services/dropdown.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { MastersInlineModalComponent } from '../../master/general-master/add-master-modal/add-master-modal';
import { AmountPipe } from "../../../shared/pipes/amount-pipe";

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, AmountPipe],
  templateUrl: './add-products.html',
  standalone: true
})
export class AddProducts {
  modalForm: FormGroup;
  endPoint = 'products';
  isLoading = false;
  companyDetails: any;
  selectedProduct: any;

  requiredPurchase = false;
  requiredSales = false;
  requiredDivision = false;

  currentStepIndex = 0;
  totalSteps = 2;
  selectedProfileImage: any = null;
  deleteImage: boolean = false;

  public operationList: any = [];
  public allCatrgories: Array<any> = [];
  public allGroups: Array<any> = [];
  public allCompanies: Array<any> = [];
  public allDivisions: any;
  public allGenericNames: Array<any> = [];
  public allPackings: Array<any> = [];
  public allTaxTypes: Array<any> = [];
  public allUnits: Array<any> = [];
  public selectedTypeName: Array<String> = [];
  accountDropdownList: any = [];
  valuationMethodList = [
    {
      id: "FIFO",
      name: "FIFO"
    },
    {
      id: "LIFO",
      name: "LIFO"
    },
    {
      id: "FEFO",
      name: "FEFO"
    },

  ];
  productTypeList = [
    {
      id: "Inventory Item",
      name: "Inventory Item"
    },
    {
      id: "Service Item",
      name: "Service Item"
    }
  ];

  public selectedCategories: any[] = [];
  public selectedType = [
    {
      id: 1,
      name: "sellable"
    },
    {
      id: 2,
      name: "purchasable"
    },
  ];

  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    private dropdown: DropdownsService,
    private configService: ConfigurationService,
    private fb: FormBuilder,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalForm = this.fb.nonNullable.group({
      id: [],
      name: [, Validators.required],
      product_code: [],
      discontinue_status: [],
      sku: [],
      barcode: [],
      hs_code: [],
      primary_unit_id: [, Validators.required],
      primary_quantity: [],
      has_secondary_unit: [false],
      secondary_unit_id: [],
      secondary_quantity: [],
      product_type: [, Validators.required],
      product_group_id: [],
      packing_id: [],
      division_ids: [],
      generic_name_id: [],
      tax_type_id: [],
      company_ids: [],
      company_names: [],
      remarks: [],
      types: [],
      status: [true],
      product_categories: [],

      cost_price: [],
      mrp: [],
      selling_price: [],
      trade_price: [],
      max_sales_quantity: [],
      is_max_supply: [false],
      max_stock: [],
      min_stock: [],
      reorder_level: [],
      reorder_quantity: [],


      purchase_account_master_id: [],
      purchase_return_account_master_id: [],
      sales_account_master_id: [],
      sales_return_account_master_id: [],

      valuation_method: [, Validators.required],
      is_batch_available: [false],
      has_expiry_date: [false],
      has_manufacturing_date: [false],
      bonus_infos: new FormArray([])
    });

    if (data?.formData) {
      this.modalForm.patchValue(data?.formData);
    }


  }

  getAccountDropdown() {
    this.dropdown.getMasterAccounts().subscribe({
      next: (res) => {
        this.accountDropdownList = res;
      },
      error: (err) => {
        this.toastr.error(err)
      },
    })
  }

  ngOnInit() {
    this.operationList = this.authService.userPermissionList();
    if (this.data.isView != true) {
      this.getAllProducts();
    }



    if (this.data?.formData?.id) {
      this.getAccountDropdown();
      this.bonus_infos.clear();



      this.masterService.getMasterDetail(this.data?.formData?.id, this.endPoint).subscribe(
        {
          next: (res: any) => {

            this.selectedProduct = res;
            this.selectedCategories = res?.product_categories.map(function (obj: any) {
              return obj.id;
            });
            this.selectedProduct.product_categories = res?.product_categories.map((item: any) => item.name).join(', ');
            if (this.selectedProduct?.bonus_infos?.length > 0) {

              for (let i = 0; i < this.selectedProduct?.bonus_infos?.length; i++) {
                this.addBonus();
              }
            }
            else {
              this.addBonus();
            }


            if (this.selectedProduct.company_names == undefined || this.selectedProduct.company_names == null) {
              const companyNames = this.allDivisions
                ?.filter((d: any) => this.selectedProduct?.division_ids?.includes(d?.id))
                .map((d: any) => d.company_name);

              const uniqueCompanyNames = Array.from(new Set(companyNames)).join(", ");

              this.selectedProduct.company_names = uniqueCompanyNames;
            }

            this.modalForm.patchValue(this.selectedProduct);

            if (res.image_name != null) {
              fetch(`${environment.apiUrl}/master/products/image/${res.image_name}`, {
                headers: { Authorization: `Bearer ${this.authService.getToken()}` }
              })
                .then(resp => resp.blob())
                .then(blob => {
                  this.selectedProfileImage = {
                    file: null,
                    url: URL.createObjectURL(blob),
                    name: res.image_name,
                    size: this.formatFileSize(blob.size)
                  };
                });
            }

            if (this.selectedProduct.types != null && this.selectedProduct.types != "") {
              this.selectedTypeName = this.selectedProduct?.types?.map((item: any) => {
                return item.trim(" ");
              });
            }

            if (this.selectedTypeName.includes('purchasable')) {
              this.modalForm.get('purchase_account_master_id')?.addValidators(Validators.required);
              this.modalForm.get('purchase_account_master_id')?.updateValueAndValidity();
              this.modalForm.get('purchase_return_account_master_id')?.addValidators(Validators.required);
              this.modalForm.get('purchase_return_account_master_id')?.updateValueAndValidity();
              this.requiredPurchase = true;
            }
            else {
              this.modalForm.get('purchase_account_master_id')?.removeValidators(Validators.required);
              this.modalForm.get('purchase_account_master_id')?.updateValueAndValidity();
              this.modalForm.get('purchase_return_account_master_id')?.removeValidators(Validators.required);
              this.modalForm.get('purchase_return_account_master_id')?.updateValueAndValidity();
              this.requiredPurchase = false;
            }

            if (this.selectedTypeName.includes('sellable')) {
              this.modalForm.get('sales_account_master_id')?.addValidators(Validators.required);
              this.modalForm.get('sales_account_master_id')?.updateValueAndValidity();
              this.modalForm.get('sales_return_account_master_id')?.addValidators(Validators.required);
              this.modalForm.get('sales_return_account_master_id')?.updateValueAndValidity();
              this.requiredSales = true;
              this.requiredDivision = true;
              this.f['division_ids']?.setValidators([Validators.required]);
              this.f['division_ids']?.updateValueAndValidity();
            }
            else {
              this.modalForm.get('sales_account_master_id')?.removeValidators(Validators.required);
              this.modalForm.get('sales_account_master_id')?.updateValueAndValidity();
              this.modalForm.get('sales_return_account_master_id')?.removeValidators(Validators.required);
              this.modalForm.get('sales_return_account_master_id')?.updateValueAndValidity();
              this.requiredSales = false;
              this.requiredDivision = false;
              this.f['division_ids']?.removeValidators([Validators.required]);
              this.f['division_ids']?.updateValueAndValidity();
            }

            if (this.f['has_secondary_unit'].value == true) {
              this.modalForm.get('secondary_unit_id')?.addValidators(Validators.required);
              this.modalForm.get('secondary_unit_id')?.updateValueAndValidity();
            }
            else {
              this.modalForm.get('secondary_unit_id')?.removeValidators(Validators.required);
              this.modalForm.get('secondary_unit_id')?.updateValueAndValidity();
            }

            if (this.f['product_type'].value == 'Service Item') {
              this.modalForm.get('primary_unit_id')?.removeValidators(Validators.required);
              this.modalForm.get('primary_unit_id')?.updateValueAndValidity();
              this.modalForm.get('valuation_method')?.removeValidators(Validators.required);
              this.modalForm.get('valuation_method')?.updateValueAndValidity();
            }
            else {
              this.modalForm.get('primary_unit_id')?.addValidators(Validators.required);
              this.modalForm.get('primary_unit_id')?.updateValueAndValidity();
              this.modalForm.get('valuation_method')?.addValidators(Validators.required);
              this.modalForm.get('valuation_method')?.updateValueAndValidity();
            }
          },
          error: (err) => {
            err?.error?.messages?.forEach((message: any) => {
              this.toastr.error(message.message, 'Error', {
                closeButton: true,
              });
            });
          },

        }
      )
    }
    else {
      this.configService.companyDetails$.subscribe((c) => {
        this.companyDetails = c;
        this.dropdown.getMasterAccounts().subscribe({
          next: (res) => {
            this.accountDropdownList = res;
            if (this.companyDetails?.company_reg_type != 'PAN') {
              let purchase_id = this.accountDropdownList.find((item: any) => item?.name?.includes('VAT Purchase'))?.id || null;
              let sales_id = this.accountDropdownList.find((item: any) => item?.name?.includes('VAT Sales'))?.id || null;
              this.f['purchase_account_master_id']?.setValue(purchase_id)
              this.f['purchase_return_account_master_id']?.setValue(purchase_id)
              this.f['sales_account_master_id']?.setValue(sales_id)
              this.f['sales_return_account_master_id']?.setValue(sales_id)
            }
            else {
              let purchase_id = this.accountDropdownList.find((item: any) => item?.name.includes('VAT Free Purchase'))?.id || null;
              let sales_id = this.accountDropdownList.find((item: any) => item?.name?.includes('VAT Free Sales'))?.id || null;
              this.f['purchase_account_master_id']?.setValue(purchase_id)
              this.f['purchase_return_account_master_id']?.setValue(purchase_id)
              this.f['sales_account_master_id']?.setValue(sales_id)
              this.f['sales_return_account_master_id']?.setValue(sales_id)
            }
          },
          error: (err) => {
            this.toastr.error(err)
          },
        })
      });

      this.modalForm.get('valuation_method')?.setValue(this.companyDetails?.product_valuation_method);
      this.masterService.getMasterCode('products').subscribe((res: string) => {
        this.f['product_code'].setValue(res || null);
      });
      this.addBonus();
    }

    this.configService.companyDetails$.subscribe((c) => {
      this.companyDetails = c;
    });
  }

  get f() { return this.modalForm.controls; }

  get bonus_infos(): any {
    return this.modalForm.get('bonus_infos') as FormArray;
  }

  addBonus() {
    this.bonus_infos.push(
      this.fb.group({
        id: [],
        min_quantity: [],
        bonus_quantity: []
      }),
    );
  }

  removeBonus(index: number) {
    this.bonus_infos.removeAt(index);
  }

  public getAllProducts(): void {
    this.dropdown.getAllProductDropdownInfo()
      .subscribe((productInfo: any) => {
        this.allCatrgories = productInfo.categories;
        this.allCompanies = productInfo.companies;
        this.allDivisions = productInfo.divisions;
        this.allGenericNames = productInfo.generic_names;
        this.allPackings = productInfo.packings;
        this.allTaxTypes = productInfo.tax_types;
        this.allUnits = productInfo.units;
        this.allGroups = productInfo.product_groups;
      })
  }

  getType(name: string) {
    if (this.selectedTypeName.includes(name)) {
      this.selectedTypeName = this.selectedTypeName.filter(item => item != name);
    }
    else {
      this.selectedTypeName.push(name);
    }

    if (this.selectedTypeName.includes('purchasable')) {
      this.modalForm.get('purchase_account_master_id')?.addValidators(Validators.required);
      this.modalForm.get('purchase_account_master_id')?.updateValueAndValidity();
      this.modalForm.get('purchase_return_account_master_id')?.addValidators(Validators.required);
      this.modalForm.get('purchase_return_account_master_id')?.updateValueAndValidity();
      this.requiredPurchase = true;
    }
    else {
      this.modalForm.get('purchase_account_master_id')?.removeValidators(Validators.required);
      this.modalForm.get('purchase_account_master_id')?.updateValueAndValidity();
      this.modalForm.get('purchase_return_account_master_id')?.removeValidators(Validators.required);
      this.modalForm.get('purchase_return_account_master_id')?.updateValueAndValidity();
      this.requiredPurchase = false;
    }

    if (this.selectedTypeName.includes('sellable')) {
      this.modalForm.get('sales_account_master_id')?.addValidators(Validators.required);
      this.modalForm.get('sales_account_master_id')?.updateValueAndValidity();
      this.modalForm.get('sales_return_account_master_id')?.addValidators(Validators.required);
      this.modalForm.get('sales_return_account_master_id')?.updateValueAndValidity();
      this.requiredSales = true;
      this.requiredDivision = true;
      this.f['division_ids']?.setValidators([Validators.required]);
      this.f['division_ids']?.updateValueAndValidity();
    }
    else {
      this.modalForm.get('sales_account_master_id')?.removeValidators(Validators.required);
      this.modalForm.get('sales_account_master_id')?.updateValueAndValidity();
      this.modalForm.get('sales_return_account_master_id')?.removeValidators(Validators.required);
      this.modalForm.get('sales_return_account_master_id')?.updateValueAndValidity();
      this.requiredSales = false;
      this.requiredDivision = false;
      this.f['division_ids']?.removeValidators([Validators.required]);
      this.f['division_ids']?.updateValueAndValidity();
    }
  }

  isRequiredInvalid(fieldName: string): boolean {
    const field = this.modalForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['required']
    );
  }

  async onSelectProfileImage(event: any): Promise<void> {
    if (!event.target.files) {
      this.selectedProfileImage = null;
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
      this.selectedProfileImage = null;
      return;
    }

    try {
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        this.selectedProfileImage = {
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: this.formatFileSize(file.size)
        };
        this.deleteImage = true;
      }
      else {
        this.selectedProfileImage = null;
      }
    } catch (error) {
      this.toastr.error("Failed to compress image", 'Error');
    }
  }

  formatFileSize(size: number): string {
    const kb = size / 1024;
    if (kb < 1024) {
      return kb.toFixed(1) + " KB";
    }
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }

  toggleCheckbox(event: any, name: any) {
    event.preventDefault();
    this.getType(name);
  }

  setCompany(e: any) {
    if (e != undefined) {
      const uniqueCompanyNames = [...new Set(e.flatMap((item: any) => item.company_name || []))].join(", ");
      const uniqueCompanyIds = [...new Set(e.flatMap((item: any) => item.company_id || []))];

      this.modalForm.get('company_names')?.setValue(uniqueCompanyNames);
      this.modalForm.get('company_ids')?.setValue(uniqueCompanyIds);
    }
    else {
      this.modalForm.get('company_names')?.setValue(null);
      this.modalForm.get('company_ids')?.setValue(null);
    }
  }

  resetSecondaryUnit() {
    this.modalForm.get('secondary_unit_id')?.setValue(null);
    this.modalForm.get('secondary_quantity')?.setValue(null);
    if (this.f['has_secondary_unit'].value == true) {
      this.modalForm.get('secondary_unit_id')?.addValidators(Validators.required);
      this.modalForm.get('secondary_unit_id')?.updateValueAndValidity();
    }
    else {
      this.modalForm.get('secondary_unit_id')?.removeValidators(Validators.required);
      this.modalForm.get('secondary_unit_id')?.updateValueAndValidity();
    }
  }

  onChangeProductType(event: any) {
    if (event && event.id == 'Service Item') {
      this.modalForm.patchValue({
        max_stock: null,
        min_stock: null,
        reorder_level: null,
        reorder_quantity: null,
        valuation_method: null,
        is_batch_available: false,
        has_expiry_date: false,
        primary_unit_id: null,
        primary_quantity: null
      })
      this.bonus_infos.clear();
      this.addBonus();
      this.modalForm.get('primary_unit_id')?.removeValidators(Validators.required);
      this.modalForm.get('primary_unit_id')?.updateValueAndValidity();
      this.modalForm.get('valuation_method')?.removeValidators(Validators.required);
      this.modalForm.get('valuation_method')?.updateValueAndValidity();
    }
    else {
      this.modalForm.get('primary_unit_id')?.addValidators(Validators.required);
      this.modalForm.get('primary_unit_id')?.updateValueAndValidity();
      this.modalForm.get('valuation_method')?.addValidators(Validators.required);
      this.modalForm.get('valuation_method')?.updateValueAndValidity();
      this.modalForm.get('valuation_method')?.setValue(this.companyDetails?.product_valuation_method);
    }
  }

  onAddItem(event: any, formcontrolName: string, data: any) {
    if (event != undefined && event.id == undefined) {
      this.openInlineDialog(formcontrolName, data, event?.name);
      return;
    }
  }

  onMultiAdd(event: any, formcontrolName: string, data: any) {
    if (event == undefined) {
      return;
    }
    const addItem = event.find((item: any) => item.id == undefined)
    if (addItem) {
      this.openInlineDialog(formcontrolName, data, addItem.name);
      return;
    }
  }

  async onAddAccount(event: any, formcontrolName: string) {
    // if (event != undefined && event.id == undefined) {
    //   const dialogRef = this.dialog.open(AddMasterAccountComponent, {
    //     panelClass: ['slide-left', 'drawer-right'],
    //     enterAnimationDuration: '0ms',
    //     exitAnimationDuration: '0ms',
    //     disableClose: true,
    //     data: { formData: { account_name: event.name } }
    //   });

    //   dialogRef.backdropClick().subscribe(() => {
    //     dialogRef.removePanelClass('slide-left');
    //     dialogRef.addPanelClass('slide-left-close');

    //     setTimeout(() => {
    //       dialogRef.close();
    //     }, 400);
    //   });

    //   dialogRef.afterClosed().subscribe(async result => {
    //     if (result) {
    //       const datas: any = await firstValueFrom(this.dropdown.getMasterAccounts());
    //       this.accountDropdownList = datas;
    //       if (datas.some((item: any) => item.id == result.id)) {
    //         this.modalForm.get(formcontrolName)?.setValue(result.id);
    //       }
    //       else {
    //         this.modalForm.get(formcontrolName)?.setValue(null);
    //       }
    //     }
    //     else {
    //       this.accountDropdownList = [...this.accountDropdownList];
    //       this.modalForm.get(formcontrolName)?.setValue(null);
    //     }
    //   })
    // }
  }

  openInlineDialog(formcontrolName: string, dialogData: any, name: string) {
    const dialogRef = this.dialog.open(MastersInlineModalComponent, {
      panelClass: ['slide-left'],
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
      disableClose: true,
      data: { item: dialogData, name: name }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.removePanelClass('slide-left');
      dialogRef.addPanelClass('slide-left-close');

      setTimeout(() => {
        dialogRef.close();
      }, 400);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (dialogData.title) {
          case "Unit":
            this.allUnits = [result, ...this.allUnits];
            break;

          case "Packing":
            this.allPackings = [result, ...this.allPackings];
            break;

          case "Tax Type":
            this.allTaxTypes = [result, ...this.allTaxTypes];
            break;

          case "Category":
            this.allCatrgories = [result, ...this.allCatrgories];
            this.selectedCategories = [result.id, ...this.selectedCategories];
            this.selectedCategories = this.selectedCategories.filter(item => item != undefined);
            break;

          case "Company":
            this.allCompanies = [result, ...this.allCompanies];
            break;

          case "Division":
            this.allDivisions = [result, ...this.allDivisions];
            let divs = this.modalForm.get('division_ids')?.value.filter((item: any) => item != null);
            this.modalForm.get('division_ids')?.setValue([result?.id, ...divs]);
            this.modalForm.get('company_ids')?.setValue(result?.company_ids || null);
            this.modalForm.get('company_names')?.setValue(result?.company_names || null);

            break;

          case "Generic Name":
            this.allGenericNames = [result, ...this.allGenericNames];
            break;

          case "Product Group":
            this.allGroups = [result, ...this.allGroups];
            break;

          default:
            break;
        }

        if (formcontrolName != 'category_id' && formcontrolName != 'division_ids') {
          this.modalForm.get(formcontrolName)?.setValue(result.id);
        }
      }
      else {
        formcontrolName != 'category_id' && this.modalForm.get(formcontrolName)?.setValue(null);
        this.allUnits = [...this.allUnits];
        this.selectedCategories = [...this.selectedCategories];
        this.selectedCategories = this.selectedCategories.filter(item => item != undefined);
        this.allPackings = [...this.allPackings];
        this.allTaxTypes = [...this.allTaxTypes];
        this.allCatrgories = [...this.allCatrgories];
        this.allCompanies = [...this.allCompanies];
        this.allDivisions = [...this.allDivisions];
        this.allGenericNames = [...this.allGenericNames];
        this.allGroups = [...this.allGroups];
      }
    });
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.modalForm.value;
    Object.keys(formData).forEach(key => {
      if (formData[key] === '') {
        formData[key] = null;
      }
    });

    formData.bonus_infos = formData.bonus_infos?.filter((info: any) => info.min_quantity !== null)
      .map((info: any) => ({
        ...info,
        bonus_quantity: info.bonus_quantity ?? 0
      }));

    formData.types = this.selectedTypeName;
    const obj = this.selectedCategories?.map(function (el: number, i: number) {
      return {
        id: el
      }
    });
    formData.discontinue_status = formData.status == true ? false : null;
    formData.product_categories = obj || [];


    let finalData = new FormData();
    let jsonPayload = JSON.stringify(formData);

    if (this.selectedProfileImage != null) {
      finalData.append('file', this.selectedProfileImage.file);
    }

    finalData.append('product', new Blob([jsonPayload], { type: "application/json" }));

    const request$ = formData.id
      ? this.masterService.updateMaster(finalData, formData.id, this.endPoint)
      : this.masterService.createMaster(finalData, this.endPoint);

    request$.subscribe({
      next: (res: any) => {
        if (res?.success == true) {
          this.isLoading = false;
          this.closeDialog(res);
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
    this.dialogRef.removePanelClass('slide-up');
    this.dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      if (data) {
        this.dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      }
      else {
        this.dialogRef.close();
      }

    }, 400);
  }
}
