import {Component, forwardRef, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input() requiredFileType: string | string[];

  fileName = '';
  fileUploadError = false;
  fileUploadSuccess = false;
  uploadProgress: number;

  disabled = false;
  onChange = (fileName: string) => {};
  onTouched = () => {};
  onValidationChange = () => {};

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
            this.fileUploadSuccess = true;
            this.fileUploadError = false;
            this.onChange(this.fileName);
            this.onValidationChange();
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

  registerOnValidatorChange(onValidationChange: any): void {
    this.onValidationChange = onValidationChange;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.fileUploadSuccess) {
      return null;
    }
    const errors: ValidationErrors = {
      requiredFileType: this.requiredFileType
    };

    if (this.fileUploadError) {
      errors.uploadFailed = true;
    }

    return errors;
  }
}
