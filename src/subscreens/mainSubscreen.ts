import { BaseSubscreen } from "zois-core/ui";
import { Bug, CodeXml, createElement, GitPullRequest, Heart, Trash2 } from "lucide";
import { MultiClickModule, StyleModule, TypeModule } from "zois-core/shard-modules";
import { version } from "@/../package.json";
import { TentaclesModule } from "@/shard-modules/tentaclesModule";
import { PaintTextModule } from "@/shard-modules/paintTextModule";
import { ChaosAuraSubscreen } from "./chaosAuraSubscreen";
import { OverlaySubscreen } from "./overlaySubscreen";
import { DarkMagicSubscreen } from "./darkMagicSubscreen";
import { QuickAccessMenuSubscreen } from "./quickAccessMenuSubscreen";
import { CheatsSubscreen } from "./cheatsSubscreen";
import { syncStorage } from "@/modules/storage";
import { AttributionsSubscreen } from "./attributionsSubscreen";
import { ResetSettingsSubscreen } from "./resetSettingsSubscreen";
import { getRandomNumber, MOD_DATA } from "zois-core";
import { toastsManager } from "zois-core/toasts";


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

    public override get name(): string {
        return "";
    }

    public override load(): void {
        super.load();
        this.createCard({
            anchor: "bottom-right",
            x: 90,
            y: 65,
            width: 220,
            name: "Version",
            value: version,
            icon: createElement(GitPullRequest),
            modules: {
                value: [
                    ...(this.animations ? [new TypeModule({
                        duration: 850
                    })] : [])
                ],
                base: [
                    // You have found secret, but let's keep it between us, fine?
                    new MultiClickModule({
                        callback: () => {
                            //@ts-expect-error
                            if (window.ZOIS_CORE.getSettings().devMode) {
                                return toastsManager.info({
                                    message: "You are already developer",
                                    duration: 5000
                                });
                            }
                            //@ts-expect-error
                            window.ZOIS_CORE.enableDevMode();
                            toastsManager.success({
                                message: "You became developer",
                                duration: 4000
                            });
                        },
                        n: 4
                    }),
                    new StyleModule({
                        userSelect: "none"
                    })
                ]
            }
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
            href: MOD_DATA.repository,
            x: 1050,
            y: 400,
            width: 485,
            padding: 2,
        });

        this.createButton({
            text: "Issues",
            icon: createElement(Bug),
            href: MOD_DATA.repository ? MOD_DATA.repository + "/issues" : undefined,
            x: 1050,
            y: 510,
            width: 485,
            padding: 2
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
            variant: "filled",
            width: 485,
            padding: 2,
            onClick: () => this.setSubscreen(new ResetSettingsSubscreen())
        });
    }

    public override exit(): void {
        super.exit();
        this.setSubscreen(null);
        syncStorage();
        PreferenceSubscreenExtensionsClear();
    }
}