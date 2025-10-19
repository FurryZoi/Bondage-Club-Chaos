import { BaseSubscreen } from "zois-core/ui";
import { Bug, CodeXml, createElement, GitPullRequest, Heart, Trash2 } from "lucide";
import { ClickModule, DynamicClassModule, StyleModule, TypeModule } from "zois-core/ui-modules";
import { version } from "@/../package.json";
import { TentaclesModule } from "@/ui-modules/tentaclesModule";
import { Atom, atoms } from "@/modules/darkMagic";
import { PaintTextModule } from "@/ui-modules/paintTextModule";
import { ChaosAuraSubscreen } from "./chaosAuraSubscreen";
import { OverlaySubscreen } from "./overlaySubscreen";
import { DarkMagicSubscreen } from "./darkMagicSubscreen";
import { QuickAccessMenuSubscreen } from "./quickAccessMenuSubscreen";
import { CheatsSubscreen } from "./cheatsSubscreen";
import { syncStorage } from "@/modules/storage";
import { AttributionsSubscreen } from "./attributionsSubscreen";
import { ResetSettingsSubscreen } from "./resetSettingsSubscreen";
import { getRandomNumber } from "zois-core";


const quotes = [
    "Chaos is not always the opposite of order",
    "Chaos is complex order, not mess",
    "I find peace in chaos, because it contains the possibility of everything",
    "War is the father of all things, and chaos is their mother",
    "Chaos is a feature, not a bug of the universe",
    "There is a love for chaos in every creator because only out of it is new things born",
    "Chaos often turns out to be not destruction, but a different form of organization — more complex, dynamic and full of possibilities",
    "Ἔρις"
];


export class MainSubscreen extends BaseSubscreen {
    constructor(private readonly animations: boolean = false) {
        super();
    }

    public load(): void {
        super.load();
        this.createCard({
            anchor: "bottom-right",
            x: 90,
            y: 65,
            name: "Version",
            value: version,
            icon: createElement(GitPullRequest),
            modules: this.animations ? {
                value: [
                    new TypeModule({
                        duration: 850
                    })
                ]
            } : undefined
        });

        this.createText({
            text: "BONDAGE CLUB CHAOS",
            fontSize: 12,
            x: 150,
            y: 80,
            width: 1600,
            modules: {
                base: [
                    new PaintTextModule(this.animations),
                ]
            }
        });

        this.createText({
            text: quotes[getRandomNumber(0, quotes.length - 1)],
            fontSize: 3,
            x: 800,
            y: 230,
            width: 1000,
            modules: {
                base: [
                    new StyleModule({
                        textAlign: "center",
                        fontWeight: "bold"
                    })
                ]
            }
        });

        [
            new ChaosAuraSubscreen(), new OverlaySubscreen(), new DarkMagicSubscreen(),
            new QuickAccessMenuSubscreen(), new CheatsSubscreen()
        ].forEach((t, i) => {
            this.createButton({
                text: t.name,
                icon: t.icon,
                x: 165,
                y: 280 + (115 * i),
                width: 575,
                padding: 2,
                modules: {
                    base: [
                        new TentaclesModule()
                    ],
                    icon: [
                        new StyleModule({
                            width: "auto",
                            height: "70%"
                        })
                    ]
                },
                onClick: () => this.setSubscreen(t)
            }).style.fontWeight = "bold";
        });

        this.createButton({
            text: "Source Code",
            icon: createElement(CodeXml),
            x: 1050,
            y: 400,
            width: 485,
            padding: 2,
            onClick() {
                window.open("https://github.com/FurryZoi/Bondage-Club-Chaos", "_blank");
            },
        });

        this.createButton({
            text: "Issues",
            icon: createElement(Bug),
            x: 1050,
            y: 510,
            width: 485,
            padding: 2,
            onClick() {
                window.open("https://github.com/FurryZoi/Bondage-Club-Chaos/issues", "_blank");
            }
        });

        this.createButton({
            text: "Attributions",
            icon: createElement(Heart),
            x: 1050,
            y: 620,
            width: 485,
            padding: 2,
            onClick: () => this.setSubscreen(new AttributionsSubscreen())
        });

        this.createButton({
            text: "Reset Settings",
            icon: createElement(Trash2),
            x: 1050,
            y: 730,
            style: "inverted",
            width: 485,
            padding: 2,
            onClick: () => this.setSubscreen(new ResetSettingsSubscreen())
        });
    }


    public exit(): void {
        super.exit();
        this.setSubscreen(null);
        syncStorage();
        PreferenceSubscreenExtensionsClear();
    }
}