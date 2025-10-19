import { BaseSubscreen } from "zois-core/ui";
import { Ban, createElement } from "lucide";
import { Atom, MinimumRole, spellEffects } from "@/modules/darkMagic";
import { ClickModule, StyleModule } from "zois-core/ui-modules";
import { modStorage } from "@/modules/storage";

const minimumRoleNames = {
    [MinimumRole.EVERYONE]: "Everyone",
    [MinimumRole.FRIEND]: "Friend",
    [MinimumRole.WHITELIST]: "Whitelist",
    [MinimumRole.LOVER]: "Lover",
    [MinimumRole.OWNER]: "Owner",
};

export class LimitsSubscreen extends BaseSubscreen {
    get icon(): SVGElement {
        return createElement(Ban);
    }

    get name() {
        return "Limits";
    }

    public load(): void {
        super.load();

        const container = this.createScrollView({
            scroll: "y",
            x: 160,
            y: 240,
            width: 800,
            height: 1000 - 75 - 240,
            modules: {
                base: [
                    new StyleModule({
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "0.3em",
                    })
                ]
            }
        });

        for (const [key, value] of Object.entries(spellEffects)) {
            const _container = this.createContainer({
                place: false,
                modules: {
                    base: [
                        new StyleModule({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            columnGap: "0.3em"
                        })
                    ]
                }
            });
            _container.append(
                this.createText({
                    place: false,
                    text: value.name
                }),
                this.createSelect({
                    place: false,
                    options: Object
                        .values(MinimumRole)
                        .slice(Object.values(MinimumRole).length / 2)
                        .map((r) => ({ name: r.toString(), text: minimumRoleNames[r] })),
                    currentOption: typeof modStorage.darkMagic?.limits?.effects?.[String.fromCharCode(parseInt(key, 10))] === "number" ? modStorage.darkMagic?.limits?.effects?.[String.fromCharCode(parseInt(key, 10))].toString() : value.atoms.includes(Atom.NOX) ? MinimumRole.LOVER.toString() : MinimumRole.FRIEND.toString(),
                    width: 400,
                    onChange(name) {
                        modStorage.darkMagic ??= {};
                        modStorage.darkMagic.limits ??= {};
                        modStorage.darkMagic.limits.effects ??= {};
                        modStorage.darkMagic.limits.effects[String.fromCharCode(parseInt(key, 10))] = parseInt(name, 10);
                    },
                    modules: {
                        base: [
                            new StyleModule({
                                position: "relative"
                            }),
                            new ClickModule((target) => {
                                if (target.style.zIndex === "100") target.style.zIndex = "10";
                                else target.style.zIndex = "100";
                            })
                        ]
                    }
                })
            );
            container.append(_container);
        }

        this.createText({
            x: 1100,
            y: 240,
            width: 650,
            text: `Here you can limit the use of certain spell effects on yourself.<br><b>Only</b> users who fit the minimum role will be able to use the spell with the effect that you limited.<br>Dangerous effects (those containing "Nox" atom) are limited <b>by default</b>`,
            withBorder: true,
            padding: 2
        });
    }

    public exit(): void {
        super.exit();
    }
}