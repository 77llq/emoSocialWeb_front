<script setup>
import {onMounted, ref} from 'vue'
import OptionsButton from "./OptionsButton.vue";

const message_form = ref([])
let friends_info = ref(null)
onMounted(() => {
  const storedUserProfile = localStorage.getItem('friends_info')
  friends_info = JSON.parse(storedUserProfile)
  message_form.value = friends_info.map((item) => {
    const obj = {
      avatar: item.friend_avatar,
      name: item.friend_name,
      friendId: item.friend_id,
      link: '/message_content'
    }
    return obj
  })
})
</script>

<template>
  <el-aside style="display: flex;flex:3.5;background-color: rgb(245,245,245);flex-direction: column">
    <OptionsButton></OptionsButton>
    <el-main class="main">
      <el-scrollbar style="height: 100%">
        <router-link
            v-for="item in message_form"
            :to="{path:item.link,query:{data:JSON.stringify(item)}}"
            style="height: 65px; display: flex; align-items: center; padding-left: 10px; text-decoration: none;"
        >
          <el-row>
            <el-image :src="item.avatar" style="width: 40px; height: 40px;"></el-image>
            <el-container style="height: 40px;width: 100px; flex-direction: column;text-align: left">
              <el-text
                  style="color: black;margin-bottom: auto; margin-top: 10px">
                {{ item.name }}
              </el-text>
            </el-container>
          </el-row>
        </router-link>
      </el-scrollbar>

    </el-main>
  </el-aside>
  <el-main
      style="display: flex;flex: 10;padding: 0;background-color: rgb(245,245,245);
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

</style>