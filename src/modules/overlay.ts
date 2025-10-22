import { callOriginal, hookFunction, HookPriority } from "zois-core/modsApi";
import { type ModStorage, modStorage } from "./storage";
import { getSpellIcon } from "./darkMagic";
import { getThemedColorsModule } from "zois-core";

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

            const versionText = modStorage.overlay?.versionText ?? 2;
            const effectsIcons = modStorage.overlay?.effectsIcons ?? 2;

            if (
                (
                    MouseHovering(CharX, CharY, 500 * Zoom, 1000 * Zoom) &&
                    versionText === 1
                ) ||
                versionText === 2
            ) {
                DrawTextFit(
                    `BCC v${bccData?.version}`,
                    CharX + 250 * Zoom,
                    CharY + 60 * Zoom,
                    140 * Zoom,
                    "Black"
                );
            }

            if (
                (
                    MouseHovering(CharX, CharY, 500 * Zoom, 1000 * Zoom) &&
                    effectsIcons === 1
                ) ||
                effectsIcons === 2
            ) {
                let spellIconY = 200;
                for (const spell of bccData?.darkMagic?.state?.spells ?? []) {
                    DrawCircle(CharX + 400 * Zoom, CharY + spellIconY * Zoom, 20 * Zoom, 2, "#c4b2e2ff", "#e6d6ffff");
                    DrawImageResize(getSpellIcon(spell.icon).dataurl, CharX + 400 * Zoom - 12 * Zoom, CharY + spellIconY * Zoom - 12 * Zoom, 25 * Zoom, 25 * Zoom);
                    if (MouseIn(CharX + 400 * Zoom - 20 * Zoom, CharY + spellIconY * Zoom - 20 * Zoom, 40 * Zoom, 40 * Zoom)) {
                        DrawRect(CharX + 200 * Zoom - 75 * Zoom, CharY + spellIconY * Zoom - 10 * Zoom, 240 * Zoom, 100 * Zoom, getThemedColorsModule()?.base?.element ?? "#e6d6ffff");
                        callOriginal("DrawTextFit", [spell.name, CharX + 240 * Zoom, CharY + 10 * Zoom + spellIconY * Zoom, 200 * Zoom, "Black"]);
                        callOriginal("DrawTextFit", [`Casted by: ${spell.castedBy?.name} (${spell.castedBy?.id})`, CharX + 240 * Zoom, CharY + 40 * Zoom + spellIconY * Zoom, 200 * Zoom, "Black"]);
                        callOriginal("DrawTextFit", [`Created by: ${spell.createdBy?.name} (${spell.createdBy?.id})`, CharX + 240 * Zoom, CharY + 70 * Zoom + spellIconY * Zoom, 200 * Zoom, "Black"]);
                    }
                    spellIconY += 45;
                    if (spellIconY >= 700) break;
                }
            }
        }
    );
}