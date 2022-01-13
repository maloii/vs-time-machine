import { ISportsman } from '@/types/ISportsman';
import { IReport } from '@/types/IReport';
import { ITeam } from '@/types/ITeam';
import { IPositionSportsmenReport } from '@/types/IPositionSportsmenReport';
import { sportsmanName } from '@/utils/sportsmanName';
import _ from 'lodash';

export const calculatePositionSportsmenReport = async (
    report: IReport,
    teams: ITeam[],
    sportsmen: ISportsman[]
): Promise<Array<IPositionSportsmenReport>> => {
    return _.orderBy(
        [
            ...(teams || [])
                .filter((team) => team.selected)
                .map((team) => ({
                    _id: team._id,
                    pos: team.position,
                    name: team.name,
                    city: team.city,
                    country: team.country
                })),
            ...(sportsmen || [])
                .filter((sportsman) => sportsman.selected)
                .map((sportsman) => ({
                    _id: sportsman._id,
                    pos: sportsman.position,
                    name: sportsmanName(sportsman),
                    city: sportsman.city,
                    country: sportsman.country
                }))
        ],
        'pos'
    );
};
