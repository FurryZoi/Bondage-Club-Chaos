import { modStorage, type ModStorage } from "@/modules/storage";
import type { DeepRequired } from "@/types/utilities";
import { StyleModule } from "zois-core/shard-modules";
import { BaseSubscreen } from "zois-core/ui";
import strugglingMinigamesImage from "@/assets/images/struggling-minigames.png";



const minigamesCheats: {
    name: string
    storageKey: keyof DeepRequired<ModStorage>["cheats"]["skipMinigames"]
}[] = [
        {
            name: "Dexterity",
            storageKey: "dexterity"
        },
        {
            name: "Flexibility",
            storageKey: "flexibility"
        },
        {
            name: "Lock Pick",
            storageKey: "lockPick"
        },
        {
            name: "Loosen",
            storageKey: "loosen"
        },
        {
            name: "Strength",
            storageKey: "strength"
        }
    ];

export class CheatsMinigamesSubscreen extends BaseSubscreen {
    public override get name(): string {
        return "Minigames";
    }

    public override load(): void {
        super.load();

        this.createText({
            text: "Minigames to cheat skip:",
            x: 90,
            y: 200,
        });

        const c = this.createContainer({
            scroll: "y",
            x: 90,
            y: 280,
            width: 1000,
            height: 600,
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

        for (const cheat of minigamesCheats) {
            this.createCheckbox({
                text: cheat.name,
                isChecked: !!modStorage.cheats?.skipMinigames?.[cheat.storageKey],
                parent: c,
                onChange: () => {
                    modStorage.cheats ??= {};
                    modStorage.cheats.skipMinigames ??= {};
                    modStorage.cheats.skipMinigames[cheat.storageKey] = !modStorage.cheats.skipMinigames[cheat.storageKey];
                }
            });
        }

        this.createImage({
            src: strugglingMinigamesImage,
            x: 1150,
            y: 200,
            width: 475,
        })

        this.createText({
            width: 750,
            x: 1150,
            y: 750,
            padding: 1,
            withBorder: true,
            text: "Instantly completes certain mini-games with a successful result"
        });
    }
}