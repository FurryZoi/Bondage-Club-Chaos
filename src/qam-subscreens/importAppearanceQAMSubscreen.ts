import { quickMenuItems, isFeatureEnabled, quickMenuSubscreens, setQAMSubscreen, isAllowScripts } from "@/modules/quickAccessMenu";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { ArrowDown, ArrowUp, createElement, Settings } from "lucide";
import { getNickname, MOD_DATA } from "zois-core";
import { addDynamicClass, DynamicClassStyles, setSubscreen } from "zois-core/ui";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { toastsManager } from "zois-core/popups";
import { importAppearance, serverAppearanceBundleToAppearance } from "zois-core/wardrobe";


export class ImportAppearanceQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Import Appearance";
    public description: string = "Import appearance on target using base64 outfit code";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const input = this.buildInput("Code");
        const select = this.buildCharacterSelect((C) => { target = C });
        const btn = this.buildButton("Import Appearance");
        btn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            try {
                importAppearance(
                    target,
                    serverAppearanceBundleToAppearance(target.AssetFamily, JSON.parse(LZString.decompressFromBase64(input.value)))
                );
                toastsManager.success({
                    message: `Appearance was successfully imported on ${getNickname(target)}`,
                    duration: 4000
                });
            } catch {
                toastsManager.error({
                    title: "Oops!",
                    message: "Error occurred while trying to import appearance",
                    duration: 5000
                });
            }
        });
        container.append(input, select, btn);
    }
}