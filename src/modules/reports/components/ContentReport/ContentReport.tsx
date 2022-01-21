import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IReport } from '@/types/IReport';
import { TypeReport } from '@/types/TypeReport';
import { BestLapReport } from '@/modules/reports/components/BestLapReport/BestLapReport';
import { story } from '@/story/story';
import { CountLapsReport } from '@/modules/reports/components/CountLapsReport/CountLapsReport';
import { BestPitStopReport } from '@/modules/reports/components/BestPitStopReport/BestPitStopReport';
import { PositionSportsmenReport } from '@/modules/reports/components/PositionSportsmenReport/PositionSportsmenReport';

interface IProps {
    report: IReport;
}

export const ContentReport: FC<IProps> = observer(({ report }: IProps) => {
    return (
        <>
            {report.type === TypeReport.BEST_LAP && (
                <BestLapReport report={report} rounds={story.rounds} sportsmen={story.sportsmen} teams={story.teams} />
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
        </>
    );
});
