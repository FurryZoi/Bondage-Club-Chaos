import { BaseSubscreen } from "zois-core/ui";
import { CodeXml, createElement, GitPullRequest, PawPrint, Rat } from "lucide";
import { CenterModule, CounterUpModule, StyleModule, TypeModule } from "zois-core/ui-modules";
import { version } from "@/../package.json";
import { TestModule } from "@/ui-modules/testModule";
import { TentaclesModule } from "@/ui-modules/tentaclesModule";
import { Atom, atoms } from "@/modules/darkMagic";
import { PaintTextModule } from "@/ui-modules/paintTextModule";
import { ChaosAuraSubscreen } from "./chaosAuraSubscreen";
import { OverlaySubscreen } from "./overlaySubscreen";
import { DarkMagicSubscreen } from "./darkMagicSubscreen";
import { QuickMenuSubscreen } from "./quickMenuSubscreen";
import { CheatsSubscreen } from "./cheatsSubscreen";
import { syncStorage } from "@/modules/storage";

export class MainSubscreen extends BaseSubscreen {
    load(): void {
        super.load();
        this.createCard({
            anchor: "bottom-right",
            x: 90,
            y: 65,
            name: "Version",
            value: version,
            icon: createElement(GitPullRequest),
            modules: {
                value: [
                    new TypeModule({
                        duration: 850
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
                    new PaintTextModule(),
                    // new StyleModule({
                    //     ["font-family"]: "Finger Paint",
                    //     ["text-align"]: "center",
                    //     ["text-shadow"]: "rgba(115, 0, 255, 1) 0px 0px 0.05em"
                    // })
                ]
            }
        });

        this.createText({
            text: "Chaos is not always the opposite of order",
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
            new QuickMenuSubscreen(), new CheatsSubscreen()
        ].forEach((t, i) => {
            this.createButton({
                text: t.name,
                icon: t.icon,
                x: 165,
                y: 280 + (115 * i),
                width: 500,
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
            anchor: "bottom-right",
            x: 325,
            y: 65,
            width: 425,
            padding: 1
        });

        this.createText({
            text: atoms[Atom.IGNIS].name,
            x: 900,
            y: 400,
            width: 800
        }).style.textAlign = "center";

        this.createText({
            text: atoms[Atom.IGNIS].description,
            x: 900,
            y: 485,
            width: 800,
            withBorder: true,
            padding: 2
        }).style.textAlign = "center";
    }


    exit(): void {
        this.setSubscreen(null);
        syncStorage();
        PreferenceSubscreenExtensionsClear();
    }
}