import { BaseModule, Context, ModuleTarget } from "zois-core/modules";

function shuffleString(str) {
    return str
        .split('')
        .sort(() => Math.random() - Math.random())
        .join('');
}

function change(
    element: ModuleTarget
): void {
    if (!element) {
        throw new Error('Element not found');
    }

    const oldTextContent = element.textContent;
    const oldFontFamily = element.style.fontFamily;

    element.style.fontFamily = "Kitnyx2";

    let startTime: number;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        let progress = Math.min(elapsed / duration, 1);
        // const currentValue = endValue.slice(0, parseInt(endValue.length * progress));
        // if (currentValue.trim() !== "") element.textContent = currentValue;

        element.textContent = shuffleString(element.textContent);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            element.textContent = oldTextContent;
            element.style.fontFamily = oldFontFamily;
            // setTimeout(() => element.classList.remove("zcCursor"), duration / endValue.length);
        }
    };

    animationFrameId = requestAnimationFrame(animate);
}


export class TentaclesModule extends BaseModule {
    constructor() {
        super();
    }
    overrideProperties(context: Context, target: ModuleTarget): Context {
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