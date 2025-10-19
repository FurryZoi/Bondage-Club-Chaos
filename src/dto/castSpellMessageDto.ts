import { getSpellEffect, SpellIcon } from "@/modules/darkMagic";
import { BaseEffect } from "@/spell-effects/baseEffect";
import { isEnum, IsNumber, IsObject, IsString, Type, ValidateIf, ValidateNested } from "zois-core/validation";


class SpellDto {
    @IsString({message: "tytg"})
    public name: string;

    // Can't use @IsEnum here because circular imports
    @ValidateIf((dto: SpellDto) => isEnum(dto.icon, SpellIcon))
    public icon: SpellIcon;

    @IsString()
    @ValidateIf((dto: SpellDto) => dto.effects?.split("")?.every((e) => getSpellEffect(e.charCodeAt(0)) instanceof BaseEffect))
    public effects: string;

    @IsObject()
    public data?: Record<string, unknown>;

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