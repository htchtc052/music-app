import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFileNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minLengthCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          console.debug(value);
          return (
            value !== null &&
            value !== undefined &&
            (value instanceof Buffer || typeof value === 'object')
          );
        },
      },
    });
  };
}
