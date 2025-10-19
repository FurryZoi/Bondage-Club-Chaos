import { version } from "@/../package.json";
import type { Effect, MinimumRole, SpellIcon } from "./darkMagic";
import { messagesManager } from "zois-core/messaging";
import { SyncStorageMessageData } from "@/types/messages";

export let modStorage: ModStorage = { version: "" };

export interface ModStorage {
    // Quick Access Menu
    qam?: {
        enabled?: boolean
        enabledFeatures?: string
        cloneBackup?: {
            nickName: string,
            labelColor: string,
            emoticon: {
                expression: ExpressionName,
                color: string
            },
            blush: {
                expression: ExpressionName
            },
            appearance: string,
            activePose: AssetPoseName[]
        }
    }
    chaosAura?: {
        enabled?: boolean
        retribution?: boolean
        whiteList?: {
            enabled?: boolean
            value?: number[]
        }
        triggers?: {
            itemsChange?: boolean
            clothesChange?: boolean
            magicCast?: boolean
            poseChange?: boolean
        }
        triggersCount?: number
        ignoreItemsChangeIfNotRestraint?: boolean
    }
    cheats?: {
        permanentSkillsBoost?: boolean
        autoTight?: boolean
        anonymousMode?: boolean
        allowActivities?: boolean
        mapSuperPower?: boolean
        xray?: boolean
        showPadlocksPasswords?: boolean
    }
    darkMagic?: {
        spells?: {
            name: string
            icon: SpellIcon
            effects: string
            data?: Record<string, unknown>
            createdBy: {
                name: string
                id: number
            }
        }[]
        limits?: {
            effects?: Record<string, MinimumRole>
        }
        state?: {
            spells?: (ModStorage["darkMagic"]["spells"][0] & { castedBy: { name: string, id: number } })[]
        }
    }
    version: string
}

export function loadStorage(): void {
    if (typeof Player.ExtensionSettings.BCC === "string") {
        modStorage = JSON.parse(LZString.decompressFromBase64(Player.ExtensionSettings.BCC)) ?? { version };
    } else modStorage = { version };
    if (!modStorage.version) modStorage.version = version;
    if (modStorage.version === "1.8.7") modStorage = { version };
    syncStorage();
    messagesManager.onPacket("syncStorage", (data: SyncStorageMessageData, sender) => {
        if (!sender.BCC) {
            messagesManager.sendPacket<SyncStorageMessageData>("syncStorage", {
                storage: JSON.parse(JSON.stringify(modStorage)),
            });
        }
        sender.BCC = data.storage;
    });
}

export function syncStorage(): void {
    if (typeof modStorage !== "object") return;
    Player.ExtensionSettings.BCC = LZString.compressToBase64(JSON.stringify(modStorage));
    ServerPlayerExtensionSettingsSync("BCC");
    messagesManager.sendPacket<SyncStorageMessageData>("syncStorage", {
        storage: JSON.parse(JSON.stringify(modStorage)),
    });
}

export function resetStorage(): void {
    modStorage = {
        version
    };
    syncStorage();
}