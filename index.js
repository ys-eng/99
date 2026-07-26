const express = require('express');
const { HDate } = require('@hebcal/core');

const app = express();
const PORT = process.env.PORT || 3000;

// נתיב ראשי לבדיקת תקינות השרת (Health Check) עבור UptimeRobot
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// הנתיב המיועד לימות המשיח
app.get('/time-elapsed-hebrew', (req, res) => {
    try {
        const now = new Date();
        
        // הגדרת תאריך היעד (יום, חודש, שנה)
        const targetHDate = new HDate(17, 'Tamuz', 3830); 
        const currentHDate = new HDate(now);

        let years = currentHDate.getFullYear() - targetHDate.getFullYear();
        let months = currentHDate.getMonth() - targetHDate.getMonth();
        let days = currentHDate.getDate() - targetHDate.getDate();

        if (days < 0) {
            months--;
            // קבלת היום הקודם בעזרת .prev()
            const prevMonthHDate = new HDate(1, currentHDate.getMonthName(), currentHDate.getFullYear()).prev();
            days += prevMonthHDate.daysInMonth();
        }

        if (months < 0) {
            years--;
            const monthsInYear = currentHDate.isLeapYear() ? 13 : 12;
            months += monthsInYear;
        }

        const targetHours = 11;
        const targetMinutes = 44;
        const targetSeconds = 0;

        let hours = now.getHours() - targetHours;
        let minutes = now.getMinutes() - targetMinutes;
        let seconds = now.getSeconds() - targetSeconds;

        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { hours += 24; }

        const responseText = `id_list_message=n-${years}.t-years.n-${months}.t-months.n-${days}.t-days.n-${hours}.t-hours.n-${minutes}.t-minutes.n-${seconds}.t-seconds`;

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
