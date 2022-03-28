import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Router } from '@/Router';
import { init, initByCompetition, initByRound, initLaps } from '@/init';
import { story } from '@/story/story';
import { autorun } from 'mobx';

const App = observer(() => {
    const selectedRound = (story.rounds || []).find((round) => round.selected);
    const selectedGroup = (story.groups || []).find((group) => group.selected);

    useEffect(() => {
        autorun(() => initByRound(selectedRound));
    }, [selectedRound]);

    useEffect(() => {
        const readonly =
            window.location.pathname?.indexOf('screen') >= 0 || window.location.hash?.indexOf('screen') >= 0;
        autorun(() => initLaps(selectedGroup, readonly));
    }, [selectedGroup]);

    useEffect(() => {
        autorun(() => init());
        autorun(() => initByCompetition(story.competition));
    }, []);

    return <Router />;
});

export default App;
