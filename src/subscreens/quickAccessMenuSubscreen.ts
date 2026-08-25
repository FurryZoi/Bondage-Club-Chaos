import { BaseSubscreen } from "zois-core/ui";
import { createElement, PanelsTopLeft } from "lucide";
import { modStorage } from "@/modules/storage";
import { createQAMButton, isFeatureEnabled, qamFeatures, removeQuickMenu, toggleFeature } from "@/modules/quickAccessMenu";
import { StyleModule } from "zois-core/shard-modules";
import qamImage from "@/assets/images/qam.png";
import { MainSubscreen } from "./mainSubscreen";

export class QuickAccessMenuSubscreen extends BaseSubscreen {
    public get icon(): SVGElement {
        return createElement(PanelsTopLeft);
    }

    public override get name() {
        return "Quick Access Menu";
    }

    public override load(): void {
        super.load();

        this.createCheckbox({
            isChecked: !!modStorage.qam?.enabled,
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
            width: 500,
            modules: {
                base: [
                    new StyleModule({
                        border: "2px solid var(--tmd-accent, #e4e4e4)"
                    })
                ]
            }
        });

        this.createText({
            x: 200,
            y: 580,
            width: 1000,
            height: 345,
            withBorder: true,
            text: `<b>Quick Access Menu</b> or <b>QAM</b><br><br>Interactive, draggable utility overlay that lets you to perform many actions on fly instead of navigating through complex submenus or using chat commands.<br>Most of the functions and mechanics are located there.<br>The button to open the menu remembers its last position (Linked to the device and not to the account)`,
            padding: 2
        });

        this.createText({
            text: "Features",
            x: 1300,
            y: 200
        });

        const container = this.createContainer({
            x: 1300,
            y: 280,
            width: 600,
            height: 620,
            scroll: "y",
            modules: {
                content: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.45em",
                    })
                ]
            }
        });

        qamFeatures.forEach((i) => {
            this.createCheckbox({
                text: i.subscreen.name,
                isChecked: isFeatureEnabled(i.id),
                parent: container,
                onChange: () => toggleFeature(i.id)
            })
        });
    }

    public override exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}