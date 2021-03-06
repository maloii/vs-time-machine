import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { story } from '@/story/story';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TableReports } from '@/modules/reports/components/TableReports/TableReports';
import { IReport } from '@/types/IReport';
import { DialogFormReport } from '@/modules/reports/components/DialogFormReport/DialogFormReport';
import { DialogReportContainer } from '@/modules/reports/containers/DialogReportContainer';
import { reportDeleteAction, reportInsertAction, reportUpdateAction } from '@/actions/actionReportRequest';

import styles from './styles.module.scss';

export const ReportsContainer: FC = observer(() => {
    const [openDialogAddReport, setOpenDialogAddReport] = useState(false);
    const [openDialogEditReport, setOpenDialogEditReport] = useState<IReport>();
    const [openDialogReport, setOpenDialogReport] = useState<IReport>();

    const handleOpenAddReport = useCallback(() => {
        setOpenDialogAddReport(true);
    }, []);

    const handleOpenEditReport = useCallback((report: IReport) => {
        setOpenDialogEditReport(report);
    }, []);

    const handleOpenReport = useCallback((report: IReport) => {
        setOpenDialogReport(report);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialogAddReport(false);
        setOpenDialogEditReport(undefined);
        setOpenDialogReport(undefined);
    }, []);

    const handleAddReport = useCallback(
        (report: Omit<IReport, '_id' | 'competitionId'>) => {
            if (report.name && story.competition) {
                reportInsertAction({ ...report, competitionId: story.competition._id });
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleEditReport = useCallback(
        (_id: string, report: Omit<IReport, '_id' | 'competitionId'>) => {
            if (report.name) {
                reportUpdateAction(_id, report);
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    const handleDeleteReport = useCallback(
        (_id: string) => {
            if (window.confirm('Are you sure you want to delete the report?')) {
                reportDeleteAction(_id);
                handleCloseDialog();
            }
        },
        [handleCloseDialog]
    );

    return (
        <div className={styles.root}>
            <div className={styles.actions}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleOpenAddReport}>
                    Add report
                </Button>
            </div>
            <TableReports
                reports={story.reports}
                onEdit={handleOpenEditReport}
                onDelete={handleDeleteReport}
                onOpen={handleOpenReport}
            />
            {(openDialogAddReport || openDialogEditReport) && (
                <DialogFormReport
                    report={openDialogEditReport}
                    rounds={story.rounds}
                    open={openDialogAddReport || !!openDialogEditReport}
                    onClose={handleCloseDialog}
                    onSave={handleAddReport}
                    onUpdate={handleEditReport}
                    onDelete={handleDeleteReport}
                />
            )}
            {openDialogReport && (
                <DialogReportContainer
                    report={openDialogReport}
                    open={!!openDialogReport}
                    onClose={handleCloseDialog}
                />
            )}
        </div>
    );
});
