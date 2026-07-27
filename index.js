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
        
        // 5 באוגוסט שנת 70, 11:44 בבוקר
        const targetDate = new Date();
        targetDate.setFullYear(70);
        targetDate.setMonth(7); 
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
        
        // 1.wav = קובץ מקומי בשלוחה (שנים)
        // m-3968 = חודשים
        // 2.wav = קובץ מקומי בשלוחה (ימים)
        // m-1185 = שעות
        // m-1183 = דקות
        // m-2787 = שניות
        const responseText = `id_list_message=n-${years}.1.wav.n-${months}.m-3968.n-${days}.2.wav.n-${hours}.m-1185.n-${minutes}.m-1183.n-${seconds}.m-2787`;

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
