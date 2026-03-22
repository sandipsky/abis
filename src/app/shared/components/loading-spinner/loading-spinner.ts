import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  private _spinnerService = inject(SpinnerService);
  showSpinner = toSignal(this._spinnerService.showSpinner$);
}
