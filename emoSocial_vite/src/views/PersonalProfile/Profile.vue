<script setup>
import {onMounted, ref} from "vue"
import http from "../../utils/index.js";
import cons from "../../components/Apis/constant.js";

let user_profile = ref(null)
const account_info = ref({
  name: '',
  avatar_url: '',
  signature: '',
  follow: '',
  following: '',
  email: '',
  profileBp: '',
})
let follow_num = ref('')
let fans_num = ref('')
let user_info = ref([
  {
    avatar: '',
    name: '',
    id: '',
  },
])
let fans_info = ref([
  {
    avatar: '',
    name: '',
    id: '',
  },
])
let moments_form = ref([
  {
    account_avatar: '',
    account_name: '',
    moments_content: '',
  },
])
onMounted(() => {
  // 从localStorage中获取用户信息
  http.get(cons.getFansInfo_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    follow_num.value = res.data['follow_num']
    fans_num.value = res.data['fans_num']
  })
  const storedUserProfile = localStorage.getItem('user_info')
  user_profile = JSON.parse(storedUserProfile)
  account_info.value.name = user_profile.name
  account_info.value.avatar_url = user_profile.avatar_url
  account_info.value.signature = user_profile.signature
  account_info.value.email = user_profile.email
  account_info.value.profileBp = user_profile.profileBp
  http.get(cons.getFollowInfo_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    user_info = res.data['user_info']
  })
  http.get(cons.getFollowingInfo_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    fans_info = res.data['fans_info']
  })
  http.get(cons.getPersonalMoments_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    let momentsInfo = res.data['data']
    moments_form.value = momentsInfo.map((item) => {
      const obj = {
        account_avatar: item.postAvatar,
        account_name: item.postName,
        moments_content: item.postContent,
      }
      return obj
    })
  })
})


</script>

<template>
  <el-container class="outside">
    <div class="inside">
      <el-header style="flex:0.3;">
        <div class="header_back">
          <el-text style="font-size: 25px;font-weight: bold">个人主页</el-text>
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
              <el-image style="width: 100%;height: 160px;"
                        :src=account_info.profileBp></el-image>
            </el-container>
            <el-container style="height: 40%;width: 100%;position: relative;">
              <el-container
                  style="height: 95px;width: 95px;background-color: white;position: absolute;bottom: 0;left: 10px;
                  border-radius: 50%"></el-container>
              <el-container
                  style="position: absolute;bottom: 3px;left: 13px;">
                <el-avatar :src="account_info.avatar_url"
                           style="height: 90px;width: 90px;border-radius: 50%"></el-avatar>
              </el-container>
            </el-container>
          </el-container>
          <el-container style="flex: 1;width: 100%;flex-direction: column;">
            <el-row class="account_info">
              <el-text style="font-weight: bolder;font-size: 20px;">{{ account_info.name }}</el-text>
              <el-text style="margin-left: 20px;">Email: {{ account_info.email }}</el-text>
            </el-row>
            <el-row class="account_info">
              <el-text>{{ account_info.signature }}</el-text>
            </el-row>
            <el-row class="account_info">
              <el-popover placement="bottom" :width="200" trigger="click">
                <template #reference>
                  <el-button>
                    <el-text style="font-weight: bolder;margin-right: 5px">关注的人</el-text>
                    <el-text style="font-weight: bolder">{{ follow_num }}</el-text>
                  </el-button>
                </template>
                <el-scrollbar height="200px">
                  <a href="#" class="fans_row" v-for="item in user_info">
                    <el-image :src=item.avatar
                              style="height: 50px;width: 50px;margin-left: 5px;border-radius: 5px"></el-image>
                    <el-text style="margin-left: auto;margin-right: 25px;font-size: 15px;font-weight: bold">
                      {{ item.name }}
                    </el-text>
                  </a>
                </el-scrollbar>
              </el-popover>
              <el-popover placement="bottom" :width="200" trigger="click">
                <template #reference>
                  <el-button>
                    <el-text style="font-weight: bolder;margin-right: 5px">粉丝</el-text>
                    <el-text style="font-weight: bolder">
                      {{ fans_num }}
                    </el-text>
                  </el-button>
                </template>
                <el-scrollbar height="200px">
                  <a href="#" class="fans_row" v-for="item in fans_info">
                    <el-image :src=item.avatar
                              style="height: 50px;width: 50px;margin-left: 5px;border-radius: 5px"></el-image>
                    <el-text style="margin-left: auto;margin-right: 25px;font-size: 15px;font-weight: bold">
                      {{ item.name }}
                    </el-text>
                    <!--                    <div style="height: 2px;width: 100%;background-color: rgb(214, 214, 214)"></div>-->
                  </a>
                </el-scrollbar>
              </el-popover>
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
        <el-row>
          <a href="/personal_moments" class="moments_a" v-for="(moments) in moments_form">
            <div
                style="height: 60px;width: 60px;display: flex;justify-content: center;flex-direction: column;margin-left: 20px;">
              <el-image :src=moments.account_avatar style="width: 70%;height: 70%"></el-image>
            </div>
            <el-container
                style="display: flex;flex-direction: column;padding-bottom: 10px;padding-top: 10px">
              <el-text style="font-size: 15px;font-weight: bolder;color: black;align-self: normal">
                {{ moments.account_name }}
                {{ moments.moments_postTime }}
              </el-text>
              <el-text style="font-size: 20px;font-weight: bolder;color: black;align-self: normal">
              </el-text>
              <el-text style="align-self: normal;margin-top: 3px">
                {{ moments.moments_content }}
              </el-text>
            </el-container>
          </a>
        </el-row>
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
  opacity: 0.9;
}

.inside {
  width: 65%;
  height: 90%;
  border: 1px solid rgb(239, 243, 244);
  display: flex;
  flex-direction: column;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */
  background-color: rgb(246, 246, 246);
}

.header_back {
  width: 100%;
  height: 60px;
  display: flex;
  font-size: 20px;
  color: black;
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

.fans_row {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 2px;
}

.fans_row:hover {
  background-color: rgb(215, 215, 216);
  transition: 0.3s background-color;
}
</style>

