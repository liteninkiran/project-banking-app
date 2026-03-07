import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  standalone: true,
  imports: [],
})
export class DragAndDrop {
  files: File[] = [];
  uploading = false;

  constructor(private http: HttpClient) {}

  onFileDropped(dt: DataTransfer | null) {
    if (dt?.files) {
      this.addFiles(dt.files);
    }
  }

  fileBrowseHandler(files: FileList | null) {
    if (files) {
      this.addFiles(files);
    }
  }

  private addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'text/csv') {
        this.files.push(files[i]);
      } else {
        alert('Only CSV files are allowed!');
      }
    }
  }

  uploadFiles() {
    if (!this.files.length) return;

    const formData = new FormData();
    this.files.forEach((file) => formData.append('files[]', file, file.name));

    this.uploading = true;
    this.http.post('https://your-backend-endpoint.com/upload', formData).subscribe({
      next: (res) => {
        console.log('Upload successful', res);
        this.files = [];
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploading = false;
      },
    });
  }
}
