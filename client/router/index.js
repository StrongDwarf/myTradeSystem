import Vue from 'vue'
import VueRouter from 'vue-router'
import words from '../words/index'
import interviewerTask from '../views/interviewer/task.vue'
import interviewerTime from '../views/interviewer/time.vue'
import interviewerInterview from '../views/interviewer/interview.vue'



Vue.use(VueRouter);

const Routers = [
    {
        path: '*',
        redirect: '/index'
    },
    {
        path:'/index',
        meta:{
            title:'面试时间管理平台'
        },
        component:(resolve) => require(['../views/index.vue'],resolve)
    },
    {
        path:'/login',
        meta:{
            title:'用户登录'
        },
        component:(resolve) => require(['../views/login.vue'],resolve)
    },
    {
        path:'/interviewer',
        meta:{
            title:'面试官首页'
        },
        component:(resolve) => require(['../views/interviewer/main.vue'],resolve),
        
        children:[{
            path:'task',
            component:interviewerTask,
            meta:{title:'task'}
        },{
            path:'time',
            component:interviewerTime,
            meta:{title:'time'}
        },{
            path:'interview',
            component:interviewerInterview,
            meta:{title:'interview'}
        },{
            path:'taskDetail/:taskNumber',
            component:(resolve) => require(['../views/interviewer/taskDetail.vue'],resolve),
            meta:{title:'task detail'}
        }]
    },
    {
        path:'/candidater',
        meta:{
            title:'候选人首页'
        },
        component:(resolve) => require(['../views/candidater/main.vue'],resolve)
    },
   
];

// 路由配置
const RouterConfig = {
    // 使用 HTML5 的 History 路由模式
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});

export default router;