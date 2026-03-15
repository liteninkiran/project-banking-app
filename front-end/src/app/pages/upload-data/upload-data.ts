import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragAndDrop } from '../../components/drag-and-drop/drag-and-drop';
import { RuxTab, RuxTabPanel, RuxTabPanels, RuxTabs } from '@astrouxds/angular';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.html',
  styleUrl: './upload-data.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DragAndDrop, RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel],
})
export class UploadData {
  public activeTab = 'selectFilesTab';
}
