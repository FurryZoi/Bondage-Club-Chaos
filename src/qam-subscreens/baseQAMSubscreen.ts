import { qamFeatures } from "@/modules/quickAccessMenu";
import { Check, ChevronDown, createElement, Target, type IconNode } from "lucide";
import { getPlayer } from "zois-core";
import { addDynamicClass } from "zois-core/ui";


export abstract class BaseQAMSubscreen {
    public name: string;
    public description?: string;

    public isFeatureSubscreen(): boolean {
        return !!qamFeatures.find((f) => f.subscreen.constructor.name === this.constructor.name);
    }

    public load(container: HTMLDivElement) { }

    protected buildButton(text: string) {
        const btn = document.createElement("button");
        addDynamicClass(btn, {
            base: {
                cursor: "pointer",
                border: "none",
                padding: "0.65em",
                margin: "0.25em 1em",
                background: "#7e00ff",
                borderRadius: "4px",
                color: "white"
            },
            hover: {
                background: "rgb(143, 82, 255)"
            }
        });
        btn.textContent = text;
        return btn;
    }

    protected buildText(text: string) {
        const p = document.createElement("p");
        addDynamicClass(p, {
            base: {
                padding: "0.65em",
                marginTop: "0.25em",
                color: "black",
                fontSize: "1.25em"
            }
        });
        p.textContent = text;
        return p;
    }

    protected buildDropdown<T extends string>({
        onChange,
        options,
        currentOption = options[0]?.name
    }: {
        onChange: (value: T) => void,
        options: {
            name: T
            text: string
            icon?: SVGElement
        }[],
        currentOption?: T
    }) {
        let isOpened = false;
        let optionsContainer: HTMLDivElement;

        const select = document.createElement("div");
        select.classList.add("bccQAMSelect");
        select.style.margin = "0.25em 1em";
        select.style.position = "relative";
        select.setAttribute("opened", false);
        select.addEventListener("click", () => {
            if (options.length === 0) return;
            if (isOpened) {
                isOpened = false;
                select.style.zIndex = "10";
                optionsContainer.remove();
            } else {
                isOpened = true;
                select.style.zIndex = "100";
                optionsContainer = document.createElement("div");
                optionsContainer.setAttribute(
                    "data-position",
                    select.offsetTop > (window.innerHeight / 2 - select.offsetHeight / 2) ? "top" : "bottom"
                );
                options.forEach((option) => {
                    const e = document.createElement("div");
                    e.style.cssText = "display: flex; align-items: center; column-gap: 0.5em;";
                    if (option.icon) {
                        option.icon.style.cssText = "color: #bcbcbc;";
                        e.append(option.icon);
                    }
                    e.append(option.text);
                    if (option.name === currentOption) {
                        e.append(checkmark);
                    }
                    e.addEventListener("click", () => {
                        currentOption = option.name;
                        p.textContent = option.text;
                        optionsContainer.remove();
                        if (onChange) onChange(option.name);
                    });
                    optionsContainer.append(e);
                });
                select.append(optionsContainer);
            }
        });

        const p = document.createElement("p");
        p.style.paddingRight = "2em";
        if (options.length === 0) {
            p.textContent = "No options";
        } else {
            p.textContent = options.find((option) => option.name === currentOption)?.text ?? "Unknown";
        }

        const arrow = createElement(ChevronDown);
        const checkmark = createElement(Check);
        checkmark.style.cssText = "position: absolute; right: 0.25em;";

        select.append(p, arrow);
        return select;
    }

    protected buildDynamicDropdown<T>({
        onChange,
        options
    }: {
        onChange: (value: T) => void,
        options: () => {
            text: string
            returnValue: T
            icon?: SVGElement
        }[]
    }) {
        let isOpened = false;
        let optionsContainer: HTMLDivElement;

        const select = document.createElement("div");
        select.classList.add("bccQAMSelect");
        select.style.margin = "0.25em 1em";
        select.style.position = "relative";
        select.setAttribute("opened", false);
        select.addEventListener("click", () => {
            if (options().length === 0) return;
            if (isOpened) {
                isOpened = false;
                select.style.zIndex = "10";
                optionsContainer.remove();
            } else {
                isOpened = true;
                select.style.zIndex = "100";
                optionsContainer = document.createElement("div");
                optionsContainer.setAttribute(
                    "data-position",
                    select.offsetTop > (window.innerHeight / 2 - select.offsetHeight / 2) ? "top" : "bottom"
                );
                options().forEach((option) => {
                    const e = document.createElement("div");
                    e.style.cssText = "display: flex; align-items: center; column-gap: 0.5em;";
                    if (option.icon) {
                        option.icon.style.cssText = "color: #bcbcbc;";
                        e.append(option.icon);
                    }
                    e.append(option.text);
                    // if (option.name === currentOption) {
                    //     e.append(checkmark);
                    // }
                    e.addEventListener("click", () => {
                        // currentOption = option.name;
                        p.textContent = option.text;
                        optionsContainer.remove();
                        if (onChange) onChange(option.returnValue);
                    });
                    optionsContainer.append(e);
                });
                select.append(optionsContainer);
            }
        });

        const p = document.createElement("p");
        p.style.paddingRight = "2em";
        if (options().length === 0) {
            p.textContent = "No options";
        } else {
            p.textContent = options()[0].text;
        }

        const arrow = createElement(ChevronDown);
        const checkmark = createElement(Check);
        checkmark.style.cssText = "position: absolute; right: 0.25em;";

        select.append(p, arrow);
        return select;
    }

    protected buildCharacterSelect(onChange?: (char: Character) => void, currentCharacter: Character = Player) {
        const select = this.buildDropdown({
            onChange: (value) => {
                const target = getPlayer(parseInt(value, 10));
                if (onChange && target) onChange(target);
            },
            options: (ChatRoomCharacter.length === 0 ? [Player] : ChatRoomCharacter)
                .map((c) => {
                    return {
                        name: c.MemberNumber.toString(),
                        text: c.Name + `(${c.MemberNumber})`,
                        icon: createElement(Target, { stroke: "red" })
                    };
                }),
            currentOption: currentCharacter.MemberNumber.toString()
        });
        return select;
    }

    protected buildInput(placeholder: string) {
        const input = document.createElement("input");
        input.style.cssText = "border: none; background: #ebebeb; padding: 0.65em; margin: 0.25em 1em; border-radius: 5px;";
        input.placeholder = placeholder;
        return input;
    }

    protected buildCheckbox(labelText: string, isChecked: boolean, onChange: (isChecked: boolean) => void) {
        const checkbox = document.createElement("div");
        checkbox.style.cssText = "display: flex; align-items: center; column-gap: 4px; margin: 0.25em 1em;";

        const input = document.createElement("input");
        input.style.cssText = "width: 1.5em; aspect-ratio: 1/1; cursor: pointer;";
        input.type = "checkbox";
        input.checked = isChecked;
        input.addEventListener("change", () => {
            onChange(input.checked);
        });

        const label = document.createElement("p");
        label.style.cssText = "font-size: 1.25em;";
        label.textContent = labelText;

        checkbox.append(input, label);
        return checkbox;
    }
}