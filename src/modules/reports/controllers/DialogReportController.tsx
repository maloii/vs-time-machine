import React, { FC, useRef } from 'react';
import { observer } from 'mobx-react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { story } from '@/story/story';
import { IReport } from '@/types/IReport';
import { TypeReport } from '@/types/TypeReport';
import { BestLapReport } from '@/modules/reports/components/BestLapReport/BestLapReport';
import PrintIcon from '@mui/icons-material/Print';
import { CountLapsReport } from '@/modules/reports/components/CountLapsReport/CountLapsReport';
import { PositionSportsmenReport } from '@/modules/reports/components/PositionSportsmenReport/PositionSportsmenReport';
import { BestPitStopReport } from '@/modules/reports/components/BestPitStopReport/BestPitStopReport';

import styles from './styles.module.scss';

interface IProps {
    open: boolean;
    onClose: () => void;
    report: IReport;
}

export const DialogReportController: FC<IProps> = observer(({ open, onClose, report }: IProps) => {
    const refReport = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <div ref={refReport} className={styles.report}>
                <div className={styles.logo}>
                    <img
                        src={window.api.getFilePath(story.competition?.logo || window.api.DEFAULT_COMPETITION_LOGO)}
                        alt="logo"
                    />
                </div>
                <DialogTitle className={styles.title}>{report.name}</DialogTitle>
                <DialogContent>
                    {report.type === TypeReport.BEST_LAP && (
                        <BestLapReport
                            report={report}
                            rounds={story.rounds}
                            sportsmen={story.sportsmen}
                            teams={story.teams}
                        />
                    )}
                    {report.type === TypeReport.COUNT_LAPS && (
                        <CountLapsReport
                            report={report}
                            rounds={story.rounds}
                            sportsmen={story.sportsmen}
                            teams={story.teams}
                        />
                    )}
                    {report.type === TypeReport.BEST_PIT_STOP && (
                        <BestPitStopReport
                            report={report}
                            rounds={story.rounds}
                            sportsmen={story.sportsmen}
                            teams={story.teams}
                        />
                    )}
                    {report.type === TypeReport.POSITION_SPORTSMEN && (
                        <PositionSportsmenReport report={report} sportsmen={story.sportsmen} teams={story.teams} />
                    )}
                </DialogContent>
                <footer className={styles.footerLogo}>
                    <img src={window.api.getFilePath(window.api.DEFAULT_COMPETITION_LOGO)} alt="logo" />
                </footer>
            </div>
            <DialogActions>
                <ReactToPrint content={() => refReport.current}>
                    <PrintContextConsumer>
                        {({ handlePrint }) => (
                            <IconButton onClick={handlePrint}>
                                <PrintIcon />
                            </IconButton>
                        )}
                    </PrintContextConsumer>
                </ReactToPrint>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
});
