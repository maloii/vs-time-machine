import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { Box, Button, IconButton, InputAdornment, Tab, Tabs, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { TableSportsmen } from '@/modules/sportsmen/components/TableSportsmen/TableSportsmen';
import { TableTeams } from '@/modules/sportsmen/components/TableTeams/TableTeams';
import { story } from '@/story/story';
import { ISportsman } from '@/types/ISportsman';
import { ITeam } from '@/types/ITeam';
import {
    loadSportsmenAction,
    loadTeamsAction,
    sportsmanDeleteAction,
    sportsmanInsertAction,
    sportsmanUpdateAction,
    teamDeleteAction,
    teamInsertAction,
    teamUpdateAction
} from '@/actions/actionRequest';
import { DialogSportsmanEdit } from '@/modules/sportsmen/components/DialogSportsmanEdit/DialogSportsmanEdit';
import { DialogTeamEdit } from '@/modules/sportsmen/components/DialogTeamEdit/DialogTeamEdit';

import styles from './styles.module.scss';

export const SportsmenContainer: FC = observer(() => {
    const [tabSelected, setTabSelected] = useState('Sportsmen');
    const [searchSportsmen, setSearchSportsmen] = useState('');
    const [searchTeams, setSearchTeams] = useState('');

    const [openDialogAddSportsman, setOpenDialogAddSportsman] = useState(false);
    const [openDialogAddTeam, setOpenDialogAddTeam] = useState(false);
    const [sportsmanEdit, setSportsmanEdit] = useState<ISportsman>();
    const [teamEdit, setTeamEdit] = useState<ITeam>();

    const sportsmen = useMemo(
        () =>
            _.sortBy(story.sportsmen, 'lastName').filter((sportsman) => {
                if (!searchSportsmen) return true;
                return (
                    `${sportsman.lastName} ${sportsman.firstName} ${sportsman.middleName} ${sportsman.transponders.join(
                        ' '
                    )}`
                        .toUpperCase()
                        .indexOf(searchSportsmen.toUpperCase()) >= 0
                );
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [story.sportsmen, searchSportsmen]
    );

    const teams = useMemo(
        () =>
            _.sortBy(story.teams, 'name').filter((team) => {
                if (!searchTeams) return true;
                return team.name.toUpperCase().indexOf(searchTeams.toUpperCase()) >= 0;
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [story.teams, searchTeams]
    );

    const handleChangeTab = useCallback((event: React.SyntheticEvent, id: string) => {
        setTabSelected(id);
    }, []);

    const handleChangeSearchSportsmen = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchSportsmen(event.target.value);
    }, []);

    const handleChangeSearchTeams = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchTeams(event.target.value);
    }, []);

    const handleClearSearchSportsmen = useCallback(() => {
        setSearchSportsmen('');
    }, []);

    const handleClearSearchTeams = useCallback(() => {
        setSearchTeams('');
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogAddSportsman(false);
        setOpenDialogAddTeam(false);
        setSportsmanEdit(undefined);
        setTeamEdit(undefined);
    }, []);

    const handleOpenAddSportsman = useCallback(() => {
        setOpenDialogAddSportsman(true);
    }, []);

    const handleOpenAddTeam = useCallback(() => {
        setOpenDialogAddTeam(true);
    }, []);

    const handleOpenEditSportsman = useCallback(
        (_id: string) => {
            setSportsmanEdit(_.find(sportsmen, ['_id', _id]));
        },
        [sportsmen]
    );

    const handleOpenEditTeam = useCallback(
        (_id: string) => {
            setTeamEdit(_.find(teams, ['_id', _id]));
        },
        [teams]
    );

    const handleSaveSportsman = useCallback(
        (sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => {
            if (story.competition) {
                sportsmanInsertAction({
                    ...sportsman,
                    competitionId: story.competition._id
                });
                handleClose();
            }
        },
        [handleClose]
    );

    const handleUpdateSportsman = useCallback(
        (_id: string, sportsman: Omit<ISportsman, '_id' | 'competitionId'>) => {
            if (story.competition && _id) {
                sportsmanUpdateAction(_id, sportsman);
                handleClose();
            }
        },
        [handleClose]
    );

    const handleDeleteSportsmen = useCallback(
        (_id: string) => {
            if (story.competition) {
                if (window.confirm('Are you sure you want to remove the sportsman?')) {
                    sportsmanDeleteAction(_id)
                        .then(() => {
                            handleClose();
                            loadSportsmenAction(story.competition!);
                        })
                        .catch((error) => window.alert(error));
                }
            }
        },
        [handleClose]
    );

    const handleSaveTeam = useCallback(
        (team: Omit<ITeam, '_id' | 'competitionId'>) => {
            if (story.competition) {
                teamInsertAction({
                    ...team,
                    competitionId: story.competition._id
                });
                handleClose();
            }
        },
        [handleClose]
    );

    const handleUpdateTeam = useCallback(
        (_id: string, team: Omit<ITeam, '_id' | 'competitionId'>) => {
            if (story.competition && _id) {
                teamUpdateAction(_id, team);
                handleClose();
            }
        },
        [handleClose]
    );

    const handleDeleteTeam = useCallback(
        (_id: string) => {
            if (story.competition) {
                if (window.confirm('Are you sure you want to remove the team?')) {
                    teamDeleteAction(_id)
                        .then(() => {
                            handleClose();
                            loadTeamsAction(story.competition!);
                        })
                        .catch((error) => window.alert(error));
                }
            }
        },
        [handleClose]
    );

    if (!story.competition) return null;

    return (
        <div className={styles.root}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant="scrollable" scrollButtons="auto" value={tabSelected} onChange={handleChangeTab}>
                    <Tab label="Sportsmen" value="Sportsmen" id="Sportsmen" />
                    <Tab label="Teams" value="Teams" id="Teams" />
                </Tabs>
            </Box>
            <div hidden={tabSelected !== 'Sportsmen'} className={styles.tabPanel}>
                <div className={styles.actions}>
                    <div className={styles.count}>
                        Selected: {sportsmen.filter((item) => item.selected).length}, Has transponder:{' '}
                        {sportsmen.filter((item) => item.hasTransponder).length}
                    </div>
                    <div style={{ flex: 1 }} />
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddSportsman}>
                        Add sportsman
                    </Button>
                </div>
                <TextField
                    className={styles.search}
                    size="small"
                    label="Search"
                    value={searchSportsmen}
                    onChange={handleChangeSearchSportsmen}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearchSportsmen}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TableSportsmen
                    sportsmen={sportsmen}
                    onUpdate={handleUpdateSportsman}
                    onDelete={handleDeleteSportsmen}
                    onOpenEdit={handleOpenEditSportsman}
                />
            </div>
            <div hidden={tabSelected !== 'Teams'} className={styles.tabPanel}>
                <div className={styles.actions}>
                    <div className={styles.count}>Selected: {teams.filter((item) => item.selected).length}</div>
                    <div style={{ flex: 1 }} />
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddTeam}>
                        Add team
                    </Button>
                </div>
                <TextField
                    className={styles.search}
                    size="small"
                    label="Search"
                    value={searchTeams}
                    onChange={handleChangeSearchTeams}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClearSearchTeams}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TableTeams
                    teams={teams}
                    onUpdate={handleUpdateTeam}
                    onDelete={handleDeleteTeam}
                    onOpenEdit={handleOpenEditTeam}
                />
            </div>
            {(openDialogAddSportsman || !!sportsmanEdit) && (
                <DialogSportsmanEdit
                    open={openDialogAddSportsman || !!sportsmanEdit}
                    sportsman={sportsmanEdit}
                    onClose={handleClose}
                    onSave={handleSaveSportsman}
                    onUpdate={handleUpdateSportsman}
                    onDelete={handleDeleteSportsmen}
                />
            )}
            {(openDialogAddTeam || !!teamEdit) && (
                <DialogTeamEdit
                    open={openDialogAddTeam || !!teamEdit}
                    team={teamEdit}
                    teams={teams}
                    sportsmen={sportsmen}
                    onClose={handleClose}
                    onSave={handleSaveTeam}
                    onUpdate={handleUpdateTeam}
                    onDelete={handleDeleteTeam}
                />
            )}
        </div>
    );
});
