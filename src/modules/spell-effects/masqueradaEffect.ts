import { Atom } from "../darkMagic";
import { BaseEffect, EffectParameter } from "./baseEffect";

export class MasqueradaEffect extends BaseEffect {
    get name(): string {
        return "Masquerada";
    }

    get atoms(): Atom[] {
        return [Atom.LUX, Atom.FULGUR];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Removes all spell effects from the target.";
    }

    get parameters(): EffectParameter[] {
        return [
            {   
                name: "outfit",
                type: "text",
                label: "Outfit Code"
            }
        ]
    }
}