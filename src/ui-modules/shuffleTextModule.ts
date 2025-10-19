import { BaseModule, type Context, type ModuleTarget } from "zois-core/modules";

function shuffleString(str) {
    return str
        .split('')
        .sort(() => Math.random() - Math.random())
        .join('');
}

export class ShuffleTextModule extends BaseModule {
    public effect(context: Context, target: ModuleTarget): void {
        const id = setInterval(() => {
            try {
                target.textContent = shuffleString(target.textContent);
            } catch {
                clearInterval(id);
            }
        }, 1000);
    }
}