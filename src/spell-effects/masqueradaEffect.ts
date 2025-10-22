import { Atom } from "../modules/darkMagic";
import { BaseEffect, type RemoveEvent, type TriggerEvent, type EffectParameter } from "./baseEffect";

export class MasqueradaEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }

    get name(): string {
        return "Masquerada";
    }

    get atoms(): Atom[] {
        return [Atom.MATERIA];
    }

    get description(): string {
        return "Changes target's appearance.";
    }

    get parameters(): EffectParameter[] {
        return [
            {
                name: "outfit",
                type: "text",
                label: "Outfit Code"
            }
        ]
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        if (!event.init) return;
        const lastOutfit = LZString.compressToBase64(JSON.stringify(ServerAppearanceBundle(Player.Appearance)));
        this.setParameter("lastOutfit", lastOutfit, event.spellName);
        ServerAppearanceLoadFromBundle(Player, Player.AssetFamily, JSON.parse(LZString.decompressFromBase64(event.data.outfit)), event.sourceCharacter.MemberNumber);
        ChatRoomCharacterUpdate(Player);
        this.setParameter("outfit", undefined, event.spellName);
    }

    public remove(event: RemoveEvent, push: boolean = true): void {
        const lastOutfit = this.getParameter<string>("lastOutfit", Player);
        super.remove(event, push);
        ServerAppearanceLoadFromBundle(Player, Player.AssetFamily, JSON.parse(LZString.decompressFromBase64(lastOutfit)), Player.MemberNumber);
        ChatRoomCharacterUpdate(Player);
    }
}