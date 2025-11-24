import { CastSpellMessageDto } from "@/dto/castSpellMessageDto";
import { getSpellIcon, addDefaultParametersIfNeeds, getSpellEffect, isMagicItem, allowSpellCast, castSpell } from "@/modules/darkMagic";
import { modStorage, ModStorage } from "@/modules/storage";
import { toastsManager } from "zois-core/popups";
import { validateData } from "zois-core/validation";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class CastSpellQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Cast Spell";
    public description: string = "Cast dark magic spell";

    public load(container: HTMLDivElement) {
        super.load(container);

        if ((modStorage.darkMagic?.spells ?? []).length === 0) {
            const message = document.createElement("p");
            message.style.cssText = "margin: 1.65em auto; font-weight: bold;";
            message.textContent = "You don't have any spells to cast";
            container.append(message);
            return;
        }

        function dataURLToSVGElement(dataURL) {
            const svgEncoded = dataURL.replace('data:image/svg+xml,', '');
            const svgString = decodeURIComponent(svgEncoded);
            const div = document.createElement('div');
            div.innerHTML = svgString;
            return div.firstElementChild as SVGElement;
        }

        let target: Character = Player;
        let spell: ModStorage["darkMagic"]["spells"][0] = JSON.parse(JSON.stringify(modStorage.darkMagic.spells[0]));

        const select = this.buildCharacterSelect((_target) => {
            target = _target;
        });

        const _select = this.buildSelect({
            options: modStorage.darkMagic?.spells?.map((s) => ({ name: s.name, text: s.name, icon: dataURLToSVGElement(getSpellIcon(s.icon).dataurl) })),
            currentOption: modStorage.darkMagic?.spells?.[0]?.name,
            onChange: (value) => {
                spell = JSON.parse(JSON.stringify(modStorage.darkMagic.spells.find((s) => s.name === value)));
                addDefaultParametersIfNeeds(spell);
                this.refreshParamtersContainer(paramters, spell);
            }
        });

        const paramters = document.createElement("div");
        paramters.style.cssText = "display: flex; flex-direction: column; row-gap: 0.5em; border: 3px dashed #dcccffff; border-radius: 4px; padding: 0.5em 0; margin: 0.5em auto; width: 90%;";

        const btn = this.buildButton("Cast Spell");
        btn.addEventListener("click", async () => {
            if (!spell) return;
            if (!Player.CanInteract()) {
                return toastsManager.error({ message: "You can't interact", duration: 3000 });
            }
            if (!isMagicItem(InventoryGet(Player, "ItemHandheld"))) {
                return toastsManager.error({
                    message: "You should hold magic item in your hand to cast spells",
                    duration: 5000
                });
            }
            const allow = allowSpellCast(Player, target, spell);
            if (allow.result === false) {
                return toastsManager.error({
                    title: "Can't cast this spell",
                    message: allow.reason,
                    duration: 5000
                });
            }
            const { isValid } = await validateData({
                spell
            }, CastSpellMessageDto);

            if (!isValid) {
                return toastsManager.error({
                    title: "Spell validation failed",
                    message: "Check spell's settings and make sure that everything is specified correctly",
                    duration: 5000
                });
            }

            castSpell(target, spell);
        });

        this.refreshParamtersContainer(paramters, spell);

        container.append(select, _select, paramters, btn);
    }

    private refreshParamtersContainer(paramters: HTMLDivElement, spell: ModStorage["darkMagic"]["spells"][0]) {
        paramters.innerHTML = "";
        const title = document.createElement("p");
        title.style.cssText = "margin: 0.65em auto; width: 90%; font-weight: bold; font-size: 0.85em; color: #9977d0;";
        title.textContent = "Parameters";
        paramters.append(title);

        for (const c of spell.effects.split("")) {
            const effect = getSpellEffect(c.charCodeAt(0));
            if (effect.parameters.length === 0) continue;
            const effectName = document.createElement("p");
            effectName.style.cssText = "margin: 0.6em auto 0 auto; width: 90%;";
            effectName.textContent = effect.name;
            paramters.append(effectName);
            for (const parameter of effect.parameters) {
                const value = spell.data?.[c]?.[parameter.name];
                switch (parameter.type) {
                    case "boolean": {
                        const checkbox = document.createElement("label");
                        checkbox.style.cssText = "margin: auto; width: 90%;"
                        const input = document.createElement("input");
                        input.type = "checkbox";
                        if (typeof value === "boolean") input.checked = value;
                        input.addEventListener("change", () => {
                            spell.data[c][parameter.name] = input.checked;
                        });
                        checkbox.append(input, parameter.label);
                        paramters.append(checkbox);
                        break;
                    }
                    case "choice":
                        paramters.append(
                            this.buildSelect({
                                options: parameter.options,
                                currentOption: parameter.options.find((o) => o.name === value)?.name ?? parameter.options[0].name,
                                onChange: (_value) => {
                                    spell.data[c][parameter.name] = _value;
                                }
                            })
                        );
                        break;
                    case "number": {
                        const input = this.buildInput(parameter.label);
                        input.type = "number";
                        if (typeof value === "number") input.value = value.toString();
                        if (parameter.min) input.min = parameter.min.toString();
                        if (parameter.min) input.max = parameter.max.toString();
                        input.addEventListener("input", () => {
                            spell.data[c][parameter.name] = parseInt(input.value, 10);
                        });
                        paramters.append(input);
                        break;
                    }
                    case "text": {
                        const input = this.buildInput(parameter.label);
                        if (typeof value === "string") input.value = value;
                        input.addEventListener("input", () => {
                            spell.data[c][parameter.name] = input.value;
                        });
                        paramters.append(input);
                        break;
                    }
                }
            }
        }

        if (paramters.children.length === 1) paramters.style.display = "none";
        else paramters.style.display = "flex";
    }
}