import { BasePage, PageMarkup } from "./base";
import limitsImage from "@/assets/images/limits.png";
import qamCastSpellImage from "@/assets/images/qam-cast-spell.png";
import characterStateIconsImage from "@/assets/images/character-state-icons.png";


export class SpellCastingPage extends BasePage {
    get name(): string {
        return "Spell Casting";
    }

    public load(container: HTMLDivElement): void {
        super.load(container);

        const t1 = PageMarkup.text({
            content: "Spell casting is the process of using your magical abilities to cast spells.",
        });

        const t2 = PageMarkup.text({
            content: "First of all, you need to enable <a href='zc://open?mod=BCC&subscreen=QuickAccessMenuSubscreen'>Quick Access Menu</a> through which magic is cast.",
        });

        const img = PageMarkup.image({
            source: qamCastSpellImage,
            width: "50%",
            height: "auto"
        });
        img.style.marginTop = "0.35em";

        const t3 = PageMarkup.text({
            content: "Select an already created spell and the target character from the drop-down list."
        });

        const img2 = PageMarkup.image({
            source: characterStateIconsImage,
            width: "25%",
            height: "auto"
        });
        img2.style.marginTop = "0.35em";

        const t4 = PageMarkup.text({
            content: "Hover your mouse over the spell icon to see more detailed information."
        });

        const t5 = PageMarkup.text({
            content: "<b>To be continued</b>",
            fontSize: "lg"
        });

        container.append(t1, t2, img, t3, img2, t4, t5);
    }
}