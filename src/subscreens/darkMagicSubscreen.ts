import { BaseSubscreen, dataUrlSvgWithColor } from "zois-core/ui";
import { createElement, SendToBack, Shell, Skull } from "lucide";
import { MySpellsSubscreen } from "./dark-magic/mySpellsSubscreen";
import { CreateSpellSubscreen } from "./dark-magic/createSpellSubscreen";
import { RaceSubscreen } from "./dark-magic/raceSubscreen";
import { LimitsSubscreen } from "./dark-magic/limitsSubscreen";
import { MainSubscreen } from "./mainSubscreen";
import evilBookIcon from "@/assets/game-icons/evilBook.svg";
import spellBookIcon from "@/assets/game-icons/spellBook.svg";
import { ShuffleTextModule } from "@/ui-modules/shuffleTextModule";
import { StyleModule } from "zois-core/ui-modules";
import { TomeOfKnowledgeSubscreen } from "./dark-magic/tomeOfKnowledgeSubscreen";

export class DarkMagicSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(Skull);
    }

    get name() {
        return "Dark Magic";
    }

    load(): void {
        super.load();

        [
            new MySpellsSubscreen(), new CreateSpellSubscreen(),
            new LimitsSubscreen()
        ].forEach((t, i) => {
            t.icon.style.width = "auto";
            t.icon.style.height = "70%";
            console.log(t.icon);
            this.createButton({
                text: t.name,
                icon: t.icon,
                x: 165,
                y: 320 + (115 * i),
                width: 600,
                padding: 2,
                onClick: () => this.setSubscreen(t)
            }).style.fontWeight = "bold";
        });

        this.createButton({
            text: "Tome of Knowledge",
            icon: evilBookIcon,
            x: 165,
            y: 320 + (115 * 3) + 150,
            style: "inverted",
            width: 600,
            padding: 2,
            onClick: () => this.setSubscreen(new TomeOfKnowledgeSubscreen())
        }).style.fontWeight = "bold";

        this.createText({
            text: "QWERTYUIOPASDFGHJKLZXCVBNM",
            x: 165,
            y: 230,
            width: 2000 - (2 * 165),
            modules: {
                base: [
                    new ShuffleTextModule(),
                    new StyleModule({
                        fontFamily: "Kitnyx2",
                        fontWeight: "bold",
                        letterSpacing: "1em",
                        overflow: "hidden",
                        textAlign: "center",
                        textShadow: "0 0 0.2em var(--tmd-text)"
                    })
                ]
            }
        });

        this.createSvg({
            dataurl: spellBookIcon,
            size: 500,
            x: 1000,
            y: 350,
            fill: "var(--tmd-text, black)",
            stroke: "none"
        });
    }

    exit(): void {
        this.setSubscreen(new MainSubscreen());
    }
}