import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { Subscription } from 'rxjs';

type ColumnType = 'string' | 'number' | 'date';

type ColumnHeader = {
  label: string;
  camel: string;
};

type ColumnFormGroup = FormGroup<{
  type: FormControl<ColumnType | ''>;
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
export class MapColumns implements OnInit, OnDestroy {
  @Input() public columns = '';

  @Output() public cancel = new EventEmitter<void>();

  public columnHeaders: ColumnHeader[] = [];
  public form!: FormGroup<ColumnFormControls>;
  public submitted = false;
  public columnTypes: ColumnType[] = ['string', 'number', 'date'];

  private subscriptions: Subscription[] = [];

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
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
    const options = {
      validators: [Validators.required],
    };

    const createControl = (col: string) => {
      const defaultValue: ColumnType | '' = col.endsWith('Date') ? 'date' : '';
      const columnGroup = this.fb.group({
        type: this.fb.control<ColumnType | ''>(defaultValue, options),
        format: this.fb.control<string>(''),
      });

      // Apply conditional validator immediately for initial value
      const formatControl = columnGroup.controls.format;
      if (defaultValue === 'date') {
        formatControl.setValidators([Validators.required]);
        formatControl.updateValueAndValidity();
      }

      // Subscribe for future changes
      const subscriptionFn = (type: ColumnType | '') => {
        if (type === 'date') {
          formatControl.setValidators([Validators.required]);
        } else {
          formatControl.clearValidators();
          formatControl.setValue('');
        }
        formatControl.updateValueAndValidity();
      };
      const sub = columnGroup.controls.type.valueChanges.subscribe(subscriptionFn);

      this.subscriptions.push(sub);

      group[col] = columnGroup;
    };

    this.columnHeaders.map((c) => c.camel).forEach(createControl);

    return this.fb.group(group);
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.form.valid, this.form.value);

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
