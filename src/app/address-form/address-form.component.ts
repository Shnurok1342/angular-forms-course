import {Component, forwardRef, Input, OnDestroy} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder, FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => AddressFormComponent)
  }]
})
export class AddressFormComponent implements ControlValueAccessor, OnDestroy {
  @Input() legend: string;

  destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]]
  });

  onTouched = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  registerOnChange(onChange: any): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(onChange);
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}



