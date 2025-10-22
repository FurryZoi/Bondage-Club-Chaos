import { BaseSubscreen } from "zois-core/ui";
import { createElement, Wand } from "lucide";
import { atoms, Effect, getSpellIcons, spellEffects, type SpellIcon } from "@/modules/darkMagic";
import { DynamicClassModule, StyleModule } from "zois-core/ui-modules";
import { type ModStorage, modStorage } from "@/modules/storage";
import { EffectSettingsSubscreen } from "./effectSettingsSubscreen";
import { DarkMagicSubscreen } from "../darkMagicSubscreen";
import { ClickModule } from "zois-core/ui-modules";
import { getNickname } from "zois-core";
import { MySpellsSubscreen } from "./mySpellsSubscreen";


export class SpellEditorSubscreen extends BaseSubscreen {
    private effectNameElement: HTMLParagraphElement;
    private effectDescriptionElement: HTMLParagraphElement;
    private effectTraitsContainerElement: HTMLDivElement;
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
        return "Spell Editor";
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
            data: {},
            createdBy: {
                name: getNickname(Player),
                id: Player.MemberNumber
            }
        };
        this.currentTab ??= "Main";
        this._oldName = this.spellSettings.name;
    }

    private selectEffect(effectId: Effect): void {
        this.selectedEffectId = effectId;
        const effect = spellEffects[effectId];
        if (this.effectNameElement) {
            this.effectNameElement.textContent = effect.name;
        } else {
            this.effectNameElement = this.createText({
                text: effect.name,
                x: 1000,
                y: 315,
                width: 500,
                modules: {
                    base: [
                        new StyleModule({
                            fontWeight: "bold"
                        })
                    ]
                }
            });
        }
        if (this.effectTraitsContainerElement) {
            this.effectTraitsContainerElement.innerHTML = "";
        } else {
            this.effectTraitsContainerElement = this.createContainer({
                x: 1600,
                y: 315,
                width: 300
            });
        }
        if (effect.isInstant) {
            this.effectTraitsContainerElement.append(
                this.createText({
                    place: false,
                    text: "Instant",
                    color: "#3e2653",
                    fontSize: 2.5,
                    modules: {
                        base: [
                            new StyleModule({
                                background: "#d18cff",
                                borderRadius: "0.25em",
                                padding: "0.2em 0.65em"
                            })
                        ]
                    }
                })
            );
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
            if (!atom) return;
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
                    const effectButtonElement = document.getElementById(`effect-${String.fromCharCode(this.selectedEffectId)}-button`);
                    if (this.spellSettings.effects.includes(String.fromCharCode(this.selectedEffectId))) {
                        this.spellSettings.effects = this.spellSettings.effects.replaceAll(String.fromCharCode(this.selectedEffectId), "");
                        this.effectAddElement.textContent = "Add Effect";
                        effectButtonElement.setAttribute("data-zc-style", "default");
                    } else {
                        this.spellSettings.effects += String.fromCharCode(this.selectedEffectId);
                        this.effectAddElement.textContent = "Remove Effect";
                        effectButtonElement.setAttribute("data-zc-style", "green");
                    }
                }
            });
        }
        if (this.effectSettingsElement) {
            this.effectSettingsElement.classList.toggle("zcDisabled", spellEffects[this.selectedEffectId].parameters.length === 0);
        } else {
            this.effectSettingsElement = this.createButton({
                text: "Settings",
                anchor: "bottom-left",
                x: 1435,
                y: 75,
                padding: 2,
                width: 365,
                onClick: () => this.setSubscreen(new EffectSettingsSubscreen(this.selectedEffectId, this.spellSettings)),
                isDisabled: () => spellEffects[this.selectedEffectId].parameters.length === 0
            });
        }
    }

    public load(): void {
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
                            text: "Spell Icon",
                            x: 200,
                            y: 450,
                        });

                        const iconsContainer = this.createScrollView({
                            x: 200,
                            y: 515,
                            width: 1600,
                            scroll: "x",
                            modules: {
                                base: [
                                    new StyleModule({
                                        display: "flex",
                                        gap: "4px",
                                    })
                                ]
                            }
                        });
                        iconsContainer.addEventListener("wheel", (e) => {
                            if (e.deltaY !== 0) {
                                e.preventDefault();
                                iconsContainer.scrollLeft += e.deltaY;
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
                                                flexShrink: "0",
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
                                                this.spellSettings.icon = icon.name as SpellIcon;
                                                this.selectedSpellIconElement.style.background = "";
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

                        if (this.spellSettings.createdBy.id !== Player.MemberNumber) {
                            this.createText({
                                anchor: "bottom-right",
                                x: 300,
                                y: 115,
                                width: 565,
                                color: "red",
                                text: "Can't edit spells which were not created by you"
                            });
                        }

                        this.createButton({
                            anchor: "bottom-right",
                            x: 100,
                            y: 90,
                            text: "Save",
                            padding: 3,
                            isDisabled: () => this.spellSettings.createdBy.id !== Player.MemberNumber,
                            onClick: () => {
                                modStorage.darkMagic ??= {};
                                modStorage.darkMagic.spells ??= [];
                                const spell = modStorage.darkMagic.spells.find((s) => s.name === this._oldName);
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
                            const effectId: Effect = parseInt(effectKey, 10);
                            const effectItem = spellEffects[effectId];
                            const btn = this.createButton({
                                text: effectItem.name,
                                place: false,
                                padding: 2,
                                fontSize: 3,
                                style: this.spellSettings.effects.includes(String.fromCharCode(effectId)) ? "green" : "default",
                                onClick: () => this.selectEffect(effectId),
                                modules: {
                                    base: [
                                        new StyleModule({
                                            width: "100%"
                                        })
                                    ]
                                }
                            });
                            btn.id = `effect-${String.fromCharCode(effectId)}-button`;
                            container.append(btn);
                        });

                        this.selectEffect(Effect.ANIMA_FURTA);
                    },
                    exit: () => {
                        this.effectNameElement = null;
                        this.effectTraitsContainerElement = null;
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
    }

    public exit(): void {
        const s = this.previousSubscreen instanceof MySpellsSubscreen ? new MySpellsSubscreen() : new DarkMagicSubscreen();
        super.exit();
        this.setSubscreen(s);
    }
}