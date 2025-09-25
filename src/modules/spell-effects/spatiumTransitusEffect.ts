import { Atom } from "../darkMagic";
import { BaseEffect, EffectParameter } from "./baseEffect";

//teleport
export class SpatiumTransitusEffect extends BaseEffect {
    get name(): string {
        return "Spatium Transitus";
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
                name: "lobby",
                type: "choice",
                label: "Outfit Code",
                options: [
                    {
                        name: "f",
                        text: "Female"
                    },
                    {
                        name: "m",
                        text: "Male"
                    }
                ]
            },
            {
                name: "roomName",
                type: "text",
                label: "Room Name",
            }
        ]
    }
}