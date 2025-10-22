import { HookPriority } from "zois-core/modsApi";
import { Atom, CastSpellRejectionReason, Effect, getSpellEffect } from "../modules/darkMagic";
import { BaseEffect, RemoveEvent, TriggerEvent } from "./baseEffect";
import { messagesManager } from "zois-core/messaging";
import { AnimaFurtaMessageDto } from "@/dto/animaFurtaMessageDto";
import { getPlayer } from "zois-core";


export class AnimaFurtaEffect extends BaseEffect {
    private removePacketListener: () => void;

    get isInstant(): boolean {
        return false;
    }

    get selfCastAllowed(): boolean {
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
            return c.BCC && this.isActiveOn(c) && this.getSpellsWithEffect(c)[0].castedBy.id === Player.MemberNumber;
        });
    }

    public canCast(_sourceCharacter: Character, targetCharacter: Character): {
        result: false
        reason: CastSpellRejectionReason
    } | {
        result: true
    } {
        if (this.isActiveOn(targetCharacter)) return { result: false, reason: CastSpellRejectionReason.CANT_CAST_AT_THIS_MOMENT };
        return { result: true };
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        if (event.init) {
            this.hookFunction(event, "ChatRoomLeave", HookPriority.OBSERVE, (args, next) => {
                this.remove({
                    sourceCharacter: event.sourceCharacter,
                    sourceSpellName: null,
                    targetSpellName: event.spellName
                });
                return next(args);
            });

            this.hookFunction(event, "ChatRoomSyncMemberLeave", HookPriority.OBSERVE, (args, next) => {
                const data = args[0];
                if (data.SourceMemberNumber === event.sourceCharacter?.MemberNumber) {
                    this.remove({
                        sourceCharacter: event.sourceCharacter,
                        sourceSpellName: null,
                        targetSpellName: event.spellName
                    });
                }
                return next(args);
            });

            this.hookFunction(event, "ChatRoomSendChat", HookPriority.OVERRIDE_BEHAVIOR, () => {
                return messagesManager.sendLocal("You lost control of yourself");
            });

            this.hookFunction(event, "Player.CanWalk", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "Player.CanChangeToPose", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "Player.CanChangeOwnClothes", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "PoseCanChangeUnaidedStatus", HookPriority.OVERRIDE_BEHAVIOR, () => PoseChangeStatus.NEVER);
            this.hookFunction(event, "ChatRoomCanAttemptStand", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "ChatRoomCanAttemptKneel", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "Player.CanInteract", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "InventoryGroupIsBlockedForCharacter", HookPriority.OVERRIDE_BEHAVIOR, () => true);
            this.hookFunction(event, "DialogClickExpressionMenu", HookPriority.OVERRIDE_BEHAVIOR, () => false);
            this.hookFunction(event, "ChatRoomMapViewMove", HookPriority.OVERRIDE_BEHAVIOR, () => false);

            this.removePacketListener = messagesManager.onPacket("animaFurtaCommand", AnimaFurtaMessageDto, (data: AnimaFurtaMessageDto, sender) => {
                if (!sender.BCC) return;
                if (
                    !getSpellEffect(Effect.ANIMA_FURTA).isActive
                ) return;
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
            this.remove({
                sourceCharacter: event.sourceCharacter,
                sourceSpellName: null,
                targetSpellName: event.spellName
            }, false);
        }
    }

    public remove(event: RemoveEvent, push?: boolean): void {
        super.remove(event, push);
        this.removePacketListener?.();
    }
}