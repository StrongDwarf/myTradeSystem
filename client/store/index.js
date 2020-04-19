import Vue from 'vue'
import Vuex from 'vuex'
import Ajax from './ajax.js'
import apiUrl from './apiUrl.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 调用state中的数据:this.$store.state.article
         */
       token:'',
       language:'简体中文',
       user:{
           name:'面试官1',
           number:'10001',
           type:'1',
       },
       apiUrl:apiUrl
    },
    getters: {
        /**
         * 调用getters中的方法,this.$store.getters.brands;
         */
        
        token:state=>{
            const token = state.token
            return token
        },
        language:state=>{
            const language = state.language
            return language
        },
        user:state=>{
            const user = state.user
            return user
        }
       
    },
    mutations: {
        /**
         * 调用mutations中的方法,this.$store.commit('setTags',data);
         */
        setToken(state,token){
            state.token = token
        },
        setUser(state,user){
            state.user = user
        }
       
    },
    actions: {
        /**
         * 调用action中的方法, this.$store.dispatch('increment',data);
         */
        getToken(context,user,pass){
            Ajax.post(apiUrl.login,{user,pass},(res) => {
                context.commit('setToken',res.token);
            })
        },
       
    }
});

export default store
