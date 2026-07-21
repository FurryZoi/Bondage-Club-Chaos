import { BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack } from "lucide";

export class RaceSubscreen extends BaseSubscreen {
    public get icon(): SVGElement {
        return createElement(SendToBack);
    }

    public override get name() {
        return "Race";
    }

    public override load(): void {
        super.load();
    }

    public override exit(): void {
        super.exit();
    }
}