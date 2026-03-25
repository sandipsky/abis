import { ChangeDetectionStrategy, Component, Optional, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { AuthService } from '../../../auth/auth.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Configuration {

  public configSubscription!: Subscription;

  setupItems = signal<any[]>([
    {
      name: 'Company Profile',
      items: [
        { name: 'logo', type: 'image' },
        { name: 'company_name', type: 'input' },
        { name: 'company_reg_type', valueList: [{ id: "PAN", name: "PAN" }, { id: "VAT", name: "VAT" }], type: 'radio' },
        { name: 'company_reg', type: 'input' },
        { name: 'company_contact', type: 'input' },
        { name: 'company_address', type: 'input' },
        { name: 'company_email', type: 'input' },
        { name: 'is_IRD_certified', valueList: [{ id: "1", name: "Certified" }, { id: "0", name: "Not Certified" }], type: 'radio' },
        { name: 'username_IRD', type: 'input' },
        { name: 'password_IRD', type: 'input' },
      ]
    },
    {
      name: 'General Settings',
      items: [
        { name: 'pdf_format', type: 'dropdown', valueList: [{ id: "npl", name: "NPL" }] },
        { name: 'default_rounding', type: 'toggle' },
        { name: 'trade_price', type: 'toggle' },
        { name: 'mfg_date', type: 'toggle' },
        { name: 'is_free_sample', type: 'toggle' },
        { name: 'allow_day_in_expiry', valueList: [{ id: "1", name: "DD/MM/YYYY" }, { id: "0", name: "MM/YYYY" }], type: 'radio' },
        { name: 'product_valuation_method', valueList: [{ id: "LIFO", name: "LIFO" }, { id: "FIFO", name: "FIFO" }, { id: "FEFO", name: "FEFO" }], type: 'radio' },
      ]
    },
    {
      name: "Purchase/Inventory",
      items: [
        { name: "default_unit_purchase", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_unit_purchase_order", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_unit_purchase_return", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "zero_value_purchase", type: "toggle" },
        { name: "default_transaction_type_purchase", valueList: [{ id: "Cash", name: "Cash" }, { id: "Credit", name: "Credit" }], type: "radio" },
        { name: "default_unit_inventories", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "zero_value_finish_goods", type: "toggle" },
      ],
    },
    {
      name: 'Sales',
      items: [
        { name: "division_wise_sales", type: "toggle" },
        { name: "category_wise_discount", type: "toggle" },
        { name: "sales_due_alert_days", type: "input" },
        { name: "treat_expiry_as_product_stock", type: "toggle" },
        { name: "default_unit_sales", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_unit_sales_return", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_unit_expiries", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_unit_sales_order", valueList: [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }], type: "radio" },
        { name: "default_transaction_type_sales", valueList: [{ id: "Cash", name: "Cash" }, { id: "Credit", name: "Credit" }], type: "radio" },
        { name: "zero_value_sales", type: "toggle" },
        { name: "sales_order_hierarchy", type: "toggle" },
      ]
    },
    {
      name: 'User',
      items: [
        { name: "max_failed_attempts", type: "input" },
        { name: "session_time_limit_hour", type: "input" },
        { name: "time_frame_for_unlocking_user", type: "input" },
      ]
    }
  ]);

  public operationList: any = [];

  editMode = signal<boolean>(false);

  selectedTabIndex = signal<number>(0);
  selectedImg = signal<{ file: File | null, url: string, name: string } | null>(null);

  selectedGroup = computed(() => {
    return this.setupItems()[this.selectedTabIndex()] || null;
  });

  constructor(
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
    public authService: AuthService,
    public dialog: MatDialog,
    @Optional() private dialogRef: MatDialogRef<any>,
    public spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.getAllConfigList();
    this.operationList = this.authService.userPermissionList();
  }

  selectTab(index: number) {
    this.selectedTabIndex.set(index);
  }

  // onEdit() {
  //   this.dialogRef = this.dialog.open(AddConfigComponent, {
  //     panelClass: ['drawer-right', 'slide-left'],
  //     enterAnimationDuration: '0ms',
  //     exitAnimationDuration: '0ms',
  //     disableClose: true,
  //     data: this.setupItems[this.selectedTabIndex]?.items
  //   });

  //   this.dialogRef.backdropClick().subscribe(() => {
  //     this.closeDialog();
  //   });

  //   this.dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getAllConfigList();
  //     }
  //   });
  // }

  getAllConfigList(): void {
    this.configurationService.getAllConfigData()
      .subscribe({
        next: (res: any[]) => {

          const apiMap = new Map(res.map(r => [r.name, r]));

          const temp = this.setupItems().map((group: any) => {
            return {
              ...group,
              items: group.items.map((item: any) => {

                const apiItem = apiMap.get(item.name);

                const merged = {
                  ...item,
                  ...(apiItem || {})
                };

                let displayValue = merged.value;

                if (merged.type === 'toggle') {
                  displayValue = merged.value == '1' ? 'Yes' : 'No';
                }

                else if (merged.type === 'radio' || merged.type === 'dropdown') {
                  const match = merged.valueList?.find((v: any) => v.id == merged.value);
                  displayValue = match ? match.name : merged.value;
                }

                return {
                  ...merged,
                  displayValue
                };
              })
            };
          });

          this.setupItems.set(temp);

          const imgName = res?.find((item: any) => item?.name == 'logo')?.value;
          if (imgName) {
            fetch(`${environment.apiUrl}/master/${imgName}`, {
              headers: { Authorization: `Bearer ${this.authService.getToken()}` }
            })
              .then(resp => resp.blob())
              .then(blob => {
                this.selectedImg.set({
                  file: null,
                  url: URL.createObjectURL(blob),
                  name: imgName,
                });
              });
          }
        },

        error: (err: any) => {
          this.toastr.error(err);
        }
      });
  }

  onSelectImage(event: any): void {
    if (!event.target.files) {
      this.selectedImg.set(null);
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
      this.selectedImg.set(null);
      return;
    }

    try {
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        this.selectedImg.set({
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
        });
      }
      else {
        this.selectedImg.set(null);
      }
    } catch (error) {
      this.toastr.error("Failed to compress image", 'Error');
    }
  }

  saveImage() {
    if (this.selectedImg == null) {
      return
    }

    let formData = new FormData();

    if (this.selectedImg != null) {
      formData.append('file', this.selectedImg()?.file as File);
    }
    this.configurationService.setCompanyImage(formData)
      .subscribe(
        {
          next: (res: any) => {
            if (res?.success == true) {
              res?.messages?.forEach((message: any) => {
                this.toastr.success(message.message, 'Success', {
                  closeButton: true,
                });
              })
            }
            else {
              res?.messages?.forEach((message: any) => {
                this.toastr.error(message.message, 'Error', {
                  closeButton: true,
                });
              });
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

  saveConfiguration() {
    this.configurationService.addConfiguration(this.selectedGroup().filter((it: any) => it.name != 'logo'))
      .subscribe(
        {
          next: (res) => {
            if (res.success == true) {
              this.toastr.success(res?.messages[0]?.message);
            }
            else {
              this.toastr.error(res?.messages[0]?.message);
            }
          },
          error: (err) => {
            this.toastr.error(err);
          },
        }
      )

    this.saveImage();
  }
}