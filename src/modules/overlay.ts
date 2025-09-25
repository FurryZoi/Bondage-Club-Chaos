import { hookFunction, HookPriority } from "zois-core/modsApi";
import { ModStorage, modStorage } from "./storage";

export function loadOverlay(): void {
    hookFunction(
        "ChatRoomCharacterViewDrawOverlay",
        HookPriority.ADD_BEHAVIOR,
        (args, next) => {
            next(args);
            if (ChatRoomHideIconState !== 0) return;

            const [C, CharX, CharY, Zoom] = args as [Character, number, number, number];
            let bccData: ModStorage;

            if (C.IsPlayer()) {
                bccData = modStorage;
            } else {
                if (!C.BCC) return;
                bccData = C.BCC;
            }
            if (!bccData) return;

            // if (visorMode === visorsModes.aura) processEssencesAura(C, CharX, CharY, Zoom);

            const displayTitles: string = "show";

            if (
                (
                    MouseHovering(CharX, CharY, 500 * Zoom, 1000 * Zoom) &&
                    displayTitles === "show on hover"
                ) ||
                displayTitles === "show"
            ) {
                DrawTextFit(
                    `BCC v${bccData.version}`,
                    CharX + 250 * Zoom,
                    CharY + 50 * Zoom,
                    140 * Zoom,
                    "black"
                );
            }
        }
    );
}