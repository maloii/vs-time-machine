import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { ICompetition } from '@/types/ICompetition';
import { IRound } from '@/types/IRound';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import { IGroup } from '@/types/IGroup';
import { groupsFindByRoundId } from '@/repository/GroupRepository';

export const loadCompetitionAction = async (): Promise<Array<ICompetition>> => {
    const competitions: ICompetition[] = await db.competition.find({});
    story.setCompetitions(competitions);
    const competition = await db.competition.findOne<ICompetition>({ selected: true });
    if (competition) {
        story.setCompetition(competition);
        await loadSportsmenAction(competition);
        await loadTeamsAction(competition);
        await loadRoundsAction(competition);
    }
    return competitions;
};

export const loadSportsmenAction = async (competition: ICompetition): Promise<Array<ISportsman>> => {
    const sportsmen: ISportsman[] = await db.sportsman.find({ competitionId: competition._id });
    story.setSportsmen(sportsmen);
    return sportsmen;
};

export const loadTeamsAction = async (competition: ICompetition): Promise<Array<ITeam>> => {
    const teams: ITeam[] = await db.team.find({ competitionId: competition._id });
    story.setTeams(teams);
    return teams;
};

export const loadRoundsAction = async (competition: ICompetition): Promise<Array<IRound>> => {
    const rounds: IRound[] = await db.round.find({ competitionId: competition._id });
    story.setRounds(rounds);
    return rounds;
};

export const loadGroupsAction = async (round: IRound): Promise<Array<IGroup>> => {
    const groups: IGroup[] = await groupsFindByRoundId(round._id);
    story.setGroups(groups);
    return groups;
};
