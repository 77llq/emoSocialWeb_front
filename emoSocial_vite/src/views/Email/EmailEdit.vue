<script setup>
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import http from "../../utils/index.js";
import cons from "../../components/Apis/constant.js";

const route = useRoute()
onMounted(() => {
  let send_info = localStorage.getItem('user_info')
  send_info = JSON.parse(send_info)
  account_info.value.account_email = send_info['email']
  account_info.value.account_name = send_info['name']
  if (route.query.data) {
    let data = JSON.parse(route.query.data)
    email_info.value.receive_email = data['contact_email']
    email_info.value.receive_id = data['contact_id']
  }
})
const email_info = ref({
  receive_id: '',
  receive_email: '',
  email_topic: '',
  email_content: '',
  send_email: '',
  send_name: '',
  token: '',
})
const account_info = ref({
  account_name: '1771',
  account_email: '2785118462@qq.com',
})
const open_success = () => {
  email_info.value.token = localStorage.getItem('token')
  email_info.value.send_email = account_info.value.account_email
  email_info.value.send_name = account_info.value.account_name

  http.post(cons.sendEmails_apis, {email_info: email_info}).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '发送成功',
        type: 'success',
      })
    } else {
      ElMessage.error('请核对收件人地址!')
    }
  })
}
const open_cancel = () => {
  ElMessage('您取消了本次发送!')
}

</script>

<template>
  <el-container style="height: 100%;width: 100%;background-color: rgb(239,245,251);border-radius: 10px">
    <el-header
        style="display: flex;flex:1;padding:10px;border-radius:10px 10px 0 0;background-color:rgb(193,217,243) ">
      <el-text style="font-size: 30px;color: black;font-weight: bolder">请编辑您的邮件</el-text>
    </el-header>
    <el-main style="display: flex;flex: 10;flex-direction: column">
      <el-row
          style="display: flex;flex: 1;color: red;flex-direction: row;align-items: center">
        <el-text style="width: 50px;font-size: 15px;font-weight: bold">收件人</el-text>
        <input v-model="email_info.receive_email" style="height: 15px"/>
      </el-row>
      <el-row
          style="display: flex;flex: 1;flex-direction: row;align-items: center">
        <el-text style="width: 50px; font-size: 15px;font-weight: bold">主题</el-text>
        <input v-model="email_info.email_topic" style="height: 15px"/>
      </el-row>
      <el-row style="display: flex; flex: 9;flex-direction: row; align-items: flex-start;">
        <el-text style="width: 50px; font-size: 15px; font-weight: bold; align-self: flex-start;">正文</el-text>
        <textarea v-model="email_info.email_content"
                  style="height: 300px; width: 75%; margin-left: 20px; resize: none;"></textarea>
      </el-row>
      <el-row
          style="display: flex;flex: 1;color: red;flex-direction: row;align-items: center">
        <el-text style="width: 50px;font-size: 15px;font-weight: bold">发件人:</el-text>
        <el-text style="margin-left: 20px;font-size: 17px;font-weight: bolder;margin-top: 2px ">
          {{ account_info.account_name }}
        </el-text>
        <el-text style="margin-left: 5px;font-size: 15px;margin-top: 1px ">
          <{{ account_info.account_email }}>
        </el-text>
      </el-row>
      <el-row
          style="display: flex;flex: 1;color: red;flex-direction: row;align-items: center">
        <router-link to="/email_default"
                     style="display: flex; justify-content: flex-end; width: 47%; height: 50px;text-decoration: none">
          <el-button :plain="true" @click="open_success" style="width: 100%; height: 50px;">发送</el-button>
        </router-link>
        <router-link to="/email_default" style="width: 47%;height: 50px;margin-left: 10px">
          <el-button :plain="true" @click="open_cancel" style="width: 100%;height: 50px">关闭</el-button>
        </router-link>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
input {
  width: 75%;
  margin-left: 20px;
  outline: none;
  border: 1px solid black;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}
</style>