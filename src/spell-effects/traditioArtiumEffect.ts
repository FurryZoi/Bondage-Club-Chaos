import { getRandomNumber } from "zois-core";
import { Atom, generateSpellName } from "../modules/darkMagic";
import { BaseEffect, EffectParameter, TriggerEvent } from "./baseEffect";
import { dialogsManager, toastsManager } from "zois-core/popups";
import { ModStorage, modStorage, syncStorage } from "@/modules/storage";

export class TraditioArtiumEffect extends BaseEffect {
    get name(): string {
        return "Traditio Artium";
    }

    get atoms(): Atom[] {
        return [Atom.LUX];
    }

    get description(): string {
        return "Establishes connection with target, letting you share your magical arts";
    }

    get parameters(): EffectParameter[] {
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

    public async trigger(event: TriggerEvent<{ spell: ModStorage["darkMagic"]["spells"][number] }>) {
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