import _ from 'lodash';
import { ILap } from '@/types/ILap';
import { story } from '@/story/story';
import { IGroup } from '@/types/IGroup';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';
import { ICompetition } from '@/types/ICompetition';
import { loadSportsmenAction } from '@/actions/actionSportsmanRequest';
import { loadTeamsAction } from '@/actions/actionTeamRequest';
import { loadRoundsAction } from '@/actions/actionRoundRequest';
import { TypeRaceStatus } from '@/types/TypeRaceStatus';
import { ISerialPortStatus } from '@/types/ISerialPortStatus';
import { IWlanStatus } from '@/types/IWlanStatus';

window.api.ipcRenderer.on('load-competitions-response', (e: any, competitions: ICompetition[]) => {
    story.setCompetitions(competitions);
    const competition = _.find(competitions, ['selected', true]);
    if (competition) {
        story.setCompetition(competition);
        loadSportsmenAction(competition);
        loadTeamsAction(competition);
        loadRoundsAction(competition);
    }
});

window.api.ipcRenderer.on('load-sportsmen-for-competition-response', (e: any, sportsmen: ISportsman[]) => {
    story.setSportsmen(sportsmen);
});

window.api.ipcRenderer.on('load-teams-for-competition-response', (e: any, teams: ITeam[]) => {
    story.setTeams(teams);
});

window.api.ipcRenderer.on('load-rounds-for-competition-response', (e: any, rounds: IRound[]) => {
    story.setRounds(rounds);
});

window.api.ipcRenderer.on('load-groups-for-round-response', (e: any, groups: IGroup[]) => {
    story.setGroups(groups);
});

window.api.ipcRenderer.on('load-laps-for-group-response', (e: any, laps: ILap[]) => {
    story.setLaps(laps);
});

window.api.ipcRenderer.on(
    'race-status-message',
    (e: any, raceStatus: TypeRaceStatus, startTime: number | undefined) => {
        story.setRaceStatus(raceStatus);
        story.setStartTime(startTime);
    }
);

window.api.ipcRenderer.on('status-serial-port', (e: any, serialPortStatus: ISerialPortStatus) => {
    story.setSerialPortStatus(serialPortStatus);
    story.setConnected(serialPortStatus.isOpen);
});

window.api.ipcRenderer.on('status-wlan', (e: any, wlanStatus: IWlanStatus) => {
    console.log(wlanStatus);
    story.setWlanStatus(wlanStatus);
    story.setConnected(wlanStatus.isOpen);
});

window.api.ipcRenderer.on('status-connect', (e: any, wlanStatus: IWlanStatus, serialPortStatus: ISerialPortStatus) => {
    story.setWlanStatus(wlanStatus);
    story.setSerialPortStatus(serialPortStatus);
    story.setConnected(wlanStatus?.isOpen || serialPortStatus?.isOpen);
});
