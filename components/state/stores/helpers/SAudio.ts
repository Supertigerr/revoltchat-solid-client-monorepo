import { makeAutoObservable } from "mobx";

// TODO import call_join from "../../../assets/sounds/call_join.mp3";
// TODO import call_leave from "../../../assets/sounds/call_leave.mp3";
// TODO import message from "../../../assets/sounds/message.mp3";
// TODO import outbound from "../../../assets/sounds/outbound.mp3";
import Settings from "../Settings";

export type Sounds = never; // TODO "message" | "outbound" | "call_join" | "call_leave";

export interface Sound {
    enabled: boolean;
    path: string;
}

export type SoundOptions = {
    [key in Sounds]?: Partial<Sound>;
};

export const DefaultSoundPack: { [key in Sounds]: string } = {
    // TODO message,
    // TODO outbound,
    // TODO call_join,
    // TODO call_leave,
};

export const ALL_SOUNDS: Sounds[] = [
    // TODO "message",
    // TODO "outbound",
    // TODO "call_join",
    // TODO "call_leave",
];
export const DEFAULT_SOUNDS: Sounds[] = [
    // TODO "message", "call_join", "call_leave"
];

/**
 * Helper class for reading and writing themes.
 */
export default class SAudio {
    private settings: Settings;
    private cache: Map<string, HTMLAudioElement>;

    /**
     * Construct a new sound helper.
     * @param settings Settings parent class
     */
    constructor(settings: Settings) {
        this.settings = settings;
        makeAutoObservable(this);

        this.cache = new Map();

        // Asynchronously load Audio files into cache.
        setTimeout(() => this.loadCache(), 0);
    }

    setEnabled(sound: Sounds, enabled: boolean) {
        const obj = this.settings.get("notifications:sounds");
        this.settings.set("notifications:sounds", {
            ...obj,
            [sound]: {
                // @ts-expect-error TODO
                ...obj?.[sound],
                enabled,
            },
        });
    }

    getSound(sound: Sounds, options?: SoundOptions): Sound {
        return {
            path: DefaultSoundPack[sound],
            enabled: DEFAULT_SOUNDS.includes(sound),
            // @ts-expect-error TODO
            ...(options ?? this.settings.get("notifications:sounds"))?.[sound],
        };
    }

    getState(): ({ id: Sounds } & Sound)[] {
        const options = this.settings.get("notifications:sounds");
        return ALL_SOUNDS.map((id) => {
            return { id, ...this.getSound(id, options) };
        });
    }

    getAudio(path: string) {
        if (this.cache.has(path)) {
            return this.cache.get(path)!;
        } 
            const el = new Audio(path);
            this.cache.set(path, el);
            return el;
        
    }

    loadCache() {
        this.getState().map(({ path }) => this.getAudio(path));
    }

    playSound(sound: Sounds) {
        const definition = this.getSound(sound);
        if (definition.enabled) {
            const audio = this.getAudio(definition.path);
            try {
                audio.play();
            } catch (err) {
                console.error("Hit error while playing", `${sound  }:`, err);
            }
        }
    }
}
