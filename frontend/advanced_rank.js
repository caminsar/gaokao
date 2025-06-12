document.addEventListener('DOMContentLoaded', () => {
    const advancedRankQueryForm = document.getElementById('advancedRankQueryForm');
    const advancedRankQueryResult = document.getElementById('advancedRankQueryResult');

    if (advancedRankQueryForm) {
        advancedRankQueryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const province = document.getElementById('advancedProvince').value;
            const year = document.getElementById('advancedYear').value;
            const score = document.getElementById('advancedScore').value;
            const subjectType = document.getElementById('advancedSubjectType').value;
            const classDemandStr = document.getElementById('advancedClassDemand').value;

            advancedRankQueryResult.innerHTML = '正在查询...';

            if (!score) {
                advancedRankQueryResult.innerHTML = '<p style="color: red;">请输入分数</p>';
                return;
            }

            // Basic validation for year
            if (year && (isNaN(parseInt(year)) || parseInt(year) < 2000 || parseInt(year) > 2050)) {
                advancedRankQueryResult.innerHTML = '<p style="color: red;">请输入有效的年份 (2000-2050)</p>';
                return;
            }

            // Convert classDemandStr to array, default if empty
            let classDemand = [];
            if (classDemandStr.trim() !== '') {
                classDemand = classDemandStr.split(',').map(item => item.trim()).filter(item => item !== '');
            }


            const payload = {
                province: province || undefined, // API defaults to "湖北" if empty
                year: year ? parseInt(year) : undefined, // API defaults to 2024 if 0
                score: parseInt(score),
                subject_type: subjectType || undefined, // API defaults to "物理" if empty
                class_demand: classDemand.length > 0 ? classDemand : undefined // API defaults if empty array
            };

            try {
                const response = await fetch('/api/v1/query_rank', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();

                if (response.ok && data.code === 0) {
                    advancedRankQueryResult.innerHTML = `
                        <p><strong>查询成功</strong></p>
                        <p>分数: ${data.score}</p>
                        <p>位次: ${data.rank}</p>
                        <p>年份: ${data.year}</p>
                        <p>省份: ${data.province}</p>
                        <p>科目类型: ${data.subject_type}</p>
                    `;
                } else {
                    advancedRankQueryResult.innerHTML = `<p style="color: red;">查询失败: ${data.msg || '未知错误'}</p>`;
                }
            } catch (error) {
                console.error('Advanced rank query error:', error);
                advancedRankQueryResult.innerHTML = `<p style="color: red;">查询出错: ${error.message}</p>`;
            }
        });
    }
});
