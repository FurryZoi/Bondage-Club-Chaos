import { modStorage, syncStorage } from "@/modules/storage";
import { dialogsManager } from "zois-core/dialogs";
import { toastsManager } from "zois-core/toasts";
import { Atom, generateSpellName, type Spell } from "../modules/darkMagic";
import { BaseEffect, type EffectParameter, type TriggerEvent } from "./baseEffect";

export class TraditioArtiumEffect extends BaseEffect {
    public override get name(): string {
        return "Traditio Artium";
    }

    public override get atoms(): Atom[] {
        return [Atom.LUX];
    }

    public override get description(): string {
        return "Establishes connection with target, letting you share your magical arts";
    }

    public override get parameters(): EffectParameter[] {
        return [
            {
                name: "spell",
                type: "choice",
                label: "Spell to share",
                options: () => {
                    const options = [];
                    for (const spell of modStorage.darkMagic?.spells ?? []) {
                        options.push({
                            text: spell.name,
                            returnValue: spell
                        });
                    }
                    return options;
                }
            }
        ];
    }

    public override async trigger(event: TriggerEvent<{ spell: Spell }>) {
        super.trigger(event);
        const spell = event.data.spell;
        if (!spell) return;
        const result = await dialogsManager.confirm({
            message: `Do you want to learn the spell "${spell.name}" from ${CharacterNickname(event.sourceCharacter)}?`,
        });
        if (!result) return;
        spell.name = generateSpellName(spell.name.trim(), modStorage.darkMagic?.spells ?? []);
        modStorage.darkMagic ??= {};
        modStorage.darkMagic.spells ??= [];
        modStorage.darkMagic.spells.push(spell);
        toastsManager.success({
            message: `Spell successfully learned`,
            duration: 4000
        });
        syncStorage();
    }
}