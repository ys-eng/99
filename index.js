const express = require('express');
const { HDate } = require('@hebcal/core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/time-elapsed-hebrew', (req, res) => {
    const now = new Date();
    
    // 1. הגדרת התאריך העברי המבוקש (יום, חודש עברי, שנה עברית)
    // חודשים לדוגמה: 'Av', 'Tamuz', 'Nisan', 'Tishrei' וכו'
    const targetHDate = new HDate(17, 'Tamuz', 3830); 
    const currentHDate = new HDate(now);

    // 2. חישוב ההפרש בתאריכים עבריים
    let years = currentHDate.getFullYear() - targetHDate.getFullYear();
    let months = currentHDate.getMonth() - targetHDate.getMonth();
    let days = currentHDate.getDate() - targetHDate.getDate();

    if (days < 0) {
        months--;
        // ימים בחודש הקודם בלוח העברי
        const prevMonthHDate = new HDate(1, currentHDate.getMonthName(), currentHDate.getFullYear()).sub(1, 'day');
        days += prevMonthHDate.daysInMonth();
    }

    if (months < 0) {
        years--;
        // מספר החודשים בשנה העברית (12 או 13 בשנה מעוברת)
        const monthsInYear = currentHDate.isLeapYear() ? 13 : 12;
        months += monthsInYear;
    }

    // 3. חישוב שעות, דקות ושניות מהשעה הנוכחית ביום
    // (לדוגמה: חישוב יחסי לשעה 11:44 בבוקר)
    const targetHours = 11;
    const targetMinutes = 44;
    const targetSeconds = 0;

    let hours = now.getHours() - targetHours;
    let minutes = now.getMinutes() - targetMinutes;
    let seconds = now.getSeconds() - targetSeconds;

    if (seconds < 0) { minutes--; seconds += 60; }
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { hours += 24; }

    // בניית המענה לימות המשיח
    const responseText = `id_list_message=n-${years}.years.n-${months}.months.n-${days}.days.n-${hours}.hours.n-${minutes}.minutes.n-${seconds}.seconds`;

    res.send(responseText);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});