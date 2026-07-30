const express = require('express');
const path = require('path');
const { HDate } = require('hebcal');

const app = express();
const PORT = process.env.PORT || 3000;

// מאפשר לשרת להגיש קבצים סטטיים (כמו קובצי שמע) מתוך תיקייה בשם audio
app.use('/audio', express.static(path.join(__dirname, 'audio')));

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        const now = new Date();
        const host = req.get('host');
        const protocol = req.protocol;
        
        // הכתובת של קובץ השמע בשרת שלך
        const audioUrl = `${protocol}://${host}/audio/1.wav`;

        // המרה לזמן ישראל
        const nowIsraelString = now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
        const nowIsrael = new Date(nowIsraelString);

        // שעת יעד: 11:42 בשעון חורף (UTC+2 = 09:42 UTC)
        const targetHoursUTC = 9;
        const targetMinutesUTC = 42;
        const targetSecondsUTC = 0;

        let hours = now.getUTCHours() - targetHoursUTC;
        let minutes = now.getUTCMinutes() - targetMinutesUTC;
        let seconds = now.getUTCSeconds() - targetSecondsUTC;

        let dayOffset = 0;

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            dayOffset = -1;
        }

        const effectiveDateIsrael = new Date(nowIsrael);
        if (dayOffset === -1) {
            effectiveDateIsrael.setDate(effectiveDateIsrael.getDate() - 1);
        }

        const hNow = new HDate(effectiveDateIsrael);
        const hTarget = new HDate(10, 'Av', 3829);

        let years = hNow.getFullYear() - hTarget.getFullYear();
        let months = hNow.getMonth() - hTarget.getMonth();
        let days = hNow.getDate() - hTarget.getDate();

        if (days < 0) {
            months--;
            const prevMonthDate = new Date(effectiveDateIsrael);
            prevMonthDate.setDate(prevMonthDate.getDate() - hNow.getDate());
            const hPrevMonth = new HDate(prevMonthDate);
            days += hPrevMonth.getDaysInMonth();
        }

        if (months < 0) {
            years--;
            const prevYear = hNow.getFullYear() - 1;
            const monthsInPrevYear = new HDate(1, 'Tishrei', prevYear).isLeap() ? 13 : 12;
            months += monthsInPrevYear;
        }

        // t-http/... = השמעת קובץ שמע מכתובת אינטרנט חיצונית
        const responseText = `id_list_message=n-${years}.t-${audioUrl}.n-${months}.m-3968.n-${days}.m-2593.n-${hours}.m-1185.n-${minutes}.m-1183.n-${seconds}.m-2787`;

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
