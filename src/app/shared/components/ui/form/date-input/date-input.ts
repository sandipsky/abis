import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-date-input',
  imports: [],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateInput {}
