import { Atom } from "../darkMagic";
import { BaseEffect, EffectParameter } from "./baseEffect";

export class VocisAlteratioEffect extends BaseEffect {
    get name(): string {
        return "Vocis Alteratio";
    }

    get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Changes target's speech.";
    }

    get parameters(): EffectParameter[] {
        return [
            {
                name: "speechType",
                type: "choice",
                label: "Speech Type",
                options: [
                    {
                        name: "puppy",
                        text: "Puppy"
                    },
                    {
                        name: "kitty",
                        text: "Kitty"
                    },
                    {
                        name: "bunny",
                        text: "Bunny"
                    },
                    {
                        name: "baby",
                        text: "Baby"
                    }
                ]
            }
        ]
    }
}