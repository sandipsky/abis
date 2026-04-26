import { ChangeDetectionStrategy, Component, inject, model, signal, output, ViewEncapsulation } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'select-input',
  standalone: true,
  imports: [NgSelectModule, Icon],
  templateUrl: './select-input.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInput implements ControlValueAccessor {

  // ===== Inputs =====
  label = model<string>('');
  items = model<any[]>([]);
  bindLabel = model<string>('id');
  bindValue = model<string>('name');
  placeholder = model<string>('Select...');
  errorMessage = model<string>('This field is Required.');
  showErrorMessage = model<boolean>(true);
  clearable = model<boolean>(true);
  searchable = model<boolean>(true);
  readonly = model<boolean>(false);
  multiple = model<boolean>(false);
  isView = model<boolean>(false);

  leftIcon = model<string>('');
  rightIcon = model<string>('');

  // ===== Outputs =====
  change = output<any>();
  focus = output<Event>();
  blur = output<Event>();
  leftIconClick = output<void>();
  rightIconClick = output<void>();

  // ===== CVA State =====
  value = signal<any>(null);
  isDisabled = signal<boolean>(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  readonly ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ===== Helpers =====
  get isRequired(): boolean {
    return this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }

  get hasError(): boolean {
    return !!(
      this.ngControl?.control?.invalid &&
      (this.ngControl?.control?.touched || this.ngControl?.control?.dirty)
    );
  }

  getSelectedLabel(): string | null {
    const items = this.items();
    const value = this.value();

    const found = items.find(i => i[this.bindValue()] === value);
    return found ? found[this.bindLabel()] : null;
  }

  // ===== CVA =====
  writeValue(value: any): void {
    this.value.set(value);
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

  // ===== Events =====
  onSelectChange(val: any) {
    this.value.set(val);
    this.onChange(val);
    this.change.emit(val);
  }

  handleFocus(event: Event) {
    this.focus.emit(event);
  }

  handleBlur(event: Event) {
    this.blur.emit(event);
  }
}