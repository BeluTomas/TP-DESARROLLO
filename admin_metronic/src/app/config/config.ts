import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";


export const URL_BACKEND = environment.URL_BACKEND;
export const URL_SERVICIOS = environment.URL_SERVICIOS;
export const URL_FROTEND = environment.URL_FROTEND;

export class FormReactive {
    isControlValid(formGroup,controlName: string): boolean {
        const control = formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }
    isControlInvalid(formGroup,controlName: string): boolean {
        const control = formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }
    controlHasError(formGroup,validation, controlName): boolean {
        const control = formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }
    isControlTouched(formGroup,controlName): boolean {
        const control = formGroup.controls[controlName];
        return control.dirty || control.touched;
    }
}

