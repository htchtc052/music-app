import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";


export function MinLengthCustom(num: Number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'minLengthCustom',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [num],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [num] = args.constraints;
                    return !(typeof value === 'string' && value.length > 0 && value.length < num);
                },
            },
        });
    };
}