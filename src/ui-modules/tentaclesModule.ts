import { BaseModule, type Context, type ModuleTarget } from "zois-core/modules";


export class TentaclesModule extends BaseModule {
    public overrideProperties(context: Context, target: ModuleTarget): Context {
        context.element.style.overflow = "hidden";
        context.element.innerHTML += `<div class="tentacle-horror">
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
        return context;
    }
}