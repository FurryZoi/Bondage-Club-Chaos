import { getRandomNumber } from "zois-core";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";
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

    public async trigger(event: TriggerEvent) {
        super.trigger(event);
        const spells = event.sourceCharacter?.BCC?.darkMagic?.spells;
        if (!spells) return;
        const result = await dialogsManager.showDialog({
            type: "choice_multiple",
            title: "Choose spells",
            body: "",
            width: 600,
            buttons: {
                direction: "column",
                list: spells.map((s) => ({text: s.name, value: s})),
            }
        }) as ModStorage["darkMagic"]["spells"][0][];
        modStorage.darkMagic ??= {};
        modStorage.darkMagic.spells ??= [];
        modStorage.darkMagic.spells.push(...result);
        toastsManager.success({
            message: `Learned spells: ${result.map((s) => s.name).join(", ")}`,
            duration: 5000
        });
        syncStorage();
    }
}