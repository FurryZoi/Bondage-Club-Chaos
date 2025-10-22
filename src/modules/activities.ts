import { ActivityManager } from "@sugarch/bc-activity-manager";
import { HookManager } from "@sugarch/bc-mod-hook-manager";
import { getNickname, getPlayer } from "zois-core";
import { modSdk } from "zois-core/modsApi";

enum Activity {
    STEAL_PANTIES = "BCC_StealPanties",
    SUCK_ON_TIP_HAIR = "BCC_SuckOnTipOfHair"
};

export function addActivities(): void {
    ActivityManager.addCustomActivity({
        activity: {
            Name: Activity.STEAL_PANTIES,
            Prerequisite: ["UseHands", (_, _acter, acted) => !!InventoryGet(acted, "Panties")],
            MaxProgress: 0,
            Target: ["ItemPelvis", "ItemButt", "ItemVulva", "ItemVulvaPiercings"],
        },
        useImage: (_activity, target, _group) => {
            const asset = InventoryGet(target, "Panties")?.Asset;
            return AssetGetPreviewPath(asset) + "/" + asset?.Name + ".png";
        },
        label: { EN: "Steal Panties" },
        dialog: { EN: "SourceCharacter steals TargetCharacter's panties." },
        run: (_player, sender, info) => {
            if (!sender.IsPlayer()) return;
            const target = getPlayer(info.TargetCharacter);
            InventoryRemove(target, "Panties");
            InventoryWear(Player, "Panties", "ItemHandheld", "red", 10, Player.MemberNumber, {
                Item: "Panties",
                Name: `${getNickname(target)}'s panties`,
                Description: "",
                Color: "red",
                Property: "Normal",
                Lock: "",
                Private: false,
                ItemProperty: {},
                Type: null,
                TypeRecord: null,
                MemberNumber: target.MemberNumber,
                MemberName: getNickname(target)
            });
            ChatRoomCharacterUpdate(target);
            ChatRoomCharacterUpdate(Player);
        }
    });
    ActivityManager.addCustomActivity({
        activity: {
            Name: Activity.SUCK_ON_TIP_HAIR,
            Prerequisite: ["UseMouth"],
            MaxProgress: 0,
            Target: ["ItemHead", "ItemHood", "ItemEars"],
        },
        useImage: "Kiss",
        label: { EN: "Suck on tip of hair" },
        dialog: { EN: "SourceCharacter sucks on TargetCharacter's tip of hair." },
        run: (_player, sender, info) => {
            if (!sender.IsPlayer()) return;
            const target = getPlayer(info.TargetCharacter);
            const hairColor = InventoryGet(target, "HairFront")?.Color?.[0] ?? "#6a3628";
            InventoryWear(Player, "Tentacles", "ItemMouth2", hairColor, 10, target.MemberNumber, {
                Item: "Tentacles",
                Name: `${getNickname(target)}'s tip of hair`,
                Description: "",
                Color: hairColor,
                Property: "Decoy",
                Lock: "",
                Private: false,
                ItemProperty: {},
                Type: null,
                TypeRecord: null,
                MemberNumber: target.MemberNumber,
                MemberName: getNickname(target)
            });
            ChatRoomCharacterUpdate(Player);
        }
    });
    HookManager.initWithMod(modSdk);
    ActivityManager.init();
}