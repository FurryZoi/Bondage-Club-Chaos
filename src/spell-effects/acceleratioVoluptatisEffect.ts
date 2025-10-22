import { getRandomNumber } from "zois-core";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";

export class AcceleratioVoluptatisEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }

    get name(): string {
        return "Acceleratio Voluptatis";
    }

    get atoms(): Atom[] {
        return [Atom.GEMITUM, Atom.LUX];
    }

    get description(): string {
        return "Makes target horny";
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        this.setInterval(event, () => {
            if (getRandomNumber(1, 2) === 1) {
                if (typeof Player.ArousalSettings.Progress !== "number") Player.ArousalSettings.Progress = 0;
                if (Player.ArousalSettings.Progress >= 100) return;
                Player.ArousalSettings.Progress += getRandomNumber(1, 4);
            }
        }, 2000);
    }
}