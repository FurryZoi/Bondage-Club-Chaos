import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class LeaveRoomQAMSubscreen extends BaseQAMSubscreen {
    public override name: string = "Leave Room";
    public override description: string = "Forcibly leave chat room";

    public override load(container: HTMLDivElement) {
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