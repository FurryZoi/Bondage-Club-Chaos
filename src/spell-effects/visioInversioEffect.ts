import { Atom } from "../modules/darkMagic";
import { BaseEffect, type RemoveEvent, type TriggerEvent } from "./baseEffect";

export class VisioInversioEffect extends BaseEffect {
    public override get isInstant(): boolean {
        return false;
    }

    public override get name(): string {
        return "Visio Inversio";
    }

    public override get atoms(): Atom[] {
        return [Atom.RATIO, Atom.MATERIA];
    }

    public override get description(): string {
        return "Flips target's screen.";
    }

    public override trigger(event: TriggerEvent): void {
        super.trigger(event);
        document.body.setAttribute("style", document.body.getAttribute("style") + "rotate:180deg;");
    }

    public override remove(event: RemoveEvent): void {
        super.remove(event);
        document.body.setAttribute("style", document.body.getAttribute("style")?.replace("rotate:180deg;", ""));
    }
}