import { messagesManager } from "zois-core/messaging";
import { HookPriority } from "zois-core/modsApi";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent } from "./baseEffect";

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
        if (event.init) {
            if (CharacterCanKneel(Player)) PoseSetActive(Player, "Kneel");
        }
        
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
    }
}