import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { getCurrentSubscreen, setSubscreen } from "zois-core/ui";
import icon from "@/assets/game-icons/mouthWatering.svg";


export function loadSettingsSubscreen(): void {
	// icon.style.width = "45px";
	// icon.style.height = "45px";

	PreferenceRegisterExtensionSetting({
		Identifier: "BCC",
		ButtonText: "BCC",
		Image: icon.replace('width="512"', 'width="85"').replace('height="512"', 'height="85"'),
		click: () => {
			getCurrentSubscreen()?.click();
		},
		run: () => {
			getCurrentSubscreen()?.run();
		},
		exit: () => false,
		load: () => {
			setSubscreen(new MainSubscreen());
		}
	});
}