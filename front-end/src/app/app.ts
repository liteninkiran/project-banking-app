import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
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
