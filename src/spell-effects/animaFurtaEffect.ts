import { HookPriority } from "zois-core/modsApi";
import { Atom, Effect, getSpellEffect } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";
import { messagesManager } from "zois-core/messaging";
import { AnimaFurtaMessageDto } from "@/dto/animaFurtaMessageDto";
import { getPlayer } from "zois-core";


export class AnimaFurtaEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }

    get name(): string {
        return "Anima Furta";
    }

    get atoms(): Atom[] {
        return [Atom.IGNIS, Atom.NOX, Atom.MOTUS, Atom.RATIO];
    }

    get description(): string {
        return "Lets you control target. (Chat, activities, poses, wardrobe, map moving)";
    }

    public getControllableCharacter(): Character {
        return ChatRoomCharacter.find((c) => {
            return c.BCC && this.isActiveOn(c) && this.getSpellsWithEffect(c)[0].castedBy === Player.MemberNumber;
        });
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        console.log("event", event);
        if (event.init) {
            this.hookFunction("ChatRoomLeave", HookPriority.OBSERVE, (args, next) => {
                this.remove(event);
                return next(args);
            });

            this.hookFunction("ChatRoomListUpdate", HookPriority.OBSERVE, (args, next) => {
                const [_, adding, memberNumber] = args as [number[], boolean, number];
                if (!adding && memberNumber === event.sourceCharacter?.MemberNumber) this.remove(event);
                return next(args);
            });

            this.hookFunction("ChatRoomSendChat", HookPriority.OVERRIDE_BEHAVIOR, () => {
                return messagesManager.sendLocal("You lost control of yourself");
            });

            this.hookFunction("Player.CanWalk", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("Player.CanChangeToPose", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("Player.CanChangeOwnClothes", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("PoseCanChangeUnaidedStatus", HookPriority.OVERRIDE_BEHAVIOR, () => PoseChangeStatus.NEVER);
            this.hookFunction("ChatRoomCanAttemptStand", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("ChatRoomCanAttemptKneel", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("Player.CanInteract", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("InventoryGroupIsBlockedForCharacter", HookPriority.OVERRIDE_BEHAVIOR, () => true);
            this.hookFunction("DialogClickExpressionMenu", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction("ChatRoomMapViewMove", HookPriority.OVERRIDE_BEHAVIOR, () => false);

            messagesManager.onPacket("animaFurtaCommand", AnimaFurtaMessageDto, (data: AnimaFurtaMessageDto, sender) => {
                console.log(data)
                if (!sender.BCC) return;
                if (
                    !getSpellEffect(Effect.ANIMA_FURTA).isActive
                ) return;
                console.log(data)
                if (data.name === "toggleKneel") {
                    const Dictionary = new DictionaryBuilder()
                        .sourceCharacter(Player)
                        .build();
                    ServerSend("ChatRoomChat", { Content: Player.IsKneeling() ? "StandUp" : "KneelDown", Type: "Action", Dictionary });
                    PoseSetActive(Player, Player.IsKneeling() ? "BaseLower" : "Kneel");
                    ChatRoomStimulationMessage("Kneel");
                    ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
                }
                if (data.name === "changeAppearance") {
                    ServerAppearanceLoadFromBundle(
                        getPlayer(data.target),
                        getPlayer(data.target).AssetFamily,
                        data.appearance,
                        data.target
                    );
                    ChatRoomCharacterUpdate(getPlayer(data.target));
                }
                if (data.name === "publishAction") {
                    ServerSend("ChatRoomChat", data.params);
                }
                if (data.name === "sendMessage") {
                    messagesManager.sendChat(data.message);
                }
                if (data.name === "mapMove") {
                    //@ts-expect-error
                    if (!Player.MapData) Player.MapData = {};
                    Player.MapData.Pos = {
                        X: data.pos.x,
                        Y: data.pos.y
                    };
                    ChatRoomMapViewMovement = {
                        X: data.pos.x,
                        Y: data.pos.y,
                        Direction: "East",
                        TimeStart: CommonTime(),
                        TimeEnd: CommonTime()
                    };
                }
            });
        } else {
            this.remove(event);
        }
    }
}