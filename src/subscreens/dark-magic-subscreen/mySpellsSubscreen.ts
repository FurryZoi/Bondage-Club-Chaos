import { BaseSubscreen } from "zois-core/ui";
import { BookHeart, createElement, Trash2 } from "lucide";
import { modStorage } from "@/modules/storage";
import { AttributesModule, CenterModule, StyleModule } from "zois-core/ui-modules";
import { SpellEditorSubscreen } from "./spellEditorSubscreen";
import { DarkMagicSubscreen } from "../darkMagicSubscreen";
import { getSpellIcon } from "@/modules/darkMagic";

export class MySpellsSubscreen extends BaseSubscreen {
    private deletionMode: boolean = false;

    get icon(): SVGElement {
        return createElement(BookHeart);
    }

    get name() {
        return "My Spells";
    }

    public load(): void {
        super.load();

        if ((modStorage.darkMagic?.spells ?? []).length === 0) {
            this.createText({
                text: "You don't know any spells",
                fontSize: 8,
                modules: {
                    base: [
                        new CenterModule(),
                        new StyleModule({
                            textAlign: "center"
                        })
                    ]
                }
            });
            return;
        }

        const container = this.createScrollView({
            scroll: "y",
            x: 160,
            y: 220,
            width: 900,
            height: 650,
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
            const _container = this.createContainer({
                place: false,
                modules: {
                    base: [
                        new StyleModule({
                            display: "flex",
                            columnGap: "0.25em"
                        })
                    ]
                }
            });
            _container.append(
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
                }),
                this.createButton({
                    icon: createElement(Trash2),
                    place: false,
                    isDisabled: () => !this.deletionMode,
                    modules: {
                        base: [
                            new StyleModule({
                                height: "100%",
                                aspectRatio: "1/1"
                            }),
                            new AttributesModule({
                                "data-bcc-delete-button": "true"
                            })
                        ]
                    },
                    onClick: () => {
                        modStorage.darkMagic.spells = modStorage.darkMagic.spells.filter((s) => s.name !== spell.name);
                        _container.remove();
                        if (modStorage.darkMagic.spells.length === 0) {
                            this.unload();
                            this.load();
                        }
                    }
                })
            );
            container.append(_container);
        });

        this.createCheckbox({
            anchor: "top-right",
            x: 360,
            y: 250,
            text: "Deletion Mode",
            isChecked: this.deletionMode,
            onChange: () => {
                this.deletionMode = !this.deletionMode;
                document.querySelectorAll("*[data-bcc-delete-button]").forEach((b) => {
                    b.classList.toggle("zcDisabled");
                });
            }
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new DarkMagicSubscreen());
    }
}