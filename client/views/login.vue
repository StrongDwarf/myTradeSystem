<template>
  <div>
    <el-card class="box-card" shadow="hover" style="width:400px;margin:auto;margin-top:20vh;">
        <div slot="header" class="clearfix">
            <span>{{pageConstants.SYSTEM_NAME}}</span>
        </div>
        <div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item v-bind:label="pageConstants.label.NAME">
                <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item v-bind:label="pageConstants.label.NUMBER">
                <el-input v-model="form.number"></el-input>
                </el-form-item>
                <el-form-item v-bind:label="pageConstants.label.NUMBER_TYPE">
                    <el-select v-model="form.type" v-bind:placeholder="pageConstants.placeholder.PROMPT_SELECT_NUMBER_TYPE">
                        <el-option label="面试官" v-bind:value="pageConstants.INTERVIEW_TYPE"></el-option>
                        <el-option label="候选人" v-bind:value="pageConstants.CANDIDATER_TYPE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import Ajax from "../store/ajax";
import apiUrl from "../store/apiUrl";
export default {
  data() {
    return {
      form: {
        name: "",
        number: "",
        type: ""
      },
      pageConstants: {
          SYSTEM_NAME:'宝洁面试系统登录',
          label: {
              NAME: '姓名',
              NUMBER: '编号',
              NUMBER_TYPE: '编号类型',
              INTERVIEWER: '面试官',
              CANDIDATER: '候选者',
          },
          placeholder: {
              PROMPT_SELECT_NUMBER_TYPE:'请选择编号类型'
          },
          LOGIN_ERROR:'登录失败',
          LOGIN_SUCCESS:'登录成功',
          NOT_EMPTY_NAME:'姓名不能为空',
          NOT_EMPTY_NUMBER:'编号不能为空',
          NOT_EMPTY_NUMBER_TYPE:'编号类型不能为空',
          INTERVIEW_TYPE:'1',
          CANDIDATER_TYPE:'2',
          NOT_FOUND_TYPE:'无法识别的登陆者类型',
          WELCOME_CANDIDATER:'欢迎您,候选者,祝您面试顺利',
          WELCOME_INTERVIEWER:'欢迎您,面试官,祝您开心每一天'
      }
    };
  },
  methods: {
      login() {
          let form = this.form,
              constants = this.constants
          if(!form.name) {
              this.$notify.error({
                title:constants.LOGIN_ERROR,
                message:constants.NOT_EMPTY_NAME
              });
              return
          }
          if(!form.number) {
              this.$notify.error({
                  title:constants.LOGIN_ERROR,
                  message:constants.NOT_EMPTY_NUMBER
              })
          }
          if(!form.type) {
              this.$notify.error({
                  title:constants.LOGIN_ERROR,
                  message:constants.NOT_EMPTY_NUMBER_TYPE
              })
          }
          let sendObj = {
              name:form.name,
              type:form.type
          }
          if(form.type === constants.INTERVIEW_TYPE) {
              sendObj.jobNumber = form.number
          }else if(form.type === constants.CANDIDATER_TYPE) {
              sendObj.interviewNumber =form.number
          }else {
              this.$$notify.error({
                  title:constants.LOGIN_ERROR,
                  message:constants.NOT_FOUND_TYPE
              })
              return
          }
          Ajax.post(apiUrl.login,sendObj,(data)=> {
              if(data.success) {
                  this.$store.commit('setToken',data.data.token)
                  this.$store.commit('setUser',form)
                  if(form.type === constants.CANDIDATER_TYPE) {
                      this.$notify.success({
                        title:constants.LOGIN_SUCCESS,
                        message:constants.WELCOME_CANDIDATER
                      })
                        this.$router.push('/candidater')
                  }else if(form.type === constants.INTERVIEW_TYPE) {
                      this.$notify.success({
                          title:constants.LOGIN_SUCCESS,
                          message:constants.WELCOME_INTERVIEWER
                      })
                       this.$router.push("/interviewer/task")
                  }
              } else {
                  this.$notify.error({
                      title:constants.LOGIN_ERROR,
                      message:data.message
                  })
              }
          })
          
      }
  }
};
</script>
