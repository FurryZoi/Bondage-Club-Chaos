import { atoms, MAGIC_ITEMS } from "@/modules/darkMagic";
import { BasePage, PageMarkup } from "./base";

export class BasicsPage extends BasePage {
    get name(): string {
        return "Basics";
    }

    public load(container: HTMLDivElement): void {
        super.load(container);

        const t1 = PageMarkup.text({
            content: "True magic is not witchcraft, it is <b>science</b>. The ultimate science that governs the fundamental forces of the universe.",
        });

        const t2 = PageMarkup.text({
            content: "The world around us, visible and invisible, is made up of countless <b>Magical Atoms</b> — primordial particles that are the source of all supernatural energy. A magician is not a shaman who invokes spirits, but an arcanist engineer who, by force of will and mind, gathers these atoms into complex structures — formulas that we call <b>spells</b>.",
        });

        const t3 = PageMarkup.text({
            content: "There are only few <b>atoms of magic</b> known:"
        });

        const atomsContainer = PageMarkup.flexContainer({
            direction: "column",
            gapY: "0.65em"
        });
        atomsContainer.style.marginTop = "0.5em";

        for (const atom of Object.values(atoms)) {
            const atomContainer = PageMarkup.flexContainer({
                gapX: "1em"
            });
            atomContainer.style.border = "2px solid var(--tmd-element, #d4d4d4)";
            atomContainer.style.padding = "0.25em";
            const a = PageMarkup.flexContainer({ direction: "column" });
            a.style.alignItems = "center";
            a.style.justifyContent = "center";
            a.append(
                PageMarkup.image({ source: atom.iconDataUrl, width: "2em", height: "2em" }),
                PageMarkup.text({ content: atom.name, fontSize: "sm" })
            );
            atomContainer.append(
                a,
                PageMarkup.text({ content: atom.description })
            );
            atomsContainer.append(atomContainer);
        }

        const t4 = PageMarkup.text({
            content: "Until you learn <b>wild magic</b>, you will have to hold a <b>magic item</b> in your hands in order to cast spells."
        });

        const t5 = PageMarkup.text({
            content: "Such items are: " + MAGIC_ITEMS.map((m) => AssetGet(Player.AssetFamily, "ItemHandheld", m)?.Description).filter((m) => typeof m === "string").join(", ") + "."
        });

        container.append(t1, t2, t3, atomsContainer, t4, t5);
    }
}