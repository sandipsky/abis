import { ChangeDetectionStrategy, Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import packageJson from '../../../../package.json';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/components/ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true, // Ensuring standalone mode
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = signal(false);
  hidePassword = signal(true);

  public currentApplicationVersion = packageJson.version;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isRequiredInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched) &&
      field.errors?.['required']
    );
  }

  togglePasswordVisibility() {
    this.hidePassword.update(prev => !prev);
  }

  login() {
    localStorage.setItem('token', 'test');
    this.router.navigate(['dashboard']);
    return;

    if (this.loginForm.invalid) {
      this.toastr.error("Please Enter both Username and Password", 'Error', { closeButton: true });
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
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