import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tab,
    Tabs,
    TextField
} from '@mui/material';

import { ISettingVoice } from '@/types/ISettingVoice';
import { getSettingValue, getWindowsVoices, setSettingValue } from '@/actions/settingsRequest';

import styles from './styles.module.scss';
import { Channel, ChannelFrequencies } from '@/types/VTXChannel';
import { $enum } from 'ts-enum-util';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import i18n from '../../../../electron/configs/i18next.config';

export const SettingsContainer: FC = () => {
    const [tabSelected, setTabSelected] = useState('Voice');
    const [settingsVoice, setSettingsVoice] = useState<ISettingVoice>({} as ISettingVoice);
    const [windowsVoices, setWindowsVoices] = useState<Array<string>>([]);

    const handleChangeTab = useCallback((event: React.SyntheticEvent, id: string) => {
        setTabSelected(id);
    }, []);

    const handleChangeInviteText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, invite: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeDelayStart = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, delayStartEnabled: !settingsVoice.delayStartEnabled });
        },
        [settingsVoice]
    );

    const handleChangeDelayStartText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, delayStart: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeDelayStartSec = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, delayStartSec: Number(event.target.value) });
        },
        [settingsVoice]
    );

    const handleChangeHappyRacing = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, happyRacingEnabled: !settingsVoice.happyRacingEnabled });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace10sec = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRace10sec: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace30sec = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRace30sec: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace1min = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRace1min: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace5min = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRace5min: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace10min = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRace10min: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeToEndRace = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, toEndRaceEnabled: !settingsVoice.toEndRaceEnabled });
        },
        [settingsVoice]
    );

    const handleChangeHappyRacingText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, happyRacing: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeVoice = useCallback(
        (event: SelectChangeEvent<string>) => {
            setSettingsVoice({ ...settingsVoice, windowsVoice: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeRaceIsOver = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, raceIsOverEnabled: !settingsVoice.raceIsOverEnabled });
        },
        [settingsVoice]
    );

    const handleChangeRaceIsOverText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, raceIsOver: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangePlayFailEnabled = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, playFailEnabled: !settingsVoice.playFailEnabled });
        },
        [settingsVoice]
    );

    const handleChangePlayFailText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, playFail: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangePilotFinished = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, pilotFinishedEnabled: !settingsVoice.pilotFinishedEnabled });
        },
        [settingsVoice]
    );

    const handleChangePilotFinishedText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, pilotFinished: event.target.value });
        },
        [settingsVoice]
    );

    const handleChangeAllPilotsFinishedText = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsVoice({ ...settingsVoice, allPilotsFinished: event.target.value });
        },
        [settingsVoice]
    );

    const handleSave = useCallback(async () => {
        try {
            await setSettingValue<ISettingVoice>('voice', settingsVoice);
            window.alert('Settings have been saved successfully!');
        } catch (e) {
            window.alert('Failed to save settings!');
        }
    }, [settingsVoice]);

    useEffect(() => {
        (async () => {
            const voice = await getSettingValue<ISettingVoice>('voice');
            setSettingsVoice(voice);
            if (window.api.platform === 'win32') {
                const voices = await getWindowsVoices();
                setWindowsVoices(voices);
            }
        })();
    }, []);

    return (
        <div className={styles.root}>
            <FormControl fullWidth>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="scrollable" scrollButtons="auto" value={tabSelected} onChange={handleChangeTab}>
                        <Tab label="Voice" value="Voice" id="Voice" />
                    </Tabs>
                </Box>
                <div hidden={tabSelected !== 'Voice'} className={styles.tabPanel}>
                    {window.api.platform === 'win32' && (
                        <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                            <FormControl fullWidth>
                                <InputLabel id="type-color-label">Windows platform voice</InputLabel>
                                <Select<string>
                                    labelId="type-color-label"
                                    value={settingsVoice.windowsVoice || ''}
                                    label="Windows platform voice"
                                    onChange={handleChangeVoice}
                                >
                                    <MenuItem value="">{''}</MenuItem>
                                    {(windowsVoices || []).map((voice) => (
                                        <MenuItem key={voice} value={voice}>
                                            {voice}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <TextField
                            id="outlined-basic"
                            label="Invitation of sportsmen to the start"
                            fullWidth
                            variant="outlined"
                            value={settingsVoice.invite || ''}
                            error={!settingsVoice.invite}
                            onChange={handleChangeInviteText}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch checked={settingsVoice.delayStartEnabled} onChange={handleChangeDelayStart} />
                            }
                            label="Delay start"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Delay start sec."
                            helperText="Minimum delay time 3 sec."
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.delayStartEnabled}
                            value={settingsVoice.delayStartSec || 0}
                            onChange={handleChangeDelayStartSec}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Delay start text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.delayStartEnabled}
                            value={settingsVoice.delayStart || ''}
                            onChange={handleChangeDelayStartText}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch checked={settingsVoice.happyRacingEnabled} onChange={handleChangeHappyRacing} />
                            }
                            label="Happy racing"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Happy racing text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.happyRacingEnabled}
                            value={settingsVoice.happyRacing || ''}
                            onChange={handleChangeHappyRacingText}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch checked={settingsVoice.toEndRaceEnabled} onChange={handleChangeToEndRace} />
                            }
                            label="To end race"
                        />
                        <TextField
                            id="outlined-basic"
                            label="To end race 10 sec"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.toEndRaceEnabled}
                            value={settingsVoice.toEndRace10sec || ''}
                            onChange={handleChangeToEndRace10sec}
                        />
                        <TextField
                            id="outlined-basic"
                            label="To end race 30 sec"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.toEndRaceEnabled}
                            value={settingsVoice.toEndRace30sec || ''}
                            onChange={handleChangeToEndRace30sec}
                        />
                        <TextField
                            id="outlined-basic"
                            label="To end race 1 min"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.toEndRaceEnabled}
                            value={settingsVoice.toEndRace1min || ''}
                            onChange={handleChangeToEndRace1min}
                        />
                        <TextField
                            id="outlined-basic"
                            label="To end race 5 min"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.toEndRaceEnabled}
                            value={settingsVoice.toEndRace5min || ''}
                            onChange={handleChangeToEndRace5min}
                        />
                        <TextField
                            id="outlined-basic"
                            label="To end race 10 min"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.toEndRaceEnabled}
                            value={settingsVoice.toEndRace10min || ''}
                            onChange={handleChangeToEndRace10min}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch checked={settingsVoice.raceIsOverEnabled} onChange={handleChangeRaceIsOver} />
                            }
                            label="Race is over"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Race is over text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.raceIsOverEnabled}
                            value={settingsVoice.raceIsOver || ''}
                            onChange={handleChangeRaceIsOverText}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settingsVoice.playFailEnabled}
                                    onChange={handleChangePlayFailEnabled}
                                />
                            }
                            label="Play fail"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Play fail text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.playFailEnabled}
                            value={settingsVoice.playFail || ''}
                            onChange={handleChangePlayFailText}
                        />
                    </Box>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settingsVoice.pilotFinishedEnabled}
                                    onChange={handleChangePilotFinished}
                                />
                            }
                            label="Pilot finished"
                        />
                        <TextField
                            id="outlined-basic"
                            label="Pilot finished text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.pilotFinishedEnabled}
                            value={settingsVoice.pilotFinished || ''}
                            onChange={handleChangePilotFinishedText}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Pilot finished text"
                            fullWidth
                            variant="outlined"
                            disabled={!settingsVoice.pilotFinishedEnabled}
                            value={settingsVoice.allPilotsFinished || ''}
                            onChange={handleChangeAllPilotsFinishedText}
                        />
                    </Box>
                    <Button color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </FormControl>
        </div>
    );
};
