import { BaseSubscreen } from "zois-core/ui";
import heartsIcon from "@/assets/game-icons/hearts.svg";
import { MainSubscreen } from "./mainSubscreen";
import { StyleModule } from "zois-core/ui-modules";
import { resetStorage } from "@/modules/storage";

export class ResetSettingsSubscreen extends BaseSubscreen {
    get name() {
        return "Reset Settings";
    }

    public load(): void {
        super.load();

        this.createText({
            text: "Caution!",
            x: 400,
            y: 240,
            width: 1200,
            modules: {
                base: [
                    new StyleModule({
                        textAlign: "center",
                        fontWeight: "bold"
                    })
                ]
            }
        });

        this.createText({
            text: "Are you sure you want to reset all your BCC settings to default?",
            x: 400,
            y: 350,
            width: 1200,
            modules: {
                base: [
                    new StyleModule({
                        textAlign: "center"
                    })
                ]
            }
        });

        this.createText({
            text: "This action cannot be undone!",
            x: 400,
            y: 460,
            width: 1200,
            modules: {
                base: [
                    new StyleModule({
                        textAlign: "center"
                    })
                ]
            }
        });

        this.createButton({
            text: "Confirm",
            x: 750,
            y: 700,
            width: 500,
            padding: 2,
            onClick: () => {
                resetStorage();
                this.exit();
            }
        });
    }

    public exit(): void {
        super.exit();
        this.setSubscreen(new MainSubscreen());
    }
}