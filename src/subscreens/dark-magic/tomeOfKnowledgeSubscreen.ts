import { BaseSubscreen } from "zois-core/ui";
import { createElement, SendToBack, Shell } from "lucide";
import { spellEffects } from "@/modules/darkMagic";
import { StyleModule } from "zois-core/ui-modules";


function applyPapyrusTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Базовый цвет папируса с градиентом
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f4e9');
    gradient.addColorStop(0.5, '#f0e6d2');
    gradient.addColorStop(1, '#e8d8ba');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Добавляем шум и неравномерность цвета
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Добавляем зернистость
        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.min(255, Math.max(200, data[i] + noise)); // R
        data[i + 1] = Math.min(255, Math.max(190, data[i + 1] + noise * 0.8)); // G
        data[i + 2] = Math.min(255, Math.max(180, data[i + 2] + noise * 0.6)); // B

        // Добавляем желтизну старения
        if (i % 16 === 0) {
            data[i] = Math.min(255, data[i] + 5);
            data[i + 1] = Math.min(255, data[i + 1] + 3);
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Рисуем волокна папируса
    ctx.strokeStyle = 'rgba(221, 206, 169, 0.15)';
    ctx.lineWidth = 0.8;

    // Горизонтальные волокна
    for (let i = 0; i < height; i += 3) {
        const variation = (Math.random() - 0.5) * 4;
        ctx.beginPath();
        ctx.moveTo(0, i + variation);
        ctx.lineTo(width, i + variation);
        ctx.stroke();
    }

    // Вертикальные неровности
    ctx.strokeStyle = 'rgba(190, 170, 140, 0.1)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const curve = (Math.random() - 0.5) * 15;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(
            x + curve, height * 0.3,
            x - curve, height * 0.6,
            x, height
        );
        ctx.stroke();
    }

    // Добавляем пятна старения
    ctx.fillStyle = 'rgba(210, 190, 160, 0.08)';
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 60 + 20;

        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
}


export class TomeOfKnowledgeSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(SendToBack);
    }

    get name() {
        return "Tome of Knowledge";
    }

    load(): void {
        super.load();

        this.createText({
            text: "Basics",
            x: 200,
            y: 200,
            width: 1600,
            modules: {
                base: [
                    new StyleModule({
                        borderBottom: "1px solid var(--tmd-accent, gray)",
                        paddingBottom: "5px"
                    })
                ]
            }
        });

        this.createText({
            text: "True magic is not witchcraft, it is science. The ultimate science that governs the fundamental forces of the universe.",
            x: 200,
            y: 265,
            width: 1600,
        });

        // this.createText({
        //     text: "Magic consists of particles of magic - atoms.",
        //     x: 200,
        //     y: 350,
        //     width: 1600,
        // });

        this.createText({
            text: "The world around us, visible and invisible, is made up of countless Magical Atoms — primordial particles that are the source of all supernatural energy. A magician is not a shaman who invokes spirits, but an arcanist engineer who, by force of will and mind, gathers these atoms into complex structures — formulas that we call spells.",
            x: 200,
            y: 365,
            width: 1600,
        });
    }
}