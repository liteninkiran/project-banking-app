import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { RuxButton, RuxNotification } from '@astrouxds/angular';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RuxButton, RuxNotification],
})
export class DragAndDrop {
  private expectedHeader: string | null = null;
  private fileContent: string[] = [];
  private fileKeys = new Set<string>();

  public files: File[] = [];
  public uploading = false;
  public errMsg = '';

  @Output() public fileData = new EventEmitter<string[]>();

  constructor(private cd: ChangeDetectorRef) {}

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
    this.fileContent = [];
    this.expectedHeader = null;
    this.processNextFile(0);
  }

  cancel() {
    this.files = [];
    this.cd.markForCheck();
  }

  bannerClosed() {
    this.errMsg = '';
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
        this.fileContent.push(text);
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
    this.fileData.emit(this.fileContent);
    this.cancel();
  }

  private addFiles(files: FileList) {
    const isFileValid = (file: File) => file.type === 'text/csv' && file.name.endsWith('.csv');
    const processFile = (file: File) => {
      if (!isFileValid(file)) {
        this.errMsg = 'Only CSV files are allowed';
      } else {
        const key = this.getFileKey(file);
        if (!this.fileKeys.has(key)) {
          this.fileKeys.add(key);
          this.files.push(file);
        }
      }
    };
    Array.from(files).forEach(processFile);
  }

  private getFileKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }
}
