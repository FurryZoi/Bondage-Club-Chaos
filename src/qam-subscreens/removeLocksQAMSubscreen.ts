import { toastsManager } from "zois-core/toasts";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { getNickname } from "zois-core";


export class RemoveLocksQAMSubscreen extends BaseQAMSubscreen {
    public override name: string = "Remove Locks";
    public override description: string = "Remove all locks from target's body";

    public override load(container: HTMLDivElement) {
        super.load(container);

        let target: Character = Player;
        const select = this.buildCharacterSelect((_target) => {
            target = _target;
        });
        const btn = this.buildButton("Remove Locks");
        btn.addEventListener("click", () => {
            for (const a of Player.Appearance) {
                if (InventoryGetLock(a)) InventoryUnlock(target, a);
            }
            ChatRoomCharacterUpdate(target);
            toastsManager.success({
                message: `You have successfully unlocked every item on ${getNickname(target)}'s body`,
                duration: 4500
            });
        });
        container.append(select, btn);
    }
}