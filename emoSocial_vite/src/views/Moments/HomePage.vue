<script setup>
import {onMounted, ref, onBeforeUpdate} from "vue"
import http from '/src/utils/index.js'
import cons from '/src/components/Apis/constant.js'
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

const uploadRef = ref()
const videoUploadRef = ref()
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'

const imageUrl = ref('')
const videoUrl = ref('')
onMounted(() => {
  let user_info = localStorage.getItem('user_info')
  user_info = JSON.parse(user_info)
  user.value.avatar = user_info['avatar_url']
})
const user = ref({
  avatar: '',
})
const moment_info = ref({
  token: '',
  post_time: '',
  post_content: '',
  post_pic: '',
  post_video: '',
})
const comment = ref('')
const visible = ref(false)
const handleRemove = () => {
  console.log()
}
const handlePreview = () => {
  console.log()
}
const post_success = () => {
  if (imageUrl.value) {
    uploadRef.value.submit()
  }
  if (videoUrl.value) {
    videoUploadRef.value.submit()
  }
  moment_info.value.token = localStorage.getItem('token')
  http.post(cons.postMoment_apis, {data: moment_info}).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '发布成功！',
        type: 'success',
      })
      moment_info.value.post_content = ''
    }
    if (res.data['code'] === 'sensitive') {
      ElMessage.error("存在敏感词！请重新编辑")
    }
  })
}
const handlePicSuccess = (res) => {
  // 规定新的imageUrl为 <"http://127.0.0.1:8000/media/user/"+文件名>
  moment_info.value.token = localStorage.getItem('token')
  imageUrl.value = "http://127.0.0.1:8000/moments/" + res.file;
  moment_info.value.post_pic = imageUrl.value
}
const beforePicUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 200;
  if (!isLt10M) {
    console.log('上传头像图片大小不能超过 200MB!');
  }
  return isLt10M;
}
const handleVideoSuccess = (res) => {
  moment_info.value.token = localStorage.getItem('token')
  videoUrl.value = "http://127.0.0.1:8000/videos/" + res.file;
  moment_info.value.post_video = videoUrl.value
}
const beforeVideoUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 200;
  if (!isLt10M) {
    console.log('上传头像图片大小不能超过 200MB!');
  }
  return isLt10M;
}
</script>


<template>
  <div style="justify-content: center;display: flex;flex-direction: column;align-items: center;">
    <el-container style="height: 230px;width: 490px;position: absolute;top: 70px;">
      <router-link to="/anonymity_moments" class="momentsChange_route" style="border-right: none">
        <el-text style="font-weight: bold">Square</el-text>
      </router-link>
      <router-link to="/following_moments" class="momentsChange_route" style="border-left: none">
        <el-text style="font-weight: bold">Following</el-text>
      </router-link>
    </el-container>
    <div class="moments_edit">
      <el-container style="flex-direction: column;height: 100%;width: 100%">
        <el-row style="flex:3;padding: 15px 20px 0;">
          <el-avatar :src=user.avatar></el-avatar>
          <el-container style="margin-left: 20px;flex-direction: column">
            <el-container style="flex: 3;">
              <textarea v-model="moment_info.post_content"
                        style="resize: none;width: 100%;outline: none;font-size: 20px;border: none;"
                        placeholder="What is happening?!"></textarea>
            </el-container>
            <!--            <el-container style="height: 300px;width: 100%;background-color: red"></el-container>-->
            <el-container style="flex: 1;justify-content: flex-start;padding-top: 10px;padding-bottom: 10px">
              <el-container style="align-items: center">
                <V3Emoji
                    :recent="true"
                    style="width: 25px;display: flex;margin-top: 10px"
                    fix-pos="upright"
                />
                <el-upload
                    ref="uploadRef"
                    :action=cons.uploadMomentsPic_apis
                    :auto-upload="true"
                    style="border: none;margin-top: 5px"
                    :on-success="handlePicSuccess"
                    :before-upload="beforePicUpload"
                    :limit="1"
                >
                  <el-icon style="font-size: 23px;margin-left: 10px">
                    <PictureRounded/>
                  </el-icon>
                </el-upload>
                <el-upload
                    ref="videoUploadRef"
                    class="upload-demo"
                    :action=cons.uploadMomentsVideo_apis
                    :auto-upload="true"
                    style="border: none;margin-top: -5px"
                    :show-file-list="false"
                    :on-success="handleVideoSuccess"
                    :before-upload="beforeVideoUpload"
                    :limit="1"
                >
                  <el-icon style="font-size: 23px;margin-left: 10px">
                    <VideoPlay/>
                  </el-icon>
                </el-upload>
              </el-container>
              <el-button :plain="true" @click="post_success" type="success">Post</el-button>
            </el-container>
          </el-container>
        </el-row>
      </el-container>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>

::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.moments_edit {
  height: 230px;
  width: 490px;
  margin-top: 51px;
  background-color: rgb(239, 247, 248);
  opacity: 0.8;
}

.share_icon a {
  display: flex;
  font-size: 25px;
  margin-right: 5px;
  margin-left: 5px;
}

.momentsChange_route {
  width: 50%;
  height: 50px;
  text-decoration: none;
  text-align: center;
  display: flex;
  justify-content: center;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(30px);
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 6px 6px 6px 0px;
  color: rgba(255, 255, 255, 0.75);
}

.momentsChange_route:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.2s;
}

</style>