import { Component } from '@angular/core';
import { DragAndDrop } from '../../components/drag-and-drop/drag-and-drop';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.html',
  styleUrl: './upload-data.scss',
  standalone: true,
  imports: [DragAndDrop],
})
export class UploadData {}
