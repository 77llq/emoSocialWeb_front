<script setup>
import {ref, reactive, onMounted} from "vue"
import http from "../../../utils/index.js";
import cons from "../../Apis/constant.js";
import {Check, Delete} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import router from "../../../router/index.js";
import IntimacyLines from "./IntimacyLines.vue";
import RecommendUsers from "./RecommendUsers.vue";

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
  let allRecommendInfo = JSON.parse(localStorage.getItem('friends_info'))
  recommendInfo.value = allRecommendInfo.map((item) => {
    const obj = {
      id: item.friend_id,
      avatar: item.friend_avatar,
      name: item.friend_name,
      signature: item.friend_signature,
      intimacy: item.intimacy
    }
    return obj
  })

})
</script>

<template>
  <el-container style="height: 100%;width: 100%;flex-direction: column;padding: 20px;background-color: whitesmoke">
    <el-row style="height: 120px;width: 100%;padding: 20px">
      <el-image style="width: 80px;height: 80px;border-radius: 10px" :src="userAvatar"></el-image>
      <el-container style="flex-direction: column;justify-content: center">
        <el-row>
          <el-text style="font-size: 25px;font-weight: bold;align-self: flex-start;margin-left: 20px;color: black">
            {{ userName }}
          </el-text>

        </el-row>
        <el-text
            style="font-size: 15px;font-weight: bold;margin-top: 10px;align-self: flex-start;margin-left: 20px;width: 170px"
            truncated>
          {{ userSignature }}
        </el-text>
      </el-container>
    </el-row>
    <el-row style="height: 40px;width: 100%;padding: 0 20px 0;justify-content: center;align-items: center">
      <input v-model="search"
             style="width: 80%;height: 40px;border:none;outline: none;background-color: rgb(220, 243, 244);border-radius: 10px"
             placeholder="Search..."/>
      <a href="#" @click="searchMoments"
         style="height: 30px;width: 30px;margin-left: 10px;text-decoration: none;color: black;font-size: 25px">
        <el-icon style="height: 100%;width: 100%">
          <Search/>
        </el-icon>
      </a>
    </el-row>
    <el-row
        style="height: 80px;width: 100%;padding: 0;justify-content: center;align-items: center;flex-direction: row;margin-top: 20px">
      <router-link to="" class="options">
        <el-text style="font-weight: bold;font-size: 16px">推荐用户</el-text>
      </router-link>
      <router-link to="" class="options">
        <el-text style="font-weight: bold;font-size: 16px">情感进度</el-text>
      </router-link>
    </el-row>
    <IntimacyLines></IntimacyLines>
    <!--    <RecommendUsers></RecommendUsers>-->
  </el-container>
</template>
<style scoped>

.demo-progress .el-progress--line {
  margin-left: 15px;
  max-width: 200px;
}

.options {
  background-color: red;
  display: flex;
  flex: 1;
  height: 70px;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(30px);
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 6px 6px 6px 0px;
  color: rgba(255, 255, 255, 0.75);
}

.options:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.2s;
}

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