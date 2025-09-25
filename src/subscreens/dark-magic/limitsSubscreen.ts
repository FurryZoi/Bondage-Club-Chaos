import { BaseSubscreen } from "zois-core/ui";
import { Ban, createElement } from "lucide";

export class LimitsSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(Ban);
    }

    get name() {
        return "Limits";
    }

    load(): void {
        super.load();
    }

    exit(): void {
        super.exit();
    }
}