import { addDynamicClass, BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack } from "lucide";
import { StyleModule } from "zois-core/ui-modules";
import { BasicsPage } from "./tome-of-knowledge-pages/basics";
import { EffectsPage } from "./tome-of-knowledge-pages/effects";



const pages = [
    new BasicsPage(),
    new EffectsPage()
];

export class TomeOfKnowledgeSubscreen extends BaseSubscreen {
    get name() {
        return `Tome of Knowledge`;
    }

    public async load(): Promise<void> {
        this.createBackNextButton({
            x: 125,
            y: 90,
            width: 1700 - 60,
            height: 90,
            isBold: true,
            items: pages.map((p) => [p.name, p]),
            currentIndex: 0,
            onChange: (value) => {
                container.innerHTML = "";
                value.load(container);
            }
        });

        this.createButton({
            x: 1815,
            y: 90,
            width: 90,
            height: 90,
            icon: "Icons/Exit.png",
            onClick: () => this.exit(),
            modules: {
                base: [
                    new StyleModule({
                        zIndex: "10"
                    })
                ]
            }
        });

        const container = this.createScrollView({
            scroll: "y",
            x: 125,
            y: 215,
            width: 1750,
            height: 735
        });

        pages[0].load(container);
    }
}