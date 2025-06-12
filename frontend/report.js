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

                if (response.ok && data.code === 0) {
                    if (data.data && data.data.report_data && data.data.report_data.length > 0) {
                        let tableHTML = `
                            <p><strong>查询成功</strong></p>
                            <p>总数: ${data.data.total_count}, 当前页: ${data.data.current_page}, 每页条数: ${data.data.page_size}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>年份</th>
                                        <th>省份</th>
                                        <th>院校名称</th>
                                        <th>专业名称</th>
                                        <th>选科要求</th>
                                        <th>最低分</th>
                                        <th>最低位次</th>
                                        <th>录取数</th>
                                        <th>学费</th>
                                        <th>专业备注</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;
                        data.data.report_data.forEach(item => {
                            tableHTML += `
                                <tr>
                                    <td>${item.year || ''}</td>
                                    <td>${item.province_name || ''}</td>
                                    <td>${item.university_name || ''}</td>
                                    <td>${item.major_name || ''}</td>
                                    <td>${item.class_demand_str || ''}</td>
                                    <td>${item.min_score || ''}</td>
                                    <td>${item.min_rank || ''}</td>
                                    <td>${item.admission_count || ''}</td>
                                    <td>${item.tuition_fee || ''}</td>
                                    <td>${item.major_remark || ''}</td>
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
