import { BaseModule, type Context } from "zois-core/modules";


export class PaintTextModule extends BaseModule {
    constructor(private readonly animation: boolean = true) {
        super();
    }

    public effect(context: Context) {
        const text = context.element.textContent;
        const container = context.element;
        container.innerHTML = "";

        text.split('').forEach((letter, index) => {
            const span = document.createElement("span");
            if (this.animation) span.className = "letter";
            else {
                span.style.fontFamily = "Finger Paint";
                span.style.textShadow = "0.045em 0.045em 0 var(--tmd-text, black), -0.045em -0.045em 0 var(--tmd-accent, #6600da), 0.045em -0.045em 0 var(--tmd-text, black), -0.045em 0.045em 0 var(--tmd-accent, #6600da)";
            }
            if (letter === " ") span.innerHTML = "&nbsp;";
            else span.textContent = letter;
            if (this.animation) {
                span.style.animationDelay = `${index * 0.05}s`;
            } else {
                span.style.animation = "";
            }
            container.appendChild(span);
        });

        const space = document.createElement("span");
        space.className = "letter";
        space.innerHTML = "&nbsp;";
        space.style.animationDelay = "0.6s";
        container.appendChild(space)
    }
}