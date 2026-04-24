import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-button',
  imports: [CommonModule, Icon],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  type = model<'primary' | 'secondary' | 'outlined' | 'primary-outlined'>('primary');
  disabled = model<boolean>(false);
  icon = model<string>('');
  rounded = model<boolean>(false);
  hoverable = model<boolean>(true);
  size = model<'sm' | 'md' | 'lg'>('md');
  label = model.required<string>();
}
