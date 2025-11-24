import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class LeaveRoomQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Leave Room";
    public description: string = "Forcibly leave chat room";

    public load(container: Element) {
        super.load(container);

        const btn = this.buildButton("Leave Room");
        btn.addEventListener("click", () => {
            if (!ServerPlayerIsInChatRoom()) return;
            ChatRoomLeave();
            CommonSetScreen("Online", "ChatSearch");
        });
        container.append(btn);
    }
}