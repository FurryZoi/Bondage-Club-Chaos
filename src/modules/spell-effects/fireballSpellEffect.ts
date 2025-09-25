import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

export class FireballSpellEffect extends BaseEffect {
    get name(): string {
        return "Pyroclasm";
    }

    get atoms(): Atom[] {
        return [Atom.IGNIS];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Launches a fireball at the target";
    }
}