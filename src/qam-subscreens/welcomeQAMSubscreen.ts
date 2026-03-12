import { version } from "@/../package.json";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { addDynamicClass } from "zois-core/ui";


export class WelcomeQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Welcome to QAM";
    // public description: string = "Teleport to certain character on map";

    public load(container: HTMLDivElement) {
        super.load(container);

        const text = document.createElement("p");
        text.style.cssText = "margin: 0 auto; width: 95%; text-align: center; font-size: 1.45em;";
        text.textContent = "Report errors and visual bugs if you encounter them, this will help make QAM even more convenient and powerful";

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
                margin: "1em auto",
                textDecoration: "none"
            },
            hover: {
                background: "rgb(209 181 255)"
            }
        });

        const changelog = document.createElement("div");
        changelog.classList.add("bccChangelog");
        changelog.innerHTML = `<p>-- BCC v${version} -- Changes:</p><br><ul><li>Fixed "slumber curse" effect</li><li>Fixed crashes in chat room and crafting screen</li><li>More integration with Themed</li><li>Fixed some spell state icons not rendering correctly</li><li>Fixed visual bugs</li><li>[NEW] Aura Of Chaos's magic cast trigger with LSCG integration</li><li>Adapt R126</li><li>Significantly improved "Traditio Artium" effect</li><li>[NEW] "Spell Casting" page in Tome Of Knowledge</li></ul>`;

        container.append(text, githubPageButton, changelog);
    }
}