document.addEventListener('DOMContentLoaded', () => {
    const reportQueryForm = document.getElementById('reportQueryForm');
    const reportQueryResult = document.getElementById('reportQueryResult');

    if (reportQueryForm) {
        reportQueryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const rank = document.getElementById('reportRank').value;
            const classComb = document.getElementById('reportClassComb').value;
            const province = document.getElementById('reportProvince').value;
            const page = document.getElementById('reportPage').value;
            const pageSize = document.getElementById('reportPageSize').value;

            reportQueryResult.innerHTML = '正在查询...';

            if (!rank) {
                reportQueryResult.innerHTML = '<p style="color: red;">请输入位次</p>';
                return;
            }

            const params = new URLSearchParams();
            params.append('rank', rank);
            if (classComb) params.append('class_comb', classComb);
            if (province) params.append('province', province);
            if (page) params.append('page', page);
            if (pageSize) params.append('page_size', pageSize);

            try {
                const response = await fetch(`/api/report/get?${params.toString()}`);
                const data = await response.json();

                if (response.ok && data.code === 0 && data.data) {
                    if (data.data.list && data.data.list.length > 0) {
                        const conf = data.data.conf || {};
                        let tableHTML = `
                            <p><strong>查询成功</strong></p>
                            <p>总数: ${conf.total_number !== undefined ? conf.total_number : 'N/A'},
                               当前页: ${conf.page !== undefined ? conf.page : 'N/A'},
                               每页条数: ${conf.page_size !== undefined ? conf.page_size : 'N/A'},
                               总页数: ${conf.total_page !== undefined ? conf.total_page : 'N/A'}
                            </p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>院校代码</th>
                                        <th>院校名称</th>
                                        <th>专业名称</th>
                                        <th>选科要求</th>
                                        <th>最低分</th>
                                        <th>最低位次</th>
                                        <th>专业组代码</th>
                                        <th>备注/描述</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                        data.data.list.forEach(item => {
                            tableHTML += `
                                <tr>
                                    <td>${item.colledge_code || ''}</td>
                                    <td>${item.colledge_name || ''}</td>
                                    <td>${item.professional_name || ''}</td>
                                    <td>${item.class_demand || ''}</td>
                                    <td>${item.lowest_points !== undefined ? item.lowest_points : ''}</td>
                                    <td>${item.lowest_rank !== undefined ? item.lowest_rank : ''}</td>
                                    <td>${item.special_interest_group_code || ''}</td>
                                    <td>${item.description || ''}</td>
                                </tr>
                            `;
                        });
                        tableHTML += '</tbody></table>';
                        reportQueryResult.innerHTML = tableHTML;
                    } else {
                        reportQueryResult.innerHTML = '<p>没有找到相关数据。</p>';
                    }
                } else {
                    reportQueryResult.innerHTML = `<p style="color: red;">查询失败: ${data.msg || '未知错误'}</p>`;
                }
            } catch (error) {
                console.error('Report query error:', error);
                reportQueryResult.innerHTML = `<p style="color: red;">查询出错: ${error.message}</p>`;
            }
        });
    }
});
