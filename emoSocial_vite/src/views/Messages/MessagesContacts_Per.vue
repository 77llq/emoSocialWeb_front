<script setup>
import {onBeforeUpdate, onMounted, ref} from "vue";
import {useRoute} from 'vue-router'
import {Check, Delete} from "@element-plus/icons-vue";
import http from "/src/utils/index.js"
import cons from "../../components/Apis/constant.js";
import {ElMessage} from "element-plus";

const route = useRoute()
const account_info = ref({
  name: '',
  avatar_url: '',
  signature: '',
  follow: '',
  following: '',
  email: '',
  profileBp: '',
  id: '',
})
onMounted(() => {
  data = JSON.parse(route.query.data)
  http.get(cons.getFansInfoById_apis, {
    params: {
      id: data['id']
    }
  }).then((res) => {
    follow_num.value = res.data['follow_num']
    fans_num.value = res.data['fans_num']
  })
  account_info.value.name = data['name']
  account_info.value.avatar_url = data['avatar']
  account_info.value.signature = data['signature']
  account_info.value.email = data['email']
  account_info.value.backgroundPic_url = data['profileBp']
  account_info.value.id = data['id']
  http.get(cons.getFriendsMoments_apis, {
    params: {
      id: data['id']
    }
  }).then((res) => {
    let momentsInfo = res.data['data']
    moments_form.value = momentsInfo.map((item) => {
      return {
        account_avatar: item.postAvatar,
        account_name: item.postName,
        moments_content: item.postContent,
      }
    })
  })
})
onBeforeUpdate(() => {
  data = JSON.parse(route.query.data)
  http.get(cons.getFansInfoById_apis, {
    params: {
      id: data['id']
    }
  }).then((res) => {
    follow_num.value = res.data['follow_num']
    fans_num.value = res.data['fans_num']
  })
  account_info.value.name = data['name']
  account_info.value.avatar_url = data['avatar']
  account_info.value.signature = data['signature']
  account_info.value.email = data['email']
  account_info.value.backgroundPic_url = data['profileBp']
  account_info.value.id = data['id']
  http.get(cons.getFriendsMoments_apis, {
    params: {
      id: data['id']
    }
  }).then((res) => {
    let momentsInfo = res.data['data']
    moments_form.value = momentsInfo.map((item) => {
      return {
        account_avatar: item.postAvatar,
        account_name: item.postName,
        moments_content: item.postContent,
      }
    })
  })
})
let data = []
let follow_num = ref('')
let fans_num = ref('')
const moments_form = ref([
  {
    account_avatar: '',
    account_name: '',
    moments_content: '',
  }
])
const follow_request = () => {
  http.post(cons.follow_apis,
      {token: localStorage.getItem('token'), follow_id: account_info.value.id}).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '关注成功!',
        type: 'success',
      })
    }
    if (res.data['code'] === 'already') {
      ElMessage({
        message: '您已关注对方!',
        type: 'success',
      })
    }
  })
}
const unfollow_request = () => {
  http.delete(cons.unfollow_apis, {
    params: {
      token: localStorage.getItem('token'),
      unfollow_id: account_info.value.id
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage.error({message: '取消关注成功!'})
    }
    if (res.data['code'] === 'not_your_follow') {
      ElMessage.error({message: '您尚未关注对方!'})
    }
  })
}
</script>

<template>
  <el-container class="outside">
    <div class="inside">
      <el-header style="flex:0.3;">
        <div class="header_back">
          <el-text style="font-size: 25px;font-weight: bold">{{ account_info.name }}</el-text>
          <el-text style="font-size: 20px;font-weight: bold;margin-left: 10px;">的个人主页</el-text>
        </div>
        <el-container style="margin-left: 10px;display: flex;flex-direction: column;align-self: center">
          <el-text style="font-size: 20px;font-weight: bolder;color: black;align-self: normal">{{ account_info.name }}
          </el-text>
          <el-text style="align-self: normal">的个人主页</el-text>
        </el-container>
      </el-header>
      <el-main style="flex:4; padding: 0;width:100%">
        <div style="height: 100%;width: 100%;display: flex;flex-direction: column">
          <el-container style="flex: 2;width: 100%;flex-direction: column">
            <el-container style="height: 125%;width: 100%;">
              <el-image style="width: 100%;height: 140px;"
                        :src=account_info.backgroundPic_url></el-image>
            </el-container>
            <el-container style="height: 20%;width: 100%;position: relative;">
              <el-container
                  style="height: 90px;width: 90px;background-color: white;position: absolute;bottom: -5px;left: 10px;
                  border-radius: 50%"></el-container>
              <el-container
                  style="position: absolute;bottom: 0px;left: 15px;">
                <el-avatar :src="account_info.avatar_url"
                           style="height: 80px;width: 80px;border-radius: 50%"></el-avatar>
              </el-container>
              <el-container>
                <el-button class="header_back_a" :icon="Check" type="success" circle @click="follow_request"/>
                <el-button class="header_back_a" :icon="Delete" type="danger" circle @click="unfollow_request"/>
              </el-container>
            </el-container>
          </el-container>
          <el-container style="flex: 1;width: 100%;flex-direction: column;">
            <el-row class="account_info">
              <el-text style="font-weight: bolder;font-size: 15px;">{{ account_info.name }}</el-text>
              <el-text style="margin-left: 20px;">Email: {{ account_info.email }}</el-text>
            </el-row>
            <el-row class="account_info">
              <el-text>{{ account_info.signature }}</el-text>
            </el-row>
            <el-row class="account_info">
              <el-text>关注的人:</el-text>
              <el-text style="font-weight: bolder;margin-left: 5px">{{ follow_num }}</el-text>
              <el-text style="margin-left: 10px;">粉丝:</el-text>
              <el-text style="font-weight: bolder;margin-left: 5px">{{ fans_num }}</el-text>
            </el-row>
            <el-row style="margin-top: auto;">
              <a href="#" class="posts_button">
                <el-text style="font-size: 20px;font-weight: bolder">Posts</el-text>
              </a>
            </el-row>
          </el-container>
        </div>
      </el-main>
      <el-scrollbar style="display: flex;flex:2;flex-direction: row;padding: 0">
        <el-container class="moments_row"></el-container>
        <router-link
            :to="{path:'friends_moments',query:{data:account_info.id}}"
            style="text-decoration: none;"
        >
          <el-row>
            <a href="#" class="moments_a" v-for="(moments) in moments_form">
              <div
                  style="height: 60px;width: 60px;display: flex;justify-content: center;flex-direction: column;margin-left: 20px;">
                <el-image :src=moments.account_avatar style="width: 70%;height: 70%"></el-image>
              </div>
              <el-container
                  style="display: flex;flex-direction: column;padding-bottom: 10px;padding-top: 10px">
                <el-text style="font-size: 15px;font-weight: bolder;color: black;align-self: normal">
                  {{ moments.account_name }}
                </el-text>
                <el-text style="font-size: 20px;font-weight: bolder;color: black;align-self: normal">
                </el-text>
                <el-text style="align-self: normal;margin-top: 3px">
                  {{ moments.moments_content }}
                </el-text>
              </el-container>
            </a>
          </el-row>
        </router-link>

      </el-scrollbar>
    </div>
  </el-container>
</template>

<style scoped>
.outside {
  width: 100%;
  height: 100%;
  justify-content: center; /*主轴方向(x轴方向)*/
  align-items: center;
}

.inside {
  width: 80%;
  height: 95%;
  border: 1px solid rgb(239, 243, 244);
  display: flex;
  flex-direction: column;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */
}

.header_back {
  width: 100%;
  height: 60px;
  display: flex;
  font-size: 20px;
  color: black;
}

.header_back_a {
  margin-left: 260px;
  margin-top: 10px;
}

.header_back_a:hover {
  background-color: rgb(215, 215, 216);
  transition: background-color 0.5s;
}

.click_confirm {
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 20%;
  font-family: Arial, sans-serif;
  font-weight: bold;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.account_info {
  margin: 5px 20px;
  flex: 1;
}

.posts_button {
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-decoration: none
}

.posts_button:hover {
  background-color: rgb(239, 243, 244);
  transition: background-color 0.4s;
}

.moments_row {
  display: flex;
  height: 33%;
  width: 100%;
  border-bottom: 1px solid rgb(239, 243, 244)
}

.moments_a {
  display: flex;
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: black;
}

.moments_a:hover {
  background-color: rgb(239, 243, 244);
  transition: background-color 0.4s;
}

::v-deep .el-scrollbar__wrap--hidden-default {
  scrollbar-width: auto;
}

::v-deep .el-scrollbar__wrap {
  width: 100%;
}


</style>

