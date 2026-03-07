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

  private fileContent = '';
  private filesProcessed = 0;

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

    this.fileContent = '';
    this.filesProcessed = 0;
    this.files.forEach((file) => this.processFile(file));
  }

  private processFile(file: File) {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;
        this.fileContent += text + '\n';
        this.filesProcessed++;

        console.log(text);

        // Check if all files are done
        if (this.filesProcessed === this.files.length) {
          this.completionCallback();
        }
      };

      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
        this.filesProcessed++;
      };

      reader.readAsText(file);
    } else {
      alert('Only CSV files are allowed');
      this.filesProcessed++;
    }
  }

  private completionCallback() {
    // console.log('Combined file content:', this.fileContent);
    // // POST to back-end
    // this.uploading = true;
    // this.http.post('https://your-backend-endpoint.com/upload', fileContent).subscribe({
    //   next: (res) => {
    //     console.log('Upload successful', res);
    //     this.files = [];
    //     this.uploading = false;
    //   },
    //   error: (err) => {
    //     console.error('Upload failed', err);
    //     this.uploading = false;
    //   },
    // });
  }
}
