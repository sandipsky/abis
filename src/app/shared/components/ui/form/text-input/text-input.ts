import { Component, forwardRef, inject, model, signal, output } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from '@angular/forms';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'text-input',
  imports: [Icon],
  templateUrl: './text-input.html',
})
export class TextInput implements ControlValueAccessor {
  label = model<string>('');
  leftIcon = model<string>('');
  rightIcon = model<string>('');
  placeholder = model<string>('');
  errorMessage = model<string>('This field is Required.');
  showErrorMessage = model<boolean>(true);
  readonly = model<boolean>(false);
  isView = model<boolean>(false);

  //Events
  input = output<Event>();
  change = output<Event>();
  focus = output<Event>();
  blur = output<Event>();
  keyup = output<Event>();
  keydown = output<Event>();
  keypress = output<Event>();
  enter = output<Event>();
  leftIconClick = output<void>();
  rightIconClick = output<void>();

  // --- ControlValueAccessor State ---
  value = signal<string>('');
  isDisabled = signal<boolean>(false);

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  readonly ngControl = inject(NgControl, { self: true, optional: true });

  get isRequired(): boolean {
    return this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }

  get hasError(): boolean {
    return !!(this.ngControl?.control?.invalid && (this.ngControl?.control?.touched || this.ngControl?.control?.dirty));
  }

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const inputVal = (event.target as HTMLInputElement).value;
    this.value.set(inputVal);
    this.onChange(inputVal);
    this.input.emit(event);
  }

  handleChange(event: Event): void {
    this.change.emit(event);
  }

  handleFocus(event: Event): void {
    this.focus.emit(event);
  }

  handleBlur(event: Event): void {
    this.blur.emit(event);
  }

  handleKeyup(event: KeyboardEvent) {
    this.keyup.emit(event);
  }

  handleKeydown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }

  handlekeypress(event: KeyboardEvent) {
    this.keypress.emit(event);

  }
  handlekeyenter(event: Event) {
    this.enter.emit(event);
  }
}
