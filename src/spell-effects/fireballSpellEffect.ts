import { getRandomNumber } from "zois-core";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";

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

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        DialogChangeReputation("Dominant", getRandomNumber(-5, -1));
        ServerPlayerReputationSync();
    }
}