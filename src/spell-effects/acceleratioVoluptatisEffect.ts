import { getRandomNumber } from "zois-core";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent } from "./baseEffect";

export class AcceleratioVoluptatisEffect extends BaseEffect {
    public override get isInstant(): boolean {
        return false;
    }

    public override get name(): string {
        return "Acceleratio Voluptatis";
    }

    public override get atoms(): Atom[] {
        return [Atom.GEMITUM, Atom.LUX];
    }

    public override get description(): string {
        return "Makes target horny";
    }

    public override trigger(event: TriggerEvent): void {
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