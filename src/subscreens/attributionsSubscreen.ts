import { BaseSubscreen } from "zois-core/ui";
import heartsIcon from "@/assets/game-icons/hearts.svg";
import { MainSubscreen } from "./mainSubscreen";

export class AttributionsSubscreen extends BaseSubscreen {
    get name() {
        return "Attributions";
    }

    public load(): void {
        super.load();

        this.createText({
            text: "Kitnyx2 font by KitTheCat",
            x: 220,
            y: 240
        });

        this.createText({
            text: "Game icons by https://game-icons.net licensed under <b>CC BY 3.0</b>",
            x: 220,
            y: 320
        });

        this.createText({
            text: "Lucide icons by https://lucide.dev licensed under <b>ISC</b> and <b>MIT (for portions derived from Feather)</b>",
            x: 220,
            y: 400,
            width: 1600
        });

        this.createSvg({
            x: 1550,
            y: 750,
            dataurl: heartsIcon,
            size: 180,
            fill: "var(--tmd-accent, red)",
            stroke: "var(--tmd-accent, red)"
        });

        this.createSvg({
            x: 1700,
            y: 550,
            dataurl: heartsIcon,
            size: 200,
            fill: "var(--tmd-accent, red)",
            stroke: "var(--tmd-accent, red)"
        });

        this.createSvg({
            x: 1775,
            y: 800,
            dataurl: heartsIcon,
            size: 140,
            fill: "var(--tmd-accent, red)",
            stroke: "var(--tmd-accent, red)"
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}