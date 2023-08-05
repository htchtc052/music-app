import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsSlugValid implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        // Проверяем, соответствует ли значение поля slug заданному формату
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return slugRegex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid slug format';
    }
}