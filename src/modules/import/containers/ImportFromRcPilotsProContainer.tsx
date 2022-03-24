import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import _ from 'lodash';
import {
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { ICompetitionRcPilots, IRcPilotsResponse } from '@/types/IRcPilotsResponse';
import { DateTime } from 'luxon';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { story } from '@/story/story';
import { loadCompetitionsAction } from '@/actions/actionCompetitionRequest';
import { rcPilotsTransform, rcPilotsUpdate } from '@/modules/import/utils/rcPilotsTransform';
import {
    handleLoadSportsmenAction,
    sportsmanInsertAction,
    sportsmanUpdateAction
} from '@/actions/actionSportsmanRequest';

import styles from './styles.module.scss';

const URL_RC_PILOTS = 'https://rcpilots.pro/rest_api/get_events.php?type=0&hash=read_only';
const URL_RC_PHOTO_PILOT = 'https://rcpilots.pro/pilots_foto/';

export const ImportFromRcPilotsProContainer: FC = observer(() => {
    const [loading, setLoading] = useState(false);
    const [competitions, setCompetitions] = useState<Array<ICompetitionRcPilots>>([]);
    const [search, setSearch] = useState('');

    const handleChangeSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value), []);
    const handleClearSearch = useCallback(() => setSearch(''), []);
    const handleImport = useCallback(
        (id: string) => async () => {
            if (window.confirm('Do you really want to import sportsmen')) {
                const competition = _.find(competitions || [], ['id', id]);
                if (competition && story?.competition?._id) {
                    const sportsmen = await handleLoadSportsmenAction(story?.competition?._id);
                    for (const pilot of competition.pilots || []) {
                        const existSportsman = _.find(sportsmen, ['externalId', pilot.id]);
                        let photo = '';
                        if (pilot.photo_file) {
                            photo = await axios
                                .get(`${URL_RC_PHOTO_PILOT}${pilot.photo_file}`, { responseType: 'blob' })
                                .then(({ data }) => window.api.saveFile(pilot.photo_file, data));
                        }

                        if (existSportsman) {
                            sportsmanUpdateAction(existSportsman._id, {
                                ...rcPilotsUpdate(pilot, existSportsman),
                                photo
                            });
                        } else {
                            sportsmanInsertAction({
                                ...rcPilotsTransform(pilot),
                                competitionId: story.competition?._id!,
                                photo
                            });
                        }
                    }
                    window.alert('Sportsmen imported!');
                } else {
                    window.alert('Error!');
                }
            }
        },
        [competitions]
    );

    useEffect(() => {
        loadCompetitionsAction();
        setLoading(true);
        axios
            .get<IRcPilotsResponse>(URL_RC_PILOTS)
            .then(({ data }) =>
                setCompetitions(
                    data.data.sort(
                        (a, b) =>
                            (DateTime.fromFormat(b.date_event, 'dd.MM.yyyy').toMillis() || 0) -
                            (DateTime.fromFormat(a.date_event, 'dd.MM.yyyy').toMillis() || 0)
                    )
                )
            )
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={styles.root}>
            <h2>Import sportsmen from RcPilots.pro</h2>
            <TextField
                className={styles.search}
                size="small"
                label="Search"
                value={search}
                onChange={handleChangeSearch}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Count pilots</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(competitions || [])
                            .filter((row) => {
                                if (!search) return true;
                                return row.name?.toUpperCase()?.indexOf(search.toUpperCase()) >= 0;
                            })
                            .map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th">{row.name}</TableCell>
                                    <TableCell>{row.date_event}</TableCell>
                                    <TableCell>{row.pilots?.length}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={handleImport(row.id)}>
                                            <CloudDownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading && (
                <div className={styles.loading}>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
});
