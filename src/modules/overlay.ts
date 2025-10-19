import { callOriginal, hookFunction, HookPriority } from "zois-core/modsApi";
import { type ModStorage, modStorage } from "./storage";
import { getSpellIcon } from "./darkMagic";

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
                    `BCC v${bccData?.version}`,
                    CharX + 250 * Zoom,
                    CharY + 50 * Zoom,
                    140 * Zoom,
                    "#8337ff"
                );
            }

            let spellIconY = 200;
            for (const spell of bccData?.darkMagic?.state?.spells ?? []) {
                DrawCircle(CharX + 400 * Zoom, CharY + spellIconY * Zoom, 20 * Zoom, 2, "#c4b2e2ff", "#e6d6ffff");
                DrawImageResize(getSpellIcon(spell.icon).dataurl, CharX + 400 * Zoom - 12 * Zoom, CharY + spellIconY * Zoom - 12 * Zoom, 25 * Zoom, 25 * Zoom);
                if (MouseIn(CharX + 400 * Zoom - 20 * Zoom, CharY + spellIconY * Zoom - 20 * Zoom, 40 * Zoom, 40 * Zoom)) {
                    DrawRect(CharX + 400 * Zoom - 100 * Zoom - 75 * Zoom, CharY + spellIconY * Zoom - 15 * Zoom, 150 * Zoom, 100 * Zoom, "#e6d6ffff");
                    DrawTextFit(spell.name, CharX + 400 * Zoom - 100 * Zoom, CharY + 10 * Zoom + spellIconY * Zoom, 150 * Zoom, "Black");
                    DrawTextFit(`Casted by: ${spell.castedBy?.name} (${spell.castedBy?.id})`, CharX + 400 * Zoom - 100 * Zoom, CharY + 40 * Zoom + spellIconY * Zoom, 150 * Zoom, "Black");
                    DrawTextFit(`Created by: ${spell.createdBy?.name} (${spell.createdBy?.id})`, CharX + 400 * Zoom - 100 * Zoom, CharY + 70 * Zoom + spellIconY * Zoom, 150 * Zoom, "Black");
                }
                spellIconY += 45;
                if (spellIconY >= 700) break;
            }
        }
    );
}