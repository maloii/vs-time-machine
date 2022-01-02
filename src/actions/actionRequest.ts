import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { ICompetition } from '@/types/ICompetition';
import { loadRoundsAction } from '@/actions/actionRoundRequest';
import { loadSportsmenAction } from '@/actions/actionSportsmanRequest';
import { loadTeamsAction } from '@/actions/actionTeamRequest';

import './actionsResponse';

export const actionRequest = async (): Promise<Array<ICompetition>> => {
    const competitions: ICompetition[] = await db.competition.find({});
    story.setCompetitions(competitions);
    const competition = await db.competition.findOne<ICompetition>({ selected: true });
    if (competition) {
        story.setCompetition(competition);
        loadSportsmenAction(competition);
        loadTeamsAction(competition);
        loadRoundsAction(competition);
    }
    return competitions;
};

export * from './actionTeamRequest';
export * from './actionSportsmanRequest';
export * from './actionRoundRequest';
export * from './actionGroupRequest';
export * from './actionLapRequest';
