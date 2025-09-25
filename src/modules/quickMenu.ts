import { addDynamicClass, BaseSubscreen, setSubscreen } from "zois-core/ui";
import { modStorage, syncStorage } from "./storage";
import mouthWateringIcon from "@/assets/game-icons/mouthWatering.svg";
import { Check, ChevronDown, ChevronLeft, ClipboardCopy, ClipboardPaste, CopyPlus, createElement, Eye, HatGlasses, IconNode, LogOut, MapPinned, PersonStanding, Settings, ShieldAlert, ShieldMinus, Target } from "lucide";
import { getPlayer, getNickname } from "zois-core";
import { toastsManager } from "zois-core/popups";
import { importAppearance, serverAppearanceBundleToAppearance } from "zois-core/wardrobe";
import { messagesManager } from "zois-core/messaging";
import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { hookFunction, HookPriority } from "zois-core/modsApi";
import { QuickMenuSubscreen } from "@/subscreens/quickMenuSubscreen";

let serverPing: number;
let currentSubscreen: QuickMenuSubscreen;

interface QuickMenuSubscreen {
    name: string
    load: (container: Element) => void
}

interface QuickMenuItem {
    id: number
    name: string
    description?: string
    icon: IconNode
}

class Draggable {
    private element: HTMLElement;
    private isDragging: boolean;
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

        // Для touch устройств
        this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseDown(e) {
        if (e.target.closest('.drag-handle') || e.target === this.element) {
            this.isDragging = true;
            this.offset = {
                x: e.clientX - this.element.getBoundingClientRect().left,
                y: e.clientY - this.element.getBoundingClientRect().top
            };
            e.preventDefault();
        }
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const x = e.clientX - this.offset.x;
        const y = e.clientY - this.offset.y;

        if (x >= 0 && (x + this.element.offsetWidth) <= window.innerWidth) this.element.style.left = x + 'px';
        if (y >= 0 && (y + this.element.offsetHeight) <= window.innerHeight) this.element.style.top = y + 'px';
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    onTouchStart(e) {
        if (e.target.closest('.drag-handle') || e.target === this.element) {
            this.isDragging = true;
            const touch = e.touches[0];
            this.offset = {
                x: touch.clientX - this.element.getBoundingClientRect().left,
                y: touch.clientY - this.element.getBoundingClientRect().top
            };
            e.preventDefault();
        }
    }

    onTouchMove(e) {
        if (!this.isDragging) return;

        const touch = e.touches[0];
        const x = touch.clientX - this.offset.x;
        const y = touch.clientY - this.offset.y;

        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        e.preventDefault();
    }

    onTouchEnd() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }
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
        select.classList.add("bccQuickMenuSelect");
        select.style.margin = "0.25em 1em";
        select.style.position = "relative";
        select.style.zIndex = "101";
        select.setAttribute("opened", false);
        select.addEventListener("click", () => {
            if (isOpened) {
                isOpened = false;
                optionsContainer.remove();
            } else {
                isOpened = true;
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
        p.textContent = options.find((option) => option.name === currentOption).text;

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
                const target = getPlayer(parseInt(value));
                if (onChange && target) onChange(target);
            },
            options: ChatRoomCharacter.map((c) => ({ name: c.MemberNumber.toString(), text: c.Name + `(${c.MemberNumber})`, icon: createElement(Target, { stroke: "red" }) })),
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

function setQuickMenuSubscreen(s: QuickMenuSubscreen): void {
    if (!document.querySelector(".bccQuickMenu")) return;
    const container = document.querySelector(".bccQuickMenu");
    container.innerHTML = "";
    const header = document.createElement("div");
    header.style.cssText = "display: flex; align-items: center; justify-content: space-between;";
    const title = document.createElement("p");
    title.textContent = s.name;
    title.style.cssText = "font-weight: bold; padding: 0.5em 1em; text-align: center; font-size: clamp(10px, 5vw, 24px); width: 100%; letter-spacing: 0.08em;";
    if (s.name === "BONDAGE CLUB CHAOS") {
        title.style.textShadow = "-0.1em -0.05em 0 rgb(102, 0, 218)";
    } else {
        const backBtn = document.createElement("button");
        backBtn.style.cssText = "cursor: pointer; background: none; border: none;";
        backBtn.append(createElement(ChevronLeft));
        backBtn.addEventListener("click", () => {
            setQuickMenuSubscreen(quickMenuSubscreens[0]);
        });
        header.append(backBtn);
    }
    header.append(title);
    container.append(header);
    s.load(container);
    currentSubscreen = s;
}

export function toggleFeature(id: number): void {
    modStorage.quickMenu ??= {};
    modStorage.quickMenu.enabledFeatures ??= "";
    const char = String.fromCharCode(id);
    if (modStorage.quickMenu.enabledFeatures.includes(char)) {
        modStorage.quickMenu.enabledFeatures = modStorage.quickMenu.enabledFeatures.replaceAll(char, "");
    } else modStorage.quickMenu.enabledFeatures += String.fromCharCode(id);
    setQuickMenuSubscreen(quickMenuSubscreens[0]);
}

export function isFeatureEnabled(id: number): boolean {
    const char = String.fromCharCode(id);
    return modStorage.quickMenu?.enabledFeatures?.includes(char);
}

export const quickMenuSubscreens: QuickMenuSubscreen[] = [
    {
        name: "BONDAGE CLUB CHAOS",
        load: (container) => {
            quickMenuItems
                .filter((i) => isFeatureEnabled(i.id))
                .forEach((b) => {
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
                            borderTop: "1px solid #e5e5e5"
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
                    description.textContent = b.description;

                    const icon = createElement(b.icon);
                    icon.style.cssText = "background: rgb(228 215 255 / 65%); flex-shrink: 0; width: clamp(10px, 8vw, 35px); height: clamp(10px, 6vw, 35px); padding: 4px; stroke: #7e63b6; border-radius: 4px;";
                    detailsContainer.append(name, description);
                    btn.append(icon, detailsContainer);
                    container.append(btn);
                    btn.addEventListener("click", () => {
                        const subscreen = quickMenuSubscreens.find((s) => s.name === b.name);
                        if (!subscreen) return console.warn(`Subscreen "${b.name}" is not exists`);
                        setQuickMenuSubscreen(subscreen);
                    });
                });

            const footer = document.createElement("div");
            footer.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 0.65em; background: rgb(247, 242, 255); border-top: 2px solid #e8e8e8;";

            const server = document.createElement("p");
            server.style.cssText = "background: rgb(227, 210, 255); border-radius: 0.65em; padding: 0.65em; font-weight: bold;"
            server.textContent = `Europe (${serverPing}ms)`;

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
            settingsBtn.addEventListener("click", () => setSubscreen(new MainSubscreen()));
            footer.append(server, settingsBtn);
            container.append(footer);
        }
    },
    {
        name: "Toggle Invisibility",
        load: (d) => {
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Toggles target's invisibility");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Toggle Invisibility");
            btn.addEventListener("click", () => {
                if (!ServerChatRoomGetAllowItem(Player, target)) {
                    return toastsManager.error({ message: "No BC permission", duration: 3000 });
                }

                if (!isAllowScripts(target).hide) {
                    if (target.IsPlayer()) {
                        return toastsManager.error({
                            message: `You don't allow to use scripts on yourself<br>Enable "hide" option in the scripts settings`,
                            duration: 7000
                        }
                        );
                    } else {
                        return toastsManager.error({
                            message: `${getNickname(
                                target
                            )} doesn't allow you to use scripts on yourself`,
                            duration: 6000
                        });
                    }
                }

                if (!InventoryGet(target, "ItemScript")) {
                    const itemScript = InventoryWear(target, "Script", "ItemScript");
                    itemScript.Property = {
                        Hide: [
                            "Blush",
                            "BodyLower",
                            "BodyUpper",
                            "Bra",
                            "Bracelet",
                            "Cloth",
                            "ClothAccessory",
                            "ClothLower",
                            "Corset",
                            "Emoticon",
                            "Eyebrows",
                            "Eyes",
                            "Eyes2",
                            "EyeShadow",
                            "FacialHair",
                            "Fluids",
                            "Garters",
                            "Glasses",
                            "Gloves",
                            "HairAccessory1",
                            "HairAccessory2",
                            "HairAccessory3",
                            "HairBack",
                            "HairFront",
                            "HandsLeft",
                            "HandsRight",
                            "ArmsLeft",
                            "ArmsRight",
                            "Hat",
                            "Head",
                            "ItemAddon",
                            "ItemArms",
                            "ItemBoots",
                            "ItemBreast",
                            "ItemButt",
                            "ItemDevices",
                            "ItemEars",
                            "ItemFeet",
                            "ItemHandheld",
                            "ItemHands",
                            "ItemHead",
                            "ItemHood",
                            "ItemLegs",
                            "ItemMisc",
                            "ItemMouth",
                            "ItemMouth2",
                            "ItemMouth3",
                            "ItemNeck",
                            "ItemNeckAccessories",
                            "ItemNeckRestraints",
                            "ItemNipples",
                            "ItemNipplesPiercings",
                            "ItemNose",
                            "ItemPelvis",
                            "ItemTorso",
                            "ItemTorso2",
                            "ItemVulva",
                            "ItemVulvaPiercings",
                            "Jewelry",
                            "Mask",
                            "Mouth",
                            "Necklace",
                            "Nipples",
                            "Panties",
                            "Pussy",
                            "Shoes",
                            "Socks",
                            "SocksLeft",
                            "SocksRight",
                            "Suit",
                            "SuitLower",
                            "TailStraps",
                            "Wings"
                        ]
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
            d.append(description, select, btn);
        }
    },
    {
        name: "Set Pose",
        load: (container) => {
            let pose: AssetPoseName = PoseFemale3DCG[0].Name;
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Sets pose for target");
            const select = quickMenuBuilder.buildSelect({
                onChange: (value) => {
                    pose = value as AssetPoseName;
                },
                options: PoseFemale3DCG.map((p) => ({ name: p.Name, text: p.Name, icon: null })),
                currentOption: PoseFemale3DCG[0].Name
            });
            const _select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Set Pose");
            btn.addEventListener("click", () => {
                PoseSetActive(target, pose);
            });
            container.append(description, select, _select, btn);
        }
    },
    {
        name: "Import Appearance",
        load: (container) => {
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("import appearance on target using outfit code");
            const input = quickMenuBuilder.buildInput("Code");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Import Appearance");
            btn.addEventListener("click", () => {
                console.log(JSON.parse(LZString.decompressFromBase64(input.value)), serverAppearanceBundleToAppearance(target.AssetFamily, JSON.parse(LZString.decompressFromBase64(input.value))))
                importAppearance(
                    target,
                    serverAppearanceBundleToAppearance(target.AssetFamily, JSON.parse(LZString.decompressFromBase64(input.value)))
                )
            });
            container.append(description, input, select, btn);
        }
    },
    {
        name: "Export Appearance",
        load: (container) => {
            let format = "base64";
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Export target's appearance in utf or base64 format");
            const formatSelect = quickMenuBuilder.buildSelect({
                options: [
                    {
                        name: "utf-16",
                        text: "UTF-16 (UBC)",
                    },
                    {
                        name: "base64",
                        text: "Base64 (Most mods)",
                    }
                ],
                currentOption: "base64",
                onChange: (value) => format = value
            })
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Export Appearance");
            btn.addEventListener("click", () => {
                const stringifiedAppearance = JSON.stringify(ServerAppearanceBundle(target.Appearance));
                if (format === "base64") {
                    messagesManager.sendLocal(LZString.compressToBase64(stringifiedAppearance));
                } else {
                    messagesManager.sendLocal(LZString.compressToUTF16(stringifiedAppearance));
                }
            });
            container.append(description, formatSelect, select, btn);
        }
    },
    {
        name: "Leave Room",
        load: (container) => {
            const description = quickMenuBuilder.buildDescription("Forcibly leave room");
            const btn = quickMenuBuilder.buildButton("Leave Room");
            btn.addEventListener("click", () => {
                ChatRoomLeave();
                CommonSetScreen("Online", "ChatSearch");
            });
            container.append(description, btn);
        }
    },
    {
        name: "Total Release",
        load: (container) => {
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Total free yourself or target");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Total Release");
            btn.addEventListener("click", () => {
                CharacterReleaseTotal(target, true);
            });
            container.append(description, select, btn);
        }
    },
    {
        name: "Release",
        load: (container) => {
            let target: Character = Player;
            let itemGroup: AssetGroupItemName = "ItemNeck";
            const description = quickMenuBuilder.buildDescription("Release target from certain items");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const _select = quickMenuBuilder.buildSelect({
                options: Player.Appearance
                    .filter((a) => a.Asset.Group.Name.startsWith("Item") && !!InventoryGet(target, a.Asset.Group.Name))
                    .map((a) => ({ name: a.Asset.Group.Name, text: a.Asset.Name })),
                currentOption: "ItemNeck",
                onChange: (value) => itemGroup = value as AssetGroupItemName
            });
            const btn = quickMenuBuilder.buildButton("Release");
            btn.addEventListener("click", () => {
                InventoryRemove(target, itemGroup, true);
            });
            container.append(description, _select, select, btn);
        }
    },
    {
        name: "Map Teleport",
        load: (container) => {
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Teleport to certain character on map");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Map Teleport");
            btn.addEventListener("click", () => {
                //@ts-ignore
                if (!Player.MapData) Player.MapData = {};
                const x = target.MapData?.Pos?.X;
                const y = target.MapData?.Pos?.Y;
                if (!x || !y) return messagesManager.sendLocal(`<!${getNickname(target)}!> doesn't have coordinates`);
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
                    `You have successfully teleported to ${getNickname(target)}`
                );
            });
            container.append(description, select, btn);
        }
    },
    {
        name: "Clone",
        load: (container) => {
            let target: Character = Player;
            const description = quickMenuBuilder.buildDescription("Clone target");
            const select = quickMenuBuilder.buildCharacterSelect((C) => target = C);
            const btn = quickMenuBuilder.buildButton("Clone");
            const _btn = quickMenuBuilder.buildButton("Backup");
            _btn.addEventListener("click", () => {
                if (!modStorage.quickMenu?.cloneBackup) return;
                Player.Nickname = modStorage.quickMenu.cloneBackup.nickName;
                Player.LabelColor = modStorage.quickMenu.cloneBackup.labelColor;
                PoseSetActive(Player, modStorage.quickMenu.cloneBackup.activePose[0]);
                CharacterSetFacialExpression(Player, "Emoticon", modStorage.quickMenu.cloneBackup.emoticon?.expression, null, modStorage.quickMenu.cloneBackup.emoticon?.color);
                CharacterSetFacialExpression(Player, "Blush", modStorage.quickMenu.cloneBackup.blush?.expression);
                ServerAppearanceLoadFromBundle(
                    Player,
                    Player.AssetFamily,
                    JSON.parse(LZString.decompressFromBase64(modStorage.quickMenu.cloneBackup.appearance)),
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
                delete modStorage.quickMenu.cloneBackup;
                syncStorage();
            });
            btn.addEventListener("click", () => {
                modStorage.quickMenu ??= {};
                if (!modStorage.quickMenu.cloneBackup) {
                    modStorage.quickMenu.cloneBackup = {
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
                    message: `You have successfully cloned ${getNickname(target)}`,
                    duration: 4500
                });
            });
            container.append(description, select, _btn, btn);
        }
    },
    {
        name: "View Card Decks",
        load: (container) => {
            const description = quickMenuBuilder.buildDescription("View target's decks os cards");
            const select = quickMenuBuilder.buildCharacterSelect((target) => {
                const selectedDeck = undoBundle(target.Game.ClubCard.Deck[0]);
                cardsContainer.innerHTML = "";
                cardsContainer.append(...selectedDeck.map(createCard));
            });
            // const _select = quickMenuBuilder.buildSelect({
            //     options: Player.Game.ClubCard?.DeckName?.map((n, i) => ({name: n, text: n})),
            //     currentOption: ""
            // })
            const cardsContainer = document.createElement("div");
            cardsContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 0.25em; overflow-y: scroll; max-height: 50vh; margin: 0.25em 1em;";

            function createCard(card: ClubCard) {
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
            function undoBundle(bundle: string) {
                let result: ClubCard[] = [];
                for (const entrie of bundle.split("")) {
                    const cardId = entrie.charCodeAt(0);
                    const card = ClubCardList.find((c) => c.ID === cardId);
                    if (!card) continue;
                    result.push(card);
                }
                return result;
            }

            const selectedDeck = undoBundle(Player.Game.ClubCard.Deck[0]);
            cardsContainer.append(...selectedDeck.map(createCard));

            container.append(description, select, cardsContainer);
        }
    }
];

export const quickMenuItems: QuickMenuItem[] = [
    {
        id: 1000,
        name: "Toggle Invisibility",
        description: "Toggles invisibility for targets",
        icon: HatGlasses,
    },
    {
        id: 1001,
        name: "Set Pose",
        description: "Sets pose for target",
        icon: PersonStanding,
    },
    {
        id: 1002,
        name: "Import Appearance",
        description: "import appearance on target using outfit code",
        icon: ClipboardPaste,
    },
    {
        id: 1003,
        name: "Export Appearance",
        description: "Export target's appearance in utf or base64 format",
        icon: ClipboardCopy,
    },
    {
        id: 1004,
        name: "Leave Room",
        description: "Forcibly leave room",
        icon: LogOut,
    },
    {
        id: 1005,
        name: "Total Release",
        description: "Total free yourself or target",
        icon: ShieldAlert,
    },
    {
        id: 1006,
        name: "Release",
        description: "Releases target from certain items",
        icon: ShieldMinus
    },
    {
        id: 1007,
        name: "Map Teleport",
        description: "Teleport to certain character on map",
        icon: MapPinned,
    },
    {
        id: 1008,
        name: "Clone",
        description: "Clone target",
        icon: CopyPlus
    },
    {
        id: 1009,
        name: "View Card Decks",
        description: "View target's decks of cards",
        icon: Eye
    }
];

export function createQuickMenu(): void {
    const menuButton = document.createElement("button");
    menuButton.classList.add("bccQuickMenuButton");
    const icon = document.createElement("img");
    icon.src = mouthWateringIcon;
    menuButton.addEventListener("click", () => {
        if (document.querySelector(".bccQuickMenu")) {
            document.querySelector(".bccQuickMenu").remove();
            currentSubscreen = null;
            return;
        }
        const d = document.createElement("div");
        d.classList.add("bccQuickMenu");
        document.body.append(d);
        setQuickMenuSubscreen(quickMenuSubscreens[0]);
    });
    menuButton.append(icon);
    document.body.append(menuButton);
    new Draggable(menuButton);
}

export function removeQuickMenu(): void {
    document.querySelector(".bccQuickMenuButton")?.remove();
}

export async function pingServer() {
    const d1 = Date.now();
    const res = await fetch("https://www.bondageprojects.elementfx.com/R120/BondageClub");
    if (res.status < 400) serverPing = Date.now() - d1;
}

export function loadQuickMenu(): void {
    if (modStorage.quickMenu?.enabled) createQuickMenu();
    pingServer();
    setInterval(() => {
        if (!currentSubscreen || currentSubscreen.name !== "BONDAGE CLUB CHAOS") return;
        pingServer();
    }, 10_000);
}