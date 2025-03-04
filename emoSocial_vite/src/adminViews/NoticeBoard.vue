<script setup>
import {onMounted, ref} from "vue"
import {ElNotification} from 'element-plus'
import cons from "../components/Apis/constant.js";
import http from "/src/utils/index.js"

const noticeBoard_topic = ref('')
const noticeBoard_content = ref('')
const post_success = () => {
  // console.log(noticeBoard_topic.value)
  if (noticeBoard_topic.value === '') {
    ElNotification({
      title: '提醒',
      message: '标题不能为空!',
      type: 'error',
    })
  } else if (noticeBoard_content.value === '') {
    ElNotification({
      title: '提醒',
      message: '内容不能为空!',
      type: 'error',
    })
  } else {
    http.post(cons.postBoard_apis, {
      token: localStorage.getItem('token'),
      board: {
        'board_topic': noticeBoard_topic.value,
        'board_content': noticeBoard_content.value,
      }
    }).then((res) => {
      if (res.data['code'] === 'success') {
        ElNotification({
          title: '提醒',
          message: '发布成功',
          type: 'success',
        })
        noticeBoard_content.value = ''
        noticeBoard_topic.value = ''
      }
    })
  }
}

</script>

<template>
  <div style="height: 100%;width: 100%;padding: 50px;box-sizing: inherit">
    <el-container
        style="height: 100%;width: 100%;border-radius: 10px;padding: 30px;background-color: white;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2),0px 5px 10px rgba(0, 0, 0, 0.2);">
      <el-container
          style="height: 100%;width: 100%;border-radius: 10px;padding: 30px;flex-direction: column;background-color: white;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2),0px 5px 10px rgba(0, 0, 0, 0.2);">
        <el-row style="flex-direction: row">
          <el-text style="font-weight: bold;font-size: 25px;margin-bottom: 10px">公告标题</el-text>
          <el-input v-model="noticeBoard_topic"></el-input>
        </el-row>
        <el-row>
          <el-text style="font-weight: bold;margin-top: 10px;font-size: 25px">公告内容</el-text>
          <el-input
              v-model="noticeBoard_content"
              resize="none"
              style="margin-bottom: 10px;margin-top: 10px"
              :rows="16"
              type="textarea"
              placeholder="Please input"
          />
        </el-row>
        <el-row>
          <el-button @click="post_success" type="success" style="height: 50px;margin-left: auto">发布</el-button>
        </el-row>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>

</style>