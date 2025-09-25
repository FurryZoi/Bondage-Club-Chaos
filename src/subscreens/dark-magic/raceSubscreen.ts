import { BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack, Shell } from "lucide";

export class RaceSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(SendToBack);
    }

    get name() {
        return "Race";
    }

    load(): void {
        super.load();
    }

    exit(): void {
        super.exit();
    }
}