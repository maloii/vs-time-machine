import { loadCompetitionsAction } from '@/actions/actionCompetitionRequest';
import { loadGroupsByRoundIdAction } from '@/actions/actionGroupRequest';
import { IRound } from '@/types/IRound';
import { loadRoundsAction } from '@/actions/actionRoundRequest';
import { ICompetition } from '@/types/ICompetition';
import { loadReportsAction } from '@/actions/actionReportRequest';
import { loadTeamsAction } from '@/actions/actionTeamRequest';
import { loadSportsmenAction } from '@/actions/actionSportsmanRequest';
import { loadBroadCastsAction } from '@/actions/actionBroadcastRequest';

import './actions/actionsResponse';
import { ILap } from '@/types/ILap';
import { loadLapsForGroupAction } from '@/actions/actionLapRequest';
import { TypeLap } from '@/types/TypeLap';
import { beep } from '@/utils/beep';
import { IGroup } from '@/types/IGroup';

export const init = () => {
    loadCompetitionsAction();

    window.api.ipcRenderer.removeAllListeners('competition-insert-response');
    window.api.ipcRenderer.removeAllListeners('competition-update-response');
    window.api.ipcRenderer.removeAllListeners('competition-delete-response');
    window.api.ipcRenderer.on('competition-insert-response', () => loadCompetitionsAction());
    window.api.ipcRenderer.on('competition-update-response', () => loadCompetitionsAction());
    window.api.ipcRenderer.on('competition-delete-response', () => loadCompetitionsAction());
};

export const initByRound = (round?: IRound) => {
    if (round) {
        loadGroupsByRoundIdAction(round._id);
        window.api.ipcRenderer.removeAllListeners('group-insert-response');
        window.api.ipcRenderer.removeAllListeners('group-update-response');
        window.api.ipcRenderer.removeAllListeners('group-select-response');
        window.api.ipcRenderer.removeAllListeners('group-delete-response');
        window.api.ipcRenderer.removeAllListeners('lap-update-response');
        window.api.ipcRenderer.removeAllListeners('lap-delete-response');
        window.api.ipcRenderer.on('group-insert-response', () => loadGroupsByRoundIdAction(round._id));
        window.api.ipcRenderer.on('group-update-response', () => loadGroupsByRoundIdAction(round._id));
        window.api.ipcRenderer.on('group-select-response', () => loadGroupsByRoundIdAction(round._id));
        window.api.ipcRenderer.on('group-delete-response', () => loadGroupsByRoundIdAction(round._id));
        window.api.ipcRenderer.on('lap-update-response', () => loadGroupsByRoundIdAction(round._id));
        window.api.ipcRenderer.on('lap-delete-response', () => loadGroupsByRoundIdAction(round._id));
    }
};

export const initByCompetition = (competition?: ICompetition) => {
    if (competition) {
        window.api.ipcRenderer.removeAllListeners('round-insert-response');
        window.api.ipcRenderer.removeAllListeners('round-update-response');
        window.api.ipcRenderer.removeAllListeners('round-select-response');
        window.api.ipcRenderer.removeAllListeners('round-delete-response');
        window.api.ipcRenderer.removeAllListeners('report-insert-response');
        window.api.ipcRenderer.removeAllListeners('report-update-response');
        window.api.ipcRenderer.removeAllListeners('report-delete-response');
        window.api.ipcRenderer.removeAllListeners('broadcast-insert-response');
        window.api.ipcRenderer.removeAllListeners('broadcast-update-response');
        window.api.ipcRenderer.removeAllListeners('broadcast-delete-response');
        window.api.ipcRenderer.removeAllListeners('team-insert-response');
        window.api.ipcRenderer.removeAllListeners('team-update-response');
        window.api.ipcRenderer.removeAllListeners('sportsman-insert-response');
        window.api.ipcRenderer.removeAllListeners('sportsman-update-response');
        window.api.ipcRenderer.on('round-insert-response', () => loadRoundsAction(competition));
        window.api.ipcRenderer.on('round-update-response', () => loadRoundsAction(competition));
        window.api.ipcRenderer.on('round-select-response', () => loadRoundsAction(competition));
        window.api.ipcRenderer.on('round-delete-response', () => loadRoundsAction(competition));
        window.api.ipcRenderer.on('report-insert-response', () => loadReportsAction(competition._id));
        window.api.ipcRenderer.on('report-update-response', () => loadReportsAction(competition._id));
        window.api.ipcRenderer.on('report-delete-response', () => loadReportsAction(competition._id));
        window.api.ipcRenderer.on('broadcast-insert-response', () => loadBroadCastsAction(competition._id));
        window.api.ipcRenderer.on('broadcast-update-response', () => loadBroadCastsAction(competition._id));
        window.api.ipcRenderer.on('broadcast-delete-response', () => loadBroadCastsAction(competition._id));
        window.api.ipcRenderer.on('team-insert-response', () => loadTeamsAction(competition));
        window.api.ipcRenderer.on('team-update-response', () => loadTeamsAction(competition));
        window.api.ipcRenderer.on('sportsman-insert-response', () => loadSportsmenAction(competition));
        window.api.ipcRenderer.on('sportsman-update-response', () => loadSportsmenAction(competition));
    }
};

export const initLaps = (selectedGroup: IGroup | undefined, readonly: boolean) => {
    window.api.ipcRenderer.removeAllListeners('new-lap-update');
    window.api.ipcRenderer.on('new-lap-update', (e: any, newLap: ILap) => {
        if (selectedGroup?._id === newLap.groupId) {
            loadLapsForGroupAction(newLap.groupId);
        }
        if (
            !readonly &&
            [TypeLap.OK, TypeLap.START, TypeLap.PIT_STOP_END, TypeLap.PIT_STOP_BEGIN, TypeLap.GATE].includes(
                newLap.typeLap
            )
        ) {
            beep(20, 1000, 'sine');
        }
    });
};
