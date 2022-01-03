import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
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
import { Box, Button, Tab, Tabs } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import styles from './styles.module.scss';

export const SportsmenController: FC = observer(() => {
    const [tabSelected, setTabSelected] = useState('Sportsmen');

    const [openDialogAddSportsman, setOpenDialogAddSportsman] = useState(false);
    const [openDialogAddTeam, setOpenDialogAddTeam] = useState(false);
    const [sportsmanEdit, setSportsmanEdit] = useState<ISportsman>();
    const [teamEdit, setTeamEdit] = useState<ITeam>();

    const sportsmen = _.sortBy(story.sportsmen, 'lastName');
    const teams = _.sortBy(story.teams, 'name');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, id: string) => {
        setTabSelected(id);
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
                    sportsmanDeleteAction(_id);
                    handleClose();
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
                    teamDeleteAction(_id);
                    handleClose();
                }
            }
        },
        [handleClose]
    );
    useEffect(() => {
        window.api.ipcRenderer.removeAllListeners('team-insert-response');
        window.api.ipcRenderer.removeAllListeners('team-update-response');
        window.api.ipcRenderer.removeAllListeners('team-delete-response');
        window.api.ipcRenderer.removeAllListeners('sportsman-insert-response');
        window.api.ipcRenderer.removeAllListeners('sportsman-update-response');
        window.api.ipcRenderer.removeAllListeners('sportsman-delete-response');
        window.api.ipcRenderer.on('team-insert-response', () => loadTeamsAction(story.competition!));
        window.api.ipcRenderer.on('team-update-response', () => loadTeamsAction(story.competition!));
        window.api.ipcRenderer.on('team-delete-response', () => loadTeamsAction(story.competition!));
        window.api.ipcRenderer.on('sportsman-insert-response', () => loadSportsmenAction(story.competition!));
        window.api.ipcRenderer.on('sportsman-update-response', () => loadSportsmenAction(story.competition!));
        window.api.ipcRenderer.on('sportsman-delete-response', () => loadSportsmenAction(story.competition!));
    }, []);
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
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddSportsman}>
                        Add sportsman
                    </Button>
                </div>
                <TableSportsmen
                    sportsmen={sportsmen}
                    onUpdate={handleUpdateSportsman}
                    onDelete={handleDeleteSportsmen}
                    onOpenEdit={handleOpenEditSportsman}
                />
            </div>
            <div hidden={tabSelected !== 'Teams'} className={styles.tabPanel}>
                <div className={styles.actions}>
                    <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddTeam}>
                        Add team
                    </Button>
                </div>
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
