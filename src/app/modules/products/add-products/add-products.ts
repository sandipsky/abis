import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
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
import { Button } from '../../../shared/components/button/button';
import { FormValidation } from '../../../shared/directives/form-validation';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, NgSelectModule, AmountPipe, Button, FormValidation],
  templateUrl: './add-products.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProducts {
  modalForm: FormGroup;
  endPoint = 'products';
  isLoading = false;
  selectedProduct: any;
  selectedProfileImage: any = null;
  deleteImage: boolean = false;

  public operationList: any = [];
  public allCatrgories: Array<any> = [];
  public allPackings: Array<any> = [];
  public allTaxTypes: Array<any> = [];
  public allUnits: Array<any> = [];

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
      barcode: [],
      primary_unit_id: [, Validators.required],
      primary_quantity: [],
      has_secondary_unit: [false],
      secondary_unit_id: [],
      secondary_quantity: [],
      product_type: [, Validators.required],
      packing_id: [],
      tax_type_id: [],
      remarks: [],
      status: [true],

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

    if (data?.formData) {
      this.modalForm.patchValue(data?.formData);
    }


  }

  remove() {
    this.modalForm.get('name')?.removeValidators(Validators.required);
    this.modalForm.get('name')?.updateValueAndValidity()
  }

  add() {
    this.modalForm.get('name')?.addValidators(Validators.required);
    this.modalForm.get('name')?.updateValueAndValidity()
  }

  ngOnInit() {
    this.operationList = this.authService.userPermissionList();
    if (this.data.isView != true) {
      this.getAllProducts();
    }

    if (this.data?.formData?.id) {
      this.bonus_infos.clear();
      this.masterService.getMasterDetail(this.data?.formData?.id, this.endPoint).subscribe(
        {
          next: (res: any) => {

            this.selectedProduct = res;
            for (let i = 0; i < this.selectedProduct?.bonus_infos?.length || 1; i++) {
              this.addBonus();
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
          }
        }
      )
    }
    else {
      // this.masterService.getMasterCode('products').subscribe((res: string) => {
      //   this.f['product_code'].setValue(res || null);
      // });
      this.addBonus();
    }
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
        this.allPackings = productInfo.packings;
        this.allTaxTypes = productInfo.tax_types;
        this.allUnits = productInfo.units;
      })
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

  onSelectProfileImage(event: any) {
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

    this.selectedProfileImage = {
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: this.formatFileSize(file.size)
    };
    this.deleteImage = true;
  }

  formatFileSize(size: number): string {
    const kb = size / 1024;
    if (kb < 1024) {
      return kb.toFixed(1) + " KB";
    }
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
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

    let finalData: any = new FormData();
    let jsonPayload = JSON.stringify(formData);

    if (this.selectedProfileImage != null) {
      finalData.append('file', this.selectedProfileImage.file);
    }

    finalData.append('product', new Blob([jsonPayload], { type: "application/json" }));

    const request$ = formData.id
      ? this.masterService.updateMaster(finalData, this.endPoint)
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
      error: () => {
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
