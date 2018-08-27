import { flow, Many } from 'lodash';
import * as fp from 'lodash/fp';

export const required = (value: any) => (value instanceof Array)
    ? (value.length > 0 ? undefined : 'Required')
    : (value ? undefined : 'Required');
export const email = (value: any) => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined;




export interface IFormValidationGroup<T> {
    values: T;
    errors: T;
}

export const validate = (...validationFunctions: any[]) =>
    (values: any) => {
        var errors: {[key:string]: any} = { };

    for (var prop in values) {
        if (values.hasOwnProperty(prop)) {
            errors[prop] = undefined;
        }
    }

    var formData: IFormValidationGroup<typeof values> =
        flow(validationFunctions)(<IFormValidationGroup<typeof values>>{ errors, values });

    return formData.errors;
}

export const compare = (fieldName: string, compareFieldName: string) =>
    (formData: IFormValidationGroup<any>) => {

        if (formData.values[fieldName]
            && formData.values[compareFieldName]
            && formData.values[fieldName] !== formData.values[compareFieldName]) {

            formData.errors[compareFieldName] = 'Does not match the previous entry';
        }

        return formData;
    }


const maxLength = (max:number) => (value:any) =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15)
const number = (value: any) => value && isNaN(Number(value)) ? 'Must be a number' : undefined
const minValue = (min: number) => (value: any) =>
    value && value < min ? `Must be at least ${min}` : undefined
const minValue18 = minValue(18)
const tooOld = (value: any) =>
    value && value > 65 ? 'You might be too old for this' : undefined
const aol = (value: any) =>
    value && /.+@aol\.com/.test(value) ?
        'Really? You still use AOL for your email?' : undefined
