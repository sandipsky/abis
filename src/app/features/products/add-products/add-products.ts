import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DropdownsService } from '@/shared/services/dropdown.service';
import { ConfigurationService } from '@/features/settings/configuration/configuration.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { AuthService } from '@/auth/auth.service';
import { MastersInlineModalComponent } from '@/features/master/general-master/add-master-modal/add-master-modal';
import { AmountPipe } from '@/shared/pipes/amount-pipe';
import { Button } from '@/shared/components/button/button';
import { FormValidation } from '@/shared/directives/form-validation';
import { ProductService } from '@/features/products/product.service';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IProduct, IProductBonusInfo } from '@/features/products/product.model';
import { IDropdownItem } from '@/shared/models/dropdown.model';
import { IDialogData, IFile } from '@/shared/models/common.model';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, AmountPipe, Button, FormValidation],
  templateUrl: './add-products.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProducts {
  private _productService = inject(ProductService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _dialogRef = inject<MatDialogRef<AddProducts>>(MatDialogRef);
  private _dropdownService = inject(DropdownsService);
  private _configService = inject(ConfigurationService);
  private _fb = inject(FormBuilder);
  private _spinnerService = inject(SpinnerService);
  private _authService = inject(AuthService);
  data = inject<IDialogData<IProduct>>(MAT_DIALOG_DATA);

  endPoint = 'products';

  selectedProduct = signal<IProduct | null>(null);
  selectedProfileImage = signal<IFile | null>(null);
  deleteImage = signal(false);

  private _currentUser = toSignal(this._authService.currentUser$, { initialValue: null });
  operationList = computed<string[]>(() => this._currentUser()?.operations ?? []);
  categoryList = signal<IDropdownItem[]>([]);
  packingList = signal<IDropdownItem[]>([]);
  taxTypeList = signal<IDropdownItem[]>([]);
  unitList = signal<IDropdownItem[]>([]);

  valuationMethodList = [
    { id: 'FIFO', name: 'FIFO' },
    { id: 'LIFO', name: 'LIFO' },
    { id: 'FEFO', name: 'FEFO' },
  ];

  modalForm: FormGroup = this._fb.nonNullable.group({
    id: [],
    name: [, Validators.required],
    code: [],
    barcode: [],
    unit_id: [, Validators.required],
    category_id: [],
    packing_id: [],
    tax_type_id: [],
    remarks: [],
    is_active: [true],

    service_item: [false],
    purchasable: [false],
    sellable: [false],

    cost_price: [],
    mrp: [],
    selling_price: [],
    max_stock: [],
    min_stock: [],

    valuation_method: [, Validators.required],
    is_batch_available: [false],
    has_expiry_date: [false],
    has_manufacturing_date: [false],
    bonus_infos: new FormArray([])
  });

  constructor() {}

  ngOnInit() {
    if (!this.data?.isView) {
      this.loadDropdowns();
    }

    const productId = this.data?.formData?.id;
    if (!productId) {
      this.addBonus();
      return;
    }
    else {
      this.loadProductDetail(productId);
    }
  }

  private loadDropdowns() {
    this._dropdownService.getMasterDropdown('category').subscribe(res => this.categoryList.set(res));
    this._dropdownService.getMasterDropdown('units').subscribe(res => this.unitList.set(res));
    this._dropdownService.getMasterDropdown('taxtypes').subscribe(res => this.taxTypeList.set(res));
    this._dropdownService.getMasterDropdown('packings').subscribe(res => this.packingList.set(res));
  }

  private loadProductDetail(id: number) {
    this.bonus_infos.clear();
    this._productService.getProductDetail(id).subscribe((res: IProduct) => {
      this.selectedProduct.set(res);

      const bonusCount = res?.bonus_infos?.length || 1;
      for (let i = 0; i < bonusCount; i++) {
        this.addBonus();
      }

      this.modalForm.patchValue(res);
    });
  }

  get f() { return this.modalForm.controls; }

  get bonus_infos(): FormArray {
    return this.modalForm.get('bonus_infos') as FormArray;
  }

  addBonus() {
    this.bonus_infos.push(
      this._fb.group({
        id: [],
        min_quantity: [],
        bonus_quantity: []
      }),
    );
  }

  removeBonus(index: number) {
    this.bonus_infos.removeAt(index);
  }

  saveForm() {
    this.modalForm.markAllAsTouched();
    if (this.modalForm.invalid) {
      return;
    }

    this._spinnerService.setSpinner(true);
    const formData = this.modalForm.value;

    formData.bonus_infos = formData.bonus_infos?.filter((info: IProductBonusInfo) => info.min_quantity !== null)
      .map((info: IProductBonusInfo) => ({
        ...info,
        bonus_quantity: info.bonus_quantity ?? 0
      }));

    // const finalData = new FormData();
    // const jsonPayload = JSON.stringify(formData);

    // const profileImage = this.selectedProfileImage();
    // if (profileImage != null) {
    //   finalData.append('file', profileImage.file);
    // }

    // finalData.append('product', new Blob([jsonPayload], { type: 'application/json' }));

    const request$ = formData.id
      ? this._productService.updateProduct(formData, formData.id)
      : this._productService.createProduct(formData);

    request$.subscribe({
      next: (res: IApiResponse) => {
        if (res?.success == true) {
          this._spinnerService.setSpinner(false);
          this.closeDialog(res);
          this._toastr.success(res.message, 'Success', { closeButton: true });
        } else {
          this._toastr.error(res.message, 'Error', { closeButton: true });
          this._spinnerService.setSpinner(false);
        }
      },
      error: () => {
        this._spinnerService.setSpinner(false);
      },
    });
  }

  closeDialog(data?: IApiResponse) {
    this._dialogRef.removePanelClass('slide-up');
    this._dialogRef.addPanelClass('slide-up-close');

    setTimeout(() => {
      if (data) {
        this._dialogRef.close({
          ...this.modalForm.value,
          id: data.post_data_id,
        });
      } else {
        this._dialogRef.close();
      }
    }, 400);
  }
}
