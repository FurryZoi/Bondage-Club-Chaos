import { modStorage, syncStorage } from "@/modules/storage";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class AuraOfChaosQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Aura Of Chaos";
    public description: string = "Aura Of Chaos settings";

    public load(container: HTMLDivElement) {
        super.load(container);

        const stateCheckbox = this.buildCheckbox("Enabled", modStorage.chaosAura?.enabled, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.enabled = isChecked;
            syncStorage();
        });

        const retributionCheckbox = this.buildCheckbox("Retribution", modStorage.chaosAura?.retribution, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.retribution = isChecked;
            syncStorage();
        });

        const triggersText = this.buildText("Triggers:");

        const clothesTriggerCheckbox = this.buildCheckbox("Clothes Change", modStorage.chaosAura?.triggers?.clothesChange, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.triggers ??= {};
            modStorage.chaosAura.triggers.clothesChange = isChecked;
            syncStorage();
        });

        const itemsTriggerCheckbox = this.buildCheckbox("Items Change", modStorage.chaosAura?.triggers?.itemsChange, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.triggers ??= {};
            modStorage.chaosAura.triggers.itemsChange = isChecked;
            syncStorage();
        });

        const poseTriggerCheckbox = this.buildCheckbox("Pose Change", modStorage.chaosAura?.triggers?.poseChange, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.triggers ??= {};
            modStorage.chaosAura.triggers.poseChange = isChecked;
            syncStorage();
        });

        const magicTriggerCheckbox = this.buildCheckbox("Magic Cast", modStorage.chaosAura?.triggers?.magicCast, (isChecked) => {
            modStorage.chaosAura ??= {};
            modStorage.chaosAura.triggers ??= {};
            modStorage.chaosAura.triggers.magicCast = isChecked;
            syncStorage();
        });

        container.append(stateCheckbox, retributionCheckbox, triggersText, clothesTriggerCheckbox, itemsTriggerCheckbox, poseTriggerCheckbox, magicTriggerCheckbox);
    }
}