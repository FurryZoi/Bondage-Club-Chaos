import { callOriginal, hookFunction, HookPriority } from "zois-core/modsApi";
import { type ModStorage, modStorage } from "./storage";
import { getSpellIcon } from "./darkMagic";
import { createElement, Pencil, Wand } from "lucide";

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
                    DrawImageResize(fixSvgDimensions(getSpellIcon(spell.icon).dataurl, 25 * Zoom, 25 * Zoom), CharX + 400 * Zoom - 12 * Zoom, CharY + spellIconY * Zoom - 12 * Zoom, 25 * Zoom, 25 * Zoom);
                    if (MouseIn(CharX + 400 * Zoom - 20 * Zoom, CharY + spellIconY * Zoom - 20 * Zoom, 40 * Zoom, 40 * Zoom)) {
                        drawRoundedRect(MainCanvas, CharX + 200 * Zoom - 75 * Zoom, CharY + spellIconY * Zoom - 10 * Zoom, 240 * Zoom, 100 * Zoom, 6, "#e6d6ffff", "#c3b3ddff", 2);
                        callOriginal("DrawTextFit", [spell.name, CharX + 245 * Zoom, CharY + 10 * Zoom + spellIconY * Zoom, 165 * Zoom, "Black"]);

                        DrawImageResize(svgElementToImage(createElement(Pencil), 25 * Zoom, 25 * Zoom), CharX + 140 * Zoom, CharY + 35 * Zoom + spellIconY * Zoom, 20 * Zoom, 20 * Zoom);
                        callOriginal("DrawTextFit", [`${spell.createdBy?.name} (${spell.createdBy?.id})`, CharX + 240 * Zoom, CharY + 45 * Zoom + spellIconY * Zoom, 140 * Zoom, "Black"]);

                        DrawImageResize(svgElementToImage(createElement(Wand), 25 * Zoom, 25 * Zoom), CharX + 140 * Zoom, CharY + 60 * Zoom + spellIconY * Zoom, 20 * Zoom, 20 * Zoom);
                        callOriginal("DrawTextFit", [`${spell.castedBy?.name} (${spell.castedBy?.id})`, CharX + 240 * Zoom, CharY + 70 * Zoom + spellIconY * Zoom, 140 * Zoom, "Black"]);
                    }
                    spellIconY += 45;
                    if (spellIconY >= 700) break;
                }
            }
        }
    );
}

function svgElementToImage(svgElement: SVGElement, width: number, height: number) {
    const svgClone = svgElement.cloneNode(true);

    // svgClone.setAttribute('width', width || svgElement.viewBox.baseVal.width || 300);
    // svgClone.setAttribute('height', height || svgElement.viewBox.baseVal.height || 150);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    const img = new Image();
    img.src = dataUrl;
    return img;
}

function fixSvgDimensions(dataUrl: string, width: number, height: number) {
    if (dataUrl.startsWith('data:image/svg+xml;base64,')) {
        const base64 = dataUrl.replace('data:image/svg+xml;base64,', '');
        let svgString = atob(base64);

        if (!svgString.includes('width=') && !svgString.includes('height=')) {
            svgString = svgString.replace('<svg', `<svg width="${width}" height="${height}"`);
        }

        const fixedBase64 = btoa(svgString);
        return `data:image/svg+xml;base64,${fixedBase64}`;
    }
    else if (dataUrl.startsWith('data:image/svg+xml,')) {
        let svgString = decodeURIComponent(dataUrl.replace('data:image/svg+xml,', ''));
        if (!svgString.includes('width=') && !svgString.includes('height=')) {
            svgString = svgString.replace('<svg', `<svg width="${width}" height="${height}"`);
        }
        return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
    }

    return dataUrl;
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string,
    strokeColor: string,
    lineWidth = 1
) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.closePath();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}