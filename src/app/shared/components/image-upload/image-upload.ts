import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Button } from '@/shared/components/button/button';
import { IFile } from '@/shared/models/common.model';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [Button],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUpload {
  private _toastr = inject(ToastrService);

  image = input<IFile | null>(null);
  viewMode = input<boolean>(false);
  label = input<string>('Upload Image');
  placeholder = input<string>('Click to upload Image.');
  accept = input<string>('image/*');
  maxSizeMB = input<number>(5);
  allowedExtensions = input<string[]>(['jpg', 'jpeg', 'png']);
  formatsText = input<string>('JPEG, PNG');

  imageChange = output<IFile | null>();

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!this.allowedExtensions().includes(ext)) {
      this._toastr.error(
        `Please upload only ${this.allowedExtensions().join(', ')} files`,
        'Error',
        { closeButton: true }
      );
      return;
    }

    if (file.size > this.maxSizeMB() * 1024 * 1024) {
      this._toastr.error(`File size exceeds ${this.maxSizeMB()}MB limit`, 'Error', {
        closeButton: true,
      });
      return;
    }

    this.imageChange.emit({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: this.formatFileSize(file.size),
    });
  }

  clear(): void {
    this.imageChange.emit(null);
  }

  private formatFileSize(size: number): string {
    const kb = size / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(1) + ' MB';
  }
}
