import i18n from "../../electron/configs/i18next.config";

export interface ISettingVoice {
    invite: string;
    delayStartEnabled: boolean;
    delayStart: string;
    delayStartSec: number;
    happyRacingEnabled: boolean;
    happyRacing: string;
    toEndRaceEnabled: boolean;
    toEndRace10sec: string;
    toEndRace30sec: string;
    toEndRace1min: string;
    toEndRace5min: string;
    toEndRace10min: string;
    windowsVoice?: string;
    raceIsOverEnabled: boolean;
    raceIsOver: string;
    playFailEnabled: boolean;
    playFail: string;
    pilotFinishedEnabled: boolean;
    pilotFinished: string;
    allPilotsFinished: string;
}
