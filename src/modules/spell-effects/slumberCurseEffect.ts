import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

export class SlumberCurseEffect extends BaseEffect {
    get name(): string {
        return "Slumber Curse";
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