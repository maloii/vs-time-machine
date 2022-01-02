import React, { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { observer } from 'mobx-react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    Tab,
    Tabs,
    TextField
} from '@mui/material';
import { ICompetition } from '@/types/ICompetition';
import { db } from '@/repository/Repository';
import { actionRequest } from '@/actions/actionRequest';

import styles from './styles.module.scss';
import { PositionColor } from '@/modules/competition/components/DialogCompetitionEdit/PositionColor';
import { Color } from '@/types/Color';
import { Channel } from '@/types/VTXChannel';
import { PositionChannel } from '@/modules/competition/components/DialogCompetitionEdit/PositionChannel';
import { DEFAULT_COMPETITION_LOGO } from '@/constants/images';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { copyFile, deleteFile, getFilePath } from '@/utils/fileUtils';
import { IGate } from '@/types/IGate';
import { TableGates } from '@/modules/competition/components/DialogCompetitionEdit/TableGates';
import { TypeGate } from '@/types/TypeGate';
import AddIcon from '@mui/icons-material/Add';
import { DialogGateEdit } from '@/modules/competition/components/DIalogGateEdit/DialogGateEdit';
import _ from 'lodash';

interface IProps {
    open: boolean;
    onClose: () => void;
    competition?: ICompetition;
}
export const DialogCompetitionEdit: FC<IProps> = observer(({ open, onClose, competition }: IProps) => {
    const [tabSelected, setTabSelected] = useState('Data');

    const [name, setName] = useState<string>(competition?.name || '');
    const [selected, setSelected] = useState(competition?.selected || false);
    const [skipFirstGate, setSkipFirstGate] = useState(competition?.skipFirstGate || false);
    const [logo, setLogo] = useState(competition?.logo || DEFAULT_COMPETITION_LOGO);

    const [color1, setColor1] = useState<Color>(competition?.color1 || Color.BLUE);
    const [color2, setColor2] = useState<Color>(competition?.color2 || Color.RED);
    const [color3, setColor3] = useState<Color>(competition?.color3 || Color.GREEN);
    const [color4, setColor4] = useState<Color>(competition?.color4 || Color.YELLOW);
    const [color5, setColor5] = useState<Color>(competition?.color5 || Color.MAGENTA);
    const [color6, setColor6] = useState<Color>(competition?.color6 || Color.CYAN);
    const [color7, setColor7] = useState<Color>(competition?.color7 || Color.WHITE);
    const [color8, setColor8] = useState<Color>(competition?.color8 || Color.BLACK);

    const [channel1, setChannel1] = useState<Channel>(competition?.channel1 || Channel.R1);
    const [channel2, setChannel2] = useState<Channel>(competition?.channel2 || Channel.R2);
    const [channel3, setChannel3] = useState<Channel>(competition?.channel3 || Channel.R3);
    const [channel4, setChannel4] = useState<Channel>(competition?.channel4 || Channel.R4);
    const [channel5, setChannel5] = useState<Channel>(competition?.channel5 || Channel.R5);
    const [channel6, setChannel6] = useState<Channel>(competition?.channel6 || Channel.R6);
    const [channel7, setChannel7] = useState<Channel>(competition?.channel7 || Channel.R7);
    const [channel8, setChannel8] = useState<Channel>(competition?.channel8 || Channel.R8);

    const [openAddGate, setOpenAddGate] = useState(false);
    const [openEditGate, setOpenEditGate] = useState<IGate | undefined>(undefined);

    const [gates, setGates] = useState<Array<IGate>>(
        competition?.gates || [
            {
                _id: uuidv4(),
                type: TypeGate.FINISH,
                position: 1,
                delay: 10
            }
        ]
    );

    const inputFileRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleChangeTab = useCallback((event: React.SyntheticEvent, id: string) => {
        setTabSelected(id);
    }, []);

    const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleChangeSelected = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected((prev) => !prev);
    }, []);

    const handleChangeSkipFirstGate = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSkipFirstGate((prev) => !prev);
    }, []);

    const handleChangeLogo = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        if (inputFileRef.current && inputFileRef.current.files?.[0]?.path) {
            setLogo(await copyFile(inputFileRef.current.files?.[0]?.path));
        }
    }, []);

    const handleChangeDeletePhoto = useCallback(async () => {
        await deleteFile(logo).then(async () => {
            setLogo(DEFAULT_COMPETITION_LOGO);
            if (competition) {
                await db.competition.update({ _id: competition._id }, { $set: { logo: DEFAULT_COMPETITION_LOGO } });
                await actionRequest();
            }
        });
    }, [competition, logo]);

    const handleOpenAddGate = useCallback(() => {
        setOpenAddGate(true);
    }, []);

    const handleOpenEditGate = useCallback(
        (id: string) => {
            const gate = _.find(gates, ['_id', id]);
            if (gate) {
                setOpenEditGate(gate);
            }
        },
        [gates]
    );

    const handleCloseGateEdit = useCallback(() => {
        setOpenAddGate(false);
        setOpenEditGate(undefined);
    }, []);

    const handleAddGate = useCallback(
        (gate: Omit<IGate, '_id'>) => {
            setGates([...gates, { ...gate, _id: uuidv4() }]);
            handleCloseGateEdit();
        },
        [gates, handleCloseGateEdit]
    );

    const handleUpdateGate = useCallback(
        (_id: string, gate: Omit<IGate, '_id'>) => {
            const arrGates = [...gates];
            var index = _.findIndex(arrGates, { _id });
            if (index >= 0) {
                arrGates.splice(index, 1, { ...gate, _id });
                setGates(arrGates);
                handleCloseGateEdit();
            }
        },
        [gates, handleCloseGateEdit]
    );

    const handleDeleteGate = useCallback(
        (id: string) => {
            if (window.confirm('Are you sure you want to delete the gate?')) {
                setGates((gates || []).filter((gate) => gate._id !== id));
                handleCloseGateEdit();
            }
        },
        [gates, handleCloseGateEdit]
    );

    const handleSave = useCallback(async () => {
        if (name) {
            const newValue = {
                name,
                logo,
                gates,
                selected,
                skipFirstGate,
                color1,
                color2,
                color3,
                color4,
                color5,
                color6,
                color7,
                color8,
                channel1,
                channel2,
                channel3,
                channel4,
                channel5,
                channel6,
                channel7,
                channel8
            };
            if (selected) {
                await db.competition.update({ selected: true }, { $set: { selected: false } }, { multi: true });
            }
            if (competition) {
                await db.competition.update({ _id: competition._id }, { $set: newValue });
            } else {
                await db.competition.insert(newValue);
            }
            await actionRequest();
            onClose();
        }
    }, [
        channel1,
        channel2,
        channel3,
        channel4,
        channel5,
        channel6,
        channel7,
        channel8,
        color1,
        color2,
        color3,
        color4,
        color5,
        color6,
        color7,
        color8,
        gates,
        competition,
        logo,
        name,
        onClose,
        selected,
        skipFirstGate
    ]);

    const handleDelete = useCallback(async () => {
        if (
            competition &&
            window.confirm(
                'Are you sure you want to delete the competition? All sportsmen and groups and laps will be deleted with him!'
            )
        ) {
            await db.sportsman.remove({ competitionId: competition._id }, {});
            await db.round.remove({ competitionId: competition._id }, {});
            await db.competition.remove({ _id: competition._id }, {});
            const competitions = await actionRequest();
            if ((competitions || []).length > 0) {
                const newSelectedCompetitions = competitions[competitions.length - 1];
                await db.competition.update({ _id: newSelectedCompetitions._id }, { $set: { selected: true } });
                await actionRequest();
            }
            onClose();
        }
    }, [competition, onClose]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{competition ? 'Edit' : 'New'} competition</DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs variant="scrollable" scrollButtons="auto" value={tabSelected} onChange={handleChangeTab}>
                            <Tab label="Data" value="Data" id="Data" />
                            <Tab label="Gates" value="Gates" id="Gates" />
                            <Tab label="Channels" value="Channels" id="Channels" />
                            <Tab label="Colors" value="Colors" id="Colors" />
                        </Tabs>
                    </Box>
                    <div hidden={tabSelected !== 'Data'} className={styles.tabPanel}>
                        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                            <TextField
                                id="outlined-basic"
                                label="Name competition"
                                fullWidth
                                variant="outlined"
                                value={name}
                                error={!name}
                                onChange={handleChangeName}
                            />
                            <div className={styles.logoBlock}>
                                <div>
                                    {!!logo && logo !== DEFAULT_COMPETITION_LOGO && (
                                        <CancelOutlinedIcon
                                            className={styles.deleteLogo}
                                            onClick={handleChangeDeletePhoto}
                                        />
                                    )}
                                    <img
                                        ref={imageRef}
                                        src={getFilePath(logo || DEFAULT_COMPETITION_LOGO)}
                                        alt="logo"
                                    />
                                    <Button variant="contained" component="label">
                                        Select logo
                                        <input
                                            type="file"
                                            accept="image/png, image/gif, image/jpeg"
                                            ref={inputFileRef}
                                            hidden
                                            onChange={handleChangeLogo}
                                        />
                                    </Button>
                                </div>
                            </div>
                            <FormControlLabel
                                control={<Switch checked={selected} onChange={handleChangeSelected} />}
                                label="Select this competition"
                            />
                            <FormControlLabel
                                control={<Switch checked={skipFirstGate} onChange={handleChangeSkipFirstGate} />}
                                label="Skip the first gate"
                            />
                        </Box>
                    </div>
                    <div hidden={tabSelected !== 'Gates'} className={styles.tabPanel}>
                        <div className={styles.actions}>
                            <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddGate}>
                                Add gate
                            </Button>
                        </div>
                        <TableGates gates={gates} onUpdate={handleOpenEditGate} onDelete={handleDeleteGate} />
                        {(!!openEditGate || openAddGate) && (
                            <DialogGateEdit
                                gate={openEditGate}
                                gates={gates}
                                onDelete={handleDeleteGate}
                                onUpdate={handleUpdateGate}
                                onSave={handleAddGate}
                                onClose={handleCloseGateEdit}
                                open={!!openEditGate || openAddGate}
                            />
                        )}
                    </div>
                    <div hidden={tabSelected !== 'Channels'} className={styles.tabPanel}>
                        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                            <PositionChannel label="Position 1" value={channel1} onChange={setChannel1} />
                            <PositionChannel label="Position 2" value={channel2} onChange={setChannel2} />
                            <PositionChannel label="Position 3" value={channel3} onChange={setChannel3} />
                            <PositionChannel label="Position 4" value={channel4} onChange={setChannel4} />
                            <PositionChannel label="Position 5" value={channel5} onChange={setChannel5} />
                            <PositionChannel label="Position 6" value={channel6} onChange={setChannel6} />
                            <PositionChannel label="Position 7" value={channel7} onChange={setChannel7} />
                            <PositionChannel label="Position 8" value={channel8} onChange={setChannel8} />
                        </Box>
                    </div>
                    <div hidden={tabSelected !== 'Colors'} className={styles.tabPanel}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1 }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <PositionColor label="Position 1" value={color1} onChange={setColor1} />
                            <PositionColor label="Position 2" value={color2} onChange={setColor2} />
                            <PositionColor label="Position 3" value={color3} onChange={setColor3} />
                            <PositionColor label="Position 4" value={color4} onChange={setColor4} />
                            <PositionColor label="Position 5" value={color5} onChange={setColor5} />
                            <PositionColor label="Position 6" value={color6} onChange={setColor6} />
                            <PositionColor label="Position 7" value={color7} onChange={setColor7} />
                            <PositionColor label="Position 8" value={color8} onChange={setColor8} />
                        </Box>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                {!!competition && (
                    <Button onClick={handleDelete} style={{ marginRight: 'auto' }} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave} disabled={!name}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
});
