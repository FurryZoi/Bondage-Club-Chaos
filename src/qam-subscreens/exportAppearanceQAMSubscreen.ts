import { isBannedBy } from "@/modules/quickAccessMenu";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { toastsManager } from "zois-core/popups";


export class ExportAppearanceQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Export Appearance";
    public description: string = "Copy target's appearance to clipboard in utf-16 or base64 format";

    public load(container: HTMLDivElement) {
        super.load(container);

        let format = "base64";
        let target: Character = Player;
        const formatSelect = this.buildDropdown({
            options: [
                {
                    text: "UTF-16 (Not safe)",
                    name: "utf-16",
                },
                {
                    text: "BTOA (UBC)",
                    name: "btoa",
                },
                {
                    text: "Base64 (Most mods)",
                    name: "base64",
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