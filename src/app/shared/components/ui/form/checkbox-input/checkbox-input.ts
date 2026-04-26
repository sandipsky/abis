import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-checkbox-input',
  imports: [],
  templateUrl: './checkbox-input.html',
  styleUrl: './checkbox-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxInput {}
