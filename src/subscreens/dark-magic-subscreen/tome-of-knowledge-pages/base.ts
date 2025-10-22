/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import { addDynamicClass } from "zois-core/ui";

export abstract class BasePage {
    get name(): string {
        return null;
    }

    public load(_container: HTMLDivElement): void { }
}

export class PageMarkup {
    static text({ content, fontSize = "md" }: { content: string, fontSize?: "sm" | "md" | "lg" }) {
        const p = document.createElement("p");
        p.innerHTML = content;
        addDynamicClass(p, {
            base: {
                color: "var(--tmd-text, black)",
                fontSize: fontSize === "sm" ? "0.5em" : fontSize === "md" ? "1.2em" : "1.8em",
                fontFamily: "Yusei Magic",
                marginTop: "0.25em"
            }
        });
        return p;
    }

    static flexContainer({
        direction = "row",
        gapX = "0",
        gapY = "0",
        wrap = "nowrap",
    }: {
        direction?: "column" | "row"
        gapX?: string
        gapY?: string
        wrap?: "balance" | "wrap" | "wrap-reverse" | "nowrap"
    } = {}) {
        const container = document.createElement("div");
        addDynamicClass(container, {
            base: {
                display: "flex",
                flexDirection: direction,
                columnGap: gapX,
                rowGap: gapY,
                flexWrap: wrap
            }
        });
        return container;
    }

    static image({
        source,
        width,
        height
    }: {
        source: string
        width: string
        height: string
    }) {
        const img = document.createElement("img");
        img.src = source;
        img.style.width = width;
        img.style.height = height;
        return img;
    }
}