<script setup>
import {onMounted, ref, onBeforeUpdate} from "vue"
import http from '/src/utils/index.js'
import cons from '/src/components/Apis/constant.js'
import {ElMessage} from "element-plus";
import {InfoFilled} from "@element-plus/icons-vue";

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
  let momentsInfo = JSON.parse(localStorage.getItem('searchMoments'))
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
const confirm_delete = (item) => {
  http.delete(cons.deleteMoments_apis, {
    params: {
      id: item.momentId
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
    }
  })
}

</script>

<template>
  <div style="width: 100%;justify-content: center;display: flex;flex-direction: column;align-items: center;"
       v-for="(item,index) in moments_form">
    <div class="moments_content">
      <el-row style="flex: 0.5">
        <el-container style="flex-grow: 1; align-items: center">
          <el-avatar :src=item.postAvatar></el-avatar>
          <el-container style="flex-grow: 1; margin-left: 10px;color: black;font-size: 15px;font-weight: bold">
            {{ item.postName }}
            <el-container style="margin-left: 10px;color: #737373 ">· {{ item.postTime }}</el-container>
          </el-container>
          <el-popconfirm
              width="150"
              confirm-button-text="是的"
              cancel-button-text="暂不"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="删除本条动态?"
              @confirm="confirm_delete(item)">
            <template #reference>
              <a href="#" style="color: #737373;" @click="open">
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
        <el-image style="height: 300px;width: 80%" :src="item.momentPic" fit="contain"></el-image>
      </el-row>
      <el-row v-if="item.momentVideo" style="flex: 3;justify-content: center">
        <video style="height: 500px;width: 80%;margin-top: 30px" :src="item.momentVideo" muted loop autoplay></video>
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
</template>


<style scoped>

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