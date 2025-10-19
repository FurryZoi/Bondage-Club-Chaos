import { BaseSubscreen } from "zois-core/ui";
import { createElement, HandCoins } from "lucide";
import { toastsManager } from "zois-core/popups";
import { modStorage } from "@/modules/storage";
import { refreshBonus } from "@/modules/cheats";
import { StyleModule } from "zois-core/ui-modules";
import { MainSubscreen } from "./mainSubscreen";


function appendReputationElements(container: HTMLDivElement, subscreen: CheatsSubscreen): void {
    Player.Reputation.forEach((r) => {
        const _container = subscreen.createContainer({
            place: false,
            modules: {
                base: [
                    new StyleModule({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    })
                ]
            }
        });
        const input = subscreen.createInput({
            width: 100,
            place: false,
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
        })
        _container.append(
            subscreen.createText({
                text: r.Type + ":",
                place: false
            }),
            input
        );
        container.append(_container);
    });
}

function appendSkillsElements(container: HTMLDivElement, subscreen: CheatsSubscreen): void {
    Player.Skill.forEach((s) => {
        const _container = subscreen.createContainer({
            place: false,
            modules: {
                base: [
                    new StyleModule({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    })
                ]
            }
        });
        const input = subscreen.createInput({
            width: 100,
            place: false,
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
        _container.append(
            subscreen.createText({
                text: s.Type + ":",
                place: false
            }),
            input
        );
        container.append(_container);
    });
}

export class CheatsSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(HandCoins);
    }

    get name() {
        return "Cheats";
    }

    public load(): void {
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

        this.createCheckbox({
            text: "Permanent skills boost",
            x: 200,
            y,
            isChecked: modStorage.cheats?.permanentSkillsBoost,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.permanentSkillsBoost = !modStorage.cheats.permanentSkillsBoost;
                refreshBonus();
            },
        });
        y += 90;

        this.createCheckbox({
            text: "Auto tight restraints",
            x: 200,
            y,
            isChecked: modStorage.cheats?.autoTight,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.autoTight = !modStorage.cheats.autoTight;
            },
        });
        y += 90;

        this.createCheckbox({
            text: "Anonymous mode",
            x: 200,
            y,
            isChecked: modStorage.cheats?.anonymousMode,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.anonymousMode = !modStorage.cheats.anonymousMode;
            },
        });
        y += 90;

        this.createCheckbox({
            text: "Always allow interactions with activities",
            x: 200,
            y,
            isChecked: modStorage.cheats?.allowActivities,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.allowActivities = !modStorage.cheats.allowActivities;
            },
        });
        y += 90;

        this.createCheckbox({
            text: "Map super power",
            x: 200,
            y,
            isChecked: modStorage.cheats?.mapSuperPower,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.mapSuperPower = !modStorage.cheats.mapSuperPower;
            },

        });
        y += 90;

        this.createCheckbox({
            text: "Xray vision",
            x: 200,
            y,
            isChecked: modStorage.cheats?.xray,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.xray = !modStorage.cheats.xray;
                ChatRoomCharacter.forEach((c) => {
                    CharacterLoadCanvas(c);
                });
            },
        });
        y += 90;

        this.createCheckbox({
            text: "Always show padlocks passwords",
            x: 200,
            y,
            isChecked: modStorage.cheats?.showPadlocksPasswords,
            onChange() {
                if (!modStorage.cheats) modStorage.cheats = {};
                modStorage.cheats.showPadlocksPasswords = !modStorage.cheats.showPadlocksPasswords;
            },
        });

        this.createButton({
            text: "Get All Items",
            x: 1200,
            y: 220,
            padding: 2,
            onClick: () => {
                const ids = [];
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

        this.createSelect({
            x: 1200,
            y: 220 + 120,
            width: 500,
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

        const container = this.createScrollView({
            x: 1200,
            y: 220 + 120 + 95,
            width: 500,
            height: 495,
            scroll: "y",
            modules: {
                base: [
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

    public exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}