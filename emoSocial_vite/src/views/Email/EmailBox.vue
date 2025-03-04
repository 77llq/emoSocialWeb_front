<script setup>
import {onMounted, ref, watch} from 'vue'
import http from "../../utils/index.js";
import cons from "../../components/Apis/constant.js";

const selectAll = ref(false);
const email_info = ref([
  {
    check: false,
    send_name: '',
    email_topic: '',
    email_id: ''
  },
])
let email_form = ref(null)
onMounted(() => {
  http.get(cons.checkEmailBox_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    email_form = res.data['email_info']
    email_info.value = email_form.map((item) => {
      const obj = {
        send_name: item.send_name,
        email_topic: item.email_topic,
        email_id: item.email_id,
      }
      return obj
    })
  })
})
// 监听全选按钮的变化
watch(selectAll, (value) => {
  // 将其他按钮的选中状态设为与全选按钮相同
  email_info.value.forEach(item => {
    item.check = value;
  });
});

</script>

<template>
  <el-container style="height: 100%;width: 100%;background-color: rgb(239,245,251);border-radius: 10px">
    <el-header
        style="display: flex;flex:1;padding:10px;border-radius:10px 10px 0 0;background-color:rgb(193,217,243) ">
      <div style="padding-top: 10px">
        <el-text style="font-size: 30px;color: black;font-weight: bolder;">
          收件箱
        </el-text>
      </div>
    </el-header>
    <el-main style="display: flex;flex: 10;flex-direction: column;padding: 0">
      <el-row
          style="width: 100%;height: 35px; flex-direction: row;align-items: center;border-bottom: 2px solid rgb(227,230,235)">

        <el-icon style="margin-left: 12px">
          <Message/>
        </el-icon>
        <div
            style="height: 100%;width: 2px;background-color: rgb(227,230,235);margin-left: 9px;margin-right: 9px"></div>
        <el-text style="width: 50px;font-size: 15px;font-weight: bold;">发件人</el-text>
        <div
            style="height: 100%;width: 2px;background-color: rgb(227,230,235);margin-left: 50px;margin-right: 10px"></div>
        <el-text style="width: 50px;font-size: 15px;font-weight: bold;">主题</el-text>
      </el-row>
      <el-row
          style="height: 35px; width: 100%;flex-direction: row;align-items: center;border-bottom: 2px solid rgb(227,230,235)"
          v-for="item in email_info">
        <router-link :to="{path:'email_content',query:{data:item.email_id}}"
                     style="text-decoration: none;width: 100%;height: 100%;display: flex;align-items: center">
          <el-icon style="margin-right: 22px;margin-left: 12px">
            <Message/>
          </el-icon>
          <el-text style="width: 80px;font-size: 15px;font-weight: bold;" v-bind="{truncated:true}">
            {{ item.send_name }}
          </el-text>
          <el-text style="width: 50%;font-size: 15px;font-weight: bold;margin-left: 32px" v-bind="{truncated:true}">
            {{ item.email_topic }}
          </el-text>
          <!--          <el-button style="border: none;background-color:rgb(239, 245, 251)" @click.native="delete_email($event)">-->
          <!--            <el-icon style="margin-right: 22px;margin-left: 12px">-->
          <!--              <Delete/>-->
          <!--            </el-icon>-->
          <!--          </el-button>-->
        </router-link>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
input {
  width: 80%;
  margin-left: 20px;
  outline: none;
  border: 1px solid black;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}

a {
  color: black;
}

a:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.3s;
}

.el-button:hover {
  background-color: rgb(243, 243, 243) !important;
}

.el-button:focus {
  background-color: rgb(243, 243, 243) !important;
}
</style>