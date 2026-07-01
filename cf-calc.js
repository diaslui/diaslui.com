const fs = require('fs');

function calculateStats(submissions) {
    const solvedProblems = new Set();
    const solvedDates = new Set();
    
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    let solvedAllTime = 0;
    let solvedLastYear = 0;
    let solvedLastMonth = 0;
    
    const datesAllTime = new Set();
    const datesLastYear = new Set();
    const datesLastMonth = new Set();

    submissions.forEach(sub => {
        if (sub.verdict === 'OK') {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            const subTime = sub.creationTimeSeconds * 1000;
            const dateStr = new Date(subTime).toISOString().split('T')[0];
            
            if (!solvedProblems.has(problemId)) {
                solvedProblems.add(problemId);
                solvedAllTime++;
                if (subTime >= oneYearAgo) solvedLastYear++;
                if (subTime >= oneMonthAgo) solvedLastMonth++;
            }
            
            datesAllTime.add(dateStr);
            if (subTime >= oneYearAgo) datesLastYear.add(dateStr);
            if (subTime >= oneMonthAgo) datesLastMonth.add(dateStr);
        }
    });

    const calculateMaxStreak = (datesSet) => {
        const sortedDates = Array.from(datesSet).sort();
        if (sortedDates.length === 0) return 0;
        
        let maxStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = new Date(sortedDates[i-1]);
            const curr = new Date(sortedDates[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else if (diffDays > 1) {
                currentStreak = 1;
            }
        }
        return maxStreak;
    };

    return {
        solved: {
            allTime: solvedAllTime,
            lastYear: solvedLastYear,
            lastMonth: solvedLastMonth
        },
        streaks: {
            allTime: calculateMaxStreak(datesAllTime),
            lastYear: calculateMaxStreak(datesLastYear),
            lastMonth: calculateMaxStreak(datesLastMonth)
        }
    };
}
console.log(calculateStats([{ verdict: 'OK', problem: { contestId: 1, index: 'A' }, creationTimeSeconds: Date.now()/1000 }]));
