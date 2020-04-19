<template>
    <div>
        <div v-if="taskList.length == 0">
            你还没有任何面试任务
        </div>
        <div v-else>
            <div v-if="stateTaskList['interviewing'].length != 0">
                <span style="font-weight:1000;font-size:18px;">正在进行的面试任务</span>
                <el-divider></el-divider>
                <div>
                    <div v-for="item in stateTaskList['interviewing']">
                        <!-- {{totalTaskDetail[item.taskNumber + '']}} -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>{{totalTaskDetail[item.taskNumber + ''].name}}</span>
                            </div>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">拟通过人数:</span>
                                <span class="card-item-label">{{totalTaskDetail[item.taskNumber + ''].admissionCount + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">单场面试时间:</span>
                                <span class="card-item-label">{{totalTaskDetail[item.taskNumber + ''].interviewTime + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">面试官:</span>
                                <span class="card-item-label" v-for="interviewer in totalTaskDetail[item.taskNumber + ''].interviewerList">{{interviewer.name + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">候选人:</span>
                                <span class="card-item-label" v-for="candidater in totalTaskDetail[item.taskNumber + ''].candidaterList">{{candidater.name + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">面试地点:</span>
                                <span class="card-item-label">{{totalTaskDetail[item.taskNumber + ''].address + ','}}</span>
                            </el-card>
                            <div class="text item" style="margin-top:10px">
                                <span>已选择可用面试时间</span>
                                <el-button style="float: right; padding: 3px 0" type="text" @click="intoTaskDetail(item.taskNumber)">进入</el-button>
                            </div>
                        </el-card>
                    </div>
                </div>
            </div>
            <div v-if="stateTaskList['interviewed'].length != 0">
                <span>已结束的面试任务</span>
                <el-divider></el-divider>
            </div>
        </div>
    </div>
</template>
<script>
import Ajax from '../../store/ajax';
import apiUrl from '../../store/apiUrl';

    export default {
        data() {
            return {
                // 面试任务列表
                taskList:[],
                // 面试任务状态列表
                stateTaskList:{
                    '0':[],     // 刚发布的面试任务
                    '1':[],     // 已选择面试时间
                    '2':[],     // 已确定时间并且通知候选人选择时间
                    '3':[],     // 候选者已选择面试时间(预留,不用)
                    '4':[],     // 正在面试
                    '5':[],     // 面试结束并打分
                    '6':[],     // 已筛选出通过者
                    '7':[],     // 面试已结束
                    'interviewing':[],  // 进行中
                    'interviewed':[]    // 已经结束
                },
                // 面试任务中的total任务编号列表
                taskNumberList:[],
                // 面试任务细节,
                totalTaskDetail:{},
            }
        },
        methods: {
            getTaskList(){
                let sendObj = this.$store.getters.user
                let that = this
                Ajax.post(apiUrl.getTaskList,sendObj,(data) => {
                    if(data.success){
                        that.taskList = data.data.taskList
                        
                        // 将任务列表按照进度分类
                        that.taskList.forEach(item => {
                            switch(item.process + ''){
                                case '0':
                                    that.stateTaskList['0'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '1':
                                    that.stateTaskList['1'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '2':
                                    that.stateTaskList['2'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '3':
                                    that.stateTaskList['3'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '4':
                                    that.stateTaskList['4'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '5':
                                    that.stateTaskList['5'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '6':
                                    that.stateTaskList['6'].push(item)
                                    that.stateTaskList['interviewing'].push(item)
                                    break;
                                case '7':
                                    that.stateTaskList['7'].push(item)
                                    that.stateTaskList['interviewed'].push(item)
                                    break;
                            }
                        })

                        // 获取total任务编号列表
                        let taskNumberList = []
                        that.taskList.forEach(element => {
                            taskNumberList.push(element.taskNumber)
                        });
                        that.taskNumberList = [... new Set(taskNumberList)]
                        // 获取面试任务细节
                        console.log(that.taskNumberList)
                        that.taskNumberList.forEach(taskNumber => {
                            that.getTotalTaskDetail(taskNumber)
                        })
                        
                    }else{
                        this.$notify.error({
                            title:'数据请求失败',
                            message:data.message
                        })
                    }
                })
            },
            getTotalTaskDetail(taskNumberA){
                let that = this
                let taskNumber = taskNumberA + ''
                Ajax.post(apiUrl.getTotalTaskDetail,{
                    taskNumber:taskNumber
                },(data) => {
                    if(data.success){
                        let totalTaskDetail = {}
                        totalTaskDetail[taskNumber] = data.data.taskDetail
                        that.totalTaskDetail = totalTaskDetail
                    }else{
                        this.$notify.error({
                            title:'数据请求失败',
                            message:data.message
                        })
                    }
                })
            },
            intoTaskDetail(taskNumber){
                this.$router.push('/interviewer/taskDetail/'+taskNumber)
            }
        },
        mounted() {
            this.user = this.$store.getters.user;
            this.getTaskList()
        },
    }
</script>
<style scoped>
.box-card{
    max-width: 350px;
}
.box-card item{
    padding: 18px 0;
}
.box-card item .card-item-label{
    font-size: 14px;
    font-weight: 800;
    color:black
}
</style>
