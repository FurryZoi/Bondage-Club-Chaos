import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { ArrowDown, ArrowUp, createElement, Settings } from "lucide";
import { getNickname, MOD_DATA } from "zois-core";
import { addDynamicClass, DynamicClassStyles, setSubscreen } from "zois-core/ui";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { toastsManager } from "zois-core/popups";


export class PosesManagerQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Poses Manager";
    public description: string = "Change target's pose, y position";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;

        const select = this.buildCharacterSelect((C) => {
            target = C;
            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                createPosesContainer("BodyUpper"),
                createPosesContainer("BodyLower"),
                createPosesContainer("BodyFull")
            );
        });

        const createPosesContainer = (category: keyof AssetPoseMap) => {
            const container = document.createElement("div");
            container.style.cssText = "display: flex; gap: calc(0.5 * min(2dvh, 1dvw)); margin: 0.25em 1em;";
            PoseFemale3DCG
                .filter((p) => p.Category === category && (p.AllowMenu || p.AllowMenuTransient))
                .forEach((p) => {
                    const btn = document.createElement("button");
                    addDynamicClass(btn, {
                        base: {
                            cursor: "pointer",
                            width: "3em",
                            aspectRatio: "1/1",
                            background: "none",
                            border: "2px solid #d2d2d2",
                            borderRadius: "8px"
                        },
                        hover: {
                            borderColor: "#ad68ff"
                        }
                    });
                    if (target.Pose.includes(p.Name)) {
                        btn.style.borderColor = "#ad68ff";
                    }
                    btn.addEventListener("click", () => {
                        if (!ServerChatRoomGetAllowItem(Player, target)) {
                            return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                        }
                        PoseSetActive(target, p.Name);
                        ChatRoomCharacterUpdate(target);
                        I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
                        I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                            createPosesContainer("BodyUpper"),
                            createPosesContainer("BodyLower"),
                            createPosesContainer("BodyFull")
                        );
                    });
                    const image = document.createElement("img");
                    image.src = `Icons/Poses/${p.Name}.png`;
                    image.style.cssText = "width: 80%; height: auto;";
                    btn.append(image);
                    container.append(btn);
                });
            return container;
        }

        const I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE = document.createElement("div");
        I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
            createPosesContainer("BodyUpper"),
            createPosesContainer("BodyLower"),
            createPosesContainer("BodyFull")
        );

        const suspenseBtn = this.buildButton("Suspense");;
        suspenseBtn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            PoseSetActive(target, "Suspension");
            ChatRoomCharacterUpdate(target);
            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                createPosesContainer("BodyUpper"),
                createPosesContainer("BodyLower"),
                createPosesContainer("BodyFull")
            );
        });

        const overrideHeight = (h: number) => {
            const emoticon = InventoryGet(target, "Emoticon");
            if (h === null) {
                delete emoticon.Property?.OverrideHeight;
            } else {
                emoticon.Property ??= {};
                const height = emoticon.Property.OverrideHeight?.Height ?? 0;
                //@ts-expect-error Ignore Priority
                emoticon.Property.OverrideHeight = { Height: height + h };
            }
            ChatRoomCharacterUpdate(target);
        };

        const heightOverrideControls = document.createElement("div");
        heightOverrideControls.style.cssText = "display: flex; justify-content: center; column-gap: 0.65em; flex-shrink: 0; margin-top: 0.25em; margin-bottom: 0.65em; height: 2.5em;";

        const dynamicClass: DynamicClassStyles = {
            base: {
                cursor: "pointer",
                aspectRatio: "1/1",
                height: "100%",
                background: "white",
                border: "2px solid #d2d2d2",
                borderRadius: "50%"
            },
            hover: {
                borderColor: "#ad68ff"
            }
        };

        const downBtn = document.createElement("button");
        addDynamicClass(downBtn, dynamicClass);
        downBtn.append(createElement(ArrowDown));
        downBtn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            overrideHeight(-10);
        });

        const resetBtn = document.createElement("button");
        addDynamicClass(resetBtn, {
            base: {
                cursor: "pointer",
                padding: "0.25em 0.75em",
                height: "100%",
                border: "none",
                background: "#d3d3d3ff",
                borderRadius: "4px"
            },
            hover: {
                background: "#c3c3c3ff"
            }
        });
        resetBtn.textContent = "Reset";
        resetBtn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            overrideHeight(null);
        });

        const upBtn = document.createElement("button");
        addDynamicClass(upBtn, dynamicClass);
        upBtn.append(createElement(ArrowUp));
        upBtn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            overrideHeight(10);
        });

        heightOverrideControls.append(downBtn, resetBtn, upBtn);

        container.append(select, I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE, suspenseBtn, heightOverrideControls);
    }
}