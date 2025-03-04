<script setup>
import {ref, reactive, onMounted} from "vue"
import http from "../../../utils/index.js";
import cons from "../../Apis/constant.js";
import {Check, Delete} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import router from "../../../router/index.js";

const percentage = ref('70')


const drawer = ref(false)
const search = ref('')
const userAvatar = ref('')
const userName = ref('')
const userSignature = ref('')
const recommendInfo = ref({
  id: '',
  avatar: '',
  name: '',
  signature: ''
})
const account_info = ref({
  name: '',
  avatar_url: '',
  intiamcy: '',
})
const stranger_moments_form = ref([
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
const showDrawer = (item) => {
  drawer.value = true
  http.get(cons.getStrangerProfile_apis, {
    params: {
      id: item.id
    }
  }).then((res) => {
    let info = res.data['user_info']
    account_info.value.id = info['id']
    account_info.value.name = info['name']
    account_info.value.avatar_url = info['avatar_url']
    account_info.value.email = info['email']
    account_info.value.signature = info['signature']
    account_info.value.profileBp = info['profileBp']
    account_info.value.follow = info['follow']
    account_info.value.following = info['following']
    let moments = res.data['strangerMomentsInfo']
    stranger_moments_form.value = moments.map((item) => {
      return {
        account_avatar: item.postAvatar,
        account_name: item.postName,
        moments_content: item.postContent,
      }
    })
  })
}
const searchMoments = () => {
  http.get(cons.searchMoments_apis, {
    params: {
      data: search.value
    }
  }).then((res) => {
    let searchMoments = JSON.stringify(res.data['data'])
    localStorage.setItem("searchMoments", searchMoments)
  })
  if (search.value) {
    router.push('/search_moments')
  }
}
onMounted(() => {
  let userInfo = JSON.parse(localStorage.getItem('user_info'))
  userAvatar.value = userInfo['avatar_url']
  userName.value = userInfo['name']
  userSignature.value = userInfo['signature']
  let allRecommendInfo = JSON.parse(localStorage.getItem('recommend_info')).data
  recommendInfo.value = allRecommendInfo.map((item) => {
    const obj = {
      id: item.id,
      avatar: item.avatar,
      name: item.name,
      signature: item.signature
    }
    return obj
  })

})
</script>

<template>
  <el-container style="height: 100%;width: 100%;flex-direction: column;background-color: whitesmoke">
    <el-row style="height: 60px;width: 100%;padding: 20px 20px 20px;">
      <el-text style="font-size: 15px;font-weight: bold">好友推荐</el-text>
    </el-row>
    <el-scrollbar style="height: 340px">
      <el-row style="height: 60px;width: 100%;" v-for="item in recommendInfo">
        <a href="#" class="recommend_a"
           @click="showDrawer(item)">
          <el-image style="width: 40px;height: 40px;border-radius: 10px;align-self: center;margin-left: 20px"
                    :src="item.avatar"></el-image>
          <el-container style="flex-direction: column;justify-content: center">
            <el-text
                style="font-size: 15px;font-weight: bold;align-self: flex-start;margin-left: 15px;color: black;margin-bottom: 5px">
              {{ item.name }}
            </el-text>
            <el-text
                style="font-size: 10px;font-weight: bold;align-self: flex-start;margin-left: 15px;width: 170px"
                truncated>
              {{ item.signature }}
            </el-text>
          </el-container>
        </a>
      </el-row>
    </el-scrollbar>
  </el-container>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" direction="ltr" style="z-index: 1">
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
            <el-container style="height: 125%;width: 100%;background-color: #D3D3D3">
              <el-image style="width: 100%;height: 250px"
                        :src=account_info.profileBp></el-image>
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
              <el-text style="font-weight: bolder;margin-left: 5px">{{ account_info.follow }}</el-text>
              <el-text style="margin-left: 10px;">粉丝:</el-text>
              <el-text style="font-weight: bolder;margin-left: 5px">{{ account_info.following }}</el-text>
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
            <a href="#" class="moments_a" v-for="(moments) in stranger_moments_form">
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
  </el-drawer>
</template>

<style scoped>


.inside {
  width: 100%;
  height: 100%;
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
  margin-left: 330px;
  margin-top: 10px;
}

.header_back_a:hover {
  background-color: rgb(215, 215, 216);
  transition: background-color 0.5s;
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


::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}


.share_icon a {
  display: flex;
  font-size: 25px;
  margin-right: 5px;
  margin-left: 5px;
}

.recommend_a {
  width: 100%;
  height: 100%;
  display: flex;
  text-decoration: none;
  border-radius: 10px
}

.recommend_a:hover {
  background-color: rgb(226, 227, 228);
  transition: 0.5s background-color;
}

</style>