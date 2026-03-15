import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuxTab, RuxTabPanel, RuxTabPanels, RuxTabs } from '@astrouxds/angular';
import { DragAndDrop } from '../../components/drag-and-drop/drag-and-drop';
import { MapColumns, MappedColumn } from '../../components/map-columns/map-columns';

type Tab = 'selectFilesTab' | 'mapColumnsTab';

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

  public activeTab: Tab = 'mapColumnsTab';
  public columns = 'Transaction Date,Type,Description,Value,Balance,Account Name,Account Number';

  public getFileData(fileData: string[]) {
    console.log(fileData);
    this.columns = fileData[0].split(/\r?\n/)[0];
    this.activeTab = 'mapColumnsTab';
  }

  public cancelMap() {
    this.activeTab = 'selectFilesTab';
  }

  public handleMappedColumns(data: MappedColumn[]) {
    console.log('Data', data);
  }
}
