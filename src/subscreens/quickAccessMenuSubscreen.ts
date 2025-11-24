import { BaseSubscreen } from "zois-core/ui";
import { createElement, PanelsTopLeft } from "lucide";
import { modStorage } from "@/modules/storage";
import { createQAMButton, isFeatureEnabled, qamFeatures, removeQuickMenu, toggleFeature } from "@/modules/quickAccessMenu";
import { StyleModule } from "zois-core/ui-modules";
import qamImage from "@/assets/images/qam.png";
import { MainSubscreen } from "./mainSubscreen";

export class QuickAccessMenuSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(PanelsTopLeft);
    }

    get name() {
        return "Quick Access Menu";
    }

    public load(): void {
        super.load();

        this.createCheckbox({
            isChecked: modStorage.qam?.enabled,
            text: "Enabled",
            x: 200,
            y: 200,
            onChange() {
                modStorage.qam ??= {};
                modStorage.qam.enabled = !modStorage.qam.enabled;
                if (modStorage.qam.enabled) createQAMButton();
                else removeQuickMenu();
            }
        });

        this.createImage({
            x: 200,
            y: 300,
            src: qamImage,
            width: 350,
            modules: {
                base: [
                    new StyleModule({
                        border: "2px solid var(--tmd-accent, #e4e4e4)"
                    })
                ]
            }
        });

        this.createText({
            x: 580,
            y: 300,
            width: 600,
            withBorder: true,
            text: `You can forget about the text commands. Any actions are performed through the "Quick Access Menu" (QAM).<br>Most of the functions and mechanics are located there.<br>The button to open the menu remembers its last position (Linked to the device and not to the account)`,
            padding: 2
        });

        this.createText({
            text: "Features",
            x: 1300,
            y: 200
        });

        const container = this.createScrollView({
            x: 1300,
            y: 280,
            width: 600,
            height: 620,
            scroll: "y",
            modules: {
                base: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.45em",
                    })
                ]
            }
        });

        qamFeatures.forEach((i) => {
            container.append(
                this.createCheckbox({
                    text: i.subscreen.name,
                    isChecked: isFeatureEnabled(i.id),
                    place: false,
                    onChange: () => toggleFeature(i.id)
                })
            );
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}