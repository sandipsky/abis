import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { ToastrService } from 'ngx-toastr';
import packageJson from '../../../../package.json'
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
// import { ConfigServiceService } from '../configuration/config-service/config-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class Login {
  loginForm: FormGroup;
  isLoading: boolean = false;
  companyName: string = '';
  fiscalYearList: any[] = [];
  fiscalYearId: number | null = null;

  public currentApplicationVersion: string = packageJson.version;
  public hide: boolean = true;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService,
    // private configurationService: ConfigServiceService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // this.configurationService.getCompanyName().subscribe((res: string) => {
    //   this.companyName = res;
    // });
    this.getFiscalYearDropdown();
  }

  isRequiredInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['required']
    );
  }

  getFiscalYearDropdown() {
    // this.authService.getFiscalYearDropdown().subscribe({
    //   next: (res: any) => {
    //     this.fiscalYearList = res;
    //     this.fiscalYearId = this.fiscalYearList?.find(item => item.is_current == true)?.id;
    //   },
    //   error: (err) => {
    //     this.toastr.error(err)
    //   },
    // })
  }

  setIsCurrent(e: any) {
    console.log(e);
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error(
        "Please Enter both Username and Password",
        'Error',
        {
          closeButton: true,
        }
      );
      return;
    }

    // if (this.fiscalYearId == null) {
    //   this.toastr.error(
    //     "Please Select Fiscal Year",
    //     'Error',
    //     {
    //       closeButton: true,
    //     }
    //   );
    //   return;
    // }

    this.isLoading = true;
    this.authService
      .login()
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('fiscalYear', this.fiscalYearList.find(item => item.id == this.fiscalYearId).name);
          localStorage.setItem('firstDate', this.fiscalYearList.find(item => item.id == this.fiscalYearId).fiscal_year_first_day_nepali_date || '');
          localStorage.setItem('lastDate', this.fiscalYearList.find(item => item.id == this.fiscalYearId).fiscal_year_last_day_nepali_date || '');
          localStorage.setItem('isCurrent', this.fiscalYearList.find(item => item.id == this.fiscalYearId)?.is_current == true ? 'Yes' : 'No');
          this.isLoading = false;
          this.loginForm.reset();
          this.toastr.success("Logged In Successfully.", "Success");

          if (res?.user_information?.first_password_reset == true) {
            this.router.navigate(['reset-password'], {
              queryParams: {
                id: res?.user_information?.id
              }
            });
            localStorage.removeItem("id_token");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("fiscalYear");
            localStorage.removeItem("isCurrent");
          }
          else {
            this.router.navigate(['dashboard']);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toastr.error(
            err.error.message || 'Unable to Login, Please Try Again!',
            'Error',
            {
              closeButton: true,
            }
          );
        },

      });
  }

  logout() {
    this.authService.logout();
  }

}
