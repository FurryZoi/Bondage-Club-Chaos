import { IsIn, IsNumber, IsObject, IsString, ValidateIf, ValidateNested, Type } from "zois-core/validation";

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
    @ValidateIf((o) => o.name === "changeAppearance")
    public target: number;

    @ValidateIf((o) => o.name === "changeAppearance")
    public appearance: ServerItemBundle[];

    @ValidateIf((o) => o.name === "publishAction")
    public params: unknown;

    @ValidateIf((o) => o.name === "sendMessage")
    @IsString()
    public message: string;

    @ValidateIf((o) => o.name === "mapMove")
    @ValidateNested()
    @Type(() => PosDto)
    public pos: PosDto;
}