import { isBannedBy } from "@/modules/quickAccessMenu";
import { modStorage, syncStorage } from "@/modules/storage";
import { getNickname } from "zois-core";
import { toastsManager } from "zois-core/popups";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class CloneQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Clone";
    public description: string = "Copy target's appearance, nickname, label's color and expressions. With the opportunity to return to your original appearance";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const select = this.buildCharacterSelect((C) => { target = C });
        const cloneBtn = this.buildButton("Clone");
        const backupBtn = this.buildButton("Backup");
        backupBtn.addEventListener("click", () => {
            if (!modStorage.qam?.cloneBackup) return toastsManager.error({
                message: "You don't have backup",
                duration: 3000
            });
            Player.Nickname = modStorage.qam.cloneBackup.nickName;
            Player.LabelColor = modStorage.qam.cloneBackup.labelColor;
            PoseSetActive(Player, modStorage.qam.cloneBackup.activePose[0]);
            CharacterSetFacialExpression(Player, "Emoticon", modStorage.qam.cloneBackup.emoticon?.expression, null, modStorage.qam.cloneBackup.emoticon?.color);
            CharacterSetFacialExpression(Player, "Blush", modStorage.qam.cloneBackup.blush?.expression);
            ServerAppearanceLoadFromBundle(
                Player,
                Player.AssetFamily,
                JSON.parse(LZString.decompressFromBase64(modStorage.qam.cloneBackup.appearance)),
                Player.MemberNumber
            );
            ServerSend("AccountUpdate", {
                Nickname: Player.Nickname,
                LabelColor: Player.LabelColor,
            });
            ChatRoomCharacterUpdate(Player);
            toastsManager.success({
                message: `You have successfully canceled the cloning effect!`,
                duration: 4500
            });
            delete modStorage.qam.cloneBackup;
            syncStorage();
        });
        cloneBtn.addEventListener("click", () => {
            if (isBannedBy(target)) return toastsManager.error({
                title: "Denied",
                message: "You are blacklisted or ghosted by this player",
                duration: 4500
            });
            modStorage.qam ??= {};
            if (!modStorage.qam.cloneBackup) {
                modStorage.qam.cloneBackup = {
                    nickName: getNickname(Player),
                    labelColor: Player.LabelColor,
                    emoticon: {
                        expression: InventoryGet(Player, "Emoticon")?.Property?.Expression,
                        // color: InventoryGet(Player, "Emoticon")?.Property?.Color
                        color: ""
                    },
                    blush: {
                        expression: InventoryGet(Player, "Blush")?.Property?.Expression
                    },
                    appearance: LZString.compressToBase64(JSON.stringify(ServerAppearanceBundle(Player.Appearance))),
                    activePose: [...Player.ActivePose]
                };
                syncStorage();
            }

            Player.Nickname = getNickname(target);
            Player.LabelColor = target.LabelColor;
            PoseSetActive(Player, target.ActivePose[0]);
            CharacterSetFacialExpression(Player, "Emoticon", InventoryGet(target, "Emoticon")?.Property?.Expression, null, InventoryGet(target, "Emoticon")?.Property?.Color);
            CharacterSetFacialExpression(Player, "Blush", InventoryGet(target, "Blush")?.Property?.Expression);
            ServerAppearanceLoadFromBundle(
                Player,
                Player.AssetFamily,
                ServerAppearanceBundle(target.Appearance),
                Player.MemberNumber
            );
            ServerSend("AccountUpdate", {
                Nickname: Player.Nickname,
                LabelColor: Player.LabelColor,
            });
            ChatRoomCharacterUpdate(Player);

            toastsManager.success({
                message: `You were successfully cloned ${getNickname(target)}`,
                duration: 4500
            });
        });
        container.append(select, cloneBtn, backupBtn);
    }
}