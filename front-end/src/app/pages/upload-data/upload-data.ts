import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuxTab, RuxTabPanel, RuxTabPanels, RuxTabs } from '@astrouxds/angular';
import { DragAndDrop } from '../../components/drag-and-drop/drag-and-drop';
import { MapColumns } from '../../components/map-columns/map-columns';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.html',
  styleUrl: './upload-data.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DragAndDrop, MapColumns, RuxTabs, RuxTab, RuxTabPanels, RuxTabPanel],
})
export class UploadData {
  constructor() {}

  public activeTab = 'selectFilesTab';
  public columns = '';

  public getFileData(fileData: string[]) {
    console.log(fileData);
    this.columns = fileData[0].split(/\r?\n/)[0];
    this.activeTab = 'mapColumnsTab';
  }
}
