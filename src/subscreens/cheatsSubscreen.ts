import { BaseSubscreen } from "zois-core/ui";
import { createElement, HandCoins } from "lucide";
import { toastsManager } from "zois-core/toasts";
import { type ModStorage, modStorage } from "@/modules/storage";
import { refreshBonus } from "@/modules/cheats";
import { StyleModule } from "zois-core/shard-modules";
import { MainSubscreen } from "./mainSubscreen";
import { CheatsMinigamesSubscreen } from "./cheatsMinigamesSubscreen";

const booleanCheats: {
    name: string
    tooltip: string
    storageKey: keyof NonNullable<ModStorage["cheats"]>
}[] = [
        {
            name: "Permanent skills boost",
            tooltip: "Adds permanent +5 boost for every skill",
            storageKey: "permanentSkillsBoost"
        },
        {
            name: "Auto tight restraint",
            tooltip: "Greatly tightens any restraint when used on anyone except you",
            storageKey: "autoTight"
        },
        {
            name: "Anonymous mode",
            tooltip: "Prevents sending public action messages to the chat",
            storageKey: "anonymousMode"
        },
        {
            name: "Always allow interactions with activities",
            tooltip: "Allows you to use sexual activities when this is not possible",
            storageKey: "allowActivities"
        },
        {
            name: "Map super power",
            tooltip: "Gives you admin super powers on map view",
            storageKey: "mapSuperPower"
        },
        {
            name: "Xray vision",
            tooltip: "Allows you to see through clothes",
            storageKey: "xray"
        },
        {
            name: "Always show padlocks passwords",
            tooltip: "It will always show the password on the combination locks",
            storageKey: "showPadlocksPasswords"
        },
        {
            name: "Disable arousal overlay",
            tooltip: "Turns off the pink glow",
            storageKey: "disableArousalOverlay"
        }
    ]


function appendReputationElements(container: HTMLDivElement, subscreen: CheatsSubscreen): void {
    Player.Reputation.forEach((r) => {
        const _container = subscreen.createContainer({
            parent: container,
            modules: {
                content: [
                    new StyleModule({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    })
                ]
            }
        });
        subscreen.createText({
            text: r.Type + ":",
            parent: _container
        });
        const input = subscreen.createInput({
            width: 100,
            parent: _container,
            value: r.Value.toString(),
            modules: {
                base: [
                    new StyleModule({
                        padding: "0.2em"
                    })
                ]
            },
            onChange() {
                DialogSetReputation(r.Type, parseInt(input.value, 10));
                ServerPlayerReputationSync();
            },
        });
    });
}

function appendSkillsElements(container: HTMLDivElement, subscreen: CheatsSubscreen): void {
    Player.Skill.forEach((s) => {
        const _container = subscreen.createContainer({
            parent: container,
            modules: {
                content: [
                    new StyleModule({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    })
                ]
            }
        });
        subscreen.createText({
            text: s.Type + ":",
            parent: _container
        });
        const input = subscreen.createInput({
            width: 100,
            parent: _container,
            value: s.Level.toString(),
            modules: {
                base: [
                    new StyleModule({
                        padding: "0.2em"
                    })
                ]
            },
            onChange() {
                s.Level = parseInt(input.value, 10);
                ServerPlayerSkillSync();
            },
        })
    });
}

export class CheatsSubscreen extends BaseSubscreen {
    public get icon(): SVGElement {
        return createElement(HandCoins);
    }

    public override get name() {
        return "Cheats";
    }

    public override load(): void {
        super.load();

        let y = 220;

        this.createText({
            text: "Money:",
            x: 200,
            y,
            height: 60
        });

        const input = this.createInput({
            value: Player.Money.toString(),
            x: 360,
            y: y - 10,
            width: 400,
            height: 60,
            onChange() {
                if (parseInt(input.value, 10) < 0 || Number.isNaN(parseInt(input.value, 10))) return;
                Player.Money = parseInt(input.value, 10);
                ServerPlayerSync();
            },
        });
        y += 90;

        const booleanCheatsContainer = this.createContainer({
            x: 200,
            y,
            width: 950,
            height: 625,
            modules: {
                content: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.45em",
                        overflowY: "scroll"
                    })
                ]
            }
        });

        for (const cheat of booleanCheats) {
            this.createCheckbox({
                text: cheat.name,
                parent: booleanCheatsContainer,
                isChecked: !!modStorage.cheats?.[cheat.storageKey],
                tooltip: {
                    position: "right",
                    text: cheat.tooltip,
                },
                onChange() {
                    if (!modStorage.cheats) modStorage.cheats = {};
                    modStorage.cheats[cheat.storageKey] = !modStorage.cheats[cheat.storageKey];
                    if (cheat.storageKey === "permanentSkillsBoost") refreshBonus();
                    if (cheat.storageKey === "xray") {
                        ChatRoomCharacter.forEach((c) => {
                            CharacterLoadCanvas(c);
                        });
                    }
                }
            });
        }

        this.createButton({
            text: "Get All Items",
            x: 1200,
            y: 220,
            padding: 2,
            width: 300,
            onClick: () => {
                const ids: number[] = [];
                AssetFemale3DCG.forEach((group) => {
                    group.Asset.forEach((item) => {
                        if (typeof item === "string") return;
                        if (item.Name) {
                            let exists = false;
                            for (let I = 0; I < Player.Inventory.length; I++) {
                                if (
                                    Player.Inventory[I].Name === item.Name &&
                                    Player.Inventory[I].Group === group.Group
                                ) exists = true;
                            }
                            if (!exists && item.InventoryID) {
                                InventoryAdd(Player, item.Name, group.Group, false);
                                if (!ids.includes(item.InventoryID)) {
                                    ids.push(item.InventoryID);
                                }
                            }
                        }
                    });
                });
                if (ids.length === 0) {
                    return toastsManager.warn({
                        message: `You already have all items`,
                        duration: 4000
                    });
                }
                toastsManager.success({
                    title: "New items were added to your inventory",
                    message: `Items added: ${ids.length}`,
                    duration: 6000
                });
                ServerPlayerInventorySync();
            }
        });

        this.createButton({
            text: "Minigames",
            x: 1200 + 300 + 50,
            y: 220,
            padding: 2,
            width: 300,
            onClick: () => this.setSubscreen(new CheatsMinigamesSubscreen())
        });

        this.createSelect({
            x: 1200,
            y: 220 + 120,
            width: 650,
            currentOption: "reputation",
            options: [
                {
                    name: "reputation",
                    text: "Reputation"
                },
                {
                    name: "skills",
                    text: "Skills"
                }
            ],
            onChange: (name) => {
                if (name === "skills") {
                    container.innerHTML = "";
                    appendSkillsElements(container, this);
                } else {
                    container.innerHTML = "";
                    appendReputationElements(container, this);
                }
            },
        });

        const container = this.createContainer({
            x: 1200,
            y: 220 + 120 + 95,
            width: 650,
            height: 495,
            scroll: "y",
            modules: {
                content: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.2em"
                    })
                ]
            }
        });

        appendReputationElements(container, this);
    }

    public override exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}