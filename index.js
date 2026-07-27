const express = require('express');
const { HDate } = require('hebcal');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        // תאריך נוכחי עברי
        const now = new Date();
        const hNow = new HDate(now);

        // תאריך יעד עברי (לדוגמה: ט' באב ג'תת''ל - שנת 70 לספירה)
        // פרמטרים: יום, חודש (Av), שנה עברית (3830)
        const hTarget = new HDate(9, 'Av', 3830);

        // חישוב שנים עבריות
        let years = hNow.getFullYear() - hTarget.getFullYear();
        let months = hNow.getMonth() - hTarget.getMonth();

        if (months < 0) {
            years--;
            // בדיקת מספר החודשים בשנה העברית הקודמת (12 או 13)
            const prevYear = hNow.getFullYear() - 1;
            const monthsInPrevYear = new HDate(1, 'Tishrei', prevYear).isLeap() ? 13 : 12;
            months += monthsInPrevYear;
        }

        let days = hNow.getDate() - hTarget.getDate();
        if (days < 0) {
            months--;
            days += 30; // המרה מוערכת לימים בחודש עברי
        }

        // חישוב שעות, דקות ושניות לפי השעון המקומי
        const targetHours = 11;
        const targetMinutes = 44;

        let hours = now.getHours() - targetHours;
        let minutes = now.getMinutes() - targetMinutes;
        let seconds = now.getSeconds();

        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { hours += 24; }

        // הפניה לקבצים/הודעות במערכת
        const responseText = `id_list_message=n-${years}.f-1.n-${months}.m-3968.n-${days}.f-2.n-${hours}.m-1185.n-${minutes}.m-1183.n-${seconds}.m-2787`;

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
