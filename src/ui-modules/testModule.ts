import { BaseModule, Context, ModuleTarget } from "zois-core/modules";

function shuffleString(str) {
    return str
        .split('')
        .sort(() => Math.random() - Math.random())
        .join('');
}

function change(
    element: ModuleTarget,
    duration: number,
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

interface TestModuleProps {
    duration: number
}

export class TestModule extends BaseModule {
    constructor(private props: TestModuleProps) {
        super();
    }
    effect(context: Context, target: ModuleTarget): void {
        change(target, this.props.duration);
    }
}