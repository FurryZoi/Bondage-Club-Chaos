import { Atom } from "../darkMagic";
import { BaseEffect } from "./baseEffect";

//control
export class AnimaFurtaEffect extends BaseEffect {
    get name(): string {
        return "Anima Furta";
    }

    get atoms(): Atom[] {
        return [Atom.IGNIS, Atom.NOX];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Launches a fireball at the target";
    }
}