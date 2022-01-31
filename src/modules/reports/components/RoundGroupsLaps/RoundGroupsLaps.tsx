import React, { FC, Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import { TableLaps } from '@/modules/rounds/components/TableLaps/TableLaps';
import { IReport } from '@/types/IReport';
import { IGroup } from '@/types/IGroup';
import { IRound } from '@/types/IRound';
import { loadGroupsByRoundAction } from '@/actions/actionGroupRequest';
import { story } from '@/story/story';
import { loadLapsForRoundAction } from '@/actions/actionLapRequest';

interface IProps {
    report: IReport;
    rounds: IRound[];
}

export const RoundGroupsLaps: FC<IProps> = ({ report, rounds }: IProps) => {
    const [groups, setGroups] = useState<Array<IGroup>>([]);
    const round = _.find(rounds, ['_id', report.roundId]);

    useEffect(() => {
        if (report.roundId) {
            Promise.all([loadLapsForRoundAction(report.roundId), loadGroupsByRoundAction(report.roundId)]).then(
                ([roundLaps, groups]) => {
                    setGroups(
                        groups.map((group) => ({
                            ..._.cloneDeep(group),
                            laps: (roundLaps || []).filter((lap) => lap.groupId === group._id)
                        }))
                    );
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report.roundId, story.rounds, story.groups]);

    return (
        <div>
            {Boolean(round) &&
                groups.map((group) => (
                    <Fragment key={group._id}>
                        <h2>{`${round?.name} - ${group.name}`}</h2>
                        <TableLaps round={round!} group={group} groupLaps={group.laps} readonly />
                    </Fragment>
                ))}
        </div>
    );
};
