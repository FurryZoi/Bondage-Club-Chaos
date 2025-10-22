import { IsIn, IsNumber, IsObject, IsString, ValidateIf, ValidateNested, Type, registerDecorator, ValidationArguments, ValidationOptions } from "zois-core/validation";

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

class PosDto {
    @IsNumber()
    public x: number;

    @IsNumber()
    public y: number;
}

export class AnimaFurtaMessageDto {
    @IsString()
    @IsIn(["toggleKneel", "changeAppearance", "publishAction", "sendMessage", "mapMove"])
    public name: "toggleKneel" | "changeAppearance" | "publishAction" | "sendMessage" | "mapMove";

    @IsNumber()
    @ValidateIf((o: AnimaFurtaMessageDto) => o.name === "changeAppearance")
    public target: number;

    @ValidateIf((o: AnimaFurtaMessageDto) => o.name === "changeAppearance")
    public appearance: ServerItemBundle[];

    @ValidateIf((o: AnimaFurtaMessageDto) => o.name === "publishAction")
    public params: unknown;

    @ValidateIf((o: AnimaFurtaMessageDto) => o.name === "sendMessage")
    @IsString()
    @ValidateCustom((o: AnimaFurtaMessageDto) => !o.message.startsWith("("))
    public message: string;

    @ValidateIf((o: AnimaFurtaMessageDto) => o.name === "mapMove")
    @ValidateNested()
    @Type(() => PosDto)
    public pos: PosDto;
}