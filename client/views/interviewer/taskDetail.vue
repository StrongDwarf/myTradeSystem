<template>
    <div>
        <el-page-header @back="goBack" content="task detail">
        </el-page-header>
        <el-divider></el-divider>
        <div>
            <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>{{taskDetail.name}}</span>
                            </div>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">拟通过人数:</span>
                                <span class="card-item-label">{{taskDetail.admissionCount + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">单场面试时间:</span>
                                <span class="card-item-label">{{taskDetail.interviewTime + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">面试官:</span>
                                <span class="card-item-label" v-for="interviewer in taskDetail.interviewerList">{{interviewer.name + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">候选人:</span>
                                <span class="card-item-label" v-for="candidater in taskDetail.candidaterList">{{candidater.name + ','}}</span>
                            </el-card>
                            <el-card class="text item" :body-style="{ padding: '8px' }" shadow="hover">
                                <span class="card-item-label">面试地点:</span>
                                <span class="card-item-label">{{taskDetail.address + ','}}</span>
                            </el-card>
                            <div class="text item" style="margin-top:10px">
                                <span>已选择可用面试时间</span>
                                <el-button style="float: right; padding: 3px 0" type="text" @click="intoTaskDetail(item.taskNumber)">进入</el-button>
                            </div>
                        </el-card>
            <el-card>
                <div slot="header" class="clearfix">
                    <span style="font-weight:1000;font-size:18px;">面试时间</span>
                    <span>该场面试需至少应有{{shouldSelectTimeCount}}段可用时间,您已选择{{youSelectTimeCount}}段时间,目前可用{{formatedInterviewerTimeData.useableTimeLen}}段时间</span>
                </div>
                <div style="margin-bottom:10px">
                <span style="font-size:14px;">新增可用面试时间:</span>
                <!-- 日期选择 -->
                <el-date-picker
                    style="width:140px"
                    size="medium"
                    v-model="time.date"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
                <!-- 时间选择 -->
                <el-time-select
                    style="width:120px"
                    size="medium"
                    placeholder="起始时间"
                    v-model="time.startTime"
                    :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '21:30'
                    }">
                </el-time-select>
                <el-time-select
                    style="width:120px"
                    size="medium"
                    placeholder="结束时间"
                    v-model="time.endTime"
                    :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '21:30',
                    minTime: time.startTime
                    }">
                </el-time-select>
                <el-button
                            size="small"
                            type="primary"
                            @click="addSelectedTimeList">确认</el-button>
                </div>
                <!-- 已选择的时间表 -->
                <el-table
                    :data="formatedInterviewerTimeData.bodyData"
                    border
                    style="width: 100%">
                    <el-table-column v-for="item in formatedInterviewerTimeData.headerData"
                    v-bind:prop="item.prop"
                    v-bind:label="item.label"
                    width="180">
                        <template slot-scope="scope">
                            <span style="padding-right:4px">{{scope.row[item.prop]}}</span>
                            <el-button v-if="item.isMe && scope.row[item.prop] == '已选择'"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>
<script>
import Ajax from '../../store/ajax';
import apiUrl from '../../store/apiUrl';

    export default {
        data() {
            return {
                time:{
                    date:'',
                    startTime:'',
                    endTime:'',
                },
                jobNumber:'',
                taskNumber:'',
                taskDetail:{},
                shouldSelectTimeCount:0,
                useableTimeLen:0,
                youSelectTimeCount:0,
                taskInterviewerDetailObj:{},
                timeSelectedList:[{
                    name:'面试官1',
                    jobNumber:'10001',
                    timeSelectedList:[{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'08:30',
                        endTime:'09:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'09:00',
                        endTime:'09:30'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'09:30',
                        endTime:'10:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'10:30',
                        endTime:'11:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'11:30',
                        endTime:'12:00'
                    }]
                },{
                    name:'面试官2',
                    jobNumber:'10002',
                    timeSelectedList:[{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'09:30',
                        endTime:'10:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'10:30',
                        endTime:'11:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'11:30',
                        endTime:'12:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'13:30',
                        endTime:'14:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'14:00',
                        endTime:'14:30'
                    }]
                },{
                    name:'面试官3',
                    jobNumber:'10003',
                    timeSelectedList:[{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'09:30',
                        endTime:'10:00'
                    },{
                        date:'Thu Jun 20 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'10:30',
                        endTime:'11:00'
                    },{
                        date:'Thu Jun 21 2019 00:00:00 GMT+0800 (中国标准时间)',
                        startTime:'10:30',
                        endTime:'11:00'
                    },]
                }],
                timeTableParams:[{
                    prop:'time',
                    label:'面试时间',
                    isMe:false,
                },{
                    prop:'10001',
                    label:'面试官1',
                    isMe:true
                },{
                    prop:'10002',
                    label:'面试官2',
                    isMe:false
                },{
                    prop:'10003',
                    label:'面试官3',
                    isMe:false
                }],
                timeListData:[{
                    time:'2019-06-11 12:30-13:00',
                    '10001':'已选择',
                    '10002':' ',
                    '10003':' ',
                },{
                    time:'2019-06-11 13:00-13:30',
                    '10001':' ',
                    '10002':'已选择',
                    '10003':' ',
                }],
                formatedTimeList:[],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() + 3600 * 1000 * 24 < Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周后',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        components:{
        },
        watch: {
            taskInterviewerDetailObj(newVal,oldVal){
                let tempObj1 = JSON.stringify(newVal)
                let taskInterviewerDetailObjTemp = JSON.parse(tempObj1)
                
            }
        },
        methods: {
            goBack(){
                this.$router.go(-1)
            },
            handleEdit(){

            },
            handleDelete(index,row){
                let that = this
                let SelectedtimeList = JSON.parse(that.taskInterviewerDetailObj[that.jobNumber].timeBeforeList[0])
                let ind = SelectedtimeList.findIndex(item => {
                    if(item == row.time){
                        return true
                    }
                })
                SelectedtimeList.splice(ind,1)

            },
            removeSelectedTime(){
                
            },
            addSelectedTimeList(){
                let that = this
                // date格式化 end: date='2019-6-13'
                let date = new Date(that.time.date)
                date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                // 时间规格化
                let startTime = that.time.startTime,    //12:30
                    endTime = that.time.endTime,        //13:00
                    tempTime = '',
                    timeList = []
                do{
                    if(startTime[3] == '0'){
                        tempTime = startTime[0] + startTime[1] + ':30';
                    }else{
                        tempTime = (Number(startTime.split(':')[0])+1) + ':00'
                    }
                    timeList.push(date + ' ' + startTime + '-' + tempTime)
                    startTime = tempTime
                }while(endTime > startTime)

                // 提交
                Ajax.post(apiUrl.addSelectedTimeList,{
                    taskNumber:that.taskNumber,
                    jobNumber:that.jobNumber,
                    timeList:timeList
                },(data) => {
                    if(data.success){
                        this.$notify.success({
                            title:'成功添加面试时间',
                            message:'成功添加面试时间'
                        })
                        that.getTotalTaskDetail()
                    }else{
                        this.$notify.error({
                            title:'添加面试时间失败',
                            message:data.message
                        })
                    }
                })
            },
            getTotalTaskDetail(){
                let that = this
                let taskNumber = that.taskNumber
                Ajax.post(apiUrl.getTotalTaskDetail,{
                    taskNumber:taskNumber
                },(data) => {
                    if(data.success){
                        that.taskDetail = data.data.taskDetail
                        that.shouldSelectTimeCount = data.data.taskDetail.candidaterList.length
                        data.data.taskDetail.interviewerList.forEach(interviewer => {
                             that.getInterviewTaskDetail(interviewer.jobNumber)
                        })
                    }else{
                        this.$notify.error({
                            title:'数据请求失败',
                            message:data.message
                        })
                    }
                })
            },
            getInterviewTaskDetail(jobNumber){
                let that = this
                Ajax.post(apiUrl.getInterviewTaskDetail,{
                    taskNumber:that.taskNumber,
                    jobNumber:jobNumber
                },(data) => {
                    if(data.success){
                        /*
                        let taskInterviewerDetailObj = that.taskInterviewerDetailObj
                        taskInterviewerDetailObj[jobNumber] = data.data.taskDetail
                        that.taskInterviewerDetailObj = taskInterviewerDetailObj
                        */
                        if(jobNumber == that.jobNumber){
                            that.youSelectTimeCount = JSON.parse(data.data.taskDetail.timeBeforeList[0]).length
                        }
                        that.$set(that.taskInterviewerDetailObj,jobNumber,data.data.taskDetail)
                    }else{
                        this.$notify.error({
                            title:'数据请求失败',
                            message:data.message
                        })
                    }
                })
            },
            getdeepCloneObj(){

            }
        },
        computed: {
            // 面试时间规格化
            formatedInterviewerTimeData(){
                // 当前面试官编号
                let jobNumber = this.jobNumber
                // 当前面试任务详情
                let taskDetail = this.taskDetail
                // 当前面试任务各面试官任务详情
                let tempObj1 = JSON.stringify(this.taskInterviewerDetailObj)
                let taskInterviewerDetailObj = JSON.parse(tempObj1)
                // let taskInterviewerDetailObj = this.taskInterviewerDetailObj
                // 时间选择表header数据
                let timeTableParams = [{
                    prop:'time',
                    label:'面试时间',
                    isMe:false,
                }]
                // 时间选择表中所有面试官名称数据
                let interviewerListNameData = []
                // 时间选择表中所有时间数据
                let timeListData = []
                // 可用时间长度
                let useableTimeLen = 0
                // 时间选择表中body数据
                let timeTableData = []
                // 面试官姓名和选择的面试时间映射表, item: 'jobName':Array{ index:time }
                let jobNumberMapSelectTime = {}

                // 获取header数据,并获取所有选择的时间
                if(!this.taskDetail.interviewerList || this.taskDetail.interviewerList.length <= 0){
                    return {}
                }
                this.taskDetail.interviewerList.forEach(interviewer => {
                    timeTableParams.push({
                        prop:interviewer.jobNumber,
                        label:interviewer.name,
                        isMe:interviewer.jobNumber == jobNumber
                    })
                    if(taskInterviewerDetailObj[interviewer.jobNumber + ''] && taskInterviewerDetailObj[interviewer.jobNumber + ''].timeBeforeList.length > 0){
                        let tempObj2 = JSON.parse(taskInterviewerDetailObj[interviewer.jobNumber + '']['timeBeforeList'][0])
                        for(let item of tempObj2){
                            timeListData.push(item)
                        }
                        // timeListData.concat(JSON.parse(taskInterviewerDetailObj[interviewer.jobNumber + '']['timeBeforeList'][0]))
                    }
                    
                })
                
                timeListData = [... new Set(timeListData)].sort()
                // 获取面试官编号和选择的面试时间映射表
                for(let jobNumber in taskInterviewerDetailObj){
                    let interviewTask = taskInterviewerDetailObj[jobNumber]
                    jobNumberMapSelectTime[jobNumber] = interviewTask.timeBeforeList
                }

                // 根据时间列表整理body数据
                timeListData.forEach(time => {
                    let obj = {
                        time:time,
                        'isMe':false,
                    }
                    for(let jobNumberT in jobNumberMapSelectTime){
                        
                        if(jobNumberMapSelectTime[jobNumberT].length > 0 && JSON.parse(jobNumberMapSelectTime[jobNumberT][0]).includes(time)){
                            obj[jobNumberT] = '已选择'
                        }else{
                            obj[jobNumberT] = ' '
                        }
                        if(jobNumberT == jobNumber){
                            obj.isMe = true
                        }
                    }
                    timeTableData.push(obj)
                })

                // 根据timeTableData获取可用时间长度
                timeTableData.forEach(item => {
                    let isUseable = true
                    for(let key in item){
                        if(key != 'time' && key != 'isMe' && item[key] != '已选择'){
                            isUseable = false
                        }
                    }
                    if(isUseable){
                        useableTimeLen += 1
                    }
                })

                return {
                    headerData:timeTableParams,
                    bodyData:timeTableData,
                    useableTimeLen:useableTimeLen
                }
            }
        },
        mounted() {
            this.jobNumber = this.$store.getters.user.number
            this.taskNumber = this.$route.params.taskNumber
            this.getTotalTaskDetail()
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
