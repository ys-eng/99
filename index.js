const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/time-elapsed', (req, res) => {
    // התאריך המבוקש (שנה, חודש (0-11), יום, שעה, דקה)
    // שימו לב: בחודשים ב-JavaScript ינואר הוא 0 ודצמבר הוא 11
    const targetDate = new Date(2023, 0, 15, 10, 0, 0); 
    const now = new Date();

    let years = now.getFullYear() - targetDate.getFullYear();
    let months = now.getMonth() - targetDate.getMonth();
    let days = now.getDate() - targetDate.getDate();
    let hours = now.getHours() - targetDate.getHours();
    let minutes = now.getMinutes() - targetDate.getMinutes();
    let seconds = now.getSeconds() - targetDate.getSeconds();

    if (seconds < 0) { minutes--; seconds += 60; }
    if (minutes < 0) { hours--; minutes += 60; }
    if (hours < 0) { days--; hours += 24; }
    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    // בניית המחרוזת לימות המשיח
    const responseText = `id_list_message=n-${years}.years.n-${months}.months.n-${days}.days.n-${hours}.hours.n-${minutes}.minutes.n-${seconds}.seconds`;

    res.send(responseText);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});