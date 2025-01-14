import { makeAutoObservable, ObservableMap } from "mobx";

// TODO import { mapToRecord } from "../../lib/conversion";

// TODO import { Fonts, MonospaceFonts, Overrides } from "../../context/Theme";

// TODO import { EmojiPack, setGlobalEmojiPack } from "../../components/common/Emoji";
import Persistent from "../interfaces/Persistent";
import Store from "../interfaces/Store";
import Syncable from "../interfaces/Syncable";
import SAudio, { SoundOptions } from "./helpers/SAudio";
import SSecurity from "./helpers/SSecurity";

export interface ISettings {
    "notifications:desktop": boolean;
    "notifications:sounds": SoundOptions;

    // TODO "appearance:emoji": EmojiPack;
    "appearance:ligatures": boolean;
    "appearance:seasonal": boolean;
    "appearance:transparency": boolean;
    "appearance:show_send_button": boolean;
    "appearance:show_account_age": boolean;

    "appearance:theme:base": "dark" | "light";
    // TODO "appearance:theme:overrides": Partial<Overrides>;
    "appearance:theme:light": boolean;
    // TODO "appearance:theme:font": Fonts;
    // TODO "appearance:theme:monoFont": MonospaceFonts;
    "appearance:theme:css": string;

    "security:trustedOrigins": string[];
}

/**
 * Manages user settings.
 */
export default class Settings
    implements Store, Persistent<ISettings>, Syncable
{
    private data: ObservableMap<string, unknown>;

    // TODO theme: STheme;
    sounds: SAudio;
    security: SSecurity;

    /**
     * Construct new Settings store.
     */
    constructor() {
        this.data = new ObservableMap();
        makeAutoObservable(this);

        // TODO this.theme = new STheme(this);
        this.sounds = new SAudio(this);
        this.security = new SSecurity(this);
    }

    get id() {
        return "settings";
    }

    toJSON() {
        // TODO return JSON.parse(JSON.stringify(mapToRecord(this.data)));
    }

    hydrate(data: ISettings) {
        Object.keys(data).forEach(
            (key) =>
                typeof (data as any)[key] !== "undefined" &&
                this.data.set(key, (data as any)[key]),
        );
    }

    /**
     * Set a settings key.
     * @param key Colon-divided key
     * @param value Value
     */
    set<T extends keyof ISettings>(key: T, value: ISettings[T]) {
        // Emoji needs to be immediately applied.
        // TODO 
        /* if (key === "appearance:emoji") {
            setGlobalEmojiPack(value as EmojiPack);
        } */

        this.data.set(key, value);
    }

    /**
     * Get a settings key.
     * @param key Colon-divided key
     * @param defaultValue Default value if not present
     * @returns Value at key
     */
    get<T extends keyof ISettings>(
        key: T,
        defaultValue?: ISettings[T],
    ) {
        return (this.data.get(key) as ISettings[T] | undefined) ?? defaultValue;
    }

    remove<T extends keyof ISettings>(key: T) {
        this.data.delete(key);
    }

    /**
     * Set a value in settings without type-checking.
     * @param key Colon-divided key
     * @param value Value
     */
    setUnchecked(key: string, value: unknown) {
        this.data.set(key, value);
    }

    /**
     * Get a settings key with unknown type.
     * @param key Colon-divided key
     * @returns Value at key
     */
    getUnchecked(key: string) {
        return this.data.get(key);
    }

    apply(
        key: "appearance" | "theme",
        data: unknown,
        _revision: number,
    ) {
        if (key === "appearance") {
            // TODO this.remove("appearance:emoji");
            this.remove("appearance:seasonal");
            this.remove("appearance:transparency");
        } else {
            this.remove("appearance:ligatures");
            this.remove("appearance:theme:base");
            this.remove("appearance:theme:css");
            // TODO this.remove("appearance:theme:font");
            this.remove("appearance:theme:light");
            // TODO this.remove("appearance:theme:monoFont");
            // TODO this.remove("appearance:theme:overrides");
        }

        this.hydrate(data as ISettings);
    }

    private pullKeys(keys: (keyof ISettings)[]) {
        const obj: Partial<ISettings> = {};
        keys.forEach((key) => {
            const value = this.get(key);
            if (!value) return;
            (obj as any)[key] = value;
        });

        return obj;
    }

    toSyncable() {
        const data: Record<"appearance" | "theme", Partial<ISettings>> = {
            appearance: this.pullKeys([
                // TODO "appearance:emoji",
                "appearance:seasonal",
                "appearance:transparency",
            ]),
            theme: this.pullKeys([
                "appearance:ligatures",
                "appearance:theme:base",
                "appearance:theme:css",
                // TODO "appearance:theme:font",
                "appearance:theme:light",
                // TODO "appearance:theme:monoFont",
                // TODO "appearance:theme:overrides",
            ]),
        };

        return data;
    }
}
