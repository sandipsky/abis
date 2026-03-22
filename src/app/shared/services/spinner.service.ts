import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _showSpinner = new BehaviorSubject<boolean>(false);
  showSpinner$ = this._showSpinner.asObservable();

  setSpinner(value: boolean) {
    this._showSpinner.next(value);
  }
}
