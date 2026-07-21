import { Atom, type CastedSpell, getSpellEffect } from "../modules/darkMagic";
import { modStorage, syncStorage } from "../modules/storage";
import { BaseEffect, type TriggerEvent } from "./baseEffect";

export class PurificatioEffect extends BaseEffect {
    public override get name(): string {
        return "Purificatio";
    }

    public override get atoms(): Atom[] {
        return [Atom.LUX];
    }

    public override get description(): string {
        return "Removes all magic effects from the target.";
    }

    public override trigger(event: TriggerEvent): void {
        super.trigger(event);
        const activeSpells: CastedSpell[] = JSON.parse(
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