<script setup>
import {Plus, Search} from "@element-plus/icons-vue";
import {onBeforeUpdate, ref} from "vue";
import {ElMessage} from "element-plus";
import http from "/src/utils/index.js"
import cons from "../../components/Apis/constant.js";

onBeforeUpdate(() => {
  http.get(cons.checkNewFriends_apis, {
    params: {token: localStorage.getItem('token')}
  }).then((res) => {
    data = res.data['request_info']
    FriendsApply_form.value = data.map((item, index) => {
      const formData = {
        apply_avatar: item.avatar,
        apply_name: item.name,
        apply_content: item.signature,
        apply_id: item.id
      };
      return formData
    })
  })
})

const input_content = ref()
let target_info = ref('')
const NewFriend_form = ref({
  apply_avatar: '',
  apply_name: '',
  apply_content: '',
})
const AddNewFriends_dialogVisible = ref(false)
const get_friend_profile = () => {
  http.get(cons.addNewFriend_apis, {
    params: {
      token: localStorage.getItem('token'),
      target_account: input_content.value
    }
  }).then((res) => {
    if (res.data.code === 'success') {
      AddNewFriends_dialogVisible.value = true
      target_info = res.data['target_info']
      NewFriend_form.value.apply_content = target_info.friend_signature
      NewFriend_form.value.apply_avatar = target_info.friend_avatar
      NewFriend_form.value.apply_name = target_info.friend_name
    } else {
      ElMessage.error('没有该用户!请核对后再输入账号')
    }
  })
}
const send_add_request = () => {
  http.post(cons.sendAddRequest_apis,
      {
        token: localStorage.getItem('token'),
        account: input_content.valuefriends_info
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


let data = []
const FriendsApply_form = ref([])
const NewFriends_dialogVisible = ref(false)
const CheckNewFriends = () => {
  NewFriends_dialogVisible.value = true
  http.get(cons.checkNewFriends_apis, {
    params: {token: localStorage.getItem('token')}
  }).then((res) => {
    data = res.data['request_info']
    FriendsApply_form.value = data.map((item, index) => {
      const formData = {
        apply_avatar: item.avatar,
        apply_name: item.name,
        apply_content: item.signature,
        apply_id: item.id
      };
      return formData
    })
  })
}
const accept_friend = (item) => {
  let apply_id = item.apply_id
  let token = localStorage.getItem('token')
  http.post(cons.acceptNewFriends_apis, {token: token, apply_id: apply_id})
  ElMessage({
    message: '恭喜!您新增了一位好友',
    type: 'success',
  })
  NewFriends_dialogVisible.value = false;
}
const reject_friend = (item) => {
  ElMessage.error('您拒绝了本次好友请求!')
  NewFriends_dialogVisible.value = false;
  let apply_id = item.apply_id
  let token = localStorage.getItem('token')
  http.delete(cons.rejectNewFriends_apis, {
    params: {
      token: token,
      apply_id: apply_id
    }
  })
}
let request_num = ref('')
request_num = localStorage.getItem('newFriends_request')

</script>

<template>
  <el-header class="header">
    <el-input
        v-model="input_content"
        class="search_input"
        placeholder="Search"
        :prefix-icon="Search"
    />
    <el-button class="add_button" @click="get_friend_profile" :icon="Plus"></el-button>

  </el-header>
  <el-dialog
      v-model="AddNewFriends_dialogVisible"
      title="添加新好友"
      width="500"
      style="overflow: hidden;padding: 0;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */"
  >
    <el-scrollbar height="300px">
      <el-row style="height: 70px;width: 100%;border-bottom: 2px solid rgb(231,231,231)">
        <a href="#" style="height: 100%;width: 100%;padding-left: 20px;display: flex;align-items: center">
          <el-image :src=NewFriend_form.apply_avatar style="width:50px;height: 50px;border-radius: 5px"></el-image>
          <el-container
              style="height: 50px; display: flex;flex-direction: column;justify-content: center;padding-left: 15px">
            <el-text
                style="align-self: auto;font-weight: bold;font-size: 17px;width: 100px;height: 23px;color: black"
                truncated>
              {{ NewFriend_form.apply_name }}
            </el-text>
            <el-text
                style="align-self: auto;font-size: 13px;width: 100px;height: 23px;margin-top: auto;color:rgb(136,136,136) "
                truncated>
              {{ NewFriend_form.apply_content }}
            </el-text>
          </el-container>
          <el-container style="flex-direction: row;justify-content: flex-end">
            <el-button style="height: 40px;width: 70px;margin-left: 10px;margin-right: 10px" type="success"
                       @click="send_add_request" :icon="Plus">
            </el-button>
          </el-container>
        </a>
      </el-row>
    </el-scrollbar>
  </el-dialog>
  <div
      style="background-color: rgb(229,228,228);border-bottom: 2px solid rgb(214,214,214);border-right:2px solid rgb(214,214,214);
        display: flex;flex-direction: column">
    <el-row style="margin-left: 10px;margin-top: 20px ">
      <el-text style="color:rgb(153,153,153);font-size: 12px">好友申请</el-text>
    </el-row>
    <a href="#" @click="CheckNewFriends"
       class="options_a">
      <el-badge :value="request_num" class="item" :show-zero="false"></el-badge>
      <el-row>
        <el-icon style="font-size: 30px;color: black">
          <User/>
        </el-icon>
        <el-text style="margin-left: 10px; color: black;font-size: 16px">新的好友</el-text>
      </el-row>

    </a>
    <el-dialog
        v-model="NewFriends_dialogVisible"
        title="好友申请"
        width="500"
        style="overflow: hidden;padding: 0;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */"
    >
      <el-scrollbar height="300px">
        <el-row style="height: 70px;width: 100%;">
          <a href="#"
             style="height: 100%;width: 100%;padding-left: 20px;display: flex;align-items: center;border-bottom: 2px solid rgb(231,231,231)"
             v-for="item in FriendsApply_form">
            <el-image :src=item.apply_avatar style="width:50px;height: 50px;border-radius: 5px"></el-image>
            <el-container
                style="height: 50px; display: flex;flex-direction: column;justify-content: center;padding-left: 15px">
              <el-text
                  style="align-self: auto;font-weight: bold;font-size: 17px;width: 100px;height: 23px;color: black"
                  truncated>
                {{ item.apply_name }}
              </el-text>
              <el-text
                  style="align-self: auto;font-size: 13px;width: 100px;height: 23px;margin-top: auto;color:rgb(136,136,136) "
                  truncated>
                {{ item.apply_content }}
              </el-text>
            </el-container>
            <el-container style="flex-direction: row;justify-content: flex-end">
              <el-button style="height: 40px;width: 70px" type="success" @click="accept_friend(item)">接受
              </el-button>
              <el-button style="height: 40px;width: 70px;margin-left: 10px;margin-right: 10px" type="danger"
                         @click="reject_friend(item)">拒绝
              </el-button>
            </el-container>
          </a>
        </el-row>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style scoped>
.item {
  position: absolute;
  top: -10px;
  right: 0;
}

a {
  text-decoration: none;
}

a:hover {
  background-color: rgb(215, 215, 216);
  transition: background-color 0.2s;
}

.header {
  border-bottom: 2px solid rgb(214, 214, 214);
  border-right: 2px solid rgb(214, 214, 214);
  height: 60px;
  display: flex;
  flex-direction: row;
  padding: 0;
}

.search_input {
  width: 70%;
  height: 25px;
  margin-top: 20px;
  margin-left: 10px;
  border: 1px solid rgb(221, 220, 219);
  border-radius: 3px;
  background-color: rgb(226, 226, 226)
}

.add_button {
  margin-top: 20px;
  margin-right: 10px;
  margin-left: 10px;
  height: 25px;
  width: 25px;
  background-color: rgb(226, 226, 226);
}

.options_a {
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  text-decoration: none;
  position: relative;
}

::v-deep .el-dialog__body {
  padding: 0;
  margin-top: 50px;
}
</style>