import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  booleanAttribute,
  inject,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: `
    input[formControlName], input[formControl], input[ngModel],
    textarea[formControlName], textarea[formControl], textarea[ngModel],
    ng-select[formControlName], ng-select[formControl], ng-select[ngModel],
    ne-datepicker[formControlName], ne-datepicker[formControl], ne-datepicker[ngModel]
  `,
})
export class FormValidation implements OnInit, OnDestroy {
  @Input({ transform: booleanAttribute }) useValidation = true;

  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _ngControl = inject(NgControl, { optional: true });

  private _errorEl: HTMLElement | null = null;
  private _asteriskEl: HTMLElement | null = null;
  private _destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (!this.useValidation || !this._ngControl?.control) return;

    this._ngControl.control.events
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.refresh());

    this.refresh();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this.removeError();
    this.removeAsterisk();
  }

  private get errorTarget(): HTMLElement {
    return (this._host.nativeElement.closest('.input-wrapper') as HTMLElement) || this._host.nativeElement;
  }

  private refresh(): void {
    const control = this._ngControl?.control;
    if (!control) return;

    if (this.hasRequiredValidator()) this.addAsterisk();
    else this.removeAsterisk();

    const target = this.errorTarget;
    const host = this._host.nativeElement;
    const requiredFailed = !!(control.errors?.['required'] || control.errors?.['requiredTrue']);
    const showError = requiredFailed && (control.touched || control.dirty);

    if (showError) {
      this._renderer.addClass(target, 'error');
      if (target !== host) this._renderer.addClass(host, 'error');
      this.showError();
    } else {
      this._renderer.removeClass(target, 'error');
      if (target !== host) this._renderer.removeClass(host, 'error');
      this.removeError();
    }
  }

  private hasRequiredValidator(): boolean {
    const control = this._ngControl?.control;
    if (!control?.validator) return false;
    const result = control.validator({ value: null } as AbstractControl);
    return !!(result?.['required'] || result?.['requiredTrue']);
  }

  private addAsterisk(): void {
    if (this._asteriskEl) return;

    const formGroup = this._host.nativeElement.closest('.form-group');
    const label = formGroup?.querySelector(':scope > label') as HTMLLabelElement | null;
    if (!label) return;

    const existing = label.querySelector('.required-asterisk') as HTMLElement | null;
    if (existing) {
      this._asteriskEl = existing;
      return;
    }

    const span = this._renderer.createElement('span');
    this._renderer.addClass(span, 'required-asterisk');
    this._renderer.addClass(span, 'text-danger');
    this._renderer.appendChild(span, this._renderer.createText(' *'));
    this._renderer.appendChild(label, span);
    this._asteriskEl = span;
  }

  private removeAsterisk(): void {
    if (!this._asteriskEl) return;
    this._renderer.removeChild(this._asteriskEl.parentNode, this._asteriskEl);
    this._asteriskEl = null;
  }

  private showError(): void {
    if (this._errorEl) return;
    const anchor = this.errorTarget;
    const parent = anchor.parentNode;
    if (!parent) return;

    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'alert');
    this._renderer.addClass(div, 'error');
    this._renderer.appendChild(div, this._renderer.createText('This field is required.'));

    this._renderer.insertBefore(parent, div, anchor.nextSibling);
    this._errorEl = div;
  }

  private removeError(): void {
    if (!this._errorEl) return;
    this._renderer.removeChild(this._errorEl.parentNode, this._errorEl);
    this._errorEl = null;
  }
}
