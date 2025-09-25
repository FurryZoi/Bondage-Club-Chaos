import { BaseModule, Context, ModuleTarget } from "zois-core/modules";


export class PaintTextModule extends BaseModule {
    constructor() {
        super();
    }
    effect(context: Context, target: ModuleTarget) {
        const text = context.element.textContent;
        context.element.innerHTML = `<div class="magic-reveal" id="magicText">
  <div class="magic-particle particle-1"></div>
  <div class="magic-particle particle-2"></div>
  <div class="magic-particle particle-3"></div>
  <div class="magic-particle particle-4"></div>
</div>`;
        const container = context.element;

        // Создаем буквы с анимацией
        text.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.className = 'letter';
            if (letter === " ") span.innerHTML = "&nbsp;";
            else span.textContent = letter;
            span.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(span);
        });

        // Добавляем пробелы
        const space = document.createElement('span');
        space.className = 'letter';
        space.innerHTML = '&nbsp;';
        space.style.animationDelay = '0.6s';
        container.appendChild(space)
        // return context;
    }
}