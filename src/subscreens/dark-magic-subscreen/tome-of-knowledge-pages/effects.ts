import { BasePage, PageMarkup } from "./base";
import limitsImage from "@/assets/images/limits.png";
import spellEditorMainImage from "@/assets/images/spell-editor-main.png";
import spellEditorEffectsImage from "@/assets/images/spell-editor-effects.png";


export class EffectsPage extends BasePage {
    get name(): string {
        return "Effects";
    }

    public load(container: HTMLDivElement): void {
        super.load(container);

        const t1 = PageMarkup.text({
            content: "Effects are constructor from which you can create your spells.",
        });

        const img = PageMarkup.image({
            source: limitsImage,
            width: "60%",
            height: "auto"
        });
        img.style.marginTop = "0.25em";

        const t2 = PageMarkup.text({
            content: `In the <b>Limits</b> section, you can limit the use of spells with certain effects.`
        });

        const imagesContainer = PageMarkup.flexContainer({ gapX: "0.5em" });
        imagesContainer.style.marginTop = "0.5em";
        imagesContainer.append(
            PageMarkup.image({
                source: spellEditorMainImage,
                width: "45%",
                height: "auto"
            }),
            PageMarkup.image({
                source: spellEditorEffectsImage,
                width: "45%",
                height: "auto"
            })
        );

        const t3 = PageMarkup.text({
            content: "In the spell editor, you can specify the icon, name, and effects of your spell. There are also descriptions of each effect and which atoms they consist of."
        });

        const t4 = PageMarkup.text({
            content: "Spells can only be edited by their creators. That is, if someone gives you a spell, you won't be able to edit it."
        });

        const t5 = PageMarkup.text({
            content: "<b>To be continued</b>",
            fontSize: "lg"
        });

        container.append(t1, img, t2, imagesContainer, t3, t4, t5);
    }
}