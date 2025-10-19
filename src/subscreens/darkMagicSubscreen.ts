import { BaseSubscreen } from "zois-core/ui";
import { createElement, Skull } from "lucide";
import { MySpellsSubscreen } from "./dark-magic-subscreen/mySpellsSubscreen";
import { SpellEditorSubscreen } from "./dark-magic-subscreen/spellEditorSubscreen";
// import { RaceSubscreen } from "./dark-magic/raceSubscreen";
import { LimitsSubscreen } from "./dark-magic-subscreen/limitsSubscreen";
import { MainSubscreen } from "./mainSubscreen";
import evilBookIcon from "@/assets/game-icons/evilBook.svg";
import spellBookIcon from "@/assets/game-icons/spellBook.svg";
import { ShuffleTextModule } from "@/ui-modules/shuffleTextModule";
import { ClickModule, DynamicClassModule, StyleModule } from "zois-core/ui-modules";
import { TomeOfKnowledgeSubscreen } from "./dark-magic-subscreen/tomeOfKnowledgeSubscreen";
import { atoms } from "@/modules/darkMagic";

export class DarkMagicSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(Skull);
    }

    get name() {
        return "Dark Magic";
    }

    public load(): void {
        super.load();

        [
            new MySpellsSubscreen(), new SpellEditorSubscreen(),
            new LimitsSubscreen()
        ].forEach((t, i) => {
            t.icon.style.width = "auto";
            t.icon.style.height = "70%";
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

        const radius = 210;
        const centerX = 1350;
        const centerY = 600;

        this.createText({
            text: "Atoms Of Magic",
            x: centerX - radius / 2,
            y: centerY - 40,
            width: 200,
            modules: {
                base: [
                    new StyleModule({
                        textAlign: "center"
                    })
                ]
            }
        });

        Object.values(atoms).forEach((atom, i) => {
            const angle = (i / Object.values(atoms).length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 35;
            const y = centerY + radius * Math.sin(angle) - 35;
            const iconContainer = this.createContainer({
                x,
                y,
                modules: {
                    base: [
                        new DynamicClassModule({
                            base: {
                                borderRadius: "50%",
                                padding: "0.2em",
                                filter: `drop-shadow(0 0 0.12em ${atom.iconColor})`
                            }
                        })
                    ]
                }
            });
            iconContainer.append(
                this.createSvg({
                    place: false,
                    dataurl: atom.iconDataUrl,
                    fill: atom.iconColor,
                    size: 70,
                })
            );
            this.createText({
                text: atom.name,
                color: atom.iconColor,
                x,
                y: y + 80,
                width: 80,
                fontSize: 2,
                modules: {
                    base: [
                        new StyleModule({
                            textAlign: "center"
                        })
                    ]
                }
            });
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}