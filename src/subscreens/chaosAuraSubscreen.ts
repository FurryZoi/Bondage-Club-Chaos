import { BaseSubscreen } from "zois-core/ui";
import { createElement, Shell } from "lucide";
import { CounterUpModule } from "zois-core/ui-modules";
import { ModStorage, modStorage, syncStorage } from "@/modules/storage";
import { updateChaosAuraLastData } from "@/modules/chaosAura";

export class ChaosAuraSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(Shell);
    }

    get name() {
        return "Aura Of Chaos";
    }

    private turnTrigger(triggerName: keyof ModStorage["chaosAura"]["triggers"]): void {
        if (!modStorage.chaosAura) modStorage.chaosAura = {};
        if (!modStorage.chaosAura.triggers) modStorage.chaosAura.triggers = {};
        modStorage.chaosAura.triggers[triggerName] = !modStorage.chaosAura.triggers[triggerName];
    }

    load(): void {
        super.load();

        let y = 240;

        this.createCheckbox({
            isChecked: modStorage.chaosAura?.enabled,
            x: 120,
            y,
            text: "Enabled",
            onChange: () => {
                if (!modStorage.chaosAura) modStorage.chaosAura = {};
                modStorage.chaosAura.enabled = !modStorage.chaosAura.enabled;
                updateChaosAuraLastData();
            }
        });
        y += 90;

        this.createCheckbox({
            isChecked: modStorage.chaosAura?.retribution,
            x: 120,
            y,
            text: "Retribution",
            onChange: () => {
                if (!modStorage.chaosAura) modStorage.chaosAura = {};
                modStorage.chaosAura.retribution = !modStorage.chaosAura.retribution;
            }
        });
        y += 120;

        this.createText({
            text: "Triggers:",
            x: 120,
            y
        });
        y += 90;

        this.createCheckbox({
            text: "Clothes change",
            x: 140,
            y,
            isChecked: modStorage.chaosAura?.triggers?.clothesChange,
            onChange: () => this.turnTrigger("clothesChange")
        });
        y += 90;

        this.createCheckbox({
            text: "Items change",
            x: 140,
            y,
            isChecked: modStorage.chaosAura?.triggers?.itemsChange,
            onChange: () => this.turnTrigger("itemsChange")
        });
        y += 90;

        this.createCheckbox({
            text: "Pose change",
            x: 140,
            y,
            isChecked: modStorage.chaosAura?.triggers?.poseChange,
            onChange: () => this.turnTrigger("poseChange")
        });
        y += 90;

        this.createCheckbox({
            text: "Magic cast",
            x: 140,
            y,
            isChecked: modStorage.chaosAura?.triggers?.magicCast,
            onChange: () => this.turnTrigger("magicCast")
        });
        y += 90;

        // this.createText({
        //     x: 750,
        //     y: 200,
        //     text: "Chaos aura can protect you from any restraints and even LSCG spells, if retribution enabled then chaos aura will take revenge on those who will try to tie you up, chaos aura will ignore those who are in the ignore list if ignore list is enabled",
        //     withBackground: true,
        //     padding: 2,
        //     width: 900,
        // });
        
        this.createCheckbox({
            text: "Ignore items change if not restraint",
            x: 750,
            y: 240,
            isChecked: modStorage.chaosAura?.ignoreItemsChangeIfNotRestraint,
            onChange: () => {
                if (!modStorage.chaosAura) modStorage.chaosAura = {};
                modStorage.chaosAura.ignoreItemsChangeIfNotRestraint = !modStorage.chaosAura.ignoreItemsChangeIfNotRestraint;
            }
        });

        this.createInputList({
            title: "Whitelist",
            x: 750,
            y: 360,
            value: [],
            width: 800,
            height: 550
        });

        this.createCard({
            name: "Triggers count",
            value: 0,
            anchor: "bottom-right",
            x: 80,
            y: 60,
            modules: {
                value: [
                    new CounterUpModule({ duration: 850, endValue: 100 })
                ]
            }
        })
    }

    exit(): void {
        super.exit();
        syncStorage();
    }
}