import { hookFunction } from "zois-core/modsApi";
import { Atom, CastSpellRejectionReason, getSpellEffects, MinimumRole } from "../modules/darkMagic";
import { ModStorage, modStorage, syncStorage } from "../modules/storage";

export type EffectParameter = EffectParameterText | EffectParameterNumber | EffectParameterBoolean | EffectParameterChoice;

export interface BaseEffectParameter {
    name: string
    label: string
    type: "text" | "number" | "boolean" | "choice"
}

export interface EffectParameterText extends BaseEffectParameter {
    type: "text"
}

export interface EffectParameterNumber extends BaseEffectParameter {
    type: "number"
    min?: number
    max?: number
}

export interface EffectParameterBoolean extends BaseEffectParameter {
    type: "boolean"
}

export interface EffectParameterChoice extends BaseEffectParameter {
    type: "choice"
    options: {
        name: string
        text: string
        icon?: SVGElement
    }[]
}

export interface TriggerEvent {
    sourceCharacter: Character
    data: unknown
    spellName: string
    init: boolean
}

export interface RemoveEvent {
    sourceCharacter: Character
    sourceSpellName: string | null
    targetSpellName: string
}

export abstract class BaseEffect {
    private removeCallbacks: Record<string, {
        hooks: (() => void)[]
        intervals: (() => void)[]
    }> = {};

    get isInstant(): boolean {
        return true;
    }

    get selfCastAllowed(): boolean {
        return true;
    }

    get id(): number {
        let charCode: number;
        for (const [key, value] of Object.entries(getSpellEffects())) {
            if (value.name === this.name) {
                charCode = parseInt(key, 10);
                break;
            }
        }
        return charCode;
    }

    get name(): string {
        return null;
    }

    get atoms(): Atom[] {
        return [];
    }

    get description(): string {
        return null;
    }

    get parameters(): EffectParameter[] {
        return [];
    }

    get isActive(): boolean {
        if (this.isInstant) return false;
        const charCode = this.id;
        if (!charCode) return false;
        return modStorage.darkMagic?.state?.spells?.some((s) => s.effects.includes(String.fromCharCode(charCode)));
    }

    public isActiveOn(C: Character): boolean {
        if (this.isInstant) return false;
        if (C.IsPlayer()) return this.isActive;
        if (!C.BCC) return false
        const charCode = this.id;
        if (!charCode) return false;
        return C.BCC?.darkMagic?.state?.spells?.some((s) => s.effects.includes(String.fromCharCode(charCode)));
    }

    public getSpellsWithEffect(C: Character = Player) {
        const spells: ModStorage["darkMagic"]["state"]["spells"] = [];
        if (!this.isActiveOn(C)) return spells;
        const storage = C.IsPlayer() ? modStorage : C.BCC;
        for (const spell of (storage?.darkMagic?.state?.spells ?? []).toReversed()) {
            if (spell.effects?.includes(String.fromCharCode(this.id))) {
                spells.push(spell);
            }
        }
        return spells;
    }

    public getParameter<T>(name: string, C: Character = Player): T {
        if (!this.isActiveOn(C)) return null;
        const spells = this.getSpellsWithEffect(C);
        if (spells.length === 0) return null;
        const parameter = this.parameters.find((p) => p.name === name);
        let parameterValue = spells[0].data?.[String.fromCharCode(this.id)]?.[name] as T;
        if (parameter) {
            if (parameter.type === "boolean") parameterValue ??= false as T;
            if (parameter.type === "choice") parameterValue ??= parameter.options[0].name as T;
        }
        return parameterValue;
    }

    public setParameter(name: string, value: unknown, spellName: string) {
        if (!this.isActive) return;
        const spell = modStorage.darkMagic.state.spells.find((s) => s.name === spellName);
        if (!spell) return;
        spell.data ??= {};
        spell.data[String.fromCharCode(this.id)] ??= {};
        spell.data[String.fromCharCode(this.id)][name] = value;
    }

    protected hookFunction(event: TriggerEvent, fnName, hookPriority, fn) {
        const removeHook = hookFunction(fnName, hookPriority, fn);
        this.removeCallbacks[event.spellName].hooks.push(removeHook);
    }

    protected setInterval(event: TriggerEvent, callback: () => void, ms: number): void {
        const id = setInterval(callback, ms);
        this.removeCallbacks[event.spellName].intervals.push(() => clearInterval(id));
    }

    public trigger(event: TriggerEvent) {
        this.removeCallbacks[event.spellName] = {
            hooks: [],
            intervals: []
        };
    }

    public remove(event: RemoveEvent, push: boolean = true) {
        if (!this.isActive) return;
        for (const cb of this.removeCallbacks[event.targetSpellName].hooks) cb();
        for (const cb of this.removeCallbacks[event.targetSpellName].intervals) cb();
        delete this.removeCallbacks[event.targetSpellName];
        const spells = modStorage.darkMagic.state.spells;
        const spell = spells.find((s) => s.name === event.targetSpellName);
        spell.effects = spell.effects.replaceAll(String.fromCharCode(this.id), "");
        if (spell.effects.length === 0) {
            spells.splice(spells.findIndex((s) => s.name === event.targetSpellName), 1);
        }
        if (push) syncStorage();
    }

    public canCast(sourceCharacter: Character, targetCharacter: Character): {
        result: false
        reason: CastSpellRejectionReason
    } | {
        result: true
    } {
        if (sourceCharacter.MemberNumber === targetCharacter.MemberNumber) {
            if (!this.selfCastAllowed) return { result: false, reason: CastSpellRejectionReason.SELF_CAST_NOT_ALLOWED };
            return { result: true };
        }
        const effectsLimits = (targetCharacter.IsPlayer() ? modStorage : targetCharacter.BCC)?.darkMagic?.limits?.effects;
        const minimumRole = effectsLimits?.[String.fromCharCode(this.id)];
        switch (minimumRole) {
            case MinimumRole.EVERYONE:
                return { result: true };
            case MinimumRole.FRIEND:
                if (
                    //@ts-expect-error
                    sourceCharacter.FriendList?.includes(targetCharacter.MemberNumber) ||
                    //@ts-expect-error
                    targetCharacter.FriendList?.includes(sourceCharacter.MemberNumber)
                ) {
                    return { result: true };
                } else {
                    return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                }
            case MinimumRole.WHITELIST:
                if (
                    sourceCharacter.WhiteList?.includes(targetCharacter.MemberNumber) ||
                    targetCharacter.WhiteList?.includes(sourceCharacter.MemberNumber)
                ) {
                    return { result: true };
                } else {
                    return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                }
            case MinimumRole.LOVER:
                if (targetCharacter.IsLoverOfCharacter(sourceCharacter)) {
                    return { result: true };
                } else {
                    return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                }
            case MinimumRole.OWNER:
                if (targetCharacter.IsOwnedByCharacter(sourceCharacter)) {
                    return { result: true };
                } else {
                    return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                }
            default:
                if (this.atoms.includes(Atom.NOX)) return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                if (
                    //@ts-expect-error
                    sourceCharacter.FriendList?.includes(targetCharacter.MemberNumber) ||
                    //@ts-expect-error
                    targetCharacter.FriendList?.includes(sourceCharacter.MemberNumber)
                ) {
                    return { result: true };
                } else {
                    return { result: false, reason: CastSpellRejectionReason.EFFECTS_LIMITED };
                }
        }
    }
}