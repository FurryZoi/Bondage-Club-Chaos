import { getNickname } from "zois-core";
import { messagesManager } from "zois-core/messaging";
import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class MapTeleportQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "Map Teleport";
    public description: string = "Teleport to certain character on map";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        const select = this.buildCharacterSelect((C) => { target = C });
        const btn = this.buildButton("Map Teleport");
        btn.addEventListener("click", () => {
            //@ts-expect-error
            if (!Player.MapData) Player.MapData = {};
            const x = target.MapData?.Pos?.X;
            const y = target.MapData?.Pos?.Y;
            if (!x || !y) return;;
            Player.MapData.Pos = {
                X: x,
                Y: y
            };
            ChatRoomMapViewMovement = {
                X: x,
                Y: y,
                TimeStart: CommonTime(),
                TimeEnd: CommonTime(),
                Direction: "East"
            };
            messagesManager.sendLocal(
                `You were successfully teleported to ${getNickname(target)}`
            );
        });
        container.append(select, btn);
    }
}