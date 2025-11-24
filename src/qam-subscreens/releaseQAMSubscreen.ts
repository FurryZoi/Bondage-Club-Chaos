import { getNickname } from "zois-core";
import { toastsManager } from "zois-core/popups";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class ReleaseQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Release";
    public description: string = "Release target from certain items";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        let itemGroup: AssetGroupItemName = "ItemNeck";
        const select = this.buildCharacterSelect((C) => {
            target = C;
            itemSelectContainer.innerHTML = "";
            createItemSelect();
        });
        const itemSelectContainer = document.createElement("div");
        const createItemSelect = () => {
            const options = target.Appearance
                .filter((a) => a.Asset.Group.Name.startsWith("Item") && !!InventoryGet(target, a.Asset.Group.Name))
                .map((a) => ({ name: a.Asset.Group.Name, text: a.Asset.Description }));
            const select = this.buildSelect({
                options,
                currentOption: options[0]?.name,
                onChange: (value) => { itemGroup = value as AssetGroupItemName }
            });
            itemSelectContainer.append(select);
        };
        const btn = this.buildButton("Release");
        btn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            InventoryRemove(target, itemGroup, true);
            ChatRoomCharacterUpdate(target);
            toastsManager.success({
                message: `Successfully released ${getNickname(target)}'s ${itemGroup}`,
                duration: 4000
            });
        });
        createItemSelect();
        container.append(select, itemSelectContainer, btn);
    }
}