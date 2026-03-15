import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { RuxButton, RuxSelect, RuxOption } from '@astrouxds/angular';
import { toCamelCase } from '../../utils/helper';

type ColumnType = 'string' | 'number' | 'date';

type ColumnHeader = {
  label: string;
  camel: string;
};

type ColumnFormControls = {
  [key: string]: FormControl<ColumnType>;
};

@Component({
  selector: 'app-map-columns',
  templateUrl: './map-columns.html',
  styleUrl: './map-columns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RuxButton, RuxSelect, RuxOption, ReactiveFormsModule, TitleCasePipe],
})
export class MapColumns implements OnInit {
  @Input() public columns = '';

  @Output() public cancel = new EventEmitter<void>();

  public columnHeaders: ColumnHeader[] = [];
  public form!: FormGroup<ColumnFormControls>;
  public submitted = false;
  public columnTypes: ColumnType[] = ['string', 'number', 'date'];

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    const mapColStringToObject = (col: string) => ({
      label: col,
      camel: toCamelCase(col),
    });
    this.columnHeaders = this.columns.split(',').map(mapColStringToObject);
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    const columns = this.columnHeaders.map((col) => col.camel);
    const group: Record<string, FormControl<ColumnType>> = {};
    const options = { validators: [Validators.required] };
    const createControl = (col: string) => {
      const defaultValue: ColumnType = col.endsWith('Date') ? 'date' : 'string';
      group[col] = this.fb.control<ColumnType>(defaultValue, options);
    };
    columns.forEach(createControl);
    return this.fb.group(group);
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form values:', this.form.value);

    if (this.form.valid) {
      // Send to backend...
    } else {
      // Do something...
    }
  }

  selectChange(event: Event, col: string) {
    const target = event.target as any;
    this.form.controls[col].setValue(target.value);
  }

  goBack() {
    this.cancel.emit();
  }
}
