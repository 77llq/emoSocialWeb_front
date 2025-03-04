<script setup>
import {onBeforeMount, onMounted, ref} from "vue";
import OptionsButton from "./OptionsButton.vue";
import {Delete, InfoFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import cons from "../../components/Apis/constant.js";
import http from "/src/utils/index.js";

const contacts_form = ref([
  {
    avatar: '',
    birthday: '',
    email: '',
    follow: '',
    following: '',
    gender: '',
    id: '',
    name: '',
    signature: '',
    profileBp: '',
    link: '',
  },
])
let friends_info = ref(null)
onBeforeMount(() => {
  const storedUserProfile = localStorage.getItem('friends_info')
  friends_info = JSON.parse(storedUserProfile)
  contacts_form.value = friends_info.map((item) => {
    return {
      avatar: item.friend_avatar,
      birthday: item.friend_birthday,
      email: item.friend_email,
      follow: item.friend_follow,
      following: item.friend_following,
      gender: item.friend_gender,
      id: item.friend_id,
      name: item.friend_name,
      signature: item.friend_signature,
      profileBp: item.friend_profileBp,
      link: '/contact_info',
    }
  })
})
const confirm_delete = (item) => {
  let delete_id = item.id
  let token = localStorage.getItem('token')
  http.delete(cons.deleteFriends_apis, {
    params: {
      delete_id: delete_id,
      token: token
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '删除成功!',
        type: 'success',
      })
    }
  })
}

</script>

<template>
  <el-aside style="display: flex;flex:3.5;background-color: rgb(245,245,245);flex-direction: column">
    <OptionsButton></OptionsButton>
    <el-main class="main">
      <el-scrollbar style="height: 100%;">
        <router-link
            v-for="item in contacts_form"
            :to="{path:item.link,query:{data:JSON.stringify(item)}}"
            style="height: 55px; display: flex; align-items: center; padding-left: 10px; text-decoration: none;">
          <el-image :src="item.avatar" style="width: 35px; height: 35px;"></el-image>
          <el-text style="margin-left: 10px; color: black;">{{ item.name }}</el-text>
          <el-popconfirm
              width="200"
              confirm-button-text="是的"
              cancel-button-text="再考虑一下"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="确定要删除这位好友吗?"
              @confirm="confirm_delete(item)"
          >
            <template #reference>
              <a class="delete_button">
                <el-icon>
                  <Delete></Delete>
                </el-icon>
              </a>
            </template>
          </el-popconfirm>

        </router-link>
      </el-scrollbar>
    </el-main>
  </el-aside>
  <el-main style="display: flex;flex: 10;padding: 0;background-color: rgb(245,245,245);
          border-top-right-radius: 3px;border-bottom-right-radius: 3px;flex-direction: column">
    <router-view></router-view>
  </el-main>
</template>

<style scoped>
a:hover {
  background-color: rgb(215, 215, 216);
  transition: background-color 0.2s;
}

.main {
  border-right: 2px solid rgb(214, 214, 214);
  background-color: rgb(229, 228, 228);
  padding: 0;
}

.delete_button {
  border: none;
  background-color: rgb(229, 228, 228);
  margin-left: auto;
  margin-right: 5px;
  display: flex;
  color: black;
  font-size: 13px;
}


</style>