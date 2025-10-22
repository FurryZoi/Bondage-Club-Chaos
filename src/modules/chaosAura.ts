// BCC legacy code
// TODO: Refactoring

import { getNickname, getPlayer, waitFor } from "zois-core";
import { modStorage, syncStorage } from "./storage";
import { messagesManager } from "zois-core/messaging";
import { isBody, isCloth } from "zois-core/wardrobe";
import { hookFunction, HookPriority } from "zois-core/modsApi";

const chaosAuraLastData = {
    appearance: null,
    pose: null
};

export function updateChaosAuraLastData() {
    chaosAuraLastData.appearance = ServerAppearanceBundle(
        Player.Appearance
    );
    chaosAuraLastData.pose = [...Player.ActivePose];
}

async function skyShieldAction(target: Character) {
    const appearance1 = chaosAuraLastData.appearance;
    const activePose1 = chaosAuraLastData.pose;
    const appearance2 = ServerAppearanceBundle(Player.Appearance);
    const activePose2 = Player.ActivePose;
    let newAppearance = [...appearance2];
    let newActivePose = [...activePose2];
    const targetStorage = target.IsPlayer() ? modStorage : target.BCC;

    const itemsFilter = (item: ItemBundle) => item.Group.startsWith("Item");
    const noItemsFilter = (item: ItemBundle) => !item.Group.startsWith("Item");

    const restraintsFilter = (item: ItemBundle) => InventoryGet(Player, item.Group)?.Asset?.IsRestraint;
    const noRestraintsFilter = (item: ItemBundle) => !InventoryGet(Player, item.Group)?.Asset?.IsRestraint;

    const clothesFilter = (item: ItemBundle) => isCloth(ServerBundledItemToAppearanceItem(Player.AssetFamily, item));
    const noClothesFilter = (item: ItemBundle) => isBody(ServerBundledItemToAppearanceItem(Player.AssetFamily, item));

    let triggered = false;
    const triggers = modStorage.chaosAura?.triggers;

    if (!modStorage.chaosAura?.whiteList?.includes(target.MemberNumber)) {
        if (triggers?.clothesChange) {
            if (
                JSON.stringify(
                    appearance2.filter(clothesFilter)
                ) !==
                JSON.stringify(
                    appearance1.filter(clothesFilter)
                )
            ) {
                newAppearance = newAppearance
                    .filter(noClothesFilter)
                    .concat(appearance1.filter(clothesFilter));
                triggered = true;
            }
        }
        if (triggers?.itemsChange) {
            if (modStorage.chaosAura?.ignoreItemsChangeIfNotRestraint) {
                if (
                    JSON.stringify(
                        appearance2.filter(restraintsFilter)
                    ) !==
                    JSON.stringify(
                        appearance1.filter(restraintsFilter)
                    )
                ) {
                    newAppearance = newAppearance
                        .filter(noRestraintsFilter)
                        .concat(appearance1.filter(restraintsFilter));
                    triggered = true;
                }
            } else {
                if (
                    JSON.stringify(
                        appearance2.filter(itemsFilter)
                    ) !==
                    JSON.stringify(
                        appearance1.filter(itemsFilter)
                    )
                ) {
                    newAppearance = newAppearance
                        .filter(noItemsFilter)
                        .concat(appearance1.filter(itemsFilter));
                    triggered = true;
                }
            }
        }
        if (triggers?.poseChange) {
            if (
                JSON.stringify(
                    activePose1
                ) !==
                JSON.stringify(
                    activePose2
                )
            ) {
                newActivePose = activePose1;
                triggered = true;
            }
        }

        if (triggered) {
            modStorage.chaosAura.triggersCount ??= 0;
            modStorage.chaosAura.triggersCount++;
            syncStorage();
            ServerSend("ChatRoomCharacterUpdate", {
                ID: Player.OnlineID,
                ActivePose: newActivePose,
                Appearance: newAppearance
            });
            //FBC GLITCH FIX
            setTimeout(() => ServerSend("ChatRoomCharacterPoseUpdate", { Pose: newActivePose }), 500);
            messagesManager.sendAction(
                `${getNickname(target)} tried to touch ${getNickname(
                    Player
                )}, but ${getNickname(Player)} was protected by some kind of dark aura`
            );

            if (
                modStorage.chaosAura?.retribution && (
                    !targetStorage?.chaosAura?.enabled ||
                    !targetStorage?.chaosAura?.triggers?.itemsChange ||
                    targetStorage?.chaosAura?.whiteList?.includes(Player.MemberNumber)
                ) && ServerChatRoomGetAllowItem(Player, target)
            ) {
                const items1 = appearance1
                    .filter(itemsFilter)
                    .map((item) => JSON.stringify(item));
                const items2 = appearance2
                    .filter(itemsFilter)
                    .map((item) => JSON.stringify(item));
                let retributionItems = [];
                items2.forEach((item) => {
                    if (!items1.includes(item)) retributionItems.push(JSON.parse(item));
                });
                retributionItems = retributionItems.filter(
                    (item) => item.Group !== "ItemHandheld"
                );

                if (retributionItems.length > 0) {
                    messagesManager.sendAction(
                        `Retribution: Used restraints are returned to ${getNickname(target)}`
                    );
                    ServerSend("ChatRoomCharacterUpdate", {
                        ID: target.AccountName.replace("Online-", ""),
                        ActivePose: target.ActivePose,
                        Appearance: ServerAppearanceBundle(target.Appearance).concat(
                            retributionItems
                        )
                    });
                }
            }
            // return;
        }
    }

    chaosAuraLastData.appearance = newAppearance;
    chaosAuraLastData.pose = newActivePose;
    await waitFor(() => {
        return (
            JSON.stringify(
                ServerAppearanceBundle(
                    Player.Appearance
                )
            ) === JSON.stringify(
                newAppearance
            )
        );
    });
    return true;
}

function onPlayerAppearanceChange(target: Character) {
    if (!modStorage.chaosAura?.enabled) return;
    if (target.IsPlayer()) updateChaosAuraLastData();
    else skyShieldAction(target);
}


export function loadChaosAura(): void {
    if (modStorage.chaosAura?.enabled) updateChaosAuraLastData();

    hookFunction("ChatRoomCharacterItemUpdate", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [target] = args as [Character];
        if (target.IsPlayer()) onPlayerAppearanceChange(Player);
    });

    hookFunction("ChatRoomSyncItem", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [data] = args;
        const item = data?.Item;
        const target1 = getPlayer(data?.Source);
        const target2 = getPlayer(item?.Target);
        if (!target1 || !target2) return;
        if (target2.IsPlayer()) onPlayerAppearanceChange(target1);
    });

    hookFunction("ChatRoomSyncSingle", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [data] = args;
        const target1 = getPlayer(data?.SourceMemberNumber);
        const target2 = getPlayer(data?.Character?.MemberNumber);
        if (!target1 || !target2) return;
        if (target2.IsPlayer()) onPlayerAppearanceChange(target1);
    });
}