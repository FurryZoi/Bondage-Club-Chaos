import mouthWateringIcon from "@/assets/game-icons/mouthWatering.svg";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { ArrowDown, ArrowUp, Check, ChevronDown, ChevronLeft, ClipboardCopy, ClipboardPaste, CopyPlus, createElement, Eye, Frown, HatGlasses, type IconNode, Lock, LogOut, MapPinned, PersonStanding, Settings, ShieldAlert, ShieldMinus, Target, Unlock, Wand } from "lucide";
import { getNickname, getPlayer, MOD_DATA } from "zois-core";
import { messagesManager } from "zois-core/messaging";
import { toastsManager } from "zois-core/popups";
import { addDynamicClass, DynamicClassStyles, setSubscreen } from "zois-core/ui";
import { importAppearance, serverAppearanceBundleToAppearance } from "zois-core/wardrobe";
import { addDefaultParametersIfNeeds, allowSpellCast, castSpell, getSpellEffect, getSpellIcon, isMagicItem } from "./darkMagic";
import { type ModStorage, modStorage, syncStorage } from "./storage";
import { validateData } from "zois-core/validation";
import { CastSpellMessageDto } from "@/dto/castSpellMessageDto";

let serverPing: number;
let currentSubscreen: QAMSubscreen;
let qamScrollTop: number;
const LOCAL_STORAGE_POS_KEY = "BCC_QAMButton_Pos";

interface QAMSubscreen {
    name: string
    description?: string
    load: (container: Element) => void
}

interface QAMItem {
    id: number
    name: string
    icon: IconNode
}

class Draggable {
    private element: HTMLElement;
    private isReadyForDragging: boolean;
    private isDragging: boolean;
    private wasDragged: boolean;
    private offset: { x: number, y: number };

    constructor(element: HTMLElement) {
        this.element = element;
        this.isDragging = false;
        this.offset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // touch devices
        this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        this.element.addEventListener('click', this.onClick.bind(this));
    }

    onMouseDown(e: MouseEvent) {
        if (e.target === this.element) {
            this.isReadyForDragging = true;
            this.offset = {
                x: e.clientX - this.element.getBoundingClientRect().left,
                y: e.clientY - this.element.getBoundingClientRect().top
            };
            e.preventDefault();
        }
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isReadyForDragging) return;

        const x = e.clientX - this.offset.x;
        const y = e.clientY - this.offset.y;

        if (x >= 0 && (x + this.element.offsetWidth) <= window.innerWidth) this.element.style.left = x + 'px';
        if (y >= 0 && (y + this.element.offsetHeight) <= window.innerHeight) this.element.style.top = y + 'px';
        this.isDragging = true;
    }

    onMouseUp() {
        if (this.isReadyForDragging) this.isReadyForDragging = false;
        if (this.isDragging) {
            this.isDragging = false;
            this.wasDragged = true;
            if (typeof localStorage.setItem === "function") {
                const { top, left } = this.element.getBoundingClientRect();
                localStorage.setItem(LOCAL_STORAGE_POS_KEY, `${top}:${left}`);
            }
            setTimeout(() => { this.wasDragged = false }, 100);
        }
    }

    onTouchStart(e: TouchEvent) {
        if (e.target === this.element) {
            this.isReadyForDragging = true;
            const touch = e.touches[0];
            this.offset = {
                x: touch.clientX - this.element.getBoundingClientRect().left,
                y: touch.clientY - this.element.getBoundingClientRect().top
            };
            e.preventDefault();
        }
    }

    onTouchMove(e: TouchEvent) {
        if (!this.isReadyForDragging) return;

        const touch = e.touches[0];
        const x = touch.clientX - this.offset.x;
        const y = touch.clientY - this.offset.y;

        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        e.preventDefault();
        this.isDragging = true;
    }

    onTouchEnd() {
        if (this.isDragging) {
            this.isReadyForDragging = false;
            this.isDragging = false;
            this.wasDragged = true;
            setTimeout(() => { this.wasDragged = false }, 100);
        }
    }

    onClick() {
        if (this.isDragging || this.wasDragged) return;
        if (document.querySelector(".bccQAM")) {
            document.querySelector(".bccQAM").remove();
            currentSubscreen = null;
            return;
        }
        const d = document.createElement("div");
        d.classList.add("bccQAM");
        document.body.append(d);
        setQAMSubscreen(quickMenuSubscreens[0]);
    }
}

function getServer() {
    if (window.location.host === "www.bondageprojects.elementfx.com") return "America";
    if (window.location.host === "www.bondage-europe.com") return "Europe";
    if (window.location.host === "www.bondage-asia.com") return "Asia";
    return "Not defined";
}

function isBannedBy(C: Character): boolean {
    return C.HasOnBlacklist(Player);
}

function isAllowScripts(target: Character = Player) {
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

const quickMenuBuilder = {
    buildButton(text: string) {
        const btn = document.createElement("button");
        addDynamicClass(btn, {
            base: {
                cursor: "pointer",
                border: "none",
                padding: "0.65em",
                margin: "0.25em 1em",
                background: "#7e00ff",
                borderRadius: "4px",
                color: "white"
            },
            hover: {
                background: "rgb(143, 82, 255)"
            }
        });
        btn.textContent = text;
        return btn;
    },
    buildDescription(content: string) {
        const text = document.createElement("p");
        text.style.cssText = "padding: 0.65em; border-radius: 5px; border: 2px solid #d5d5d5; background: #f8f8f8; margin: 0.25em 1em;";
        text.textContent = content;
        return text;
    },
    buildSelect({
        onChange,
        options,
        currentOption
    }: {
        onChange: (value: string) => void,
        options: {
            name: string
            text: string
            icon?: SVGElement
        }[],
        currentOption: string
    }) {
        let isOpened = false;
        let optionsContainer: HTMLDivElement;

        const select = document.createElement("div");
        select.classList.add("bccQAMSelect");
        select.style.margin = "0.25em 1em";
        select.style.position = "relative";
        select.setAttribute("opened", false);
        select.addEventListener("click", () => {
            if (options.length === 0) return;
            if (isOpened) {
                isOpened = false;
                select.style.zIndex = "10";
                optionsContainer.remove();
            } else {
                isOpened = true;
                select.style.zIndex = "100";
                optionsContainer = document.createElement("div");
                optionsContainer.setAttribute(
                    "data-position",
                    select.offsetTop > (window.innerHeight / 2 - select.offsetHeight / 2) ? "top" : "bottom"
                );
                options.forEach((option) => {
                    const e = document.createElement("div");
                    e.style.cssText = "display: flex; align-items: center; column-gap: 0.5em;";
                    if (option.icon) {
                        option.icon.style.cssText = "color: #bcbcbc;";
                        e.append(option.icon);
                    }
                    e.append(option.text);
                    if (option.name === currentOption) {
                        e.append(checkmark);
                    }
                    e.addEventListener("click", () => {
                        currentOption = option.name;
                        p.textContent = option.text;
                        optionsContainer.remove();
                        if (onChange) onChange(option.name);
                    });
                    optionsContainer.append(e);
                });
                select.append(optionsContainer);
            }
        });

        const p = document.createElement("p");
        p.style.paddingRight = "2em";
        if (options.length === 0) {
            p.textContent = "No options";
        } else {
            p.textContent = options.find((option) => option.name === currentOption)?.text ?? "Unknown";
        }

        const arrow = createElement(ChevronDown);
        const checkmark = createElement(Check);
        checkmark.style.cssText = "position: absolute; right: 0.25em;";

        select.append(p, arrow);
        return select;
    },
    buildCharacterSelect(onChange?: (value: Character) => void) {
        // const icon = ;
        const select = quickMenuBuilder.buildSelect({
            onChange: (value) => {
                const target = getPlayer(parseInt(value, 10));
                if (onChange && target) onChange(target);
            },
            options: (ChatRoomCharacter.length === 0 ? [Player] : ChatRoomCharacter)
                .map((c) => {
                    return {
                        name: c.MemberNumber.toString(),
                        text: c.Name + `(${c.MemberNumber})`,
                        icon: createElement(Target, { stroke: "red" })
                    };
                }),
            currentOption: Player.MemberNumber.toString()
        });
        return select;
    },
    buildInput(placeholder: string) {
        const input = document.createElement("input");
        input.style.cssText = "border: none; background: #ebebeb; padding: 0.65em; margin: 0.25em 1em; border-radius: 5px;";
        input.placeholder = placeholder;
        return input;
    }
};

function setQAMSubscreen(s: QAMSubscreen): void {
    if (!document.querySelector(".bccQAM")) return;
    const container = document.querySelector(".bccQAM");
    container.innerHTML = "";
    const header = document.createElement("div");
    header.style.cssText = "display: flex; align-items: center; justify-content: space-between;";
    const title = document.createElement("p");
    title.textContent = s.name;
    title.style.cssText = "font-weight: bold; padding: 0.5em 1em; text-align: center; font-size: clamp(10px, 5vw, 24px); width: 100%; letter-spacing: 0.08em;";
    if (s.name === "BONDAGE CLUB CHAOS") {
        title.style.textShadow = "rgb(102, 0, 218) -0.095em -0.05em 0px";
        title.style.letterSpacing = "0.05em";
        title.style.fontFamily = "Finger Paint";
    } else {
        const backBtn = document.createElement("button");
        backBtn.style.cssText = "cursor: pointer; background: none; border: none;";
        backBtn.append(createElement(ChevronLeft));
        backBtn.addEventListener("click", () => {
            setQAMSubscreen(quickMenuSubscreens[0]);
        });
        header.append(backBtn);
    }
    header.append(title);
    container.append(header);
    if (s.description) container.append(quickMenuBuilder.buildDescription(s.description));
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
    setQAMSubscreen(quickMenuSubscreens[0]);
}

export function isFeatureEnabled(id: number): boolean {
    const char = String.fromCharCode(id);
    return modStorage.qam?.enabledFeatures?.includes(char);
}

export const quickMenuSubscreens: QAMSubscreen[] = [
    {
        name: "BONDAGE CLUB CHAOS",
        load: (container) => {
            const searchInput = document.createElement("input");
            searchInput.style.cssText = "border: none !important; outline: none !important; background: none; width: 100%; padding: 0.65em; margin: 0.25em 0;";
            searchInput.placeholder = "Search...";
            searchInput.addEventListener("input", () => {
                setItems(
                    quickMenuItems.filter((i) => isFeatureEnabled(i.id) && i.name.toLowerCase().includes(searchInput.value.toLowerCase()))
                );
            });
            container.append(searchInput);

            const buttonsContainer = document.createElement("div");
            buttonsContainer.style.cssText = "max-height: 50vh; overflow-y: auto; scrollbar-width: none;";
            container.append(buttonsContainer);

            const setItems = (items: QAMItem[]) => {
                buttonsContainer.innerHTML = "";
                items.forEach((b) => {
                    const btn = document.createElement("button");
                    addDynamicClass(btn, {
                        base: {
                            display: "flex",
                            alignItems: "center",
                            columnGap: "0.45em",
                            cursor: "pointer",
                            fontSize: "clamp(10px, 10vw, 30px)",
                            background: "none",
                            border: "none",
                            padding: "0.25em",
                            borderTop: "1px solid #e5e5e5",
                            width: "100%"
                        },
                        hover: {
                            background: "#eeeeee"
                        }
                    });

                    const detailsContainer = document.createElement("div");
                    detailsContainer.style.cssText = "display: flex; flex-direction: column; align-items: flex-start; row-gap: 4px;";

                    const name = document.createElement("span");
                    name.style.fontSize = "clamp(10px, 5vw, 22px)";
                    name.textContent = b.name;

                    const description = document.createElement("span");
                    description.style.fontSize = "clamp(8px, 1vw, 16px)";
                    description.style.color = "#878787";
                    description.style.maxWidth = "calc(340px - clamp(10px, 8vw, 35px) - 0.45em)";
                    description.style.whiteSpace = "nowrap";
                    description.style.overflow = "clip";
                    description.style.textOverflow = "ellipsis";
                    description.style.padding = "2px";
                    description.textContent = quickMenuSubscreens.find((s) => s.name === b.name)?.description;

                    const icon = createElement(b.icon);
                    icon.style.cssText = "background: rgb(228 215 255 / 65%); flex-shrink: 0; width: clamp(10px, 8vw, 35px); height: clamp(10px, 8vw, 35px); padding: 4px; stroke: #7e63b6; border-radius: 4px;";
                    btn.addEventListener("click", () => {
                        const subscreen = quickMenuSubscreens.find((s) => s.name === b.name);
                        if (!subscreen) return console.warn(`Subscreen "${b.name}" is not exists`);
                        qamScrollTop = buttonsContainer.scrollTop;
                        setQAMSubscreen(subscreen);
                    });
                    detailsContainer.append(name, description);
                    btn.append(icon, detailsContainer);
                    buttonsContainer.append(btn);
                });
            }

            const items = quickMenuItems.filter((i) => isFeatureEnabled(i.id))
            if (items.length === 0) {
                const p = document.createElement("p");
                p.innerHTML = "You don't have any features enabled.<br>Configure it in QAM settings.";
                p.style.margin = "1.5em auto";
                p.style.background = "#f6f1ff";
                p.style.padding = "0.65em";
                p.style.border = "2px solid #eee5ff";
                p.style.borderRadius = "4px";
                container.append(p);
            } else setItems(items);

            const footer = document.createElement("div");
            footer.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 0.65em; background: rgb(247, 242, 255); border-top: 2px solid #e8e8e8;";

            const server = document.createElement("div");
            server.style.cssText = "display: flex; align-items: center; column-gap: 0.5em; background: rgb(227, 210, 255); border-radius: 0.65em; padding: 0.65em; font-weight: bold;";

            const ping = document.createElement("div");
            ping.style.cssText = "padding: 4px; background: #cabaefe8; border-radius: 6px; font-size: 0.8em;";
            ping.textContent = serverPing + "ms";

            const settingsBtn = createElement(Settings, { stroke: "rgb(126, 99, 182)", height: "2em", width: "2em" });
            addDynamicClass(settingsBtn, {
                base: {
                    cursor: "pointer",
                    background: "rgb(229, 208, 255)",
                    padding: "0.25em",
                    borderRadius: "4px"
                },
                hover: {
                    background: "rgb(223, 199, 252)"
                }
            });
            settingsBtn.addEventListener("click", async () => {
                await PreferenceOpenSubscreen("Extensions");
                await PreferenceSubscreenExtensionsOpen(MOD_DATA.key, ["Online", "ChatRoom"]);
                setSubscreen(new MainSubscreen(true));
            });
            server.append(getServer(), ping);
            footer.append(server, settingsBtn);
            container.append(footer);
            if (qamScrollTop) buttonsContainer.scroll({ top: qamScrollTop });
        }
    },
    {
        name: "Toggle Invisibility",
        description: "Toggle target's invisibility state",
        load: (d) => {
            let target: Character = Player;
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const btn = quickMenuBuilder.buildButton("Toggle Invisibility");
            btn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }

                if (!isAllowScripts(target).hide) {
                    if (target.IsPlayer()) {
                        return toastsManager.error({
                            title: "You don't allow to use scripts on yourself",
                            message: `Enable "hide" option in the scripts settings`,
                            duration: 7000
                        });
                    } else {
                        return toastsManager.error({
                            message: `${getNickname(
                                target
                            )} doesn't allow you to modify appearance using scripts`,
                            duration: 6000
                        });
                    }
                }

                if (!InventoryGet(target, "ItemScript")) {
                    const itemScript = InventoryWear(target, "Script", "ItemScript");
                    itemScript.Property = {
                        Hide: AssetGroup.filter((a) => a.Name !== "ItemScript").map((a) => a.Name)
                    };
                    ChatRoomCharacterUpdate(target);
                    toastsManager.success({
                        message: `You have successfully activated invisibility for ${getNickname(
                            target
                        )}!`,
                        duration: 6000
                    });
                } else {
                    InventoryRemove(target, "ItemScript");
                    ChatRoomCharacterUpdate(target);
                    toastsManager.success({
                        message: `You have successfully deactivated invisibility for ${getNickname(
                            target
                        )}!`,
                        duration: 6000
                    });
                }
            });
            d.append(select, btn);
        }
    },
    {
        name: "Poses Manager",
        description: "Change target's pose, y position",
        load: (container) => {
            let target: Character = Player;

            const select = quickMenuBuilder.buildCharacterSelect((C) => {
                target = C;
                I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
                I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                    createPosesContainer("BodyUpper"),
                    createPosesContainer("BodyLower"),
                    createPosesContainer("BodyFull")
                );
            });

            const createPosesContainer = (category: keyof AssetPoseMap) => {
                const container = document.createElement("div");
                container.style.cssText = "display: flex; gap: calc(0.5 * min(2dvh, 1dvw)); margin: 0.25em 1em;";
                PoseFemale3DCG
                    .filter((p) => p.Category === category && (p.AllowMenu || p.AllowMenuTransient))
                    .forEach((p) => {
                        const btn = document.createElement("button");
                        addDynamicClass(btn, {
                            base: {
                                cursor: "pointer",
                                width: "3em",
                                aspectRatio: "1/1",
                                background: "none",
                                border: "2px solid #d2d2d2",
                                borderRadius: "8px"
                            },
                            hover: {
                                borderColor: "#ad68ff"
                            }
                        });
                        if (target.Pose.includes(p.Name)) {
                            btn.style.borderColor = "#ad68ff";
                        }
                        btn.addEventListener("click", () => {
                            if (!ServerChatRoomGetAllowItem(Player, target)) {
                                return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                            }
                            PoseSetActive(target, p.Name);
                            ChatRoomCharacterUpdate(target);
                            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
                            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                                createPosesContainer("BodyUpper"),
                                createPosesContainer("BodyLower"),
                                createPosesContainer("BodyFull")
                            );
                        });
                        const image = document.createElement("img");
                        image.src = `Icons/Poses/${p.Name}.png`;
                        image.style.cssText = "width: 80%; height: auto;";
                        btn.append(image);
                        container.append(btn);
                    });
                return container;
            }

            const I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE = document.createElement("div");
            I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                createPosesContainer("BodyUpper"),
                createPosesContainer("BodyLower"),
                createPosesContainer("BodyFull")
            );

            const suspenseBtn = quickMenuBuilder.buildButton("Suspense");;
            suspenseBtn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                PoseSetActive(target, "Suspension");
                ChatRoomCharacterUpdate(target);
                I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.innerHTML = "";
                I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE.append(
                    createPosesContainer("BodyUpper"),
                    createPosesContainer("BodyLower"),
                    createPosesContainer("BodyFull")
                );
            });

            const overrideHeight = (h: number) => {
                const emoticon = InventoryGet(target, "Emoticon");
                if (h === null) {
                    delete emoticon.Property?.OverrideHeight;
                } else {
                    emoticon.Property ??= {};
                    const height = emoticon.Property.OverrideHeight?.Height ?? 0;
                    //@ts-expect-error Ignore Priority
                    emoticon.Property.OverrideHeight = { Height: height + h };
                }
                ChatRoomCharacterUpdate(target);
            };

            const heightOverrideControls = document.createElement("div");
            heightOverrideControls.style.cssText = "display: flex; justify-content: center; column-gap: 0.65em; margin-top: 0.25em; margin-bottom: 0.65em;";

            const dynamicClass: DynamicClassStyles = {
                base: {
                    cursor: "pointer",
                    aspectRatio: "1/1",
                    width: "10%",
                    background: "white",
                    border: "2px solid #d2d2d2",
                    borderRadius: "50%"
                },
                hover: {
                    borderColor: "#ad68ff"
                }
            };

            const downBtn = document.createElement("button");
            addDynamicClass(downBtn, dynamicClass);
            downBtn.append(createElement(ArrowDown));
            downBtn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                overrideHeight(-10);
            });

            const resetBtn = document.createElement("button");
            addDynamicClass(resetBtn, {
                base: {
                    cursor: "pointer",
                    padding: "0.25em 0.75em",
                    border: "none",
                    background: "#d3d3d3ff",
                    borderRadius: "4px"
                },
                hover: {
                    background: "#c3c3c3ff"
                }
            });
            resetBtn.textContent = "Reset";
            resetBtn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                overrideHeight(null);
            });

            const upBtn = document.createElement("button");
            addDynamicClass(upBtn, dynamicClass);
            upBtn.append(createElement(ArrowUp));
            upBtn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                overrideHeight(10);
            });

            heightOverrideControls.append(downBtn, resetBtn, upBtn);

            container.append(select, I_DONT_KNOW_HOW_TO_NAME_THIS_VARIABLE, suspenseBtn, heightOverrideControls);
        }
    },
    {
        name: "Import Appearance",
        description: "Import appearance on target using base64 outfit code",
        load: (container) => {
            let target: Character = Player;
            const input = quickMenuBuilder.buildInput("Code");
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const btn = quickMenuBuilder.buildButton("Import Appearance");
            btn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                try {
                    importAppearance(
                        target,
                        serverAppearanceBundleToAppearance(target.AssetFamily, JSON.parse(LZString.decompressFromBase64(input.value)))
                    );
                    toastsManager.success({
                        message: `Appearance was successfully imported on ${getNickname(target)}`,
                        duration: 4000
                    });
                } catch {
                    toastsManager.error({
                        title: "Oops!",
                        message: "Error occurred while trying to import appearance",
                        duration: 5000
                    });
                }
            });
            container.append(input, select, btn);
        }
    },
    {
        name: "Export Appearance",
        description: "Copy target's appearance to clipboard in utf-16 or base64 format",
        load: (container) => {
            let format = "base64";
            let target: Character = Player;
            const formatSelect = quickMenuBuilder.buildSelect({
                options: [
                    {
                        name: "utf-16",
                        text: "UTF-16 (Not safe)",
                    },
                    {
                        name: "btoa",
                        text: "BTOA (UBC)"
                    },
                    {
                        name: "base64",
                        text: "Base64 (Most mods)",
                    }
                ],
                currentOption: "base64",
                onChange: (value) => { format = value }
            })
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const btn = quickMenuBuilder.buildButton("Copy to clipboard");
            btn.addEventListener("click", async () => {
                if (isBannedBy(target)) return toastsManager.error({
                    title: "Denied",
                    message: "You are blacklisted or ghosted by this player",
                    duration: 4500
                });
                const stringifiedAppearance = JSON.stringify(ServerAppearanceBundle(target.Appearance));
                let clipboardResult: string;
                if (format === "base64") {
                    clipboardResult = LZString.compressToBase64(stringifiedAppearance);
                } else if (format === "utf-16") {
                    clipboardResult = LZString.compressToUTF16(stringifiedAppearance);
                } else {
                    clipboardResult = btoa(encodeURI(stringifiedAppearance));
                }
                try {
                    await navigator.clipboard.writeText(clipboardResult);
                    toastsManager.success({
                        message: "Code was copied to your clipboard",
                        duration: 3000
                    });
                } catch (e) {
                    const error = e as DOMException;
                    toastsManager.error({
                        title: error.name,
                        message: error.message,
                        duration: 8000
                    });
                }
            });
            container.append(formatSelect, select, btn);
        }
    },
    {
        name: "Leave Room",
        description: "Forcibly leave chat room",
        load: (container) => {
            const btn = quickMenuBuilder.buildButton("Leave Room");
            btn.addEventListener("click", () => {
                if (!ServerPlayerIsInChatRoom()) return;
                ChatRoomLeave();
                CommonSetScreen("Online", "ChatSearch");
            });
            container.append(btn);
        }
    },
    {
        name: "Total Release",
        description: "Release target from all items except for clothing and slave collar",
        load: (container) => {
            let target: Character = Player;
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const btn = quickMenuBuilder.buildButton("Total Release");
            btn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                CharacterReleaseTotal(target, true);
                toastsManager.success({
                    message: `${getNickname(target)} was completely released`,
                    duration: 4000
                });
            });
            container.append(select, btn);
        }
    },
    {
        name: "Release",
        description: "Release target from certain items",
        load: (container) => {
            let target: Character = Player;
            let itemGroup: AssetGroupItemName = "ItemNeck";
            const select = quickMenuBuilder.buildCharacterSelect((C) => {
                target = C;
                itemSelectContainer.innerHTML = "";
                createItemSelect();
            });
            const itemSelectContainer = document.createElement("div");
            const createItemSelect = () => {
                const options = target.Appearance
                    .filter((a) => a.Asset.Group.Name.startsWith("Item") && !!InventoryGet(target, a.Asset.Group.Name))
                    .map((a) => ({ name: a.Asset.Group.Name, text: a.Asset.Description }));
                const select = quickMenuBuilder.buildSelect({
                    options,
                    currentOption: options[0]?.name,
                    onChange: (value) => { itemGroup = value as AssetGroupItemName }
                });
                itemSelectContainer.append(select);
            };
            const btn = quickMenuBuilder.buildButton("Release");
            btn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "Interactions are not allowed", duration: 3000 });
                }
                InventoryRemove(target, itemGroup, true);
                ChatRoomCharacterUpdate(target);
                toastsManager.success({
                    message: `Successfully released ${getNickname(target)}'s ${itemGroup}`,
                    duration: 4000
                });
            });
            createItemSelect();
            container.append(select, itemSelectContainer, btn);
        }
    },
    {
        name: "Map Teleport",
        description: "Teleport to certain character on map",
        load: (container) => {
            let target: Character = Player;
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const btn = quickMenuBuilder.buildButton("Map Teleport");
            btn.addEventListener("click", () => {
                //@ts-expect-error
                if (!Player.MapData) Player.MapData = {};
                const x = target.MapData?.Pos?.X;
                const y = target.MapData?.Pos?.Y;
                if (!x || !y) return;;
                Player.MapData.Pos = {
                    X: x,
                    Y: y
                };
                ChatRoomMapViewMovement = {
                    X: x,
                    Y: y,
                    TimeStart: CommonTime(),
                    TimeEnd: CommonTime(),
                    Direction: "East"
                };
                messagesManager.sendLocal(
                    `You were successfully teleported to ${getNickname(target)}`
                );
            });
            container.append(select, btn);
        }
    },
    {
        name: "Clone",
        description: "Copy target's appearance, nickname, label's color and expressions. With the opportunity to return to your original appearance.",
        load: (container) => {
            let target: Character = Player;
            const select = quickMenuBuilder.buildCharacterSelect((C) => { target = C });
            const cloneBtn = quickMenuBuilder.buildButton("Clone");
            const backupBtn = quickMenuBuilder.buildButton("Backup");
            backupBtn.addEventListener("click", () => {
                if (!modStorage.qam?.cloneBackup) return toastsManager.error({
                    message: "You don't have backup",
                    duration: 3000
                });
                Player.Nickname = modStorage.qam.cloneBackup.nickName;
                Player.LabelColor = modStorage.qam.cloneBackup.labelColor;
                PoseSetActive(Player, modStorage.qam.cloneBackup.activePose[0]);
                CharacterSetFacialExpression(Player, "Emoticon", modStorage.qam.cloneBackup.emoticon?.expression, null, modStorage.qam.cloneBackup.emoticon?.color);
                CharacterSetFacialExpression(Player, "Blush", modStorage.qam.cloneBackup.blush?.expression);
                ServerAppearanceLoadFromBundle(
                    Player,
                    Player.AssetFamily,
                    JSON.parse(LZString.decompressFromBase64(modStorage.qam.cloneBackup.appearance)),
                    Player.MemberNumber
                );
                ServerSend("AccountUpdate", {
                    Nickname: Player.Nickname,
                    LabelColor: Player.LabelColor,
                });
                ChatRoomCharacterUpdate(Player);
                toastsManager.success({
                    message: `You have successfully canceled the cloning effect!`,
                    duration: 4500
                });
                delete modStorage.qam.cloneBackup;
                syncStorage();
            });
            cloneBtn.addEventListener("click", () => {
                if (isBannedBy(target)) return toastsManager.error({
                    title: "Denied",
                    message: "You are blacklisted or ghosted by this player",
                    duration: 4500
                });
                modStorage.qam ??= {};
                if (!modStorage.qam.cloneBackup) {
                    modStorage.qam.cloneBackup = {
                        nickName: getNickname(Player),
                        labelColor: Player.LabelColor,
                        emoticon: {
                            expression: InventoryGet(Player, "Emoticon")?.Property?.Expression,
                            // color: InventoryGet(Player, "Emoticon")?.Property?.Color
                            color: ""
                        },
                        blush: {
                            expression: InventoryGet(Player, "Blush")?.Property?.Expression
                        },
                        appearance: LZString.compressToBase64(JSON.stringify(ServerAppearanceBundle(Player.Appearance))),
                        activePose: [...Player.ActivePose]
                    };
                    syncStorage();
                }

                Player.Nickname = getNickname(target);
                Player.LabelColor = target.LabelColor;
                PoseSetActive(Player, target.ActivePose[0]);
                CharacterSetFacialExpression(Player, "Emoticon", InventoryGet(target, "Emoticon")?.Property?.Expression, null, InventoryGet(target, "Emoticon")?.Property?.Color);
                CharacterSetFacialExpression(Player, "Blush", InventoryGet(target, "Blush")?.Property?.Expression);
                ServerAppearanceLoadFromBundle(
                    Player,
                    Player.AssetFamily,
                    ServerAppearanceBundle(target.Appearance),
                    Player.MemberNumber
                );
                ServerSend("AccountUpdate", {
                    Nickname: Player.Nickname,
                    LabelColor: Player.LabelColor,
                });
                ChatRoomCharacterUpdate(Player);

                toastsManager.success({
                    message: `You were successfully cloned ${getNickname(target)}`,
                    duration: 4500
                });
            });
            container.append(select, cloneBtn, backupBtn);
        }
    },
    {
        name: "View Card Decks",
        description: "View target's decks of cards",
        load: (container) => {
            let target: Character = Player;
            let deckIndex = 0;
            const select = quickMenuBuilder.buildCharacterSelect((_target) => {
                target = _target;
                refreshContent();
            });
            const contentContainer = document.createElement("div");

            const createCard = (card: ClubCard) => {
                const cardName = card.Name;
                const requiredLevel = card.RequiredLevel ? card.RequiredLevel : 1;
                const colors = ["", "white", "#a6a4a4", "#9be09b", "#b4b4f0", "#ed8e8e"];

                const img = document.createElement("img");
                img.style.cssText = `width: 2.5em; height: 5em; background: ${colors[requiredLevel]}; padding: 4px; border: 2px solid black;`;
                img.src = card.Type === "Event" ?
                    `https://www.bondage-europe.com/${GameVersion}/BondageClub/Screens/MiniGame/ClubCard/Event/${cardName}.png` :
                    `https://www.bondage-europe.com/${GameVersion}/BondageClub/Screens/MiniGame/ClubCard/Member/${cardName}.png`;
                return img;
            }
            const undoBundle = (bundle: string) => {
                const result: ClubCard[] = [];
                for (const entrie of bundle.split("")) {
                    const cardId = entrie.charCodeAt(0);
                    const card = ClubCardList.find((c) => c.ID === cardId);
                    if (!card) continue;
                    result.push(card);
                }
                return result;
            }
            const refreshContent = () => {
                contentContainer.innerHTML = "";
                deckIndex = 0;
                const select = quickMenuBuilder.buildSelect({
                    options: target.Game.ClubCard?.Deck
                        ?.map((_, i) => ({ name: i.toString(), text: target?.Game?.ClubCard?.DeckName?.[i] || `Deck #${i}` }))
                        ?.filter((n) => !!target?.Game?.ClubCard?.Deck?.[parseInt(n.name, 10)]),
                    currentOption: deckIndex.toString(),
                    onChange: (value) => {
                        deckIndex = parseInt(value, 10);
                        const selectedDeck = undoBundle(target.Game?.ClubCard?.Deck?.[deckIndex] ?? "");
                        cardsContainer.innerHTML = "";
                        cardsContainer.append(...selectedDeck.map(createCard));
                    }
                });
                const cardsContainer = document.createElement("div");
                cardsContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 0.25em; overflow-y: scroll; max-height: 50vh; margin: 0.25em 1em;";
                const selectedDeck = undoBundle(target.Game?.ClubCard?.Deck?.[deckIndex] ?? "");
                cardsContainer.append(...selectedDeck.map(createCard));
                contentContainer.append(select, cardsContainer);
            }

            refreshContent();
            container.append(select, contentContainer);
        }
    },
    {
        name: "Cast Spell",
        description: "Cast dark magic spell",
        load: (container) => {
            if ((modStorage.darkMagic?.spells ?? []).length === 0) {
                const message = document.createElement("p");
                message.style.cssText = "margin: 1.65em auto; font-weight: bold;";
                message.textContent = "You don't have any spells to cast";
                container.append(message);
                return;
            }

            function dataURLToSVGElement(dataURL) {
                const svgEncoded = dataURL.replace('data:image/svg+xml,', '');
                const svgString = decodeURIComponent(svgEncoded);
                const div = document.createElement('div');
                div.innerHTML = svgString;
                return div.firstElementChild as SVGElement;
            }

            let target: Character = Player;
            let spell: ModStorage["darkMagic"]["spells"][0] = JSON.parse(JSON.stringify(modStorage.darkMagic.spells[0]));

            const select = quickMenuBuilder.buildCharacterSelect((_target) => {
                target = _target;
            });

            const _select = quickMenuBuilder.buildSelect({
                options: modStorage.darkMagic?.spells?.map((s) => ({ name: s.name, text: s.name, icon: dataURLToSVGElement(getSpellIcon(s.icon).dataurl) })),
                currentOption: modStorage.darkMagic?.spells?.[0]?.name,
                onChange: (value) => {
                    spell = JSON.parse(JSON.stringify(modStorage.darkMagic.spells.find((s) => s.name === value)));
                    addDefaultParametersIfNeeds(spell);
                    refreshParamtersContainer();
                }
            });

            const paramters = document.createElement("div");
            paramters.style.cssText = "display: flex; flex-direction: column; row-gap: 0.5em; border: 3px dashed #dcccffff; border-radius: 4px; padding: 0.5em 0; margin: 0.5em auto; width: 90%;";

            function refreshParamtersContainer() {
                paramters.innerHTML = "";
                const title = document.createElement("p");
                title.style.cssText = "margin: 0.65em auto; width: 90%; font-weight: bold; font-size: 0.85em; color: #9977d0;";
                title.textContent = "Parameters";
                paramters.append(title);

                for (const c of spell.effects.split("")) {
                    const effect = getSpellEffect(c.charCodeAt(0));
                    if (effect.parameters.length === 0) continue;
                    const effectName = document.createElement("p");
                    effectName.style.cssText = "margin: 0.6em auto 0 auto; width: 90%;";
                    effectName.textContent = effect.name;
                    paramters.append(effectName);
                    for (const parameter of effect.parameters) {
                        const value = spell.data?.[c]?.[parameter.name];
                        switch (parameter.type) {
                            case "boolean": {
                                const checkbox = document.createElement("label");
                                checkbox.style.cssText = "margin: auto; width: 90%;"
                                const input = document.createElement("input");
                                input.type = "checkbox";
                                if (typeof value === "boolean") input.checked = value;
                                input.addEventListener("change", () => {
                                    spell.data[c][parameter.name] = input.checked;
                                });
                                checkbox.append(input, parameter.label);
                                paramters.append(checkbox);
                                break;
                            }
                            case "choice":
                                paramters.append(
                                    quickMenuBuilder.buildSelect({
                                        options: parameter.options,
                                        currentOption: parameter.options.find((o) => o.name === value)?.name ?? parameter.options[0].name,
                                        onChange: (_value) => {
                                            spell.data[c][parameter.name] = _value;
                                        }
                                    })
                                );
                                break;
                            case "number": {
                                const input = quickMenuBuilder.buildInput(parameter.label);
                                input.type = "number";
                                if (typeof value === "number") input.value = value.toString();
                                if (parameter.min) input.min = parameter.min.toString();
                                if (parameter.min) input.max = parameter.max.toString();
                                input.addEventListener("input", () => {
                                    spell.data[c][parameter.name] = parseInt(input.value, 10);
                                });
                                paramters.append(input);
                                break;
                            }
                            case "text": {
                                const input = quickMenuBuilder.buildInput(parameter.label);
                                if (typeof value === "string") input.value = value;
                                input.addEventListener("input", () => {
                                    spell.data[c][parameter.name] = input.value;
                                });
                                paramters.append(input);
                                break;
                            }
                        }
                    }
                }

                if (paramters.children.length === 1) paramters.style.display = "none";
                else paramters.style.display = "flex";
            }

            const btn = quickMenuBuilder.buildButton("Cast Spell");
            btn.addEventListener("click", async () => {
                if (!spell) return;
                if (!Player.CanInteract()) {
                    return toastsManager.error({ message: "You can't interact", duration: 3000 });
                }
                if (!isMagicItem(InventoryGet(Player, "ItemHandheld"))) {
                    return toastsManager.error({
                        message: "You should hold magic item in your hand to cast spells",
                        duration: 5000
                    });
                }
                const allow = allowSpellCast(Player, target, spell);
                if (allow.result === false) {
                    return toastsManager.error({
                        title: "Can't cast this spell",
                        message: allow.reason,
                        duration: 5000
                    });
                }
                const { isValid } = await validateData({
                    spell
                }, CastSpellMessageDto);

                if (!isValid) {
                    return toastsManager.error({
                        title: "Spell validation failed",
                        message: "Check spell's settings and make sure that everything is specified correctly",
                        duration: 5000
                    });
                }

                castSpell(target, spell);
            });

            refreshParamtersContainer();

            container.append(select, _select, paramters, btn);
        }
    },
    {
        name: "Put Locks",
        description: "Put lock on target's all items",
        load: (container) => {
            let target: Character = Player;
            const locks = AssetGroupGet(Player.AssetFamily, "ItemMisc").Asset
                .filter((item) => item.Name?.endsWith("Padlock"));
            let lock = locks[0].Name;
            const select = quickMenuBuilder.buildCharacterSelect((_target) => {
                target = _target;
            });
            const _select = quickMenuBuilder.buildSelect({
                options: locks.map((l) => ({ name: l.Name, text: l.Description })),
                currentOption: locks[0].Name,
                onChange: (value) => {
                    lock = value;
                }
            });
            const btn = quickMenuBuilder.buildButton("Put Locks");
            btn.addEventListener("click", () => {
                InventoryFullLock(target, lock as AssetLockType);
                ChatRoomCharacterUpdate(target);
                toastsManager.success({
                    message: `You have successfully locked every item on ${getNickname(target)}'s body`,
                    duration: 4500
                });
            });
            container.append(select, _select, btn);
        }
    },
    {
        name: "Remove Locks",
        description: "Remove all locks from target's body",
        load: (container) => {
            let target: Character = Player;
            const select = quickMenuBuilder.buildCharacterSelect((_target) => {
                target = _target;
            });
            const btn = quickMenuBuilder.buildButton("Remove Locks");
            btn.addEventListener("click", () => {
                for (const a of Player.Appearance) {
                    if (InventoryGetLock(a)) InventoryUnlock(target, a);
                }
                ChatRoomCharacterUpdate(target);
                toastsManager.success({
                    message: `You have successfully unlocked every item on ${getNickname(target)}'s body`,
                    duration: 4500
                });
            });
            container.append(select, btn);
        }
    }
];

export const quickMenuItems: QAMItem[] = [
    {
        id: 1000,
        name: "Toggle Invisibility",
        icon: HatGlasses,
    },
    {
        id: 1001,
        name: "Poses Manager",
        icon: PersonStanding,
    },
    {
        id: 1002,
        name: "Import Appearance",
        icon: ClipboardPaste,
    },
    {
        id: 1003,
        name: "Export Appearance",
        icon: ClipboardCopy,
    },
    {
        id: 1004,
        name: "Leave Room",
        icon: LogOut,
    },
    {
        id: 1005,
        name: "Total Release",
        icon: ShieldAlert,
    },
    {
        id: 1006,
        name: "Release",
        icon: ShieldMinus
    },
    {
        id: 1007,
        name: "Map Teleport",
        icon: MapPinned,
    },
    {
        id: 1008,
        name: "Clone",
        icon: CopyPlus
    },
    {
        id: 1009,
        name: "View Card Decks",
        icon: Eye
    },
    {
        id: 1010,
        name: "Cast Spell",
        icon: Wand
    },
    {
        id: 1011,
        name: "Put Locks",
        icon: Lock
    },
    {
        id: 1012,
        name: "Remove Locks",
        icon: Unlock
    }
];

export function createQuickMenu(): void {
    const menuButton = document.createElement("button");
    menuButton.classList.add("bccQAMButton");
    const icon = document.createElement("img");
    icon.src = mouthWateringIcon;
    menuButton.append(icon);
    document.body.append(menuButton);
    new Draggable(menuButton);
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

export function loadQuickAccessMenu(): void {
    if (modStorage.qam?.enabled) createQuickMenu();
    pingServer();
    setInterval(() => {
        if (!currentSubscreen || currentSubscreen.name !== "BONDAGE CLUB CHAOS") return;
        pingServer();
    }, 10_000);
}