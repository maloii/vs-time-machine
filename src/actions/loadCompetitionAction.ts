import { story } from '@/story/story';
import { db } from '@/repository/Repository';
import { ICompetition } from '@/types/ICompetition';

export const loadCompetitionAction = async (): Promise<void> => {
    story.setCompetitions(await db.competition.find({}));
    const competition = await db.competition.findOne<ICompetition>({ selected: true });
    if (competition) {
        story.setCompetition(competition);
        story.setSportsmen(await db.sportsman.find({ competitionId: competition._id }));
        story.setRounds(await db.round.find({ competitionId: competition._id }));
    }
};
