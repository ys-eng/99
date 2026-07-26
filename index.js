const express = require('express');
const { HDate } = require('@hebcal/core');

const app = express();
const PORT = process.env.PORT || 3000;

// נתיב ראשי לבדיקת תקינות עבור UptimeRobot
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// הנתיב המיועד לימות המשיח
app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        const now = new Date();
        
        // הגדרת תאריך היעד העברי
        const targetHDate = new HDate(17, 'Tamuz', 3830); 
        const currentHDate = new HDate(now);

        let years = currentHDate.getFullYear() - targetHDate.getFullYear();
        let months = currentHDate.getMonth() - targetHDate.getMonth();
        let days = currentHDate.getDate() - targetHDate.getDate();

        // תיקון ימים במידת הצורך לפי מספר הימים בחודש העברי
        if (days < 0) {
            months--;
            const prevMonthHDate = new HDate(1, currentHDate.getMonthName(), currentHDate.getFullYear()).prev();
            days += prevMonthHDate.daysInMonth();
        }

        // תיקון חודשים עבריים במידת הצורך (מתחשב בשנה מעוברת)
        if (months < 0) {
            years--;
            const prevYear = currentHDate.getFullYear() - 1;
            const monthsInPrevYear = new HDate(1, 'Tishrei', prevYear).isLeapYear() ? 13 : 12;
            months += monthsInPrevYear;
        }

        // חישוב שעות, דקות ושניות
        const targetHours = 11;
        const targetMinutes = 44;
        const targetSeconds = 0;

        let hours = now.getHours() - targetHours;
        let minutes = now.getMinutes() - targetMinutes;
        let seconds = now.getSeconds() - targetSeconds;

        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { hours += 24; }

        // בניית מחרוזת בעברית באמצעות s- (TTS)
        const responseText = `id_list_message=n-${years}.s-שנים.n-${months}.s-חודשים.n-${days}.s-ימים.n-${hours}.s-שעות.n-${minutes}.s-דקות.n-${seconds}.s-שניות`;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(responseText);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('id_list_message=s-שגיאה בחישוב התאריך');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
