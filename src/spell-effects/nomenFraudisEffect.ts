import { HookPriority } from "zois-core/modsApi";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";
import { getPlayer, getRandomNumber } from "zois-core";

//gallucination
export class NomenFraudisEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }

    get name(): string {
        return "Nomen Fraudis";
    }

    get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Causes the target to hallucinate with charaters names. They will be swapped.";
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        this.hookFunction("ChatRoomMessage", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
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