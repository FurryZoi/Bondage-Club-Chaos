import { Atom } from "../darkMagic";

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

export abstract class BaseEffect {
    get name(): string {
        return null;
    }

    get atoms(): Atom[] {
        return [];
    }

    get icon(): SVGElement {
        return null;
    }

    get description(): string {
        return null;
    }

    get parameters(): EffectParameter[] {
        return null;
    }
}