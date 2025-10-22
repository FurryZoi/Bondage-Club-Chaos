import { HookPriority } from "zois-core/modsApi";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent } from "./baseEffect";
import { messagesManager } from "zois-core/messaging";
import { getNickname } from "zois-core";

export class VocisPrivatioEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }
    
    get name(): string {
        return "Vocis Privatio";
    }

    get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    get description(): string {
        return "Takes away the target's voice. The target will lose the ability to send messages except chat commands and OOC.";
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        this.hookFunction(event, "ServerSend", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
            const message = args[0];
            const params = args[1];

            if (message === "ChatRoomChat" && ["Chat", "Whisper"].includes(params.Type)) {
                if (params.Content[0] !== "(") {
                    return messagesManager.sendAction(`${getNickname(Player)} tries to say something, but <pronoun> doesn't have a voice`);
                }
            }
            return next(args);
        });
    }
}