<script setup>
import {onRenderTriggered, onMounted, ref} from "vue"
import http from '/src/utils/index.js'
import cons from '/src/components/Apis/constant.js'
import {ElMessage} from "element-plus";
import {Check, Delete} from "@element-plus/icons-vue";

const drawer = ref(false)
let moments_form = ref([
  {
    momentId: '',
    postId: '',
    postAvatar: '',
    postName: '',
    postTime: '',
    postContent: '',
    commentInput: '',
    momentComment: [{
      commentName: '',
      commentContent: '',
    }],
    momentLike: '',
    momentPic: '',
    momentVideo: '',
  }
])
onMounted(() => {
  http.get(cons.getSquareMoments_apis).then((res) => {
    let momentsInfo = res.data['data']
    moments_form.value = momentsInfo.map((item) => {
      const obj = {
        momentId: item.momentId,
        postId: item.postId,
        postAvatar: item.postAvatar,
        postName: item.postName,
        postTime: item.postTime,
        postContent: item.postContent,
        momentComment: item.momentCommentInfo,
        momentLike: item.momentLike,
        momentPic: item.momentPic,
        momentVideo: item.momentVideo,
      }
      return obj
    })
  })
})
const comment = ref('')
const postComment = (item) => {
  const commentInfo = {
    'Token': localStorage.getItem('token'),
    'commentMomentId': item.momentId,
    'commentContent': item.commentInput,
  }
  if (item.commentInput !== undefined) {
    http.post(cons.commentMoments_apis, commentInfo).then((res) => {
      if (res.data['code'] === 'success') {
        ElMessage({
          message: '成功！',
          type: 'success'
        })
      }
    })
  } else {
    ElMessage.error("评论内容不能为空!")
  }
}
const momentLike = (item) => {
  http.post(cons.likeMoments_apis, {
    token: localStorage.getItem('token'),
    momentId: item.momentId
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '点赞成功!',
        type: 'success'
      })
    } else {
      ElMessage.error("取消点赞!")
    }
  })
}
const visible = ref(false)
const sendAddRequest = (item) => {
  http.post(cons.addFriendsById_apis,
      {
        token: localStorage.getItem('token'),
        postId: item
      }).then((res) => {
    if (res.data.code === 'repeat') {
      ElMessage.error('您已发送过好友请求!请勿重复发送')
    }
    if (res.data.code === 'self') {
      ElMessage.error('请勿添加自己为好友!')
    }
    if (res.data.code === 'already') {
      ElMessage.error('你们已经是好友了!')
    }
    if (res.data.code === 'success') {
      ElMessage({
        message: '已发送好友请求!',
        type: 'success',
      })
      AddNewFriends_dialogVisible.value = false
    }
  })
}
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
const stranger_moments_form = ref([
  {
    account_avatar: '',
    account_name: '',
    moments_content: '',
  }
])
const showDrawer = (item) => {
  drawer.value = true
  http.get(cons.getStrangerProfile_apis, {
    params: {
      id: item.postId
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
    console.log(moments)
    stranger_moments_form.value = moments.map((item) => {
      return {
        account_avatar: item.postAvatar,
        account_name: item.postName,
        moments_content: item.postContent,
      }
    })
  })
}
const follow_request = () => {
  console.log(account_info.value.id)
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
  <div
      style="width: 100%;justify-content: center;display: flex;flex-direction: column;align-items: center;"
      v-for="(item,index) in moments_form">
    <div class="moments_content">
      <el-row style="flex: 0.5">
        <el-container style="flex-grow: 1; align-items: center">
          <el-avatar :src=item.postAvatar></el-avatar>
          <el-container style="flex-grow: 1; margin-left: 10px;color: black;font-size: 15px;font-weight: bold">
            <!--            <router-link :to="{path:'friends_moments',query:{data:item.postId}}"-->
            <!--                         style="text-decoration: none;color: black">-->
            <a href="#" style="text-decoration: none;color: black" @click="showDrawer(item)">
              {{ item.postName }}
            </a>
            <!--            </router-link>-->
            <el-container style="margin-left: 10px;color: #737373 ">· {{ item.postTime }}</el-container>
          </el-container>
          <el-popconfirm title="想要添加Ta为好友吗?" width="200" @confirm="sendAddRequest(item.postId)">
            <template #reference>
              <a href="#" style="color: #737373;" @click="visible=true">
                <el-icon>
                  <MoreFilled/>
                </el-icon>
              </a>
            </template>
          </el-popconfirm>
        </el-container>
      </el-row>
      <el-row style="flex: 3;margin-top: 40px;">
        <el-text style="align-self: flex-start;font-size: 16px">{{ item.postContent }}</el-text>
      </el-row>
      <el-row v-if="item.momentPic" style="flex: 3;justify-content: center">
        <el-image style="height: 400px;width: 80%" :src="item.momentPic" fit="contain"></el-image>
      </el-row>
      <el-row v-if="item.momentVideo" style="flex: 3;justify-content: center;margin-top: 30px">
        <video style="height: 300px;width: 80%" :src="item.momentVideo" muted loop autoplay></video>
      </el-row>
      <el-row style="flex: 2;flex-direction: column;margin-top: 30px">
        <el-row class="share_icon">
          <a href="#" style="color: #737373;">
            <el-icon>
              <ChatRound/>
            </el-icon>
          </a>
          <a href="#" style="color: #737373;" @click="momentLike(item)">
            <el-icon>
              <Star/>
            </el-icon>
          </a>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-text style="font-weight: bold;color: black;">
            {{ item.momentLike }}次点赞
          </el-text>
        </el-row>
        <el-row style="margin-top: 5px;flex-direction: row;font-size: 15px;font-weight: bold"
                v-for="(item2) in item['momentComment']">
          <el-row style="margin-top: 5px;font-size: 10px">
            <el-text>{{ item2.commentName }}:</el-text>
          </el-row>
          <el-row style="margin-top: 5px;margin-left: 10px">
            <el-text>{{ item2.commentContent }}</el-text>
          </el-row>
        </el-row>
        <el-row style="height: 30px;margin-top: 5px">
          <el-input v-model="item.commentInput" placeholder="添加评论..." style="width: 100%;height: 100%">
          </el-input>
          <el-button style="position: absolute;right: 0" @click="postComment(item)">发布</el-button>
        </el-row>
      </el-row>
    </div>
  </div>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" direction="ltr">
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
              <el-image style="width: 100%;height: 350px"
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
  margin-left: 450px;
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

.moments_content {
  width: 450px;
  padding: 20px 20px 10px 20px;
  background-color: rgb(247, 249, 249);
  opacity: 0.9;
  border-top: 2px solid rgb(177, 220, 237);
}

.share_icon a {
  display: flex;
  font-size: 25px;
  margin-right: 5px;
  margin-left: 5px;
}

.momentsChange_route {
  width: 50%;
  height: 100%;
  text-decoration: none;
  text-align: center;
  display: flex;
  justify-content: center;
}

.momentsChange_route:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.2s;
}

</style>