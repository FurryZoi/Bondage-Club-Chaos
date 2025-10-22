import { addDefaultParametersIfNeeds, getSpellEffect, SpellIcon } from "@/modules/darkMagic";
import { BaseEffect } from "@/spell-effects/baseEffect";
import { getSizeInKbytes } from "zois-core";
import { isBoolean, isEnum, isNumber, IsNumber, IsObject, isString, IsString, registerDecorator, Type, ValidateIf, ValidateNested, ValidationArguments, ValidationOptions } from "zois-core/validation";

function ValidateCustom(validator: (object: ValidationArguments["object"]) => boolean, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'validateCustom',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return validator(args.object);
                },
                defaultMessage(args: ValidationArguments) {
                    return "Params error";
                }
            },
        });
    };
}

class SpellDto {
    @IsString({ message: "tytg" })
    public name: string;

    // Can't use @IsEnum here because circular imports
    @ValidateIf((dto: SpellDto) => isEnum(dto.icon, SpellIcon))
    public icon: SpellIcon;

    @IsString()
    @ValidateCustom((dto: SpellDto) => dto.effects?.split("")?.every((e) => getSpellEffect(e.charCodeAt(0)) instanceof BaseEffect))
    public effects: string;

    @IsObject()
    @ValidateCustom((dto: SpellDto) => {
        addDefaultParametersIfNeeds(dto);
        for (const effectChar of dto.effects.split("")) {
            const effect = getSpellEffect(effectChar.charCodeAt(0));
            for (const parameter of effect.parameters) {
                const parameterValue = dto.data?.[effectChar]?.[parameter.name];
                if (parameterValue === undefined || parameterValue === null) return false;
                switch (parameter.type) {
                    case "boolean":
                        if (!isBoolean(parameterValue)) return false;
                        break;
                    case "number":
                        if (!isNumber(parameterValue)) return false;
                        if (parameter.max && parameterValue > parameter.max) return false;
                        if (parameter.min && parameterValue < parameter.min) return false;
                        break;
                    case "text":
                        if (!isString(parameterValue)) return false;
                        if (parameterValue.trim() === "") return false;
                        if (getSizeInKbytes(parameterValue) > 5) return false;
                        break;
                    case "choice":
                        if (!isString(parameterValue)) return false;
                        if (!parameter.options.map((o) => o.name).includes(parameterValue)) return false;
                        break;
                }
            }
        }
        return true;
    })
    public data?: Record<string, Record<string, unknown>>;

    @Type(() => CreatedByDto)
    @ValidateNested()
    public createdBy: CreatedByDto;
}

export class CastSpellMessageDto {
    @Type(() => SpellDto)
    @ValidateNested()
    public spell: SpellDto;
}

export class CreatedByDto {
    @IsString()
    public name: string;

    @IsNumber()
    public id: number
}