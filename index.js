const express = require('express');
const { HDate } = require('hebcal');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        const now = new Date();
        
        const nowIsraelString = now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
        const nowIsrael = new Date(nowIsraelString);
        const hNow = new HDate(nowIsrael);

        const hTarget = new HDate(9, 'Av', 3830);

        let years = hNow.getFullYear() - hTarget.getFullYear();
        let months = hNow.getMonth() - hTarget.getMonth();

        if (months < 0) {
            years--;
            const prevYear = hNow.getFullYear() - 1;
            const monthsInPrevYear = new HDate(1, 'Tishrei', prevYear).isLeap() ? 13 : 12;
            months += monthsInPrevYear;
        }

        let days = hNow.getDate() - hTarget.getDate();
        if (days < 0) {
            months--;
            days += 30;
        }

        const targetHoursUTC = 9;
        const targetMinutesUTC = 44;

        let hours = now.getUTCHours() - targetHoursUTC;
        let minutes = now.getUTCMinutes() - targetMinutesUTC;
        let seconds = now.getUTCSeconds();

        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { hours += 24; }

        // f-1 = שנים
        // m-3968 = חודשים
        // m-2593 = ימים
        // m-1185 = שעות
        // m-1183 = דקות
        // m-2787 = שניות
        const responseText = `id_list_message=n-${years}.f-1.n-${months}.m-3968.n-${days}.m-2593.n-${hours}.m-1185.n-${minutes}.m-1183.n-${seconds}.m-2787`;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(responseText);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('id_list_message=t-Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
