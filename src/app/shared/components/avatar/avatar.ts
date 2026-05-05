import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  imageUrl = input<string | null>('');
  name = input<string>('');
  size = input<string>('32px');
  color = input<string>('orange');
  textColor = input<string>('#ffffff');

  initials = computed(() => {
    const value = this.name()?.trim();
    if (!value) return '';

    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });
}
