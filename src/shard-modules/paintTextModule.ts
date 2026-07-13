import { ShardModule, type ShardModuleTarget } from "zois-core/shard-modules";
import type { ShardContext } from "zois-core/shards";


export class PaintTextModule extends ShardModule {
    constructor(private readonly animation: boolean = true) {
        super();
    }

    override effect(_context: ShardContext, target: ShardModuleTarget) {
        const text = target.textContent;
        const container = target;
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