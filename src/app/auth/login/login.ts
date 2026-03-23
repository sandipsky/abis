import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import packageJson from '../../../../package.json';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Ensuring standalone mode
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class Login implements OnInit {
  // --- Dependency Injection ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // --- Signals (State) ---
  isLoading = signal(false);
  fiscalYearList = signal<any[]>([]);
  fiscalYearId = signal<number | null>(null);
  hidePassword = signal(true);
  
  // Constant data
  public currentApplicationVersion = packageJson.version;

  // --- Reactive Form ---
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    this.getFiscalYearDropdown();
  }

  // --- Methods ---
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
    this.authService.getFiscalYearDropdown().subscribe({
      next: (res: any) => {
        this.fiscalYearList.set(res);
        const currentYear = res?.find((item: any) => item.is_current === true);
        if (currentYear) {
          this.fiscalYearId.set(currentYear.id);
        }
      },
      error: (err) => this.toastr.error(err)
    });
  }

  togglePasswordVisibility() {
    this.hidePassword.update(prev => !prev);
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error("Please Enter both Username and Password", 'Error', { closeButton: true });
      return;
    }

    if (this.fiscalYearId() === null) {
      this.toastr.error("Please Select Fiscal Year", 'Error', { closeButton: true });
      return;
    }

    this.isLoading.set(true);
    
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const selectedYear = this.fiscalYearList().find(item => item.id === this.fiscalYearId());
        localStorage.setItem('fiscalYear', selectedYear?.name || '');
        localStorage.setItem('token', res?.authorization?.token || '');

        this.isLoading.set(false);
        this.toastr.success("Logged In Successfully.", "Success");
        this.router.navigate(['dashboard']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.toastr.error(
          err.error.message || 'Unable to Login, Please Try Again!',
          'Error',
          { closeButton: true }
        );
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}