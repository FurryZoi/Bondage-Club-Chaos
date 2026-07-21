import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent, type EffectParameter } from "./baseEffect";

export class SpatiumTransitusEffect extends BaseEffect {
    public override get name(): string {
        return "Spatium Transitus";
    }

    public override get atoms(): Atom[] {
        return [Atom.NOX, Atom.MOTUS];
    }

    public override get description(): string {
        return "Teleports target in the specified chat room. If the chat room does not exist then target creates it.";
    }

    public override get parameters(): EffectParameter[] {
        return [
            {
                name: "lobby",
                type: "choice",
                label: "Lobby",
                options: [
                    {
                        name: "extended",
                        text: "Extended (Recommened)"
                    },
                    {
                        name: "classic",
                        text: "Classic"
                    }
                ]
            },
            {
                name: "isPrivate",
                type: "boolean",
                label: "Is Private"
            },
            {
                name: "roomName",
                type: "text",
                label: "Room Name",
            }
        ];
    }

    public override trigger(
        event: TriggerEvent<{
            roomName: string
            isPrivate: boolean
            lobby: "extended" | "classic"
        }>
    ): void {
        super.trigger(event);
        const roomName = event.data.roomName.trim();
        const isPrivate = event.data.isPrivate;
        const space = event.data.lobby;
        ChatRoomLeave();
        CommonSetScreen("Online", "ChatSearch");
        ChatSearchLastQueryJoinTime = CommonTime();
        ChatSearchLastQueryJoin = roomName;
        ServerSend("ChatRoomJoin", { Name: roomName });
        ChatRoomPingLeashedPlayers();
        ServerSocket.once("ChatRoomSearchResponse", (data: string) => {
            if (["CannotFindRoom", "RoomFull"].includes(data)) {
                ServerAccountUpdate.QueueData({ RoomCreateLanguage: "EN" });
                const newRoom = {
                    Name: roomName,
                    Language: "EN",
                    Description: "",
                    Background: "Introduction",
                    Private: isPrivate,
                    Locked: false,
                    Space: space === "extended" ? "X" : "",
                    Game: "",
                    Admin: "",
                    Whitelist: "",
                    Ban: "",
                    Limit: 10,
                    BlockCategory: ""
                };
                ServerSend("ChatRoomCreate", newRoom);
                // ChatCreateMessage = "CreatingRoom";
                ServerSocket.once("ChatRoomCreateResponse", (data: string) => {
                    if (data === "ChatRoomCreated") {
                        ChatRoomPingLeashedPlayers();
                    }
                });
            }
        });
    }
}