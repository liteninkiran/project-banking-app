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
import { RuxButton, RuxSelect, RuxOption, RuxInput } from '@astrouxds/angular';
import { toCamelCase } from '../../utils/helper';

type ColumnType = 'string' | 'number' | 'date';

type ColumnHeader = {
  label: string;
  camel: string;
};

type ColumnFormGroup = FormGroup<{
  type: FormControl<ColumnType>;
  format: FormControl<string>;
}>;

type ColumnFormControls = {
  [key: string]: ColumnFormGroup;
};

@Component({
  selector: 'app-map-columns',
  templateUrl: './map-columns.html',
  styleUrl: './map-columns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RuxButton, RuxSelect, RuxOption, ReactiveFormsModule, TitleCasePipe, RuxInput],
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

  private createForm(): FormGroup<ColumnFormControls> {
    const group: Record<string, ColumnFormGroup> = {};

    const createControl = (col: string) => {
      const defaultType: ColumnType = col.endsWith('Date') ? 'date' : 'string';

      group[col] = this.fb.group({
        type: this.fb.control<ColumnType>(defaultType, {
          validators: [Validators.required],
        }),
        format: this.fb.control<string>(''),
      });
    };

    this.columnHeaders.map((c) => c.camel).forEach(createControl);

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

  formChange(event: Event, col: string, field: 'type' | 'format') {
    const target = event.target as any;
    this.form.controls[col].patchValue({
      [field]: target.value,
    });
  }

  goBack() {
    this.cancel.emit();
  }
}
