import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RuxButton, RuxSelect, RuxOption, RuxInput } from '@astrouxds/angular';
import { toCamelCase } from '../../utils/helper';

type ColumnType = 'string' | 'number' | 'date' | '';

type ColumnHeader = {
  label: string;
  camel: string;
};

type ColumnValue = {
  type: FormControl<ColumnType>;
  format: FormControl<string>;
};

type ColumnFormGroup = FormGroup<ColumnValue>;

type ColumnFormControls = {
  [key: string]: ColumnFormGroup;
};

type MapColumnsFormValue = {
  [column: string]: ColumnValue;
};

export type MappedColumn = {
  column: string;
  type: ColumnType;
  format: string;
};

type InputChanges = {
  columns?: SimpleChange<string>;
};

const DEFAULT_FORMAT = 'd/m/Y';

@Component({
  selector: 'app-map-columns',
  templateUrl: './map-columns.html',
  styleUrl: './map-columns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RuxButton, RuxSelect, RuxOption, ReactiveFormsModule, TitleCasePipe, RuxInput],
})
export class MapColumns implements OnInit, OnChanges {
  @Input() public columns = '';

  @Output() public cancel = new EventEmitter<void>();
  @Output() public submit = new EventEmitter<MappedColumn[]>();

  public columnHeaders: ColumnHeader[] = [];
  public form!: FormGroup<ColumnFormControls>;
  public submitted = false;
  public columnTypes: ColumnType[] = ['string', 'number', 'date'];

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnChanges(changes: InputChanges): void {
    if ('columns' in changes) {
      const change = changes['columns'];
      if (change && change.currentValue) {
        this.setupForm();
      }
    }
  }

  ngOnInit() {}

  private setupForm() {
    if (this.columns === '') return;
    const mapColStringToObject = (col: string) => ({
      label: col,
      camel: toCamelCase(col),
    });
    this.columnHeaders = this.columns.split(',').map(mapColStringToObject);
    this.form = this.createForm();
  }

  private createForm(): FormGroup<ColumnFormControls> {
    const group: Record<string, ColumnFormGroup> = {};
    const options = {
      validators: [Validators.required],
    };
    const dateFormatRequiredValidator = (): ValidatorFn => {
      return (group: AbstractControl): ValidationErrors | null => {
        const formGroup = group as FormGroup;
        const typeControl = formGroup.get('type');
        const formatControl = formGroup.get('format');

        if (!typeControl || !formatControl) return null;

        // If type is 'date', format must not be empty
        if (typeControl.value === 'date' && !formatControl.value) {
          formatControl.setErrors({ required: true });
          return { formatRequired: true };
        }

        // Otherwise, clear errors
        if (formatControl.hasError('required')) {
          formatControl.setErrors(null);
        }

        return null;
      };
    };
    const createControl = (col: string) => {
      const isDate = col.toLowerCase().endsWith('date');
      const defaultType: ColumnType = isDate ? 'date' : 'string';
      const defaultFormat = isDate ? DEFAULT_FORMAT : '';
      const controls = {
        type: this.fb.control<ColumnType>(defaultType, options),
        format: this.fb.control<string>(defaultFormat),
      };
      const groupOptions = { validators: dateFormatRequiredValidator() };
      group[col] = this.fb.group(controls, groupOptions);
    };
    this.columnHeaders.map((c) => c.camel).forEach(createControl);

    return this.fb.group(group);
  }

  onSubmit() {
    this.submitted = true;
    const keys = Object.keys(this.form.controls);
    const payload = keys.map((col) => this.getColumnValue(col));
    if (this.form.valid) this.submit.emit(payload);
  }

  typeChange(event: Event, col: string) {
    const value = this.getVal(event);
    this.form.controls[col].patchValue({
      type: value,
      format: value === 'date' ? DEFAULT_FORMAT : '',
    });
  }

  formatChange(event: Event, col: string) {
    const value = this.getVal(event);
    this.form.controls[col].patchValue({
      format: value,
    });
  }

  getVal(event: Event) {
    const target = event.target as any;
    return target.value;
  }

  goBack() {
    this.cancel.emit();
  }

  getColumnValue(col: string): MappedColumn {
    const group = this.form.controls[col];
    return {
      column: col,
      type: group.controls.type.value,
      format: group.controls.format.value,
    };
  }
}
