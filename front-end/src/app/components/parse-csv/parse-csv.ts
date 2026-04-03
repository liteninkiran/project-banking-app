import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-parse-csv',
  templateUrl: './parse-csv.html',
  styleUrl: './parse-csv.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class ParseCsv implements OnChanges {
  @Input({ required: true }) fileData: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
}
