import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

export class VisioInversioEffect extends BaseEffect {
    get name(): string {
        return "Visio Inversio";
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