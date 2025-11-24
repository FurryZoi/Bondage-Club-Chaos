import mouthWateringIcon from "@/assets/game-icons/mouthWatering.svg";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { ArrowDown, ArrowUp, Check, ChevronDown, ChevronLeft, ClipboardCopy, ClipboardPaste, CopyPlus, createElement, Eye, Frown, GitBranchPlus, GitCommitVertical, GitCompareArrows, GitPullRequestArrow, Goal, HatGlasses, type IconNode, Lock, LogOut, MapPinned, PersonStanding, Settings, ShieldAlert, ShieldMinus, Target, Unlock, Wand } from "lucide";
import { getNickname, getPlayer, MOD_DATA } from "zois-core";
import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/popups";
import { addDynamicClass, DynamicClassStyles, setSubscreen } from "zois-core/ui";
import { appearanceComparer, importAppearance, serverAppearanceBundleToAppearance } from "zois-core/wardrobe";
import { addDefaultParametersIfNeeds, allowSpellCast, castSpell, getSpellEffect, getSpellIcon, isMagicItem } from "./darkMagic";
import { type ModStorage, modStorage, syncStorage } from "./storage";
import { validateData } from "zois-core/validation";
import { CastSpellMessageDto } from "@/dto/castSpellMessageDto";
import { hookFunction, HookPriority } from "zois-core/modsApi";
import type { BaseQAMSubscreen } from "@/qam-subscreens/baseQAMSubscreen";
import { MainQAMSubscreen } from "@/qam-subscreens/mainQAMSubscreen";
import { ToggleInvisibilityQAMSubscreen } from "@/qam-subscreens/toggleInvisibilityQAMSubscreen";
import { PosesManagerQAMSubscreen } from "@/qam-subscreens/posesManagerQAMSubscreen";
import { ImportAppearanceQAMSubscreen } from "@/qam-subscreens/importAppearanceQAMSubscreen";
import { ExportAppearanceQAMSubscreen } from "@/qam-subscreens/exportAppearanceQAMSubscreen";
import { LeaveRoomQAMSubscreen } from "@/qam-subscreens/leaveRoomQAMSubscreen";
import { TotalReleaseQAMSubscreen } from "@/qam-subscreens/totalReleaseQAMSubscreen";
import { ReleaseQAMSubscreen } from "@/qam-subscreens/releaseQAMSubscreen";
import { MapTeleportQAMSubscreen } from "@/qam-subscreens/mapTeleportQAMSubscreen";
import { CloneQAMSubscreen } from "@/qam-subscreens/cloneQAMSubscreen";
import { ViewCardDecksQAMSubscreen } from "@/qam-subscreens/viewCardDecksQAMSubscreen";
import { CastSpellQAMSubscreen } from "@/qam-subscreens/castSpellQAMSubscreen";
import { PutLocksQAMSubscreen } from "@/qam-subscreens/putLocksQAMSubscreen";
import { RemoveLocksQAMSubscreen } from "@/qam-subscreens/removeLocksQAMSubscreen";
import { AVQS_QAMSubscreen } from "@/qam-subscreens/avcsQAMSubscreen";

export let serverPing: number;
let currentSubscreen: BaseQAMSubscreen;
const LOCAL_STORAGE_POS_KEY = "BCC_QAMButton_Pos";
let commitHashGenerationToken = Date.now().toString(16);

export interface QAMFeature {
    id: number
    subscreen: BaseQAMSubscreen
    icon: IconNode
    isBeta?: boolean
}

class Draggable {
    protected isReadyForDragging: boolean = false;
    protected isDragging: boolean = false;
    protected wasDragged: boolean = false;
    protected offset: { x: number, y: number };
    protected previousMousePositionX: number;
    protected previousMousePositionY: number;

    constructor(
        protected draggableElement: HTMLElement,
        protected captureElement: HTMLElement
    ) {
        this.offset = { x: 0, y: 0 };
        this.init();
    }

    protected init() {
        this.captureElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // touch devices
        this.captureElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        this.captureElement.addEventListener('click', this.onClick.bind(this));
    }

    protected onMouseDown(e: MouseEvent) {
        if (e.currentTarget === this.captureElement) {
            this.isReadyForDragging = true;
            this.offset = {
                x: e.clientX - this.draggableElement.getBoundingClientRect().left,
                y: e.clientY - this.draggableElement.getBoundingClientRect().top
            };
        }
    }

    protected onMouseMove(e: MouseEvent) {
        if (this.previousMousePositionX === e.clientX && this.previousMousePositionY === e.clientY) return;

        this.previousMousePositionX = e.clientX;
        this.previousMousePositionY = e.clientY;

        if (!this.isReadyForDragging) return;

        const x = e.clientX - this.offset.x;
        const y = e.clientY - this.offset.y;

        if (x >= 0 && (x + this.draggableElement.offsetWidth) <= window.innerWidth) this.draggableElement.style.left = x + 'px';
        if (y >= 0 && (y + this.draggableElement.offsetHeight) <= window.innerHeight) this.draggableElement.style.top = y + 'px';
        this.isDragging = true;
    }

    protected onMouseUp() {
        if (this.isReadyForDragging) this.isReadyForDragging = false;
        if (this.isDragging) {
            this.isDragging = false;
            this.wasDragged = true;
            setTimeout(() => { this.wasDragged = false; }, 100);
        }
    }

    protected onTouchStart(e: TouchEvent) {
        if (e.currentTarget === this.captureElement) {
            this.isReadyForDragging = true;
            const touch = e.touches[0];
            this.offset = {
                x: touch.clientX - this.draggableElement.getBoundingClientRect().left,
                y: touch.clientY - this.draggableElement.getBoundingClientRect().top
            };
        }
    }

    protected onTouchMove(e: TouchEvent) {
        const touch = e.touches[0];
        if (this.previousMousePositionX === touch.clientX && this.previousMousePositionY === touch.clientY) return;

        this.previousMousePositionX = touch.clientX;
        this.previousMousePositionY = touch.clientY;

        if (!this.isReadyForDragging) return;

        const x = touch.clientX - this.offset.x;
        const y = touch.clientY - this.offset.y;

        if (x >= 0 && (x + this.draggableElement.offsetWidth) <= window.innerWidth) this.draggableElement.style.left = x + 'px';
        if (y >= 0 && (y + this.draggableElement.offsetHeight) <= window.innerHeight) this.draggableElement.style.top = y + 'px';
        this.isDragging = true;
    }

    protected onTouchEnd() {
        if (this.isReadyForDragging) this.isReadyForDragging = false;
        if (this.isDragging) {
            this.isDragging = false;
            this.wasDragged = true;
            setTimeout(() => { this.wasDragged = false; }, 100);
        }
    }

    protected onClick() { }
}

class QAMButton extends Draggable {
    protected onMouseUp() {
        super.onMouseUp();
        if (this.wasDragged && typeof localStorage.setItem === "function") {
            const { top, left } = this.draggableElement.getBoundingClientRect();
            localStorage.setItem(LOCAL_STORAGE_POS_KEY, `${top}:${left}`);
        }
    }

    protected onClick() {
        if (this.isDragging || this.wasDragged) return;
        const qam: HTMLDivElement = document.querySelector(".bccQAM");
        if (qam) {
            qam.style.display = qam.style.display === "none" ? "flex" : "none";
            currentSubscreen = null;
        } else {
            const d = document.createElement("div");
            d.classList.add("bccQAM");
            document.body.append(d);
            setQAMSubscreen(new MainQAMSubscreen());
        }

    }
}


export class QAMWindow extends Draggable {
    protected onMouseMove(e: MouseEvent) {
        this.draggableElement.style.transform = "none";
        super.onMouseMove(e);
    }
}

export function isBannedBy(C: Character): boolean {
    return C.HasOnBlacklist(Player);
}

export function isAllowScripts(target: Character = Player) {
    let allowHide = ValidationHasScriptPermission(
        target,
        "Hide",
        ScriptPermissionLevel.PUBLIC
    );
    let allowBlock = ValidationHasScriptPermission(
        target,
        "Block",
        ScriptPermissionLevel.PUBLIC
    );

    if (target.IsPlayer()) {
        if (!allowHide) {
            allowHide = ValidationHasScriptPermission(
                target,
                "Hide",
                ScriptPermissionLevel.SELF
            );
        }
        if (!allowBlock) {
            allowBlock = ValidationHasScriptPermission(
                target,
                "Block",
                ScriptPermissionLevel.SELF
            );
        }
    }
    if (target.IsOwnedByPlayer()) {
        if (!allowHide) {
            allowHide = ValidationHasScriptPermission(
                target,
                "Hide",
                ScriptPermissionLevel.OWNER
            );
        }
        if (!allowBlock) {
            allowBlock = ValidationHasScriptPermission(
                target,
                "Block",
                ScriptPermissionLevel.OWNER
            );
        }
    }
    if (target.IsLoverOfPlayer()) {
        if (!allowHide) {
            allowHide = ValidationHasScriptPermission(
                target,
                "Hide",
                ScriptPermissionLevel.LOVERS
            );
        }
        if (!allowBlock) {
            allowBlock = ValidationHasScriptPermission(
                target,
                "Block",
                ScriptPermissionLevel.LOVERS
            );
        }
    }
    if (target.WhiteList.includes(Player.MemberNumber)) {
        if (!allowHide) {
            allowHide = ValidationHasScriptPermission(
                target,
                "Hide",
                ScriptPermissionLevel.WHITELIST
            );
        }
        if (!allowBlock) {
            allowBlock = ValidationHasScriptPermission(
                target,
                "Block",
                ScriptPermissionLevel.WHITELIST
            );
        }
    }
    if (Player.FriendList.includes(target.MemberNumber)) {
        if (!allowHide) {
            allowHide = ValidationHasScriptPermission(
                target,
                "Hide",
                ScriptPermissionLevel.FRIENDS
            );
        }
        if (!allowBlock) {
            allowBlock = ValidationHasScriptPermission(
                target,
                "Block",
                ScriptPermissionLevel.FRIENDS
            );
        }
    }

    return {
        hide: allowHide,
        block: allowBlock,
    };
}


export function setQAMSubscreen(s: BaseQAMSubscreen): void {
    if (!document.querySelector(".bccQAM")) return;
    const container = document.querySelector<HTMLDivElement>(".bccQAM");
    container.innerHTML = "";
    s.load(container);
    currentSubscreen = s;
}

export function toggleFeature(id: number): void {
    modStorage.qam ??= {};
    modStorage.qam.enabledFeatures ??= "";
    const char = String.fromCharCode(id);
    if (modStorage.qam.enabledFeatures.includes(char)) {
        modStorage.qam.enabledFeatures = modStorage.qam.enabledFeatures.replaceAll(char, "");
    } else modStorage.qam.enabledFeatures += String.fromCharCode(id);
    setQAMSubscreen(new MainQAMSubscreen());
}

export function isFeatureEnabled(id: number): boolean {
    const char = String.fromCharCode(id);
    return modStorage.qam?.enabledFeatures?.includes(char);
}

export const qamFeatures: QAMFeature[] = [
    {
        id: 1000,
        subscreen: new ToggleInvisibilityQAMSubscreen(),
        icon: HatGlasses,
    },
    {
        id: 1001,
        subscreen: new PosesManagerQAMSubscreen(),
        icon: PersonStanding,
    },
    {
        id: 1002,
        subscreen: new ImportAppearanceQAMSubscreen(),
        icon: ClipboardPaste,
    },
    {
        id: 1003,
        subscreen: new ExportAppearanceQAMSubscreen(),
        icon: ClipboardCopy,
    },
    {
        id: 1004,
        subscreen: new LeaveRoomQAMSubscreen(),
        icon: LogOut,
    },
    {
        id: 1005,
        subscreen: new TotalReleaseQAMSubscreen(),
        icon: ShieldAlert,
    },
    {
        id: 1006,
        subscreen: new ReleaseQAMSubscreen(),
        icon: ShieldMinus
    },
    {
        id: 1007,
        subscreen: new MapTeleportQAMSubscreen(),
        icon: MapPinned,
    },
    {
        id: 1008,
        subscreen: new CloneQAMSubscreen(),
        icon: CopyPlus
    },
    {
        id: 1009,
        subscreen: new ViewCardDecksQAMSubscreen(),
        icon: Eye
    },
    {
        id: 1010,
        subscreen: new CastSpellQAMSubscreen(),
        icon: Wand
    },
    {
        id: 1011,
        subscreen: new PutLocksQAMSubscreen(),
        icon: Lock
    },
    {
        id: 1012,
        subscreen: new RemoveLocksQAMSubscreen(),
        icon: Unlock
    },
    {
        id: 1013,
        subscreen: new AVQS_QAMSubscreen(),
        icon: GitCompareArrows,
        isBeta: true
    }
];

export function createQAMButton(): void {
    const menuButton = document.createElement("button");
    menuButton.classList.add("bccQAMButton");
    const icon = document.createElement("img");
    icon.src = mouthWateringIcon;
    menuButton.append(icon);
    document.body.append(menuButton);
    new QAMButton(menuButton, menuButton);
    if (typeof localStorage.getItem === "function") {
        const pos = localStorage.getItem(LOCAL_STORAGE_POS_KEY)?.split(":");
        if (pos) {
            menuButton.style.top = pos[0] + "px";
            menuButton.style.left = pos[1] + "px";
        }
    }
}

export function removeQuickMenu(): void {
    document.querySelector(".bccQAMButton")?.remove();
}

export async function pingServer() {
    const d1 = Date.now();
    const res = await fetch(window.location.href);
    if (res.status < 400) serverPing = Date.now() - d1;
}

interface BaseCommit {
    bundle: {
        seed: number
        content: AppearanceBundle
    }
    type: "initial" | "push" | "revert"
}

interface InitialCommit extends BaseCommit {
    type: "initial"
}

interface PushCommit extends BaseCommit {
    bundle: BaseCommit["bundle"] & {
        difference: {
            added: string[],
            modified: string[],
            removed: string[]
        }
    }
    sourceCharacter: {
        name: string
        memberNumber: number
    }
    timestamp: number
    type: "push"
}

interface RevertCommit extends BaseCommit {
    bundle: BaseCommit["bundle"] & {
        difference: {
            added: string[],
            modified: string[],
            removed: string[]
        }
    }
    sourceCharacter: {
        name: string
        memberNumber: number
    }
    timestamp: number
    type: "revert"
}

export type Commit = PushCommit | RevertCommit | InitialCommit;

export const commits = new Map<number, Commit[]>();
export const commitsBehindCount = new Map<number, number>();

function addCommit(sourceCharacter: Character, targetCharacter: Character) {
    const _commits = commits.get(targetCharacter.MemberNumber) ?? [];
    const prevCommit = _commits[0];
    const seed = appearanceComparer.getSeed(targetCharacter.Appearance);
    if (!prevCommit) {
        _commits.unshift({
            bundle: {
                seed,
                content: ServerAppearanceBundle(targetCharacter.Appearance)
            },
            type: "initial"
        });
    } else {
        const prevSeed = prevCommit.bundle.seed;
        if (prevSeed === seed) return;
        const revertCommitsFollowingThisCommit = _commits.find((c) => c.bundle.seed === seed);
        _commits.unshift({
            bundle: {
                seed,
                content: ServerAppearanceBundle(targetCharacter.Appearance),
                difference: appearanceComparer.getDifference(serverAppearanceBundleToAppearance("Female3DCG", prevCommit.bundle.content), targetCharacter.Appearance)
            },
            sourceCharacter: {
                name: CharacterNickname(sourceCharacter),
                memberNumber: sourceCharacter.MemberNumber
            },
            timestamp: Date.now(),
            type: revertCommitsFollowingThisCommit ? "revert" : "push"
        });
    }
    commits.set(targetCharacter.MemberNumber, _commits);
}

export function loadQuickAccessMenu(): void {
    if (modStorage.qam?.enabled) createQAMButton();
    pingServer();

    addCommit(Player, Player);
    commitsBehindCount.set(Player.MemberNumber, 0);

    if (ServerPlayerIsInChatRoom()) {
        ChatRoomCharacter.forEach((C) => {
            if (!C.IsPlayer()) addCommit(null, C);
        });
    }

    setInterval(() => {
        if (!currentSubscreen || currentSubscreen.name !== "BONDAGE CLUB CHAOS") return;
        pingServer();
    }, 10_000);

    hookFunction("ChatRoomCharacterItemUpdate", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [target, group] = args;
        addCommit(Player, target);
    });

    hookFunction("ChatRoomSyncItem", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [data] = args;
        const item = data?.Item;
        const target1 = getPlayer(data?.Source);
        const target2 = getPlayer(item?.Target);
        if (!target1 || !target2) return;
        addCommit(target1, target2);
    });

    hookFunction("ChatRoomSyncSingle", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [data] = args;
        const target1 = getPlayer(data?.SourceMemberNumber);
        const target2 = getPlayer(data?.Character?.MemberNumber);
        if (!target1 || !target2) return;
        addCommit(target1, target2);
    });

    hookFunction("ChatRoomSync", HookPriority.OBSERVE, async (args, next) => {
        await next(args);
        const [data] = args;
        const playerCommits = commits.get(Player.MemberNumber);
        commits.clear();
        commits.set(Player.MemberNumber, playerCommits);
        ChatRoomCharacter.forEach((C) => {
            if (!C.IsPlayer()) addCommit(null, C);
        });
    });

    hookFunction("ChatRoomSyncMemberJoin", HookPriority.OBSERVE, (args, next) => {
        next(args);
        const [data] = args;
        addCommit(null, getPlayer(data.SourceMemberNumber));
    });
}