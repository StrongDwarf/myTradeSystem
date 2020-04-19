const host = `http://127.0.0.1:8083`

const apiUrl = {
    
    // 登录
    login:`${host}/login`,
    
    // 获取任务列表
    getTaskList:`${host}/getTaskList`,

    // 获取total任务详情
    getTotalTaskDetail:`${host}/totalTask/getTaskDetail`,

    // 获取面试官面试任务详情
    getInterviewTaskDetail:`${host}/interviewer/getInterviewTaskDetail`,

    // 面试官添加面试时间
    addSelectedTimeList:`${host}/interviewer/addSelectedTimeList`,
}
export default apiUrl