import { MainSubscreen } from "@/subscreens/mainSubscreen";
import { getCurrentSubscreen, setSubscreen } from "zois-core/ui";
import icon from "@/assets/game-icons/mouthWatering.svg";


export function loadSettingsSubscreen(): void {
	PreferenceRegisterExtensionSetting({
		Identifier: "BCC",
		ButtonText: "BCC Settings",
		Image: icon.replace('width="512"', 'width="85"').replace('height="512"', 'height="85"'),
		click: () => {
			getCurrentSubscreen()?.click();
		},
		run: () => {
			getCurrentSubscreen()?.run();
		},
		exit: () => false,
		load: () => {
			setSubscreen(new MainSubscreen(true));
		}
	});
}