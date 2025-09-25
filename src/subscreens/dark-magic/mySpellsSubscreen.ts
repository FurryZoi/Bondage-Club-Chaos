import { BaseSubscreen } from "zois-core/ui";
import { BookHeart, createElement, SendToBack, Shell } from "lucide";
import { modStorage } from "@/modules/storage";
import { StyleModule } from "zois-core/ui-modules";
import { CreateSpellSubscreen } from "./createSpellSubscreen";
import { DarkMagicSubscreen } from "../darkMagicSubscreen";
import { getSpellIcon } from "@/modules/darkMagic";

export class MySpellsSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(BookHeart);
    }

    get name() {
        return "My Spells";
    }

    load(): void {
        super.load();

        const container = this.createScrollView({
            scroll: "y",
            x: 160,
            y: 220,
            width: 900,
            modules: {
                base: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.25em"
                    })
                ]
            }
        });

        modStorage.darkMagic?.spells?.forEach((spell) => {
            container.append(
                this.createButton({
                    text: spell.name,
                    icon: getSpellIcon(spell.icon)?.dataurl ?? undefined,
                    padding: 2,
                    place: false,
                    modules: {
                        base: [
                            new StyleModule({
                                width: "100%"
                            })
                        ]
                    },
                    onClick: () => {
                        this.setSubscreen(new CreateSpellSubscreen(spell));
                    }
                })
            );
        });
    }

    exit(): void {
        super.exit();
        this.setSubscreen(new DarkMagicSubscreen());
    }
}