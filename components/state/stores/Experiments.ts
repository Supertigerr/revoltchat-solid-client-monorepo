import { makeAutoObservable, ObservableSet } from "mobx";

import Persistent from "../interfaces/Persistent";
import Store from "../interfaces/Store";

/**
 * Union type of available experiments.
 */
export type Experiment = "dummy" | "offline_users" | "plugins" | "picker";

/**
 * Currently active experiments.
 */
export const AVAILABLE_EXPERIMENTS: Experiment[] = [
    "dummy",
    "offline_users",
    "plugins",
    "picker",
];

/**
 * Definitions for experiments listed by {@link Experiment}.
 */
export const EXPERIMENTS: {
    [key in Experiment]: { title: string; description: string };
} = {
    dummy: {
        title: "Placeholder Experiment",
        description: "This is a placeholder experiment.",
    },
    offline_users: {
        title: "Re-enable offline users in large servers (>10k members)",
        description:
            "If you can take the performance hit - for example, if you're on desktop - you can re-enable offline users for big servers such as the Revolt Lounge.",
    },
    plugins: {
        title: "Experimental Plugin API",
        description:
            "This will enable the experimental plugin API. Only touch this if you know what you're doing.",
    },
    picker: {
        title: "Custom Emoji",
        description:
            "This will enable a work-in-progress emoji picker, custom emoji settings and a reaction picker.",
    },
};

export interface Data {
    enabled?: Experiment[];
}

/**
 * Handles enabling and disabling client experiments.
 */
export default class Experiments implements Store, Persistent<Data> {
    private enabled: ObservableSet<Experiment>;

    /**
     * Construct new Experiments store.
     */
    constructor() {
        this.enabled = new ObservableSet();
        makeAutoObservable(this);
    }

    get id() {
        return "experiments";
    }

    toJSON() {
        return {
            enabled: [...this.enabled],
        };
    }

    hydrate(data: Data) {
        if (data.enabled) {
            for (const experiment of data.enabled) {
                this.enable(experiment as Experiment);
            }
        }
    }

    /**
     * Check if an experiment is enabled.
     * @param experiment Experiment
     */
    isEnabled(experiment: Experiment) {
        return this.enabled.has(experiment);
    }

    /**
     * Enable an experiment.
     * @param experiment Experiment
     */
    enable(experiment: Experiment) {
        if (experiment === "offline_users") {
            // TODO setOfflineSkipEnabled(false);
            // TODO resetMemberSidebarFetched();
        }

        this.enabled.add(experiment);
    }

    /**
     * Disable an experiment.
     * @param experiment Experiment
     */
    disable(experiment: Experiment) {
        // TODO if (experiment === "offline_users") setOfflineSkipEnabled(true);

        this.enabled.delete(experiment);
    }

    /**
     * Set the state of an experiment.
     * @param key Experiment
     * @param enabled Whether this experiment is enabled.
     */
    setEnabled(key: Experiment, enabled: boolean): void {
        if (enabled) {
            this.enable(key);
        } else {
            this.disable(key);
        }
    }

    /**
     * Reset and disable all experiments.
     */
    reset() {
        this.enabled.clear();
    }
}
