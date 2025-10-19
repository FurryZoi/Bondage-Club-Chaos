import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent, type EffectParameter } from "./baseEffect";

interface Parameters {
    lobby: "classic" | "extended"
    isPrivate: boolean
    roomName: string
}

export class SpatiumTransitusEffect extends BaseEffect {
    get name(): string {
        return "Spatium Transitus";
    }

    get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Teleports target in the specified chat room. If the chat room does not exist then target creates it.";
    }

    get parameters(): EffectParameter[] {
        return [
            {
                name: "lobby",
                type: "choice",
                label: "Lobby",
                options: [
                    {
                        name: "classic",
                        text: "Classic"
                    },
                    {
                        name: "extended",
                        text: "Extended (Recommened)"
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

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        const roomName = event.data.roomName;
        const isPrivate = event.data.isPrivate;
        const space = event.data.lobby;
        if (!roomName?.trim()) return;
        ChatRoomLeave();
        CommonSetScreen("Online", "ChatSearch");
        ChatSearchLastQueryJoinTime = CommonTime();
        ChatSearchLastQueryJoin = roomName;
        ServerSend("ChatRoomJoin", { Name: roomName });
        ChatRoomPingLeashedPlayers();
        ServerSocket.once("ChatRoomSearchResponse", (data) => {
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
                ServerSocket.once("ChatRoomCreateResponse", (data) => {
                    if (data === "ChatRoomCreated") {
                        ChatRoomPingLeashedPlayers();
                    }
                });
            }
        });
    }
}