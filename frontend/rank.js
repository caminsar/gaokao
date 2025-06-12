document.addEventListener('DOMContentLoaded', () => {
    const rankQueryForm = document.getElementById('rankQueryForm');
    const rankQueryResult = document.getElementById('rankQueryResult');

    if (rankQueryForm) {
        rankQueryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const score = document.getElementById('rankQueryScore').value;
            rankQueryResult.innerHTML = '正在查询...';

            if (!score) {
                rankQueryResult.innerHTML = '<p style="color: red;">请输入分数</p>';
                return;
            }

            try {
                const response = await fetch(`/api/rank/get?score=${score}`);
                const data = await response.json();

                if (response.ok && data.code === 0) {
                    rankQueryResult.innerHTML = `
                        <p><strong>查询成功</strong></p>
                        <p>分数: ${data.score}</p>
                        <p>位次: ${data.rank}</p>
                        <p>年份: ${data.year}</p>
                    `;
                } else {
                    rankQueryResult.innerHTML = `<p style="color: red;">查询失败: ${data.msg || '未知错误'}</p>`;
                }
            } catch (error) {
                console.error('Rank query error:', error);
                rankQueryResult.innerHTML = `<p style="color: red;">查询出错: ${error.message}</p>`;
            }
        });
    }
});
