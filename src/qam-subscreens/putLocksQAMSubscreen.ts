import { toastsManager } from "zois-core/popups";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { getNickname } from "zois-core";


export class PutLocksQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Put Locks";
    public description: string = "Put lock on target's all items";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const locks = AssetGroupGet(Player.AssetFamily, "ItemMisc").Asset
            .filter((item) => item.Name?.endsWith("Padlock"));
        let lock = locks[0].Name;
        const select = this.buildCharacterSelect((_target) => {
            target = _target;
        });
        const _select = this.buildSelect({
            options: locks.map((l) => ({ name: l.Name, text: l.Description })),
            currentOption: locks[0].Name,
            onChange: (value) => {
                lock = value;
            }
        });
        const btn = this.buildButton("Put Locks");
        btn.addEventListener("click", () => {
            InventoryFullLock(target, lock as AssetLockType);
            ChatRoomCharacterUpdate(target);
            toastsManager.success({
                message: `You have successfully locked every item on ${getNickname(target)}'s body`,
                duration: 4500
            });
        });
        container.append(select, _select, btn);
    }
}