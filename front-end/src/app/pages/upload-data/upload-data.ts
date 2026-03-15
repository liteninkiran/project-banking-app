import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuxTab, RuxTabPanel, RuxTabPanels, RuxTabs } from '@astrouxds/angular';
import { DragAndDrop } from '../../components/drag-and-drop/drag-and-drop';
import { MapColumns, MappedColumn } from '../../components/map-columns/map-columns';

type Tab = 'selectFilesTab' | 'mapColumnsTab';

const defaultHeaders = 'Transaction Date,Transaction Type,Value,Balance,Account';

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

  public activeTab: Tab = 'selectFilesTab';
  public columns = '';
  public fileData: string[] = [];
  public metaData: MappedColumn[] = [];

  public getFileData(fileData: string[]) {
    this.fileData = fileData;
    this.columns = fileData[0].split(/\r?\n/)[0].trim();
    this.activeTab = 'mapColumnsTab';
  }

  public cancelMap() {
    this.activeTab = 'selectFilesTab';
  }

  public handleMappedColumns(metaData: MappedColumn[]) {
    this.metaData = metaData;
    console.log(this.metaData);
    this.fileData.map((file) => console.log(file));
  }
}
