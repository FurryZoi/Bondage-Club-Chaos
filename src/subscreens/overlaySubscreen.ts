import { BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack, Shell } from "lucide";

export class OverlaySubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(SendToBack);
    }

    get name() {
        return "Overlay";
    }

    load(): void {
        super.load();
    }

    exit(): void {
        super.exit();
    }
}