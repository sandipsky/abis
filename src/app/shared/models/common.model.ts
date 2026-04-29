export interface IDialogData<T = unknown> {
  formData?: T;
  isView?: boolean;
}

export interface IFile {
  file: File | null;
  url: string;
  name: string;
  size: string;
}