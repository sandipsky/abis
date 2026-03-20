import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';
import { CommonModule, Location } from '@angular/common';
import { passwordUppercase, specialeChars, numericPass, validateConfirmpassword } from 'src/app/components/passsword-validators/valitade';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class ChangePasswordComponent {
  selectedFile: File | null = null;
  isLoading: boolean = false;

  passwordForm: FormGroup;
  operationList: any[] = [];
  databaseLogs: any[] = [];
  length: number = 0;
  hideCurrent = true;
  hidePassword = true;
  hideConfirm = true;

  constructor(
    private _userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.passwordForm = this.fb.group({
      current_password: ['', [
        Validators.required
      ],],
      password: ['', [
        Validators.minLength(8),
        passwordUppercase(),
        specialeChars(),
        numericPass(),
        Validators.required
      ],],
      confirmpassword: ['', Validators.required]
    }, { validators: validateConfirmpassword() })
  }

  get f() {
    return this.passwordForm.controls
  }

  ngOnInit() {
  }

  save() {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      return;
    }

    if (this.f['current_password'].value == this.f['password'].value) {
      this.toastr.error('New Password Cannot be Same as Old Password.', 'Error', {
        closeButton: true,
      });
      return;
    }

    let userInfo = localStorage.getItem('userInfo');
    let userId = 0;
    if (userInfo != null) {
      userId = JSON.parse(userInfo)?.id;
    }
    this.isLoading = true;
    this._userService.changePassword(this.passwordForm.value, userId).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success('Password Changed Successfully', 'Success', {
            closeButton: true,
          });
          this.authService.logout();
          this.isLoading = false;
        }
        else {
          res.messages.forEach((message: any) => {
            this.toastr.error(message.message, 'Error', {
              closeButton: true,
            });
            console.log(message);
          })
          this.isLoading = false;
        }

      },
      error: (err) => {
        this.toastr.error(err, 'Error', {
          closeButton: true,
        });
        this.isLoading = false;
      },
    })
  }

  exit() {
    this.authService.openNav();
    this.location.back();
  }

}
