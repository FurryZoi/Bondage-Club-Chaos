import { BaseSubscreen } from "zois-core/ui";
import { type Effect, spellEffects } from "@/modules/darkMagic";
import { AttributesModule } from "zois-core/ui-modules";
import { SpellEditorSubscreen } from "./spellEditorSubscreen";
import type { ModStorage } from "@/modules/storage";

export class EffectSettingsSubscreen extends BaseSubscreen {
    get name() {
        return `Spell Editor > ${spellEffects[this.effectId].name}'s Settings`;
    }

    constructor(private readonly effectId: Effect, private spellSettings: ModStorage["darkMagic"]["spells"][0]) {
        super();
        this.spellSettings = JSON.parse(JSON.stringify(this.spellSettings));
    }

    private setParameter(name: string, value: unknown): void {
        this.spellSettings.data[String.fromCharCode(this.effectId)] ??= {};
        this.spellSettings.data[String.fromCharCode(this.effectId)][name] = value;
    }

    private getParameterValue<T>(name: string): T {
        this.spellSettings.data[String.fromCharCode(this.effectId)] ??= {};
        return this.spellSettings.data[String.fromCharCode(this.effectId)][name] as T;
    }

    public load(): void {
        super.load();

        // Should not be called, but just in case
        if (spellEffects[this.effectId].parameters.length === 0) {
            this.exit();
            return;
        }

        let y = 200;
        for (const param of spellEffects[this.effectId].parameters) {
            switch (param.type) {
                case "text": {
                    const textInput = this.createInput({
                        x: 200,
                        y,
                        value: this.getParameterValue(param.name),
                        placeholder: param.label,
                        width: 800,
                        padding: 2,
                        onChange: () => {
                            this.setParameter(param.name, textInput.value);
                        },
                    });
                    y += 100;
                    break;
                }
                case "number": {
                    const numberInput = this.createInput({
                        x: 200,
                        y,
                        value: this.getParameterValue(param.name),
                        placeholder: param.label,
                        width: 800,
                        padding: 2,
                        modules: {
                            base: [
                                new AttributesModule({
                                    type: "number"
                                })
                            ]
                        },
                        onChange: () => {
                            this.setParameter(param.name, numberInput.value);
                        },
                    });
                    y += 100;
                    break;
                }
                case "boolean":
                    this.createCheckbox({
                        text: param.label,
                        x: 200,
                        y,
                        isChecked: this.getParameterValue(param.name) ?? false,
                        onChange: () => {
                            this.setParameter(param.name, !(this.getParameterValue<boolean>(param.name) ?? false));
                        },
                    });
                    y += 100;
                    break;
                case "choice":
                    this.createSelect({
                        x: 200,
                        y,
                        options: param.options,
                        currentOption: this.getParameterValue(param.name) ?? param.options[0].name,
                        width: 800,
                        onChange: (name) => {
                            this.setParameter(param.name, name);
                        },
                    });
                    y += 100;
                    break;
            }
        }
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(
            new SpellEditorSubscreen(this.spellSettings, "Effects")
        );
    }
}