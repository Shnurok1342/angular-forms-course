import {Component, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() requiredFileType: string | string[];

  fileName = '';
  fileUploadError = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);
      this.http.post('/api/thumbnail-upload', formData)
        .pipe(
          catchError(error => {
            this.fileUploadError = true;
            return of(error);
          })
        )
        .subscribe();
    }
  }
}
