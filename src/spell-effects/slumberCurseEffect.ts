import { messagesManager } from "zois-core/messaging";
import { HookPriority } from "zois-core/modsApi";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, RemoveEvent, type TriggerEvent } from "./baseEffect";

export class SlumberCurseEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }

    get name(): string {
        return "Slumber Curse";
    }

    get atoms(): Atom[] {
        return [Atom.IGNIS, Atom.RATIO];
    }

    get description(): string {
        return `Puts target to sleep. (Analogue of LSCG's "Slumbering" effect)`;
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);

        if (CharacterCanKneel(Player)) PoseSetActive(Player, "Kneel");
        CharacterSetFacialExpression(Player, "Eyes", "Closed");
        CharacterSetFacialExpression(Player, "Emoticon", "Sleep");
        ChatRoomCharacterUpdate(Player);

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
    }

    public remove(event: RemoveEvent, push?: boolean): void {
        super.remove(event, push);
        CharacterSetFacialExpression(Player, "Eyes", null);
        CharacterSetFacialExpression(Player, "Emoticon", null);
    }
}