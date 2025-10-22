import { Atom, getSpellEffect } from "../modules/darkMagic";
import { ModStorage, modStorage, syncStorage } from "../modules/storage";
import { BaseEffect, TriggerEvent } from "./baseEffect";

export class PurificatioEffect extends BaseEffect {
    get name(): string {
        return "Purificatio";
    }

    get atoms(): Atom[] {
        return [Atom.LUX];
    }

    get description(): string {
        return "Removes all magic effects from the target.";
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        const activeSpells: ModStorage["darkMagic"]["state"]["spells"] = JSON.parse(
            JSON.stringify(modStorage.darkMagic?.state?.spells ?? [])
        );
        for (const spell of activeSpells) {
            for (const effectChar of spell.effects) {
                const effect = getSpellEffect(effectChar.charCodeAt(0));
                effect.remove({
                    sourceCharacter: event.sourceCharacter,
                    sourceSpellName: event.spellName,
                    targetSpellName: spell.name
                }, false);
            }
        }
        syncStorage();
    }
}