import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-columns',
  templateUrl: './map-columns.html',
  styleUrl: './map-columns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class MapColumns {
  @Input() columns = '';
}
