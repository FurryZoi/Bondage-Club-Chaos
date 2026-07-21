import { HookPriority } from "zois-core/mod-sdk";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent } from "./baseEffect";
import { getPlayer, getRandomNumber } from "zois-core";

export class NomenFraudisEffect extends BaseEffect {
    public override get isInstant(): boolean {
        return false;
    }

    public override get name(): string {
        return "Nomen Fraudis";
    }

    public override get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    public override get description(): string {
        return "Causes the target to hallucinate with charaters names. They will be swapped.";
    }

    public override trigger(event: TriggerEvent): void {
        super.trigger(event);
        this.hookFunction(event, "ChatRoomMessage", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
            const message = args[0];
            const sender = getPlayer(message.Sender);
            if (!sender) return next(args);
            if (!sender.IsPlayer() && message.Type === "Chat") {
                const randomPlayer = ChatRoomCharacter[getRandomNumber(0, ChatRoomCharacter.length - 1)];
                message.Sender = randomPlayer.MemberNumber;
            }
            return next(args);
        });
    }
}