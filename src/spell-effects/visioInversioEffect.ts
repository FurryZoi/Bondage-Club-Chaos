import { Atom } from "../modules/darkMagic";
import { BaseEffect, RemoveEvent, TriggerEvent } from "./baseEffect";

export class VisioInversioEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }
    
    get name(): string {
        return "Visio Inversio";
    }

    get atoms(): Atom[] {
        return [Atom.LUX];
    }

    get description(): string {
        return "Flips target's screen.";
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        document.body.setAttribute("style", document.body.getAttribute("style") + "rotate:180deg;");
    }

    public remove(event: RemoveEvent): void {
        super.remove(event);
        document.body.setAttribute("style", document.body.getAttribute("style").replace("rotate:180deg;", ""));
    }
}