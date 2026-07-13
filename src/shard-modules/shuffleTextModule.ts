import { ShardModule, type ShardModuleTarget } from "zois-core/shard-modules";
import type { ShardContext } from "zois-core/shards";

function shuffleString(str) {
    return str
        .split('')
        .sort(() => Math.random() - Math.random())
        .join('');
}

export class ShuffleTextModule extends ShardModule {
    override effect(_context: ShardContext, target: ShardModuleTarget): void {
        const id = setInterval(() => {
            try {
                target.textContent = shuffleString(target.textContent);
            } catch {
                clearInterval(id);
            }
        }, 1000);
    }
}