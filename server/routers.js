/**
 * 路由管理文件
 */

const loginController = require('./controllers/login_controller')
const interviewTaskController = require('./controllers/interviewTask_controller')
const interviewTotalTaskController = require('./controllers/interviewTotalTask_controller')
const interviewerInterviewTaskController = require('./controllers/interviewerInterviewTask_controller')

module.exports = function (app) {
    app.get('/hello',(req,res) => {
        res.end('hello,world')
    })

    // 登录
    app.post('/login',loginController.login)
    
    // 获取任务列表
    app.post('/getTaskList',interviewTaskController.getTaskList)

    // 获取任务详情
    app.post('/totalTask/getTaskDetail',interviewTotalTaskController.getTaskDetail)

    // 面试官添加选择的面试时间
    app.post('/interviewer/addSelectedTimeList',interviewerInterviewTaskController.addSelectedTimeList)

    // 获取面试官面试任务细节
    app.post('/interviewer/getInterviewTaskDetail',interviewerInterviewTaskController.getInterviewTaskDetail)

}
