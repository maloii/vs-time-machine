import React, { FC, useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { DateTime } from 'luxon';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import { TypeLap } from '@/types/TypeLap';
import { ILap } from '@/types/ILap';
import { IGate } from '@/types/IGate';
import { millisecondsToTimeString } from '@/utils/millisecondsToTimeString';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { ISportsman } from '@/types/ISportsman';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { DialogFormLap } from '@/modules/rounds/components/DialogFormLap/DialogFormLap';
import { sportsmanName } from '@/utils/sportsmanName';

import styles from './styles.module.scss';

interface IProps {
    open: boolean;
    memberGroupId: string;
    onClose: () => void;
    laps: ILap[];
    gates?: IGate[];
    sportsmen: ISportsman[];
    onDelete: (id: string) => void;
    onUpdate: (_id: string, lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>) => void;
    onAdd: (
        memberGroupId: string,
        lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>,
        beforeLap?: ILap,
        afterLap?: ILap
    ) => void;
}

export const ListAllLaps: FC<IProps> = ({
    open,
    memberGroupId,
    onClose,
    laps,
    gates,
    sportsmen,
    onDelete,
    onUpdate,
    onAdd
}: IProps) => {
    const [editLap, setEditLap] = useState<ILap | undefined>(undefined);
    const [openAddLap, setOpenAddLap] = useState(false);
    const [beforeLap, setBeforeLap] = useState<ILap | undefined>(undefined);
    const [afterLap, setAfterLap] = useState<ILap | undefined>(undefined);

    const lapsWithPos = useMemo<ILap[]>(() => {
        let pos = 1;
        return (laps || [])
            .map((lap) => {
                if (lap.typeLap === TypeLap.OK) return { ...lap, position: pos++ };
                return lap;
            })
            .map((lap) => ({ ...lap, gate: _.find(gates, ['_id', lap.gateId]) }))
            .map((lap) => ({ ...lap, sportsman: _.find(sportsmen, ['_id', lap.sportsmanId]) }));
    }, [gates, laps, sportsmen]);

    const handleDelete = useCallback(
        (id: string) => () => {
            if (window.confirm('Are you sure you want to delete the lap?')) {
                onDelete(id);
                setEditLap(undefined);
            }
        },
        [onDelete]
    );
    const handleOpenEdit = useCallback((lap: ILap) => () => setEditLap(lap), [setEditLap]);
    const handleOpenAdd = useCallback(() => setOpenAddLap(true), []);
    const handleOpenBeforeAdd = useCallback(
        (lap: ILap) => () => {
            setOpenAddLap(true);
            setBeforeLap(lap);
        },
        [setBeforeLap]
    );
    const handleOpenAfterAdd = useCallback(
        (lap: ILap) => () => {
            setOpenAddLap(true);
            setAfterLap(lap);
        },
        [setAfterLap]
    );
    const handleCloseEdit = useCallback(() => {
        setEditLap(undefined);
        setBeforeLap(undefined);
        setAfterLap(undefined);
        setOpenAddLap(false);
    }, [setEditLap]);

    const handleSave = useCallback(
        (id: string, lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>) => {
            onUpdate(id, lap);
            handleCloseEdit();
        },
        [onUpdate, handleCloseEdit]
    );

    const handleAdd = useCallback(
        (
            memberGroupId: string,
            lap: Pick<ILap, 'typeLap' | 'gateId' | 'timeLap'>,
            beforeLap?: ILap,
            afterLap?: ILap
        ) => {
            onAdd(memberGroupId, lap, beforeLap, afterLap);
            handleCloseEdit();
        },
        [onAdd, handleCloseEdit]
    );

    const Row: FC<{ lap: ILap }> = ({ lap }: { lap: ILap }) => {
        return (
            <TableRow>
                <TableCell>{lap.position}</TableCell>
                <TableCell>{DateTime.fromMillis(lap.millisecond).toFormat('dd.MM.yyyy hh:mm.ss')}</TableCell>
                <TableCell>{lap.timeLap ? millisecondsToTimeString(lap.timeLap) : '--:--:---'}</TableCell>
                <TableCell>{lap.typeLap}</TableCell>
                <TableCell>{lap.gate?.number || <b>{lap.gateNumber}</b>}</TableCell>
                <TableCell>{lap.gate?.position}</TableCell>
                <TableCell>{lap.transponder}</TableCell>
                <TableCell>{sportsmanName(lap.sportsman!)}</TableCell>
                <TableCell>
                    <div className={styles.actions}>
                        <Tooltip title="Add lap after">
                            <IconButton onClick={handleOpenAfterAdd(lap)}>
                                <ArrowDownwardIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add lap before">
                            <IconButton onClick={handleOpenBeforeAdd(lap)}>
                                <ArrowUpwardIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleOpenEdit(lap)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete(lap._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth={false}>
                <DialogTitle>All laps</DialogTitle>
                <DialogContent>
                    {lapsWithPos?.length === 0 && (
                        <div className={styles.add}>
                            <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                                Add lap
                            </Button>
                        </div>
                    )}
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Lap</TableCell>
                                    <TableCell>DateTime</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Gate num.</TableCell>
                                    <TableCell>Gate pos.</TableCell>
                                    <TableCell>Transponder</TableCell>
                                    <TableCell>Sportsman</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lapsWithPos.map((lap, indx) => (
                                    <Row key={lap._id} lap={lap} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {(!!editLap || openAddLap) && (
                <DialogFormLap
                    memberGroupId={memberGroupId}
                    lap={editLap}
                    beforeLap={beforeLap}
                    afterLap={afterLap}
                    gates={gates || []}
                    open={!!editLap || openAddLap}
                    onDelete={handleDelete}
                    onClose={handleCloseEdit}
                    onUpdate={handleSave}
                    onAdd={handleAdd}
                />
            )}
        </>
    );
};
