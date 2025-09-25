import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

export class VocisPrivatioEffect extends BaseEffect {
    get name(): string {
        return "Vocis Privatio";
    }

    get atoms(): Atom[] {
        return [Atom.IGNIS, Atom.RATIO];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Puts target to sleep.";
    }
}