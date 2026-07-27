const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        const nowString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
        const now = new Date(nowString);
        
        // הגדרת תאריך היעד: 5 באוגוסט שנת 70, שעה 11:44 לפי שעון ישראל
        const targetDate = new Date();
        targetDate.setFullYear(70);
        targetDate.setMonth(7); // 7 = אוגוסט
        targetDate.setDate(5);
        targetDate.setHours(11, 44, 0, 0); 

        let years = now.getFullYear() - targetDate.getFullYear();
        let months = now.getMonth() - targetDate.getMonth();
        let days = now.getDate() - targetDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        let hours = now.getHours() - targetDate.getHours();
        let minutes = now.getMinutes() - targetDate.getMinutes();
        let seconds = now.getSeconds() - targetDate.getSeconds();

        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { hours += 24; }
        
        // 1 = הקובץ המקומי בשלוחה עבור "שנים" (1.wav)
        // 2 = הקובץ המקומי בשלוחה עבור "ימים" (2.wav)
        // t-months, t-hours, t-minutes, t-seconds = הודעות מערכת מובנות
        const responseText = `id_list_message=n-${years}.1.n-${months}.t-months.n-${days}.2.n-${hours}.t-hours.n-${minutes}.t-minutes.n-${seconds}.t-seconds`;

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
