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

    public load(container: HTMLElement) {}

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

    protected buildSelect({
        onChange,
        options,
        currentOption
    }: {
        onChange: (value: string) => void,
        options: {
            name: string
            text: string
            icon?: SVGElement
        }[],
        currentOption: string
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

    protected buildCharacterSelect(onChange?: (value: Character) => void, currentCharacter: Character = Player) {
        // const icon = ;
        const select = this.buildSelect({
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
}