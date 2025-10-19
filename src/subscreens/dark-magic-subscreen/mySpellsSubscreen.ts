import { BaseSubscreen } from "zois-core/ui";
import { BookHeart, createElement } from "lucide";
import { modStorage } from "@/modules/storage";
import { StyleModule } from "zois-core/ui-modules";
import { SpellEditorSubscreen } from "./spellEditorSubscreen";
import { DarkMagicSubscreen } from "../darkMagicSubscreen";
import { getSpellIcon } from "@/modules/darkMagic";

export class MySpellsSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(BookHeart);
    }

    get name() {
        return "My Spells";
    }

    public load(): void {
        super.load();

        const container = this.createScrollView({
            scroll: "y",
            x: 160,
            y: 220,
            width: 900,
            height: 600,
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
                                position: "relative",
                                width: "100%"
                            })
                        ]
                    },
                    onClick: () => {
                        this.setSubscreen(new SpellEditorSubscreen(spell));
                    }
                })
            );
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new DarkMagicSubscreen());
    }
}