import { quickMenuItems, isFeatureEnabled, quickMenuSubscreens, setQAMSubscreen, isAllowScripts } from "@/modules/quickAccessMenu";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { createElement, Settings } from "lucide";
import { getNickname, MOD_DATA } from "zois-core";
import { addDynamicClass, setSubscreen } from "zois-core/ui";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { toastsManager } from "zois-core/popups";

let qamScrollTop: number;

export class ToggleInvisibilityQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Toggle Invisibility";
    public description: string = "Toggle target's invisibility state";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const select = this.buildCharacterSelect((C) => { target = C });
        const btn = this.buildButton("Toggle Invisibility");
        btn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }

            if (!isAllowScripts(target).hide) {
                if (target.IsPlayer()) {
                    return toastsManager.error({
                        title: "You don't allow to use scripts on yourself",
                        message: `Enable "hide" option in the scripts settings`,
                        duration: 7000
                    });
                } else {
                    return toastsManager.error({
                        message: `${getNickname(
                            target
                        )} doesn't allow you to modify appearance using scripts`,
                        duration: 6000
                    });
                }
            }

            if (!InventoryGet(target, "ItemScript")) {
                const itemScript = InventoryWear(target, "Script", "ItemScript");
                itemScript.Property = {
                    Hide: AssetGroup.filter((a) => a.Name !== "ItemScript").map((a) => a.Name)
                };
                ChatRoomCharacterUpdate(target);
                toastsManager.success({
                    message: `You have successfully activated invisibility for ${getNickname(
                        target
                    )}!`,
                    duration: 6000
                });
            } else {
                InventoryRemove(target, "ItemScript");
                ChatRoomCharacterUpdate(target);
                toastsManager.success({
                    message: `You have successfully deactivated invisibility for ${getNickname(
                        target
                    )}!`,
                    duration: 6000
                });
            }
        });
        container.append(select, btn);
    }
}