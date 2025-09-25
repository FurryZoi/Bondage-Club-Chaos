import { hookFunction, HookPriority } from "zois-core/modsApi";
import { modStorage } from "./storage";
import { getPlayer, waitFor } from "zois-core";

export function refreshBonus(): void {
    let skills = Player.Skill;
    if (modStorage.cheats?.permanentSkillsBoost) {
        skills.forEach((skill) => {
            skill.ModifierLevel = 5;
            skill.ModifierTimeout = Date.now() + 3600000;
        });
        const id = setInterval(() => {
            if (!modStorage.cheats?.permanentSkillsBoost) {
                return clearInterval(id);
            }
            let skills = Player.Skill;
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
        let C = args[0];
        let callbacks = args[1];
        C.AppearanceLayers?.forEach((Layer) => {
            const A = Layer.Asset;
            if (A.Group?.Clothing) {
                (A).DynamicBeforeDraw = true;
            }
        });
        return next(args);
    });

    hookFunction("CommonCallFunctionByNameWarn", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        // Taken from LSCG
        let funcName = args[0];
        let params = args[1];
        if (!params) {
            return next(args);
        }
        let C = params['C'];
        let CA = params['CA'];
        let regex = /Assets(.+)BeforeDraw/i;
        if (regex.test(funcName) && modStorage.cheats?.xray) {
            let ret = next(args) ?? {};
            if (!!CA) {
                let layerName = (params['L'] ?? "")?.trim().slice(1) ?? "";
                let layerIx = CA.Asset.Layer.findIndex(l => l.Name == layerName);
                let originalLayerOpacity = CA.Asset.Layer[layerIx]?.Opacity ?? CA.Asset.Opacity;
                let curOpacity = ret.Opacity ?? originalLayerOpacity ?? 1;
                ret.Opacity = curOpacity * 0.4;
                ret.AlphaMasks = [];
            }
            return ret;
        } else
            return next(args);
    });

    hookFunction("InventoryItemMiscPasswordPadlockDraw", HookPriority.OBSERVE, (args, next) => {
        console.log(1);
        if (!modStorage.cheats?.showPadlocksPasswords) return next(args);
        console.log(3);
        if (!DialogFocusSourceItem) return;
        if (InventoryItemMiscPasswordPadlockIsSet()) {
            console.log(2);
            waitFor(() => !!document.getElementById("Password"))
                .then(() => document.getElementById("Password").setAttribute("placeholder", DialogFocusSourceItem.Property?.Password));
        }
        return next(args);
    });
}