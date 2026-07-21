import { getRandomNumber } from "zois-core";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent } from "./baseEffect";

export class FlammaSubmissionisEffect extends BaseEffect {
    public override get name(): string {
        return "Flamma Submissionis";
    }

    public override get atoms(): Atom[] {
        return [Atom.IGNIS];
    }

    public override get description(): string {
        return "Launches a fireball at the target";
    }

    public override trigger(event: TriggerEvent): void {
        super.trigger(event);
        DialogChangeReputation("Dominant", getRandomNumber(-5, -1));
        ServerPlayerReputationSync();
    }
}