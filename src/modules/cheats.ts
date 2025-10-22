import { hookFunction, HookPriority } from "zois-core/modsApi";
import { modStorage } from "./storage";
import { getPlayer, waitFor } from "zois-core";
import { setPosition } from "zois-core/ui";
import { toastsManager } from "zois-core/popups";

export function refreshBonus(): void {
    const skills = Player.Skill;
    if (modStorage.cheats?.permanentSkillsBoost) {
        skills.forEach((skill) => {
            skill.ModifierLevel = 5;
            skill.ModifierTimeout = Date.now() + 3600000;
        });
        const id = setInterval(() => {
            if (!modStorage.cheats?.permanentSkillsBoost) {
                return clearInterval(id);
            }
            const skills = Player.Skill;
            skills.forEach((skill) => {
                skill.ModifierLevel = 5;
                skill.ModifierTimeout = Date.now() + 3600000;
            });
            ServerSend("AccountUpdate", {
                Skill: skills,
            });
        }, 100000);
    } else {
        skills.forEach((skill) => {
            delete skill.ModifierLevel;
            delete skill.ModifierTimeout;
        });
    }
    ServerSend("AccountUpdate", {
        Skill: skills,
    });
}

export function loadCheats(): void {
    refreshBonus();

    hookFunction("ServerSend", HookPriority.MODIFY_BEHAVIOR, (args, next) => {
        const message: string = args[0];
        const params = args[1];
        if (message === "ChatRoomCharacterItemUpdate") {
            if (
                modStorage.cheats?.autoTight &&
                params.Target !== Player.MemberNumber
            ) {
                const target = getPlayer(params.Target);
                const item = InventoryGet(target, params.Group);
                if (item) {
                    item.Difficulty = 1000;
                    params.Difficulty = 1000;
                }
            }
        }
        if (
            message === "ChatRoomChat" &&
            modStorage.cheats?.anonymousMode &&
            (
                (
                    params.Type === "Action" &&
                    params.Content !== "Beep"
                ) ||
                params.Type === "Status"
            )
        ) return null;

        return next(args);
    });

    hookFunction("ChatRoomPlayerIsAdmin", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        if (modStorage.cheats?.mapSuperPower && next(args) === false) {
            return (
                ChatRoomMapViewIsActive() &&
                CurrentScreen !== "ChatAdmin"
                && !CurrentCharacter
            );
        }
        return next(args);
    });

    hookFunction("CommonDrawAppearanceBuild", HookPriority.ADD_BEHAVIOR, (args, next) => {
        if (!modStorage.cheats?.xray) return next(args);
        const C: Character = args[0];
        C.AppearanceLayers?.forEach((Layer) => {
            const A = Layer.Asset;
            if (A.Group?.Clothing) {
                //@ts-expect-error
                (A).DynamicBeforeDraw = true;
            }
        });
        return next(args);
    });

    hookFunction("CommonCallFunctionByNameWarn", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        // Taken from LSCG
        const funcName = args[0];
        const params = args[1];
        if (!params) {
            return next(args);
        }
        const C = params['C'];
        const CA = params['CA'];
        const regex = /Assets(.+)BeforeDraw/i;
        if (regex.test(funcName) && modStorage.cheats?.xray) {
            const ret = next(args) ?? {};
            if (CA) {
                const layerName = (params['L'] ?? "")?.trim().slice(1) ?? "";
                const layerIx = CA.Asset.Layer.findIndex(l => l.Name === layerName);
                const originalLayerOpacity = CA.Asset.Layer[layerIx]?.Opacity ?? CA.Asset.Opacity;
                const curOpacity = ret.Opacity ?? originalLayerOpacity ?? 1;
                ret.Opacity = curOpacity * 0.4;
                ret.AlphaMasks = [];
            }
            return ret;
        } else
            return next(args);
    });

    hookFunction("ExtendedItemLoad", HookPriority.OBSERVE, (args, next) => {
        if (!modStorage.cheats?.showPadlocksPasswords) return next(args);
        if (
            !DialogFocusSourceItem ||
            !["PasswordPadlock", "TimerPasswordPadlock"].includes(DialogFocusItem.Asset?.Name)
        ) return next(args);
        if (InventoryItemMiscPasswordPadlockIsSet()) {
            waitFor(() => !!document.getElementById("Password"))
                .then(() => document.getElementById("Password").setAttribute("placeholder", DialogFocusSourceItem.Property?.Password));
        }
        return next(args);
    });

    hookFunction("ChatRoomFocusCharacter", HookPriority.OBSERVE, (args, next) => {
        next(args);
        if (!modStorage.cheats?.allowActivities) return next(args);
        const C = CharacterGetCurrent();
        if (!C) return next(args);
        if (ServerChatRoomGetAllowItem(Player, C)) return next(args);
        if (C.HasOnBlacklist(Player)) {
            toastsManager.error({
                title: "Activities cheat denied",
                message: "You are blacklisted or ghosted by this player",
                duration: 4500
            });
            return next(args);
        }
        if (DialogMenuMode !== "dialog") return next(args);
        setTimeout(() => DialogSetStatus("(You don't have access to use or remove items, but you can perform activities.)"), 250);
    });

    hookFunction("DialogClick", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        next(args);
        if (!modStorage.cheats?.allowActivities) return;
        // CurrentCharacter instead of CharacterGetCurrent()
        const C = (MouseX < 500) ? Player : CurrentCharacter;
        if (!C) return;
        if (ServerChatRoomGetAllowItem(Player, CurrentCharacter)) return;

        const X = MouseX < 500 ? 0 : 500;
        for (const Group of AssetGroup) {
            if (!Group.IsItem()) continue;
            const Zone = Group.Zone.find((Z) => DialogClickedInZone(C, Z, 1, X, 0, C.HeightRatio));
            if (Zone) {
                DialogChangeFocusToGroup(C, Group);
                DialogChangeMode("activities");
                break;
            }
        }

        const isExitButtonExists = !!document.getElementById("bcc-exit-dialog-button");
        if (CharacterGetCurrent()?.IsPlayer() && isExitButtonExists) ElementRemove("bcc-exit-dialog-button");
        if (!isExitButtonExists) {
            const button = ElementButton.Create("bcc-exit-dialog-button", () => DialogChangeMode("dialog"), { tooltip: "(BCC) Back", image: "Icons/Exit.png" });
            document.body.append(button);
            setPosition(button, 40, 20, "top-right");
            ElementSetSize(button, 90, 90);
            button.addEventListener("click", () => {
                button.remove();
                DialogChangeFocusToGroup(C, null);
            });
        }
    });

    hookFunction("DialogResize", HookPriority.OBSERVE, (args, next) => {
        if (!modStorage.cheats?.allowActivities) return next(args);
        const button = document.getElementById("bcc-exit-dialog-button");
        if (button) {
            setPosition(button, 40, 20, "top-right");
            ElementSetSize(button, 90, 90);
        }
        return next(args);
    });
}