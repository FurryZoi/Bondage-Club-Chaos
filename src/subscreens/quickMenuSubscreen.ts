import { BaseSubscreen } from "zois-core/ui";
import { createElement, PanelsTopLeft, SendToBack, Shell, Skull } from "lucide";
import { modStorage } from "@/modules/storage";
import { createQuickMenu, isFeatureEnabled, quickMenuItems, removeQuickMenu, toggleFeature } from "@/modules/quickMenu";
import { StyleModule } from "zois-core/ui-modules";

export class QuickMenuSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(PanelsTopLeft);
    }

    get name() {
        return "Quick Menu";
    }

    load(): void {
        super.load();

        this.createCheckbox({
            isChecked: modStorage.quickMenu?.enabled,
            text: "Enabled",
            x: 220,
            y: 200,
            onChange() {
                modStorage.quickMenu ??= {};
                modStorage.quickMenu.enabled = !modStorage.quickMenu.enabled;
                if (modStorage.quickMenu.enabled) createQuickMenu();
                else removeQuickMenu();
            }
        });


        this.createText({
            text: "Features",
            x: 1200,
            y: 200
        });

        const container = this.createScrollView({
            x: 1200,
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

        quickMenuItems.forEach((i) => {
            container.append(
                this.createCheckbox({
                    text: i.name,
                    isChecked: isFeatureEnabled(i.id),
                    place: false,
                    onChange: () => toggleFeature(i.id)
                })
            );
        });
    }

    exit(): void {
        super.exit();
    }
}