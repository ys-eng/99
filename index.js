const express = require('express');

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
        
        // הגדרת תאריך היעד (שנה, חודש 0-11, יום, שעה, דקה, שנייה)
        const targetDate = new Date(70, 7, 30, 11, 44, 0); 

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

        // מקרא תגים מתוקן:
        // 1 - קובץ השמעה מקומי בשלוחה (שנים)
        // m-3968 - הודעת מערכת לחודשים (M3968)
        // 2 - אם יש לך קובץ לימים, או m- עבור הודעת מערכת של ימים
        // m-1185 - הודעת מערכת לשעות (M1185)
        // m-1183 - הודעת מערכת לדקות (M1183)
        // m-1196 - הודעת מערכת לשניות (M1196)
        
        const responseText = `id_list_message=n-${years}.1.n-${months}.m-3968.n-${days}.2.n-${hours}.m-1185.n-${minutes}.m-1183.n-${seconds}.m-1196`;

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
