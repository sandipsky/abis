import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import packageJson from '../../../../package.json';
import { AuthService } from '@/auth/auth.service';
import { SpinnerService } from '@/shared/services/spinner.service';
import { CommonModule } from '@angular/common';
import { Button } from '@/shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true, 
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _toastr = inject(ToastrService);
  private _spinnerService = inject(SpinnerService);

  hidePassword = signal(true);

  public currentApplicationVersion = packageJson.version;

  loginForm: FormGroup = this._fb.group({
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
    if (this.loginForm.invalid) {
      this._toastr.error("Please Enter both Username and Password", 'Error', { closeButton: true });
      return;
    }

    this._spinnerService.setSpinner(true);

    this._authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res?.token);
        this._spinnerService.setSpinner(false);
        this._toastr.success("Logged In Successfully.", "Success");
        this._router.navigate(['dashboard']);
      }
    });
  }

  logout() {
    this._authService.logout();
  }
}
