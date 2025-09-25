import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

//gallucination
export class NomenFraudisEffect extends BaseEffect {
    get name(): string {
        return "Nomen Fraudis";
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