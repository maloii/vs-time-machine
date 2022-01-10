import React, { FC } from 'react';
import { observer } from 'mobx-react';

interface IProps {}

export const ReportsController: FC<IProps> = observer(({}: IProps) => {
    return <div>reports</div>;
});
