import type { BaseEffect } from "../spell-effects/baseEffect";
import { PurificatioEffect } from "../spell-effects/purificatioEffect";
import { SlumberCurseEffect } from "../spell-effects/slumberCurseEffect";
import { VocisAlteratioEffect } from "../spell-effects/vocisAlteratioEffect";
import luxIcon from "@/assets/game-icons/atoms/lux.svg";
import motusIcon from "@/assets/game-icons/atoms/motus.svg";
import noxIcon from "@/assets/game-icons/atoms/nox.svg";
import ratioIcon from "@/assets/game-icons/atoms/ratio.svg";
import gemitumIcon from "@/assets/game-icons/atoms/gemitum.svg";
import ignisIcon from "@/assets/game-icons/atoms/ignis.svg";
import materiaIcon from "@/assets/game-icons/atoms/materia.svg";
import beamsAuraIcon from "@/assets/game-icons/beamsAura.svg";
import cauldronIcon from "@/assets/game-icons/cauldron.svg";
import deathJuiceIcon from "@/assets/game-icons/deathJuice.svg";
import diceFireIcon from "@/assets/game-icons/diceFire.svg";
import doorIcon from "@/assets/game-icons/door.svg";
import evilBookIcon from "@/assets/game-icons/evilBook.svg";
import handcuffsIcon from "@/assets/game-icons/handcuffs.svg";
import hangingSpiderIcon from "@/assets/game-icons/hangingSpider.svg";
import hauntingIcon from "@/assets/game-icons/haunting.svg";
import heartsIcon from "@/assets/game-icons/hearts.svg";
import iceBoltIcon from "@/assets/game-icons/iceBolt.svg";
import loveInjectionIcon from "@/assets/game-icons/loveInjection.svg";
import magicPortalIcon from "@/assets/game-icons/magicPortal.svg";
import magicSwirlIcon from "@/assets/game-icons/magicSwirl.svg";
import mouthWateringIcon from "@/assets/game-icons/mouthWatering.svg";
import pawPrintIcon from "@/assets/game-icons/pawPrint.svg";
import plasticDuckIcon from "@/assets/game-icons/plasticDuck.svg";
import pumpkinMaskIcon from "@/assets/game-icons/pumpkinMask.svg";
import rearAuraIcon from "@/assets/game-icons/rearAura.svg";
import rollingEnergyIcon from "@/assets/game-icons/rollingEnergy.svg";
import spellBookIcon from "@/assets/game-icons/spellBook.svg";
import wolfTrapIcon from "@/assets/game-icons/wolfTrap.svg";
import { AnimaFurtaEffect } from "../spell-effects/animaFurtaEffect";
import { MasqueradaEffect } from "../spell-effects/masqueradaEffect";
import { NomenFraudisEffect } from "../spell-effects/nomenFraudisEffect";
import { SpatiumTransitusEffect } from "../spell-effects/spatiumTransitusEffect";
import { VisioInversioEffect } from "../spell-effects/visioInversioEffect";
import { VocisPrivatioEffect } from "../spell-effects/vocisPrivatioEffect";
import { modStorage, type ModStorage, syncStorage } from "./storage";
import { messagesManager } from "zois-core/messaging";
import { getNickname } from "zois-core";
import { hookFunction, HookPriority, patchFunction } from "zois-core/modsApi";
import { CastSpellMessageDto } from "@/dto/castSpellMessageDto";
import { TraditioArtiumEffect } from "@/spell-effects/traditioArtiumEffect";


let showAnimaFurtaWaitingButton = false;
const MAGIC_ITEMS = ["RainbowWand", "Broom", "AnimeGirlWand", "Baguette"];


export enum Atom {
    NOX = 1000,
    IGNIS = 1001,
    RATIO = 1002,
    LUX = 1003,
    GEMITUM = 1004,
    MOTUS = 1005,
    MATERIA = 1006
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
    VOCIS_PRIVATIO = 1008,
    TRADITIO_ARTIUM = 1009
};

export interface AtomItem {
    name: string
    iconDataUrl: string
    iconColor: string
    description: string
};

export enum MinimumRole {
    EVERYONE = 0,
    FRIEND = 1,
    WHITELIST = 2,
    LOVER = 3,
    OWNER = 4
};

export enum CastSpellRejectionReason {
    INTERACTIONS_NOT_ALLOWED = "INTERACTIONS_NOT_ALLOWED",
    NOT_BCC_PLAYER = "NOT_BCC_PLAYER",
    EFFECTS_LIMITED = "EFFECTS_LIMITED",
    NO_EFFECTS = "NO_EFFECTS",
    SPELLS_COUNT_LIMIT = "SPELLS_COUNT_LIMIT"
};

export const atoms: Record<Atom, AtomItem> = {
    [Atom.NOX]: {
        name: "Nox",
        iconDataUrl: noxIcon,
        iconColor: "black",
        description: "It is used in the most powerful and dangerous spells, which is why by default all these spells are limited in the permission settings for your safety"
    },
    [Atom.IGNIS]: {
        name: "Ignis",
        iconDataUrl: ignisIcon,
        iconColor: "orange",
        description: "The aspect used in spells for attack, self-defense, and so on"
    },
    [Atom.RATIO]: {
        name: "Ratio",
        iconDataUrl: ratioIcon,
        iconColor: "#ffd1d1",
        description: "It is used in spells which change the behavior of the target and encourage the performance of any actions"
    },
    [Atom.LUX]: {
        name: "Lux",
        iconDataUrl: luxIcon,
        iconColor: "yellow",
        description: "It is used in neutral safe spells, such as power-ups"
    },
    [Atom.GEMITUM]: {
        name: "Gemitum",
        iconDataUrl: gemitumIcon,
        iconColor: "red",
        description: "It is used in erotic spells..?"
    },
    [Atom.MOTUS]: {
        name: "Motus",
        iconDataUrl: motusIcon,
        iconColor: "#d4d0ff",
        description: "It is used in spells that move a target or make it move"
    },
    [Atom.MATERIA]: {
        name: "Materia",
        iconDataUrl: materiaIcon,
        iconColor: "#8f59fbff",
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
    [Effect.VOCIS_PRIVATIO]: new VocisPrivatioEffect(),
    [Effect.TRADITIO_ARTIUM]: new TraditioArtiumEffect()
};

export enum SpellIcon {
    BEAMS_AURA = "BeamsAura",
    CAULDRON = "Cauldron",
    DEATH_JUICE = "DeathJuice",
    DICE_FIRE = "DiceFire",
    DOOR = "Door",
    EVIL_BOOK = "EvilBook",
    HANDCUFFS = "Handcuffs",
    HANGING_SPIDER = "HangingSpider",
    HAUNTING = "Haunting",
    HEARTS = "Hearts",
    ICE_BOLT = "IceBolt",
    LOVE_INJECTION = "LoveInjection",
    MAGIC_PORTAL = "MagicPortal",
    MAGIC_SWIRL = "MagicSwirl",
    MOUTH_WATERING = "MouthWatering",
    PAW_PRINT = "PawPrint",
    PLASTIC_DUCK = "PlasticDuck",
    PUMPKIN_MASK = "PumpkinMask",
    REAR_AURA = "RearAura",
    ROLLING_ENERGY = "RollingEnergy",
    SPELL_BOOK = "SpellBool",
    WOLF_TRAP = "WolfTrap"
};

const spellIcons: {
    name: SpellIcon
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
            name: SpellIcon.DEATH_JUICE,
            dataurl: deathJuiceIcon
        },
        {
            name: SpellIcon.DICE_FIRE,
            dataurl: diceFireIcon
        },
        {
            name: SpellIcon.DOOR,
            dataurl: doorIcon
        },
        {
            name: SpellIcon.EVIL_BOOK,
            dataurl: evilBookIcon
        },
        {
            name: SpellIcon.HANDCUFFS,
            dataurl: handcuffsIcon
        },
        {
            name: SpellIcon.HANGING_SPIDER,
            dataurl: hangingSpiderIcon
        },
        {
            name: SpellIcon.HAUNTING,
            dataurl: hauntingIcon
        },
        {
            name: SpellIcon.HEARTS,
            dataurl: heartsIcon
        },
        {
            name: SpellIcon.ICE_BOLT,
            dataurl: iceBoltIcon
        },
        {
            name: SpellIcon.LOVE_INJECTION,
            dataurl: loveInjectionIcon
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
            name: SpellIcon.PAW_PRINT,
            dataurl: pawPrintIcon
        },
        {
            name: SpellIcon.PLASTIC_DUCK,
            dataurl: plasticDuckIcon
        },
        {
            name: SpellIcon.PUMPKIN_MASK,
            dataurl: pumpkinMaskIcon
        },
        {
            name: SpellIcon.REAR_AURA,
            dataurl: rearAuraIcon
        },
        {
            name: SpellIcon.ROLLING_ENERGY,
            dataurl: rollingEnergyIcon
        },
        {
            name: SpellIcon.SPELL_BOOK,
            dataurl: spellBookIcon
        },
        {
            name: SpellIcon.WOLF_TRAP,
            dataurl: wolfTrapIcon
        }
    ];

export function getSpellIcon(name: SpellIcon) {
    return spellIcons.find((s) => s.name === name);
}

export function getSpellIcons() {
    return spellIcons;
}

export function getSpellEffect(effectId: Effect) {
    return spellEffects[effectId];
}

export function getSpellEffects() {
    return spellEffects;
}

export function isMagicItem(item: Item): boolean {
    if (!item) return false;
    return MAGIC_ITEMS.includes(item?.Asset?.Name);
}

export function allowSpellCast(
    sourceCharacter: Character,
    targetCharacter: Character,
    spell: ModStorage["darkMagic"]["spells"][0]
): {
    result: false
    reason: CastSpellRejectionReason
} | {
    result: true
} {
    if (!ServerChatRoomGetAllowItem(sourceCharacter, targetCharacter)) {
        return {
            result: false,
            reason: CastSpellRejectionReason.INTERACTIONS_NOT_ALLOWED
        };
    }
    if (
        (!sourceCharacter.IsPlayer() && !sourceCharacter.BCC) ||
        (!targetCharacter.IsPlayer() && !targetCharacter.BCC)
    ) return { result: false, reason: CastSpellRejectionReason.NOT_BCC_PLAYER };
    if (spell.effects.length === 0) return { result: false, reason: CastSpellRejectionReason.NO_EFFECTS };
    const storage = targetCharacter.IsPlayer() ? modStorage : targetCharacter.BCC;
    if ((storage.darkMagic?.state?.spells ?? []).length >= 10 && !isSpellInstant(spell)) {
        return {
            result: false,
            reason: CastSpellRejectionReason.SPELLS_COUNT_LIMIT
        };
    }
    for (const effectChar of spell.effects.split("")) {
        const effect = getSpellEffect(effectChar.charCodeAt(0));
        const canCast = effect.canCast(sourceCharacter, targetCharacter);
        if (canCast.result === false) {
            return canCast;
        }
    }
    return { result: true };
}

export function isSpellInstant(spell: ModStorage["darkMagic"]["spells"][0]): boolean {
    return spell.effects.split("").every((c) => spellEffects[c.charCodeAt(0) as Effect].isInstant);
}

export function generateSpellName(name: string, attempt: number = 1): string {
    let search: string;
    if (attempt === 1) search = name;
    else search = `${name} (${attempt - 1})`;
    if (modStorage.darkMagic?.state?.spells.find((s) => s.name === search)) {
        return generateSpellName(name, attempt + 1);
    }
    return search;
}

export function processSpell(castedBy: Character, spell: ModStorage["darkMagic"]["spells"][0]) {
    if (!isSpellInstant(spell)) {
        modStorage.darkMagic ??= {};
        modStorage.darkMagic.state ??= {};
        modStorage.darkMagic.state.spells ??= [];
        modStorage.darkMagic.state.spells.push({
            name: generateSpellName(spell.name.trim()),
            icon: spell.icon,
            effects: spell.effects.split("").filter((c) => !spellEffects[c.charCodeAt(0) as Effect].isInstant).join(""),
            data: JSON.parse(JSON.stringify(spell.data ?? {})),
            createdBy: spell.createdBy,
            castedBy: {
                name: getNickname(castedBy),
                id: castedBy.MemberNumber
            }
        });
    }
    for (const c of spell.effects) {
        const effect: BaseEffect = spellEffects[c.charCodeAt(0)];
        effect.trigger({
            sourceCharacter: castedBy,
            data: JSON.parse(JSON.stringify(spell.data?.[c] ?? {})),
            spellName: spell.name,
            init: true
        });
    }
    syncStorage();
    messagesManager.sendAction(`Effects of "${spell.name}" spell was applied to ${getNickname(Player)}`);
}

export function castSpell(target: Character, spell: ModStorage["darkMagic"]["spells"][0]) {
    messagesManager.sendAction(`${getNickname(Player)} casts "${spell.name}" spell on ${getNickname(target)}`);
    if (target.IsPlayer()) {
        processSpell(target, spell);
    } else {
        messagesManager.sendPacket("castSpell", { spell }, target.MemberNumber);
    }
}

export async function loadDarkMagic(): Promise<void> {
    for (const spell of modStorage.darkMagic?.state?.spells ?? []) {
        for (const c of spell.effects) {
            const effect: BaseEffect = spellEffects[c.charCodeAt(0)]
            effect.trigger({
                sourceCharacter: undefined,
                data: spell.data?.[c],
                spellName: spell.name,
                init: false
            });
        }
    }

    messagesManager.onPacket("castSpell", CastSpellMessageDto, (data: CastSpellMessageDto, sender) => {
        console.log("Cast spell", data);
        const allow = allowSpellCast(sender, Player, data.spell);
        if (allow.result === false) return;
        processSpell(sender, data.spell);
    });

    hookFunction("ChatRoomToggleKneel", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        if (
            ![PoseChangeStatus.NEVER, PoseChangeStatus.NEVER_WITHOUT_AID].includes(
                PoseCanChangeUnaidedStatus(
                    controllableCharacter,
                    controllableCharacter.IsKneeling() ? "BaseLower" : "Kneel"
                )
            )
        ) {
            PoseSetActive(
                controllableCharacter,
                controllableCharacter.IsKneeling() ? "BaseLower" : "Kneel"
            );
            return messagesManager.sendPacket("animaFurtaCommand", {
                name: "toggleKneel"
            }, controllableCharacter.MemberNumber);
        }
        return next(args);
    });

    hookFunction("ChatRoomSendChat", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        messagesManager.sendPacket("animaFurtaCommand", {
            name: "sendMessage",
            message: (document.getElementById("InputChat") as HTMLTextAreaElement).value
        }, controllableCharacter.MemberNumber);
        (document.getElementById("InputChat") as HTMLTextAreaElement).value = "";
    });

    hookFunction("ChatRoomAllowItem", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        const data: ServerChatRoomAllowItemResponse = args[0];
        if (
            typeof data === "object" &&
            typeof data.MemberNumber === "number" &&
            typeof data.AllowItem === "boolean"
        ) {
            if (
                CurrentCharacter != null &&
                CurrentCharacter.MemberNumber === data.MemberNumber
            ) {
                data.AllowItem = ServerChatRoomGetAllowItem(controllableCharacter, CurrentCharacter);
                CurrentCharacter.AllowItem = data.AllowItem;
                CharacterSetCurrent(CurrentCharacter);
            }
        }
    });

    hookFunction("DialogCanUnlock", HookPriority.OBSERVE, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        const [target, item] = args;
        const lock = InventoryGetLock(item);
        if (!controllableCharacter.CanInteract()) return false;
        if (lock.Asset.Name === "ExclusivePadlock") return controllableCharacter.MemberNumber !== target.MemberNumber;
        if (lock.Asset.ExclusiveUnlock) {
            const allowedMembers = CommonConvertStringToArray(item.Property.MemberNumberListKeys);
            if (item.Property.MemberNumberListKeys != null) return allowedMembers.includes(controllableCharacter.MemberNumber);
            if (item.Property.LockMemberNumber === controllableCharacter.MemberNumber) return true;
        }
        if (lock.Asset.OwnerOnly && target.IsOwnedByMemberNumber(controllableCharacter.MemberNumber)) return true;
        if (lock.Asset.LoverOnly && target.IsLoverOfMemberNumber(controllableCharacter.MemberNumber)) return true;
        if (lock.Asset.FamilyOnly && target.IsInFamilyOfMemberNumber(controllableCharacter.MemberNumber)) return true;
        return false;
    });

    hookFunction("InventoryLock", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        args[3] = controllableCharacter.MemberNumber;
        return next(args);
    });

    hookFunction("Player.CanChangeOwnClothes", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        if ((getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter()) return false;
        return next(args);
    });

    hookFunction("Player.IsDeaf", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (controllableCharacter) {
            return controllableCharacter.IsDeaf();
        }
        return next(args);
    });

    hookFunction("Player.IsBlind", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (controllableCharacter) return controllableCharacter.IsBlind();
        return next(args);
    });

    hookFunction("Player.GetDeafLevel", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (controllableCharacter) return controllableCharacter.GetDeafLevel();
        return next(args);
    });

    hookFunction("Player.GetBlindLevel", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (controllableCharacter) return controllableCharacter.GetBlindLevel();
        return next(args);
    });

    hookFunction("Player.HasTints", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const effect = getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect;
        const controllableCharacter = effect.getControllableCharacter();
        if (controllableCharacter || effect.isActive) return true;
        return next(args);
    });

    hookFunction("Player.GetTints", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const effect = getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect;
        const controllableCharacter = effect.getControllableCharacter();
        if (controllableCharacter || effect.isActive) return [{ r: 0, g: 0, b: 100, a: 0.5 }];
        return next(args);
    });

    //@ts-expect-error
    window.getControllableC = () => (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
    patchFunction(
        "DrawCharacter",
        {
            "if (!C.IsPlayer() && !OverrideDark && (Player.IsBlind() || Player.HasTints())) {":
                `if (((getControllableC() && C.MemberNumber !== getControllableC().MemberNumber) || (!getControllableC() && !C.IsPlayer())) && !OverrideDark && (Player.IsBlind() || Player.HasTints())) {`
        }
    );

    hookFunction("PoseCanChangeUnaidedStatus", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        if (!args[0].IsPlayer()) return next(args);
        args[0] = controllableCharacter;
        return next(args);
    });

    hookFunction("Player.CanInteract", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        return controllableCharacter.CanInteract();
    });

    hookFunction("DialogInventoryAdd", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        const [C, item, isWorn, sortOrder] = args;
        const asset = item.Asset;
        if (asset.FamilyOnly && !controllableCharacter.IsInFamilyOfMemberNumber(C.MemberNumber)) return;
        if (asset.LoverOnly && !controllableCharacter.IsLoverOfCharacter(C)) return;
        if (asset.OwnerOnly && !C.IsOwnedByCharacter(controllableCharacter)) return;
        const inventoryItem = DialogInventoryCreateItem(C, item, isWorn, sortOrder);
        if (item.Craft != null) {
            inventoryItem.Craft = item.Craft;
            if (inventoryItem.SortOrder.charAt(0) === DialogSortOrder.Usable.toString()) inventoryItem.SortOrder = DialogSortOrder.PlayerFavoriteUsable.toString() + item.Asset.Description;
            if (inventoryItem.SortOrder.charAt(0) === DialogSortOrder.Unusable.toString()) inventoryItem.SortOrder = DialogSortOrder.PlayerFavoriteUnusable.toString() + item.Asset.Description;
        }
        DialogInventory.push(inventoryItem);
    });

    hookFunction("ChatRoomOpenWardrobeScreen", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        if (controllableCharacter?.CanInteract()) {
            const module = CurrentModule;
            const screen = CurrentScreen;
            const inChatRoom = ServerPlayerIsInChatRoom();
            if (inChatRoom) {
                ChatRoomHideElements();
                ChatRoomStatusUpdate("Wardrobe");
            }
            CharacterAppearanceLoadCharacter(controllableCharacter, (ready) => {
                //@ts-expect-error
                CommonSetScreen(module, screen);
                if (inChatRoom) {
                    ChatRoomShowElements();
                    ChatRoomStatusUpdate(null);
                    if (ready) {
                        messagesManager.sendPacket("animaFurtaCommand", {
                            name: "changeAppearance",
                            target: controllableCharacter.MemberNumber,
                            appearance: ServerAppearanceBundle(controllableCharacter.Appearance)
                        }, controllableCharacter.MemberNumber);
                    }
                }
            });
            return;
        }
        return next(args);
    });

    hookFunction("ChatRoomOpenInformationScreen", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        ChatRoomHideElements();
        ChatRoomStatusUpdate("Preference");
        InformationSheetLoadCharacter(controllableCharacter);
    });

    hookFunction("ChatRoomPublishAction", HookPriority.OVERRIDE_BEHAVIOR, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        const [C, Action, PrevItem, NextItem] = args;
        if (CurrentScreen !== "ChatRoom") return false;

        const dictionary = new DictionaryBuilder()
            .sourceCharacter(controllableCharacter)
            .destinationCharacter(C)
            .targetCharacter(C);

        if (PrevItem != null) {
            dictionary.asset(PrevItem.Asset, "PrevAsset", PrevItem.Craft && PrevItem.Craft.Name);
        }
        if (NextItem != null) {
            dictionary.asset(NextItem.Asset, "NextAsset", NextItem.Craft && NextItem.Craft.Name);
        }
        if (C.FocusGroup != null) {
            dictionary.focusGroup(C.FocusGroup.Name);
        }

        messagesManager.sendPacket("animaFurtaCommand", {
            name: "changeAppearance",
            appearance: ServerAppearanceBundle(C.Appearance),
            target: C.MemberNumber
        }, controllableCharacter.MemberNumber);
        messagesManager.sendPacket("animaFurtaCommand", {
            name: "publishAction",
            params: { Content: Action, Type: "Action", Dictionary: dictionary.build() }
        }, controllableCharacter.MemberNumber);
        return true;
    });

    hookFunction("ChatRoomMapViewMove", HookPriority.OVERRIDE_BEHAVIOR, async (args, next) => {
        if (showAnimaFurtaWaitingButton) return;
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (!controllableCharacter) return next(args);
        controllableCharacter.MapData.Pos.X += ((args[0] === "West") ? -1 : 0) + ((args[0] === "East") ? 1 : 0);
        controllableCharacter.MapData.Pos.Y += ((args[0] === "North") ? -1 : 0) + ((args[0] === "South") ? 1 : 0);
        showAnimaFurtaWaitingButton = true;
        setTimeout(() => { showAnimaFurtaWaitingButton = false; }, 1000);
        messagesManager.sendPacket("animaFurtaCommand", {
            name: "mapMove",
            pos: { x: controllableCharacter.MapData.Pos.X, y: controllableCharacter.MapData.Pos.Y, }
        }, controllableCharacter.MemberNumber);
    });

    hookFunction("ChatRoomViews.Map.DrawUi", HookPriority.OBSERVE, (args, next) => {
        const controllableCharacter = (getSpellEffect(Effect.ANIMA_FURTA) as AnimaFurtaEffect).getControllableCharacter();
        if (controllableCharacter && showAnimaFurtaWaitingButton) {
            DrawButton(790, 790, 200, 60, "Waiting...", "White");
        }
        return next(args);
    });

    //@ts-expect-error
    window.bccDrawGridCharacter = () => (window.getControllableC() ?? Player);
    patchFunction("ChatRoomMapViewDrawGrid", {
        "let ScreenX = (X - Player.MapData.Pos.X) * TileWidth + ChatRoomMapViewPerceptionRange * TileWidth;": "let ScreenX = (X - bccDrawGridCharacter().MapData.Pos.X) * TileWidth + ChatRoomMapViewPerceptionRange * TileWidth;",
        "let ScreenY = (Y - Player.MapData.Pos.Y) * TileHeight + ChatRoomMapViewPerceptionRange * TileWidth;": "let ScreenY = (Y - bccDrawGridCharacter().MapData.Pos.Y) * TileHeight + ChatRoomMapViewPerceptionRange * TileWidth;",
        "let MaxRange = Math.max(Math.abs(X - Player.MapData.Pos.X), Math.abs(Y - Player.MapData.Pos.Y));": "let MaxRange = Math.max(Math.abs(X - bccDrawGridCharacter().MapData.Pos.X), Math.abs(Y - bccDrawGridCharacter().MapData.Pos.Y));"
    });

    patchFunction("ChatRoomMapViewCalculatePerceptionMasks", {
        "if (ChatRoomMapViewHasSuperPowers()) {": "if (ChatRoomMapViewHasSuperPowers() || !bccDrawGridCharacter().IsPlayer()) {"
    });
}