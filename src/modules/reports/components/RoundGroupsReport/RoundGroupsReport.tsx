import React, { FC, useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IReport } from '@/types/IReport';
import { IGroup } from '@/types/IGroup';
import { loadGroupsByRoundAction } from '@/actions/actionGroupRequest';
import { sportsmanName } from '@/utils/sportsmanName';
import { ColorAndChannel } from '@/modules/rounds/components/ColorAndChannel/ColorAndChannel';
import { story } from '@/story/story';

import styles from './styles.module.scss';

interface IProps {
    report: IReport;
}

export const RoundGroupsReport: FC<IProps> = ({ report }: IProps) => {
    const [groups, setGroups] = useState<Array<IGroup>>([]);

    useEffect(() => {
        if (report.roundId) {
            loadGroupsByRoundAction(report.roundId).then(setGroups);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report.roundId, story.rounds, story.groups]);

    return (
        <div className={styles.root}>
            {groups.map((group) => (
                <div>
                    <h2>{group.name}</h2>
                    <TableContainer className={styles.group} component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pos.</TableCell>
                                    <TableCell>Sportsman/Team</TableCell>
                                    <TableCell>Col./Ch.</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...group.sportsmen, ...group.teams].map((memberGroup) => (
                                    <TableRow key={memberGroup._id}>
                                        <TableCell>{memberGroup.startNumber}</TableCell>
                                        <TableCell>
                                            {memberGroup.sportsman
                                                ? sportsmanName(memberGroup.sportsman)
                                                : memberGroup.team?.name}
                                        </TableCell>
                                        <TableCell style={{ whiteSpace: 'nowrap' }}>
                                            {memberGroup.channel !== undefined && memberGroup.color !== undefined && (
                                                <ColorAndChannel
                                                    channel={memberGroup.channel}
                                                    color={memberGroup.color}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}
        </div>
    );
};
