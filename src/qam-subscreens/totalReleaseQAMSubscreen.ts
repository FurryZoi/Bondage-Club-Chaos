import { getNickname } from "zois-core";
import { toastsManager } from "zois-core/popups";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class TotalReleaseQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Total Release";
    public description: string = "Release target from all items except for clothing and slave collar";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const select = this.buildCharacterSelect((C) => { target = C });
        const btn = this.buildButton("Total Release");
        btn.addEventListener("click", () => {
            if (!ServerChatRoomGetAllowItem(Player, target)) {
                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
            }
            CharacterReleaseTotal(target, true);
            toastsManager.success({
                message: `${getNickname(target)} was completely released`,
                duration: 4000
            });
        });
        container.append(select, btn);
    }
}