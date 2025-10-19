import { getNickname, getRandomNumber } from "zois-core";
import { messagesManager } from "zois-core/messaging";
import { HookPriority } from "zois-core/modsApi";
import { Atom } from "../modules/darkMagic";
import { BaseEffect, TriggerEvent, type EffectParameter } from "./baseEffect";


function garbleSpeech(text: string, garbleWords: string[]): string {
    let newText = "";
    const punctuation = ",.!?";
    for (const word of text.split(" ")) {
        const rword = word.split("").toReversed().join("");
        let wordPunctuation = "";
        if (punctuation.includes(rword[0])) {
            for (const c of rword.split("")) {
                if (punctuation.includes(c)) wordPunctuation += c;
            }
            wordPunctuation = wordPunctuation.split("").toReversed().join("");
        }
        newText += garbleWords[getRandomNumber(0, garbleWords.length - 1)] + wordPunctuation + " ";
    }

    return newText.trim();
}

export class VocisAlteratioEffect extends BaseEffect {
    get isInstant(): boolean {
        return false;
    }
    
    get name(): string {
        return "Vocis Alteratio";
    }

    get atoms(): Atom[] {
        return [Atom.RATIO];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return "Changes target's speech.";
    }

    get parameters(): EffectParameter[] {
        return [
            {
                name: "speechType",
                type: "choice",
                label: "Speech Type",
                options: [
                    {
                        name: "puppy",
                        text: "Puppy"
                    },
                    {
                        name: "kitty",
                        text: "Kitty"
                    },
                    {
                        name: "bunny",
                        text: "Bunny"
                    },
                    {
                        name: "baby",
                        text: "Baby"
                    },
                    {
                        name: "cow",
                        text: "Cow"
                    }
                ]
            }
        ]
    }

    public trigger(event: TriggerEvent): void {
        super.trigger(event);
        this.hookFunction("ServerSend", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
            const message = args[0];
            const params = args[1];
            const speechType = this.getParameter<"puppy" | "kitty" | "bunny" | "baby" | "cow">("speechType");

            if (message === "ChatRoomChat" && ["Chat", "Whisper"].includes(params.Type)) {
                if (params.Content[0] !== "(") {
                    if (speechType === "puppy") {
                        params.Content = garbleSpeech(params.Content, [
                            "wof", "woof", "wuf", "wooof", "awo", "awoo",
                            "woo"
                        ]);
                    }
                    if (speechType === "kitty") {
                        params.Content = garbleSpeech(params.Content, [
                            "meow", "meoow", "meooow", "meeow", "meeeow", "mnyaa",
                            "mew", "meew", "meeew"
                        ]);
                    }
                    if (speechType === "bunny") {
                        params.Content = garbleSpeech(params.Content, [
                            "скви"
                        ]);
                    }
                    if (speechType === "baby") {
                        params.Content = SpeechTransformBabyTalk(params.Content);
                    }
                    if (speechType === "cow") {
                        params.Content = garbleSpeech(params.Content, [
                            "mo", "moo", "mooo", "mu", "muu", "moooo"
                        ]);
                    }
                }
            }
            return next(args);
        });
    }
}