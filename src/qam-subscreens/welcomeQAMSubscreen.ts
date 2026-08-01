import { version } from "@/../package.json";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { addDynamicClass } from "zois-core/ui";
import { showChangelogModal } from "zois-core/changelogs";


export class WelcomeQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Welcome to QAM";
    public description: string = "";

    public load(container: HTMLDivElement) {
        super.load(container);

        const text = document.createElement("p");
        text.style.cssText = "margin: 0 auto; width: 95%; text-align: center; font-size: 1.45em;";
        text.textContent = "Report errors and visual bugs if you encounter them, this will help make QAM even more convenient and powerful";

        const flex = document.createElement("div");
        flex.style.cssText = "display: flex; gap: 6px; align-items: center; justify-content: center; margin: 1em;";

        const githubPageButton = document.createElement("a");
        githubPageButton.textContent = "Github Page";
        githubPageButton.href = "https://github.com/FurryZoi/Bondage-Club-Chaos";
        githubPageButton.target = "_blank";

        addDynamicClass(githubPageButton, {
            base: {
                padding: "0.45em",
                borderRadius: "6px",
                background: "rgb(227, 210, 255)",
                width: "fit-content",
                textDecoration: "none"
            },
            hover: {
                background: "rgb(209 181 255)"
            }
        });

        const changelogButton = document.createElement("button");
        changelogButton.textContent = "Changelog";
        changelogButton.addEventListener("click", showChangelogModal);
        addDynamicClass(changelogButton, {
            base: {
                border: "none",
                outline: "none",
                padding: "0.45em",
                borderRadius: "6px",
                background: "rgb(227, 210, 255)",
                width: "fit-content",
                textDecoration: "none"
            },
            hover: {
                background: "rgb(209 181 255)"
            }
        });

        flex.append(githubPageButton, changelogButton);

        container.append(text, flex);
    }
}