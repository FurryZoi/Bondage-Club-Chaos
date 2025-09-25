import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

export class PurificatioEffect extends BaseEffect {
    get name(): string {
        return "Purificatio";
    }

    get atoms(): Atom[] {
        return [Atom.LUX];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Removes all spell effects from the target.";
    }
}