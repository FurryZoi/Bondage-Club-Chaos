import { BaseQAMSubscreen } from "./baseQAMSubscreen";
import { createElement, GitCommitVertical, GitPullRequestArrow, GitPullRequestClosed, X } from "lucide";
import { addDynamicClass } from "zois-core/ui";
import { Commit, commits } from "@/modules/quickAccessMenu";
import { serverAppearanceBundleToAppearance } from "zois-core/wardrobe";


function formatMilliseconds(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;

    if (days > 0) {
        return `${days} ${days === 1 ? "day" : "days"} ${remainingHours} ${remainingHours === 1 ? "hour" : "hours"}`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`;
    } else {
        return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
    }
}

export class AVQS_QAMSubscreen extends BaseQAMSubscreen {
    public name: string = "AVCS";
    public description: string = "Appearance Version Control System - System that registers all the changes in appearance that occur in room and allows you to manipulate them. Don't associate this with GIT and other VCS";

    public load(container: HTMLElement) {
        super.load(container);
        this.loadCommitsList(container);
    }

    private createPreviewCanvas(commit: Commit) {
        const previewCanvas = document.createElement("canvas");
        previewCanvas.style = "width: auto; height: 100%; margin: 0; background: white; position: relative; border-radius: 6px; border: 2px solid #d7d7d7;";
        previewCanvas.width = 400;
        previewCanvas.height = 400;
        const previewCharacter = CharacterCreate("Female3DCG", CharacterType.NPC, "BCC_COMMIT_PROFILE_PREVIEW");
        previewCharacter.Appearance = serverAppearanceBundleToAppearance("Female3DCG", commit.bundle.content);
        CharacterRefresh(previewCharacter);
        if (previewCharacter.IsKneeling()) {
            DrawCharacter(previewCharacter, 90, -60, 0.4, false, previewCanvas.getContext("2d"));
        } else {
            DrawCharacter(previewCharacter, 90, 0, 0.4, false, previewCanvas.getContext("2d"));
        }
        return previewCanvas;
    }

    private loadCommitsList(container, target: Character = Player) {
        const select = this.buildCharacterSelect((_target) => {
            target = _target;
            commitsContainer.innerHTML = "";
            createCommits();
        }, target);

        const createCommits = () => {
            for (const commit of commits.get(target.MemberNumber)) {
                const commitElement = document.createElement("div");
                commitElement.addEventListener("click", () => {
                    select.remove();
                    commitsContainer.remove();
                    updateButton.remove();
                    this.loadCommitProfile(container, commit, target);
                });
                const icon = document.createElement("div");
                addDynamicClass(icon, {
                    base: {
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        columnGap: "0.2em",
                        padding: "0 0.5em",
                        fontSize: "0.8em",
                        border: "1px solid #dedede",
                        borderRadius: "8px",
                        boxSizing: "content-box",
                        height: "65%"
                    },
                    before: {
                        content: '""',
                        position: "absolute",
                        top: "100%",
                        bottom: "-50%",
                        left: "1em",
                        width: "0.15em",
                        background: "#c6c6c6c7"
                    }
                });
                const text = document.createElement("p");
                text.style.cssText = "font-size: 0.8em;";
                let timeAgo: HTMLParagraphElement;
                const differenceContainer = document.createElement("p");
                differenceContainer.style.cssText = "display: flex; column-gap: 0.45em; color: #6d6d6d; font-size: 0.75em;";

                if (commit.type === "initial") {
                    const iconImg = createElement(GitCommitVertical);
                    iconImg.style.cssText = "height: 80%; width: auto; color: rgb(72 72 123 / 70%);";
                    const iconText = document.createElement("span");
                    iconText.textContent = "Initial";
                    icon.style.background = "rgb(193 193 255 / 45%)";
                    iconText.style.color = "rgb(72 72 123 / 70%)";
                    text.textContent = "Initial Commit";
                    icon.append(iconImg, iconText);
                } else {
                    const iconImg = createElement(commit.type === "push" ? GitPullRequestArrow : GitPullRequestClosed);
                    iconImg.style.cssText = `height: 80%; width: auto; color: ${commit.type === "push" ? "rgb(102 152 130)" : "rgb(129 36 36 / 70%)"};`;
                    const iconText = document.createElement("span");
                    iconText.textContent = commit.type === "push" ? "Push" : "Revert";
                    icon.style.background = commit.type === "push" ? "rgb(172 255 220 / 50%)" : "rgb(255 0 0 / 30%)";
                    iconText.style.color = commit.type === "push" ? "rgb(102 152 130)" : "rgb(129 36 36 / 70%)";
                    text.textContent = `${commit.sourceCharacter.name} (${commit.sourceCharacter.memberNumber})`;
                    icon.append(iconImg, iconText);
                    timeAgo = document.createElement("p");
                    timeAgo.style.cssText = "color: #526378; font-size: 0.75em;";
                    timeAgo.textContent = formatMilliseconds(Date.now() - commit.timestamp) + " ago";
                    const added = document.createElement("p");
                    added.textContent = "+" + commit.bundle.difference.added.length.toString();
                    added.style.color = "#57d157";
                    const modified = document.createElement("p");
                    modified.textContent = commit.bundle.difference.modified.length.toString();
                    modified.style.color = "#ffa705";
                    const removed = document.createElement("p");
                    removed.textContent = "-" + commit.bundle.difference.removed.length.toString();
                    removed.style.color = "#ff0000";
                    differenceContainer.append(added, modified, removed);
                }

                addDynamicClass(commitElement, {
                    base: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontSize: "0.8em",
                        height: "2.5em",
                        padding: "0 0.5em"
                    },
                    hover: {
                        background: "#e7e4ef"
                    }
                });
                commitElement.append(icon, text, timeAgo ? timeAgo : "", differenceContainer);
                commitsContainer.append(commitElement);
            }
        }

        const commitsContainer = document.createElement("div");
        addDynamicClass(commitsContainer, {
            base: {
                display: "flex",
                flexDirection: "column",
                width: "90%",
                // height: "60vh",
                overflowY: "scroll",
                margin: "0 auto",
                padding: "0.5em 0"
            }
        });
        createCommits();
        const updateButton = this.buildButton("Update");
        updateButton.addEventListener("click", () => {
            commitsContainer.innerHTML = "";
            createCommits();
        });
        container.append(select, commitsContainer, updateButton);
    }

    private loadCommitProfile(container: HTMLDivElement, commit: Commit, target: Character) {
        const exitButton = createElement(X);
        addDynamicClass(exitButton, {
            base: {
                cursor: "pointer",
                color: "#454545",
                margin: "0.5em",
                padding: "0.15em",
                width: "2.85em",
                height: "2.85em",
                borderRadius: "6px",
                flexShrink: "0"
            },
            hover: {
                background: "#00000014",
            }
        });
        if (commit.type === "initial") {
            const previewCanvas = this.createPreviewCanvas(commit);
            previewCanvas.style.margin = "auto";
            previewCanvas.style.width = "50%";
            previewCanvas.style.height = "auto";
            exitButton.addEventListener("click", () => {
                exitButton.remove();
                previewCanvas.remove();
                text.remove();
                this.loadCommitsList(container, target);
            });
            const text = document.createElement("p");
            text.style.cssText = "margin: auto; text-align: center;";
            text.textContent = "Just initial commit, nothing interesting. What are you doing here?";
            container.append(exitButton, previewCanvas, text);
        } else {
            const unload = () => {
                flexContainer.remove();
                details.remove();
                seed.remove();
                revertCommitButton.remove();
                revertCommitDescription.remove();
                exitButton.remove();
            };
            exitButton.addEventListener("click", () => {
                unload();
                this.loadCommitsList(container, target);
            });
            const flexContainer = document.createElement("div");
            flexContainer.style.cssText = "display: flex; justify-content: space-evenly; column-gap: 0.25em; height: 15em;";
            const previewCanvas = this.createPreviewCanvas(commit);
            const diffsContainer = document.createElement("div");
            diffsContainer.style.cssText = "font-size: clamp(8px, 1.5vw, 12px); overflow-y: scroll;";
            commit.bundle.difference.added.forEach((added) => {
                const t = document.createElement("div");
                t.style.color = "rgb(87, 209, 87)";
                t.textContent = "+ " + added;
                diffsContainer.append(t);
            });
            commit.bundle.difference.modified.forEach((modified) => {
                const t = document.createElement("div");
                t.style.color = "rgb(255, 167, 5)";
                t.textContent = modified;
                diffsContainer.append(t);
            });
            commit.bundle.difference.removed.forEach((removed) => {
                const t = document.createElement("div");
                t.style.color = "rgb(255, 0, 0)";
                t.textContent = "- " + removed;
                diffsContainer.append(t);
            });
            const details = document.createElement("p");
            details.style.margin = "0.25em 1em";
            details.style.marginTop = "1em";
            details.innerHTML = `Commited by <span style="color: #3b3b4eff;">${commit.sourceCharacter.name} (${commit.sourceCharacter.memberNumber})</span> at <span style="color: #3b3b4eff;">${new Date(commit.timestamp).toLocaleString()}</span>`;
            const seed = document.createElement("p");
            seed.style.margin = "0.25em 1em";
            seed.textContent = `Appearance Seed: ${commit.bundle.seed}`;
            const revertCommitButton = this.buildButton("Revert");
            revertCommitButton.style.marginTop = "1em";
            revertCommitButton.addEventListener("click", () => {
                ServerAppearanceLoadFromBundle(target, target.AssetFamily, commit.bundle.content, Player.MemberNumber);
                ChatRoomCharacterUpdate(target);
                unload();
                this.loadCommitsList(container, target);
            });
            const revertCommitDescription = document.createElement("p");
            revertCommitDescription.style.cssText = "width: 95%; margin: 0 auto; text-align: center; font-size: 0.75em; color: #484848;";
            revertCommitDescription.textContent = "Will send revert commit that will revert all commits following this commit, or send push commit if it is impossible to set exactly the same appearance due to validation";
            flexContainer.append(previewCanvas, diffsContainer);
            container.append(exitButton, flexContainer, details, seed, revertCommitButton, revertCommitDescription);
        }
    }
}