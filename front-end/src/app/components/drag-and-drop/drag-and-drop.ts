import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuxButton } from '@astrouxds/angular';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  standalone: true,
  imports: [RuxButton],
})
export class DragAndDrop {
  files: File[] = [];
  uploading = false;

  private expectedHeader: string | null = null;
  private fileContent = '';
  private fileKeys = new Set<string>();

  constructor(private http: HttpClient) {}

  onFileDropped(dt: DataTransfer | null) {
    if (dt?.files) {
      this.addFiles(dt.files);
    }
  }

  fileBrowseHandler(event: Event) {
    if (event.target) {
      const dt = event.target as HTMLInputElement;
      if (dt.files) {
        this.addFiles(dt.files);
      }
    }
  }

  uploadFiles() {
    if (!this.files.length) return;

    this.fileContent = '';
    this.expectedHeader = null;
    this.processNextFile(0);
  }

  cancel() {
    this.files = [];
  }

  private processNextFile(index: number) {
    if (index >= this.files.length) {
      this.completionCallback();
      return;
    }

    const file = this.files[index];

    this.validateHeader(file, (valid) => {
      if (!valid) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;
        this.fileContent += text + '\n';
        this.processNextFile(index + 1);
      };

      reader.onerror = () => {
        alert(`Error reading ${file.name}`);
      };

      reader.readAsText(file);
    });
  }

  private validateHeader(file: File, callback: (valid: boolean) => void) {
    const chunk = file.slice(0, 4096);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;

      const firstLine = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0);

      if (!firstLine) {
        alert(`File ${file.name} is empty`);
        callback(false);
        return;
      }

      if (this.expectedHeader === null) {
        this.expectedHeader = firstLine;
        callback(true);
        return;
      }

      if (firstLine !== this.expectedHeader) {
        alert(`File ${file.name} has different headers`);
        callback(false);
        return;
      }

      callback(true);
    };

    reader.readAsText(chunk);
  }

  private completionCallback() {
    console.log('Combined file content:', this.fileContent);
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

  private addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!(file.type === 'text/csv' || file.name.endsWith('.csv'))) {
        alert('Only CSV files are allowed!');
        continue;
      }

      const key = this.getFileKey(file);

      if (this.fileKeys.has(key)) {
        continue;
      }

      this.fileKeys.add(key);
      this.files.push(file);
    }
  }

  private getFileKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }
}
