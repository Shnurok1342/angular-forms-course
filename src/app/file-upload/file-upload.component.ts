import {Component, forwardRef, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() requiredFileType: string | string[];

  fileName = '';
  fileUploadError = false;
  uploadProgress: number;

  disabled = false;
  onChange = (fileName: string) => {};
  onTouched = () => {};

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);
      this.http.post(
        '/api/thumbnail-upload',
        formData,
        { reportProgress: true, observe: 'events' })
        .pipe(
          catchError(error => {
            this.fileUploadError = true;
            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
        )
        .subscribe(e => {
          if (e.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * e.loaded / e.total);
          } else if (e.type === HttpEventType.Response) {
            this.onChange(this.fileName);
          }
        });
    }
  }

  onClick(fileInput: HTMLInputElement): void {
    this.onTouched();
    fileInput.click();
  }

  writeValue(value: string): void {
    this.fileName = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
