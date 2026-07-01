const generateHeatmap = (submissions) => {
    const dailyCounts = {};
    const solvedProblems = new Set();
    const now = new Date();
    
    submissions.forEach(sub => {
        if (sub.verdict === 'OK') {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            const subTime = sub.creationTimeSeconds * 1000;
            const dateObj = new Date(subTime);
            // Format YYYY-MM-DD
            const dateStr = dateObj.getFullYear() + "-" + 
                            String(dateObj.getMonth() + 1).padStart(2, '0') + "-" + 
                            String(dateObj.getDate()).padStart(2, '0');
            
            if (!solvedProblems.has(problemId)) {
                solvedProblems.add(problemId);
                dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
            }
        }
    });

    const heatmap = [];
    // Generate for the last 365 days
    for (let i = 364; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.getFullYear() + "-" + 
                        String(d.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(d.getDate()).padStart(2, '0');
        
        heatmap.push({
            date: dateStr,
            count: dailyCounts[dateStr] || 0
        });
    }

    return heatmap;
};
console.log(generateHeatmap([{verdict: 'OK', problem: {contestId: 1, index: 'A'}, creationTimeSeconds: Date.now()/1000}]).pop());
