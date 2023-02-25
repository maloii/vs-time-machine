import { makeAutoObservable } from 'mobx';
import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { IGroup } from '@/types/IGroup';
import { ILap } from '@/types/ILap';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { ISerialPortStatus } from '@/types/ISerialPortStatus';
import { IWlanStatus } from '@/types/IWlanStatus';
import { IReport } from '@/types/IReport';
import { IBroadCast } from '@/types/IBroadCast';

export class Story {
    public competitions: Array<ICompetition> = [];
    public sportsmen: Array<ISportsman> = [];
    public teams: Array<ITeam> = [];
    public competition: ICompetition | undefined = undefined;
    public rounds: Array<IRound> = [];
    public groups: Array<IGroup> = [];
    public reports: Array<IReport> = [];
    public broadCasts: Array<IBroadCast> = [];
    public laps: Array<ILap> = [];
    public raceStatus: TypeRaceStatus | undefined = undefined;
    public serialPortStatus: ISerialPortStatus | undefined = undefined;
    public wlanStatus: IWlanStatus | undefined = undefined;
    public connected: boolean = false;
    public startTime: number | undefined = undefined;
    public groupInRace: IGroup | undefined = undefined;
    public connectorMessage: string | undefined = undefined;
    public vtxDevice: MediaDeviceInfo | undefined = undefined;

    public constructor() {
        makeAutoObservable(this);
    }

    public setCompetition = (newCompetition: ICompetition): void => {
        this.competition = newCompetition;
    };

    public setCompetitions = (newCompetitions: ICompetition[]): void => {
        this.competitions = newCompetitions;
    };

    public setSportsmen = (newSportsmen: ISportsman[]): void => {
        this.sportsmen = newSportsmen;
    };

    public setTeams = (newTeams: ITeam[]): void => {
        this.teams = newTeams;
    };

    public setRounds = (newRounds: IRound[]): void => {
        this.rounds = newRounds;
    };

    public setGroups = (newGroups: IGroup[]): void => {
        this.groups = newGroups;
    };

    public setReports = (newReports: IReport[]): void => {
        this.reports = newReports;
    };

    public setBroadCasts = (newBroadCasts: IBroadCast[]): void => {
        this.broadCasts = newBroadCasts;
    };

    public setLaps = (newLaps: ILap[]): void => {
        this.laps = newLaps;
    };

    public setRaceStatus = (RaceStatus: TypeRaceStatus): void => {
        this.raceStatus = RaceStatus;
    };

    public setSerialPortStatus = (newSerialPortStatus: ISerialPortStatus): void => {
        this.serialPortStatus = newSerialPortStatus;
    };

    public setWlanStatus = (newWlanStatus: IWlanStatus): void => {
        this.wlanStatus = newWlanStatus;
    };

    public setConnected = (newConnected: boolean): void => {
        this.connected = newConnected;
    };

    public setStartTime = (newStartTime: number | undefined): void => {
        this.startTime = newStartTime;
    };

    public setGroupInRace = (newGroupInRace: IGroup | undefined): void => {
        this.groupInRace = newGroupInRace;
    };

    public setConnectorMessage = (newConnectorMessage: string | undefined): void => {
        this.connectorMessage = newConnectorMessage;
    };

    public setVtxDevice = (newVtxDevice: MediaDeviceInfo | undefined): void => {
        this.vtxDevice = newVtxDevice;
    };
}

export const story = new Story();
