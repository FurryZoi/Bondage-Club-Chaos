import { injectStyles, MOD_DATA, registerCore, waitForStart } from "zois-core";
import { version } from "../package.json";
import { toastsManager } from "zois-core/popups";
import styles from "./styles.css";
import { messagesManager } from "zois-core/messaging";
import { IsString } from "zois-core/validation"
import { loadSettingsSubscreen } from "./modules/settings";
import { createIcons, Heart } from "lucide";
import kitnyx2Font from "./assets/Kitnyx2.ttf";
import { loadCheats } from "./modules/cheats";
import { loadStorage } from "./modules/storage";
import { loadChaosAura } from "./modules/chaosAura";
import { loadOverlay } from "./modules/overlay";
import { loadDarkMagic } from "./modules/darkMagic";
import { loadQuickMenu } from "./modules/quickMenu";


function start() {
    registerCore({
        name: "BCC",
        fullName: "Bondage Club Chaos",
        key: "BCC",
        version,
        fontFamily: "Yusei Magic",
        singleToastsTheme: {
            backgroundColor: "#191919",
            titleColor: "#e600d2",
            messageColor: "#a9a9a9",
            iconFillColor: "#e600d2",
            iconStrokeColor: "#731f71",
            progressBarColor: "#242424"
        }
    });

    injectStyles(`${styles}@font-face { font-family: Kitnyx2; src: url(${kitnyx2Font}); }`);
    loadStorage();
    loadSettingsSubscreen();
    loadCheats();
    loadQuickMenu();
    loadChaosAura();
    loadOverlay();
    loadDarkMagic();

    toastsManager.success({
        title: `${MOD_DATA.fullName} loaded`,
        message: `v${version}`,
        duration: 4500
    });
}

waitForStart(start);