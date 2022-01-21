import React, { FC, useRef } from 'react';
import { observer } from 'mobx-react';
import { v4 } from 'uuid';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { story } from '@/story/story';
import { IReport } from '@/types/IReport';
import { ContentReport } from '@/modules/reports/components/ContentReport/ContentReport';

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
                    <ContentReport key={v4()} report={report} />
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
