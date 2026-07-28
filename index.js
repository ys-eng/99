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
        
        // המרה לזמן ישראל
        const nowIsraelString = now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
        const nowIsrael = new Date(nowIsraelString);

        // הגדרת שעת היעד (11:42 בשעון חורף = 09:42 UTC)
        const targetHoursUTC = 9;
        const targetMinutesUTC = 42;
        const targetSecondsUTC = 0;

        // חישוב הפרש הזמן ביחס לשעת היעד
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
            dayOffset = -1; // עדיין לא חלפה יממה שלמה משעת היעד
        }

        // חישוב התאריך האפקטיבי להשוואה
        const effectiveDateIsrael = new Date(nowIsrael);
        if (dayOffset === -1) {
            effectiveDateIsrael.setDate(effectiveDateIsrael.getDate() - 1);
        }

        const hNow = new HDate(effectiveDateIsrael);

        // הגדרה מפורשת של התאריך העברי עבור 17 ביולי שנת 69 לספירה:
        // 17 ביולי 69 לספירה מקביל ל-ח' באב ג'תתכ"ט (שנה 3829)
        const hTarget = new HDate(8, 'Av', 3829);

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
