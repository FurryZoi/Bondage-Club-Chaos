import { BaseQAMSubscreen } from "./baseQAMSubscreen";


export class ViewCardDecksQAMSubscreen extends BaseQAMSubscreen {
    public name: string = "View Card Decks";
    public description: string = "View target's decks of cards";

    public load(container: Element) {
        super.load(container);

        let target: Character = Player;
        let deckIndex = 0;
        const select = this.buildCharacterSelect((_target) => {
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
            const select = this.buildSelect({
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
}