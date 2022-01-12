import React, { FC, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { story } from '@/story/story';
import { IReport } from '@/types/IReport';
import { TypeReport } from '@/types/TypeReport';
import { BestLapReport } from '@/modules/reports/components/BestLapReport/BestLapReport';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface IProps {
    open: boolean;
    onClose: () => void;
    report: IReport;
}

export const DialogReportController: FC<IProps> = observer(({ open, onClose, report }: IProps) => {
    const refReport = useRef<HTMLDivElement>(null);
    const handleGeneratePDF = useCallback(() => {
        if (refReport.current) {
            html2canvas(refReport.current, { scale: 5 }).then((canvas) => {
                let imgWidth = 208;
                let imgHeight = (canvas.height * imgWidth) / canvas.width;
                const imgData = canvas.toDataURL('img/png');
                const pdf = new JsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 5, imgWidth, imgHeight);
                const pageSize = pdf.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

                const footerLogo = window.api.getFilePath(window.api.DEFAULT_COMPETITION_LOGO);
                pdf.addImage(footerLogo, 'PNG', 72, pageHeight - 15, 64, 10.6875);
                pdf.save('download.pdf');
            });
        }
    }, []);

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <div ref={refReport}>
                <DialogTitle>{report.name}</DialogTitle>
                <DialogContent>
                    {report.type === TypeReport.BEST_LAP && (
                        <BestLapReport
                            report={report}
                            rounds={story.rounds}
                            sportsmen={story.sportsmen}
                            teams={story.teams}
                        />
                    )}
                </DialogContent>
            </div>
            <DialogActions>
                <IconButton onClick={handleGeneratePDF}>
                    <PictureAsPdfIcon />
                </IconButton>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
});
