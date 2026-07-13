import { ShardModule, type ShardModuleTarget } from "zois-core/shard-modules";
import type { ShardContext } from "zois-core/shards";


export class TentaclesModule extends ShardModule {
    override layoutEffect(_context: ShardContext, target: ShardModuleTarget) {
        target.style.overflow = "hidden";
        target.innerHTML += `<div class="tentacle-horror">
        <div class="tentacle">
        <div class="tentacle-detail detail-1"></div>
        <div class="tentacle-detail detail-2"></div>
        </div>
        <div class="tentacle">
        <div class="tentacle-detail detail-1"></div>
        </div>
        <div class="tentacle">
        <div class="tentacle-detail detail-2"></div>
        </div>
        <div class="tentacle">
        <div class="tentacle-detail detail-1"></div>
        <div class="tentacle-detail detail-2"></div>
        </div>
        <div class="tentacle-particle particle-1"></div>
        <div class="tentacle-particle particle-2"></div>
        <div class="tentacle-particle particle-3"></div>
        <div class="tentacle-slime"></div>
    </div>`;
    }
}