<script setup>
import {ref, onMounted} from 'vue'
import http from "../../utils/index.js";
import cons from "../Apis/constant.js";

const boardTopic = ref('')
const boardContent = ref('')
const postTime = ref('')
onMounted(() => {
  http.get(cons.getBoardContent,).then((res) => {
    boardTopic.value = res.data.data['boardTopic']
    boardContent.value = res.data.data['boardContent']
    postTime.value = res.data.data['postTime']
  })
})
const searchText = ref('')
const users = [
  {
    avatar: 'src/avatar/avatar2.jpg',
    username: '小明',
  },
  {
    avatar: 'src/avatar/avatar3.jpg',
    username: '小红',
  },
  {
    avatar: 'src/avatar/avatar4.jpg',
    username: '小李',
  },
]

</script>

<template>
  <el-aside style="flex: 1.3;padding-left: 20px;overflow: hidden">
    <el-container class="notice-wrapper ">
      <el-container class="blank">
        <el-row>
          <h1 style="font-family: inherit;font-weight: bolder;font-size: 30px;margin: 0 auto 0 0;">{{ boardTopic }}</h1>
        </el-row>
        <el-row style="margin-top: 10px">
          {{ boardContent }}
        </el-row>
        <el-row style="margin-top: auto;align-self: flex-end">
          {{ postTime }}
        </el-row>
      </el-container>
    </el-container>
  </el-aside>
</template>


<style scoped>

.notice-wrapper {
  width: 372px;
  margin-top: 30px;
  border-radius: 20px;
  flex-direction: column;
}

.blank {
  border: 2px solid rgb(214, 214, 214);
  width: 372px;
  height: 260px;
  border-radius: 20px;
  background-color: #F7F9F9;
  padding: 20px;
  flex-direction: column;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */
}

.click_confirm {
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 10px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.follow-wrapper {
  margin-top: 50px;
  width: 372px;
  height: 260px;
  border: 2px solid rgb(214, 214, 214);
  border-radius: 20px;
  flex-direction: column;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */
}

.follow-wrapper a:hover {
  background-color: rgb(243, 243, 243);
  transition: background-color 0.2s;
}

a {
  text-decoration: none;
  color: black;
}

.chat-link {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.normal_link {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
}
</style>