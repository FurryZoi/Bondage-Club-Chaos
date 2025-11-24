import { quickMenuItems, isFeatureEnabled, quickMenuSubscreens, setQAMSubscreen, isAllowScripts, isBannedBy } from "@/modules/quickAccessMenu";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { ArrowDown, ArrowUp, createElement, Settings } from "lucide";
import { getNickname, MOD_DATA } from "zois-core";
import { addDynamicClass, DynamicClassStyles, setSubscreen } from "zois-core/ui";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { toastsManager } from "zois-core/popups";
import { importAppearance, serverAppearanceBundleToAppearance } from "zois-core/wardrobe";


export class ExportAppearanceQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Export Appearance";
    public description: string = "Copy target's appearance to clipboard in utf-16 or base64 format";

    public load(container: Element) {
        super.load(container);

        let format = "base64";
        let target: Character = Player;
        const formatSelect = this.buildSelect({
            options: [
                {
                    name: "utf-16",
                    text: "UTF-16 (Not safe)",
                },
                {
                    name: "btoa",
                    text: "BTOA (UBC)"
                },
                {
                    name: "base64",
                    text: "Base64 (Most mods)",
                }
            ],
            currentOption: "base64",
            onChange: (value) => { format = value }
        })
        const select = this.buildCharacterSelect((C) => { target = C });
        const btn = this.buildButton("Copy to clipboard");
        btn.addEventListener("click", async () => {
            if (isBannedBy(target)) return toastsManager.error({
                title: "Denied",
                message: "You are blacklisted or ghosted by this player",
                duration: 4500
            });
            const stringifiedAppearance = JSON.stringify(ServerAppearanceBundle(target.Appearance));
            let clipboardResult: string;
            if (format === "base64") {
                clipboardResult = LZString.compressToBase64(stringifiedAppearance);
            } else if (format === "utf-16") {
                clipboardResult = LZString.compressToUTF16(stringifiedAppearance);
            } else {
                clipboardResult = btoa(encodeURI(stringifiedAppearance));
            }
            try {
                await navigator.clipboard.writeText(clipboardResult);
                toastsManager.success({
                    message: "Code was copied to your clipboard",
                    duration: 3000
                });
            } catch (e) {
                const error = e as DOMException;
                toastsManager.error({
                    title: error.name,
                    message: error.message,
                    duration: 8000
                });
            }
        });
        container.append(formatSelect, select, btn);
    }
}