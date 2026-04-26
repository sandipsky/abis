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

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);
  private ngControl = inject(NgControl, { optional: true });

  private errorEl: HTMLElement | null = null;
  private asteriskEl: HTMLElement | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (!this.useValidation || !this.ngControl?.control) return;

    this.ngControl.control.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh());

    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeError();
    this.removeAsterisk();
  }

  private refresh(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    if (this.hasRequiredValidator()) this.addAsterisk();
    else this.removeAsterisk();

    const showError = control.invalid && (control.touched || control.dirty);
    if (showError) {
      this.renderer.addClass(this.host.nativeElement, 'error');
      this.showError();
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'error');
      this.removeError();
    }
  }

  private hasRequiredValidator(): boolean {
    const control = this.ngControl?.control;
    if (!control?.validator) return false;
    const result = control.validator({ value: null } as AbstractControl);
    return !!(result?.['required'] || result?.['requiredTrue']);
  }

  private addAsterisk(): void {
    if (this.asteriskEl) return;

    const formGroup = this.host.nativeElement.closest('.form-group');
    const label = formGroup?.querySelector(':scope > label') as HTMLLabelElement | null;
    if (!label) return;

    const existing = label.querySelector('.required-asterisk') as HTMLElement | null;
    if (existing) {
      this.asteriskEl = existing;
      return;
    }

    const span = this.renderer.createElement('span');
    this.renderer.addClass(span, 'required-asterisk');
    this.renderer.addClass(span, 'text-danger');
    this.renderer.appendChild(span, this.renderer.createText(' *'));
    this.renderer.appendChild(label, span);
    this.asteriskEl = span;
  }

  private removeAsterisk(): void {
    if (!this.asteriskEl) return;
    this.renderer.removeChild(this.asteriskEl.parentNode, this.asteriskEl);
    this.asteriskEl = null;
  }

  private showError(): void {
    if (this.errorEl) return;
    const host = this.host.nativeElement;
    const parent = host.parentNode;
    if (!parent) return;

    const div = this.renderer.createElement('div');
    this.renderer.addClass(div, 'alert');
    this.renderer.addClass(div, 'error');
    this.renderer.appendChild(div, this.renderer.createText('This field is required.'));

    this.renderer.insertBefore(parent, div, host.nextSibling);
    this.errorEl = div;
  }

  private removeError(): void {
    if (!this.errorEl) return;
    this.renderer.removeChild(this.errorEl.parentNode, this.errorEl);
    this.errorEl = null;
  }
}
