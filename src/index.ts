import "reflect-metadata";
import { injectStyles, bootstrap } from "zois-core";
import { toastsManager } from "zois-core/toasts";
import styles from "./styles.css";
import { version } from "../package.json";
import { loadSettingsSubscreen } from "./modules/settings";
import kitnyx2Font from "./assets/Kitnyx2.ttf";
import { loadCheats } from "./modules/cheats";
import { loadStorage } from "./modules/storage";
import { loadChaosAura } from "./modules/chaosAura";
import { loadOverlay } from "./modules/overlay";
import { loadDarkMagic } from "./modules/darkMagic";
import { loadQuickAccessMenu } from "./modules/quickAccessMenu";
import { addActivities } from "./modules/activities";
import { REPOSITORY_URL } from "./constants";
import { MainSubscreen } from "./subscreens/mainSubscreen";
import { OverlaySubscreen } from "./subscreens/overlaySubscreen";
import { QuickAccessMenuSubscreen } from "./subscreens/quickAccessMenuSubscreen";
import { CheatsSubscreen } from "./subscreens/cheatsSubscreen";
import { DarkMagicSubscreen } from "./subscreens/darkMagicSubscreen";
import { ChaosAuraSubscreen } from "./subscreens/chaosAuraSubscreen";
import { AttributionsSubscreen } from "./subscreens/attributionsSubscreen";
import { ResetSettingsSubscreen } from "./subscreens/resetSettingsSubscreen";
import { EffectSettingsSubscreen } from "./subscreens/dark-magic-subscreen/effectSettingsSubscreen";
import { LimitsSubscreen } from "./subscreens/dark-magic-subscreen/limitsSubscreen";
import { MySpellsSubscreen } from "./subscreens/dark-magic-subscreen/mySpellsSubscreen";
import { SpellEditorSubscreen } from "./subscreens/dark-magic-subscreen/spellEditorSubscreen";
import { TomeOfKnowledgeSubscreen } from "./subscreens/dark-magic-subscreen/tomeOfKnowledgeSubscreen";
import { logger } from "zois-core/logging";
import { CheatsMinigamesSubscreen } from "./subscreens/cheatsMinigamesSubscreen";


bootstrap({
    name: "BCC",
    fullName: "Bondage Club Chaos",
    repository: REPOSITORY_URL,
    key: "BCC",
    version,
    fontFamily: "Yusei Magic",
    singleToastsTheme: {
        backgroundColor: "#191919",
        titleColor: "#e600d2",
        messageColor: "#a9a9a9",
        iconFillColor: "#e600d2",
        iconStrokeColor: "#191919",
        progressBarColor: "rgba(255, 9, 205, 0.12)"
    },
    subscreens: {
        MainSubscreen,
        OverlaySubscreen,
        QuickAccessMenuSubscreen,
        CheatsSubscreen,
        CheatsMinigamesSubscreen,
        DarkMagicSubscreen,
        ChaosAuraSubscreen,
        AttributionsSubscreen,
        ResetSettingsSubscreen,
        EffectSettingsSubscreen,
        LimitsSubscreen,
        MySpellsSubscreen,
        SpellEditorSubscreen,
        TomeOfKnowledgeSubscreen
    },
    onReady: () => {
        injectStyles(`${styles}@font-face { font-family: Kitnyx2; src: url(${kitnyx2Font}); }`);
        loadStorage();
        loadSettingsSubscreen();
        loadCheats();
        loadQuickAccessMenu();
        loadChaosAura();
        loadOverlay();
        loadDarkMagic();
        addActivities();

        logger.log(`Loaded v${version}`);
        toastsManager.success({
            title: "BCC loaded",
            message: `v${version}`,
            duration: 4500
        });
    }
});