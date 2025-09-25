import { hookFunction, HookPriority } from "zois-core/modsApi";
import { BaseEffect } from "./spell-effects/baseEffect";
import { PurificatioEffect } from "./spell-effects/purificatioEffect";
import { SlumberCurseEffect } from "./spell-effects/slumberCurseEffect";
import { VocisAlteratioEffect } from "./spell-effects/vocisAlteratioEffect";
import fulgurIcon from "@/assets/game-icons/atoms/fulgur.svg";
import luxIcon from "@/assets/game-icons/atoms/lux.svg";
import motusIcon from "@/assets/game-icons/atoms/motus.svg";
import noxIcon from "@/assets/game-icons/atoms/nox.svg";
import ratioIcon from "@/assets/game-icons/atoms/ratio.svg";
import gemitumIcon from "@/assets/game-icons/atoms/gemitum.svg";
import ignisIcon from "@/assets/game-icons/atoms/ignis.svg";
import materiaIcon from "@/assets/game-icons/atoms/materia.svg";
import { AnimaFurtaEffect } from "./spell-effects/animaFurtaEffect";
import { MasqueradaEffect } from "./spell-effects/masqueradaEffect";
import { NomenFraudisEffect } from "./spell-effects/nomenFraudisEffect";
import { SpatiumTransitusEffect } from "./spell-effects/spatiumTransitusEffect";
import { VisioInversioEffect } from "./spell-effects/visioInversioEffect";
import { VocisPrivatioEffect } from "./spell-effects/vocisPrivatioEffect";
import { createElement } from "lucide";
import beamsAuraIcon from "@/assets/game-icons/beamsAura.svg";
import cauldronIcon from "@/assets/game-icons/cauldron.svg";
import evilBookIcon from "@/assets/game-icons/evilBook.svg";
import hauntingIcon from "@/assets/game-icons/haunting.svg";
import magicPortalIcon from "@/assets/game-icons/magicPortal.svg";
import magicSwirlIcon from "@/assets/game-icons/magicSwirl.svg";
import mouthWateringIcon from "@/assets/game-icons/mouthWatering.svg";
import spellBookIcon from "@/assets/game-icons/spellBook.svg";




export enum Atom {
    NOX = 1000,
    IGNIS = 1001,
    RATIO = 1002,
    LUX = 1003,
    GEMITUM = 1004,
    MOTUS = 1005,
    // FULGUR = 1006,
    MATERIA = 1007
};

export enum Effect {
    ANIMA_FURTA = 1000,
    MASQUERADA = 1001,
    NOMEN_FRAUDIS = 1002,
    PURIFICATIO = 1003,
    SLUMBER_CURSE = 1004,
    SPATIUM_TRANSITUS = 1005,
    VISIO_INVERSION = 1006,
    VOCIS_ALTERATIO = 1007,
    VOCIS_PRIVATIO = 1008
};

export interface AtomItem {
    name: string
    iconDataUrl: string
    description: string
};

export const atoms: Record<Atom, AtomItem> = {
    [Atom.NOX]: {
        name: "NOX",
        iconDataUrl: noxIcon,
        description: "It is used in the most powerful and dangerous spells, which is why by default all these spells are limited in the permission settings for your safety"
    },
    [Atom.IGNIS]: {
        name: "Ignis",
        iconDataUrl: ignisIcon,
        description: "The aspect used in spells for attack, self-defense, and so on"
    },
    [Atom.RATIO]: {
        name: "Ratio",
        iconDataUrl: ratioIcon,
        description: "It is used in spells which change the behavior of the target and encourage the performance of any actions"
    },
    [Atom.LUX]: {
        name: "Lux",
        iconDataUrl: luxIcon,
        description: "It is used in neutral safe spells, such as power-ups"
    },
    [Atom.GEMITUM]: {
        name: "Gemitum",
        iconDataUrl: gemitumIcon,
        description: "It is used in erotic spells..?"
    },
    [Atom.MOTUS]: {
        name: "Motus",
        iconDataUrl: motusIcon,
        description: "It is used in spells that move a target or make it move"
    },
    // [Atom.FULGUR]: {
    //     name: "Fulgur",
    //     iconDataUrl: fulgurIcon,
    //     description: "A very simple essence used in spells that leave no effects after they are cast"
    // },
    [Atom.MATERIA]: {
        name: "Materia",
        iconDataUrl: materiaIcon,
        description: "It is used in spells that change materia, that is, the space around you"
    }
};

export const spellEffects: Record<Effect, BaseEffect> = {
    [Effect.ANIMA_FURTA]: new AnimaFurtaEffect(),
    [Effect.MASQUERADA]: new MasqueradaEffect(),
    [Effect.NOMEN_FRAUDIS]: new NomenFraudisEffect(),
    [Effect.PURIFICATIO]: new PurificatioEffect(),
    [Effect.SLUMBER_CURSE]: new SlumberCurseEffect(),
    [Effect.SPATIUM_TRANSITUS]: new SpatiumTransitusEffect(),
    [Effect.VISIO_INVERSION]: new VisioInversioEffect(),
    [Effect.VOCIS_ALTERATIO]: new VocisAlteratioEffect(),
    [Effect.VOCIS_PRIVATIO]: new VocisPrivatioEffect()
};

export enum SpellIcon {
    BEAMS_AURA = "BeamsAura",
    CAULDRON = "Cauldron",
    EVIL_BOOK = "EvilBook",
    HAUNTING = "Haunting",
    MAGIC_PORTAL = "MagicPortal",
    MAGIC_SWIRL = "MagicSwirl",
    MOUTH_WATERING = "MouthWatering",
    SPELL_BOOK = "SpellBool"
}

const spellIcons: {
    name: string
    dataurl: string  
}[] = [
    {
        name: SpellIcon.BEAMS_AURA,
        dataurl: beamsAuraIcon,
    },
    {
        name: SpellIcon.CAULDRON,
        dataurl: cauldronIcon
    },
    {
        name: SpellIcon.EVIL_BOOK,
        dataurl: evilBookIcon
    },
    {
        name: SpellIcon.HAUNTING,
        dataurl: hauntingIcon
    },
    {
        name: SpellIcon.MAGIC_PORTAL,
        dataurl: magicPortalIcon
    },
    {
        name: SpellIcon.MAGIC_SWIRL,
        dataurl: magicSwirlIcon
    },
    {
        name: SpellIcon.MOUTH_WATERING,
        dataurl: mouthWateringIcon
    },
    {
        name: SpellIcon.SPELL_BOOK,
        dataurl: spellBookIcon
    }
];

export function getSpellIcon(name: SpellIcon) {
    return spellIcons.find((s) => s.name === name);
}

export function getSpellIcons() {
    return spellIcons;
}

export function loadDarkMagic(): void {
}