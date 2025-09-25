import { BaseSubscreen } from "zois-core/ui";
import { createElement, Wand } from "lucide";
import { atoms, Effect, getSpellIcons, spellEffects, SpellIcon } from "@/modules/darkMagic";
import { DynamicClassModule, StyleModule } from "zois-core/ui-modules";
import { BaseEffect } from "@/modules/spell-effects/baseEffect";
import cauldronIcon from "@/assets/game-icons/cauldron.svg";
import { ModStorage, modStorage, syncStorage } from "@/modules/storage";
import { EffectSettingsSubscreen } from "./effectSettingsSubscreen";
import { DarkMagicSubscreen } from "../darkMagicSubscreen";
import { ClickModule } from "zois-core/ui-modules";


export class CreateSpellSubscreen extends BaseSubscreen {
    private effectNameElement: HTMLParagraphElement;
    private effectDescriptionElement: HTMLParagraphElement;
    private effectAddElement: HTMLButtonElement;
    private effectSettingsElement: HTMLButtonElement;
    private effectAtomsElement: HTMLParagraphElement;
    private effectAtomsContainerElement: HTMLDivElement;
    private selectedEffectId: Effect;
    private selectedSpellIconElement: SVGElement;
    private _oldName: string;

    get icon(): SVGElement {
        return createElement(Wand);
    }

    get name() {
        return "Create Spell";
    }

    constructor(
        private spellSettings?: ModStorage["darkMagic"]["spells"][0],
        private readonly currentTab?: string
    ) {
        super();
        if (this.spellSettings) this.spellSettings = JSON.parse(JSON.stringify(this.spellSettings));
        this.spellSettings ??= {
            name: "",
            icon: getSpellIcons()[0].name as SpellIcon,
            effects: "",
            data: {}
        };
        this.currentTab ??= "Main";
        this._oldName = this.spellSettings.name;
    }

    private selectSpell(effectId: Effect): void {
        this.selectedEffectId = effectId;
        const effect = spellEffects[effectId];
        if (this.effectNameElement) {
            this.effectNameElement.textContent = effect.name;
        } else {
            this.effectNameElement = this.createText({
                text: effect.name,
                x: 1000,
                y: 315,
                modules: {
                    base: [
                        new StyleModule({
                            fontWeight: "bold"
                        })
                    ]
                }
            });
        }
        if (this.effectDescriptionElement) {
            this.effectDescriptionElement.textContent = effect.description;
        } else {
            this.effectDescriptionElement = this.createText({
                text: effect.description,
                withBorder: true,
                padding: 3,
                x: 1000,
                y: 400,
                width: 800,
                height: 280,
                fontSize: 3
            });
        }
        if (this.effectAtomsElement) {

        } else {
            this.effectAtomsElement = this.createText({
                text: "Atoms:",
                x: 1000,
                y: 700
            });
        }
        if (this.effectAtomsContainerElement) {
            this.effectAtomsContainerElement.innerHTML = "";
        } else {
            this.effectAtomsContainerElement = this.createContainer({
                x: 1000,
                y: 760,
                width: 800,
                modules: {
                    base: [
                        new StyleModule({
                            display: "flex",
                            columnGap: "0.25em"
                        })
                    ]
                }
            });
        }
        effect.atoms.forEach((atomId) => {
            const atom = atoms[atomId];
            this.effectAtomsContainerElement.append(
                this.createSvg({
                    dataurl: atom.iconDataUrl,
                    size: 50,
                    place: false
                })
            );
        });
        if (this.effectAddElement) {
            this.effectAddElement.textContent = this.spellSettings.effects.includes(String.fromCharCode(effectId)) ?
                "Remove Effect"
                : "Add Effect";
        } else {
            this.effectAddElement = this.createButton({
                text: this.spellSettings.effects.includes(String.fromCharCode(effectId)) ? "Remove Effect" : "Add Effect",
                anchor: "bottom-left",
                x: 1000,
                y: 75,
                padding: 2,
                width: 365,
                onClick: () => {
                    if (this.spellSettings.effects.includes(String.fromCharCode(this.selectedEffectId))) {
                        this.spellSettings.effects = this.spellSettings.effects.replaceAll(String.fromCharCode(this.selectedEffectId), "");
                        this.effectAddElement.textContent = "Add Effect";
                    } else {
                        this.spellSettings.effects += String.fromCharCode(this.selectedEffectId);
                        this.effectAddElement.textContent = "Remove Effect";
                    }
                    // this.textElement.innerHTML = "Effects:" + this.addedEffects.map((e) => "<div>" + spellEffects[e].name + "</div>").join("");
                }
            });
        }
        if (this.effectSettingsElement) {
            this.effectSettingsElement.classList.toggle("zcDisabled", !spellEffects[this.selectedEffectId].parameters);
        } else {
            this.effectSettingsElement = this.createButton({
                text: "Settings",
                anchor: "bottom-left",
                x: 1435,
                y: 75,
                padding: 2,
                width: 365,
                onClick: () => this.setSubscreen(new EffectSettingsSubscreen(this.selectedEffectId, this.spellSettings)),
                isDisabled: () => !spellEffects[this.selectedEffectId].parameters
            });
        }
    }

    load(): void {
        super.load();

        this.createTabs({
            x: 160,
            y: 200,
            width: 2000 - 320,
            tabs: [
                {
                    name: "Main",
                    load: () => {
                        const spellName = this.createInput({
                            x: 200,
                            y: 315,
                            width: 800,
                            placeholder: "Spell name",
                            padding: 2,
                            value: this.spellSettings.name,
                            onChange: () => {
                                this.spellSettings.name = spellName.value;
                            }
                        });

                        this.createText({
                            text: "Icon",
                            x: 200,
                            y: 450,
                        });

                        const iconsContainer = this.createContainer({
                            x: 200,
                            y: 515,
                            width: 1600,
                            modules: {
                                base: [
                                    new StyleModule({
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "4px"
                                    })
                                ]
                            }
                        });

                        getSpellIcons().forEach((icon) => {
                            iconsContainer.append(
                                this.createSvg({
                                    place: false,
                                    dataurl: icon.dataurl,
                                    size: 150,
                                    modules: {
                                        base: [
                                            new StyleModule({
                                                cursor: "pointer",
                                                borderRadius: "4px",
                                                background: this.spellSettings.icon === icon.name
                                                    ? "var(--tmd-element, #e6e6e6)"
                                                    : ""
                                            }),
                                            new DynamicClassModule({
                                                hover: {
                                                    background: "var(--tmd-element, #e6e6e6)"
                                                },
                                                active: {
                                                    padding: "4px"
                                                }
                                            }),
                                            new ClickModule((target) => {
                                                console.log(this.selectedSpellIconElement);
                                                this.spellSettings.icon = icon.name as SpellIcon;
                                                this.selectedSpellIconElement.style.background = "";
                                                console.log(target, target.style);
                                                target.style.background = "var(--tmd-element, #e6e6e6)";
                                                this.selectedSpellIconElement = target as SVGElement;
                                            })
                                        ]
                                    }
                                })
                            );
                        });

                        this.selectedSpellIconElement = iconsContainer.children[
                            getSpellIcons().findIndex((i) => i.name === this.spellSettings.icon)
                        ] as SVGElement;

                        this.createButton({
                            anchor: "bottom-right",
                            x: 100,
                            y: 90,
                            text: "Save",
                            padding: 3,
                            onClick: () => {
                                modStorage.darkMagic ??= {};
                                modStorage.darkMagic.spells ??= [];
                                const spell = modStorage.darkMagic.spells.find((s) => s.name === this._oldName);
                                // console.log(this._oldName, spell, modStorage.darkMagic.spells);
                                if (spell) {
                                    spell.name = this.spellSettings.name;
                                    spell.effects = this.spellSettings.effects;
                                    spell.icon = this.spellSettings.icon;
                                    spell.data = this.spellSettings.data;
                                } else {
                                    modStorage.darkMagic.spells.push(this.spellSettings);
                                }
                                this.exit();
                            }
                        });
                    }
                },
                {
                    name: "Effects",
                    load: () => {
                        const container = this.createScrollView({
                            scroll: "y",
                            x: 160,
                            y: 315,
                            width: 800,
                            height: 1000 - 75 - 315,
                            modules: {
                                base: [
                                    new StyleModule({
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: "0.3em",
                                    })
                                ]
                            }
                        });

                        Object.keys(spellEffects).forEach((effectKey) => {
                            const effectId: Effect = parseInt(effectKey);
                            // console.log("Effect key", effectId);
                            const effectItem = spellEffects[effectId];
                            container.append(
                                this.createButton({
                                    text: effectItem.name,
                                    icon: effectItem.icon,
                                    place: false,
                                    padding: 2,
                                    fontSize: 3,
                                    onClick: () => this.selectSpell(effectId),
                                    modules: {
                                        base: [
                                            new StyleModule({
                                                width: "100%"
                                            })
                                        ]
                                    }
                                })
                            );
                        });

                        this.selectSpell(Effect.ANIMA_FURTA);
                    },
                    exit: () => {
                        this.effectNameElement = null;
                        this.effectDescriptionElement = null;
                        this.effectAtomsElement = null;
                        this.effectAtomsContainerElement = null;
                        this.effectAddElement = null;
                        this.effectSettingsElement = null;
                    }
                }
            ],
            currentTabName: this.currentTab
        });

        // this.createSvg({
        //     dataurl: cauldronIcon,
        //     size: 200,
        //     x: 160,
        //     y: 750,
        //     modules: {
        //         base: [
        //             new StyleModule({
        //                 cursor: "pointer"
        //             })
        //         ]
        //     }
        // }).addEventListener("click", () => {
        //     if (!modStorage.darkMagic) modStorage.darkMagic = {};
        //     modStorage.darkMagic.spells ??= [];
        //     modStorage.darkMagic.spells.push({
        //         name: `Spell #${modStorage.darkMagic.spells.length + 1}`,
        //         effects: this.addedEffects.map((e) => e.toString().charCodeAt(0)).join("")
        //     });
        //     this.exit();
        // });

        // this.createText({
        //     text: "Save",
        //     x: 160,
        //     y: 815,
        //     width: 200,
        //     padding: 2,
        //     color: "white",
        //     modules: {
        //         base: [
        //             new StyleModule({
        //                 textAlign: "center",
        //                 pointerEvents: "none"
        //             })
        //         ]
        //     }
        // });

        // this.textElement = this.createText({
        //     text: "Effects: ",
        //     x: 500,
        //     y: 850,
        //     height: 125,
        //     withBorder: true,
        //     padding: 2
        // });
    }

    exit(): void {
        super.exit();
        this.setSubscreen(new DarkMagicSubscreen());
    }
}