import { BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack } from "lucide";

export class RaceSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(SendToBack);
    }

    get name() {
        return "Race";
    }

    public load(): void {
        super.load();
    }

    public exit(): void {
        super.exit();
    }
}