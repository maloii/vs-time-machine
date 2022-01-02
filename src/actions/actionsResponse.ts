import { ILap } from '@/types/ILap';
import { story } from '@/story/story';
import { IGroup } from '@/types/IGroup';
import { IRound } from '@/types/IRound';
import { ITeam } from '@/types/ITeam';
import { ISportsman } from '@/types/ISportsman';

const { ipcRenderer } = window.require('electron');

ipcRenderer.on('load-sportsmen-for-competition-response', (e, sportsmen: ISportsman[]) => {
    story.setSportsmen(sportsmen);
});

ipcRenderer.on('load-teams-for-competition-response', (e, teams: ITeam[]) => {
    story.setTeams(teams);
});

ipcRenderer.on('load-rounds-for-competition-response', (e, rounds: IRound[]) => {
    story.setRounds(rounds);
});

ipcRenderer.on('load-groups-for-round-response', (e, groups: IGroup[]) => {
    story.setGroups(groups);
});

ipcRenderer.on('load-laps-for-group-response', (e, laps: ILap[]) => {
    story.setLaps(laps);
});
