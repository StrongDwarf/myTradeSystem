<template>
  <div>
    <el-card class="box-card" shadow="hover" style="width:400px;margin:auto;margin-top:20vh;">
        <div slot="header" class="clearfix">
            <span>{{pageConstants.SYSTEM_NAME}}</span>
        </div>
        <div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item>
                    <el-button  @click="test">测试</el-button>
                </el-form-item>
            </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import Ajax from "../store/ajax";
import apiUrl from "../store/apiUrl";
import jquery from "jquery"

export default {
  data() {
    return {
      form: {
        name: "",
        number: "",
        type: ""
      },
      pageConstants: {
          SYSTEM_NAME:'小白菜交易系统登录'
      }
    };
  },
  methods: {
      login() {
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
          
      },
      test(){
          
          // symbol=sz002681&scale=60&ma=5&datalen=1023
          Ajax.post("http://192.168.43.14:8083/testa",{},
          (text) => {
              console.log("test",text)
          })
        /*
          this.$http.jsonp('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz002681&scale=60&ma=5&datalen=1023', {
                params: {},
                jsonp: 'onBack'
            }).then((res) => {
                console.log(res); 
            })*/
            /*
        var onBack = function(res) {
            console.log("onBack")
            alert(JSON.stringify(res));
        }
        jquery.ajax({
            url: 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz002681&scale=60&ma=5&datalen=1023',
            type: 'get',
            dataType: 'jsonp',  // 请求方式为jsonp
            jsonpCallback: "onBack",    // 自定义回调函数名
            success: function (data) {
                alert("data"+data)
            },
            data: {}
        });*/
      }
  }
};
</script>
