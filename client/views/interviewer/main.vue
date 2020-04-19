<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-nav">
                        
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <el-menu
                        width="180"
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @select="menuSelected">
                        <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <span slot="title">task</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-time"></i>
                            <span slot="title">time</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-document"></i>
                            <span slot="title">interview</span>
                        </el-menu-item>
                    </el-menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem to="/interviewer">interviewer</BreadcrumbItem>
                        <BreadcrumbItem v-if="pageIndex == '1'" to="/interviewer/task">task</BreadcrumbItem>
                        <BreadcrumbItem v-if="pageIndex == '2'" to="/interviewer/time">time</BreadcrumbItem>
                        <BreadcrumbItem v-if="pageIndex == '3'" to="/interviewer/interview">interview</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pageIndex:'1',
            constants:{
                TASK_PAGE_URL:'/interviewer/task',
                TIME_PAGE_URL:'/interviewer/time',
                INTERVIEW_PAGE_URL:'/interviewer/interview',
                TASK_PAGE_INDEX:'1',
                TIME_PAGE_INDEX:'2',
                INTERVIEW_PAGE_INDEX:'3'
            }
        }
    },
    methods: {
        menuSelected(index,indexPath){
            let constants = this.constants
            if(this.pageIndex == index){
                return
            }
            this.pageIndex = index;
            switch(index){
                case constants.TASK_PAGE_INDEX:
                    this.$router.push(constants.TASK_PAGE_URL)
                    break
                case constants.TIME_PAGE_INDEX:
                    this.$router.push(constants.TIME_PAGE_URL)
                    break
                case constants.INTERVIEW_PAGE_INDEX:
                    this.$router.push(constants.INTERVIEW_PAGE_URL)
                    break
                default:
                    break
            }
        }
    }
}
</script>

<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
