<script setup>
import {ref, onBeforeUpdate, inject, onMounted, reactive, onUpdated, onBeforeMount, watch} from 'vue';
import {useRoute} from 'vue-router'

const route = useRoute()

const user_info = ref({
  avatar: 'src/avatar/avatar1.jpg',
  name: '1771',
  message_content: '明天一起去吃饭'
})
const goEasy = inject('GoEasy');
let messages = ref({});
let content = ref('');
let sendTo = ref(null)
let nowId = ref(null)
let onlyChannel = reactive(null)
let userName = ref('')
let chatName = ref('')


onMounted(() => {
  let allData = route.query.data
  allData = JSON.parse(allData)
  sendTo = allData.friendId
  chatName.value = allData.name
  let user_info = JSON.parse(localStorage.getItem('user_info'))
  nowId = user_info['id']
  userName.value = user_info['name']
  onlyChannel = (nowId + sendTo).split('').sort().join('')
  connectGoEasy()
  subscribe()
})
onBeforeUpdate(() => {
  let allData = route.query.data
  allData = JSON.parse(allData)
  sendTo = allData.friendId
  chatName.value = allData.name
  let user_info = JSON.parse(localStorage.getItem('user_info'))
  nowId = user_info['id']
  userName.value = user_info['name']
  onlyChannel = (nowId + sendTo).split('').sort().join('')
  connectGoEasy()
  subscribe()
})

function connectGoEasy() {
  goEasy.connect({
    onProgress: function (attempts) {
      console.log("GoEasy is connecting", attempts);
    },
    onSuccess: function () {
      unshiftMessage("连接成功")
      console.log("GoEasy connect successfully.")
    },
    onFailed: function (error) {
      unshiftMessage("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
    }
  });
}

// (订阅)接收消息
function subscribe() {
  goEasy.pubsub.subscribe({
    channel: onlyChannel,
    onMessage: function (message) {
      unshiftMessage(message.content, onlyChannel);
    },
    onSuccess: function () {
      unshiftMessage('订阅成功.');
    },
    onFailed: function (error) {
      console.log('接受失败')
      unshiftMessage("订阅失败，错误编码：" + error.code + " 错误信息：" + error.content);
    }
  });
}

//发送消息
function sendMessage() {
  if (content.value.trim() !== '') {
    goEasy.pubsub.publish({
      channel: onlyChannel,
      message: userName.value + "  " + content.value,
      onSuccess: function (message) {
        content.value = "";
      },
      onFailed: function (error) {
        unshiftMessage("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
      },
    });
  }
}

function unshiftMessage(content, onlyChannel = null) {
  let formattedTime = formatDate(new Date(), "hh:mm");
  let message = formattedTime + " " + content;
  if (onlyChannel !== null) {
    if (messages.value[onlyChannel]) {
      messages.value[onlyChannel].push(message)
    } else {
      messages.value[onlyChannel] = [message]
    }
  }
}

function formatDate(date) {
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return hours + ":" + minutes;
}
</script>

<template>
  <el-header style="border-bottom: 2px solid rgb(214, 214, 214);height: 60px;display: flex;justify-content: center;
      flex-direction: column;font-size: 20px;font-weight: bold">
    {{ userName }}和{{ chatName }}的聊天室
  </el-header>
  <el-main>
    <el-container v-for="(message, index) in messages" :key="index">
      <div v-if="index === onlyChannel">
        <div v-for="(item,index) in message" :key="index">
          <!--          <el-avatar}></el-avatar>-->
          {{ item }}
        </div>
      </div>
    </el-container>
  </el-main>
  <el-footer
      style="border-top: 2px solid rgb(214, 214, 214);height: 220px;padding:0;display: flex;flex-direction: column ">
    <el-container style="flex: 0.5;padding-left: 20px;padding-top: 10px;">
      <el-popover
          placement="top"
          title="Title"
          :width="200"
          trigger="click"
          content="this is content, this is content, this is content"
      >
        <template #reference>
          <a href="#" style="text-decoration: none;color: black">
            <el-icon style="font-size: 25px">
              <ElemeFilled/>
            </el-icon>
          </a>
        </template>
      </el-popover>
    </el-container>
    <el-container style="flex: 5;padding-left: 20px;padding-top: 5px">
      <textarea v-model="content"
                style="height: 100%;width: 100%; resize: none;border: none;background-color: rgb(245,245,245);outline: none;font-size: 30px;"></textarea>
    </el-container>
    <el-container style="flex-direction: column;justify-content: center">
      <button class="send_button" type="button" @click="sendMessage">
        发送
      </button>
    </el-container>
  </el-footer>
</template>

<style scoped>
/* 禁止 <textarea> 拉伸 */
::v-deep .el-textarea__inner {
  resize: none;
}

.send_button {
  border: none;
  color: rgb(7, 193, 96);
  border-radius: 5px;
  width: 80px;
  height: 30px;
  background-color: rgb(233, 233, 233);
  margin-left: auto;
  margin-right: 10px;
  cursor: pointer;
}

.send_button:hover {
  border: none;
  background-color: rgb(210, 210, 210);
  transition: background-color 0.2s;
}

</style>