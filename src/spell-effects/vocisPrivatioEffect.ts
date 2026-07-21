import { HookPriority } from "zois-core/mod-sdk";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, type TriggerEvent } from "./baseEffect";
import { messagesManager } from "zois-core/messaging";
import { getNickname } from "zois-core";

export class VocisPrivatioEffect extends BaseEffect {
    public override get isInstant(): boolean {
        return false;
    }
    
    public override get name(): string {
        return "Vocis Privatio";
    }

    public override get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    public override get description(): string {
        return "Takes away the target's voice. The target will lose the ability to send messages except chat commands and OOC.";
    }

    public override trigger(event: TriggerEvent): void {
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