<script setup>
import {reactive, ref} from "vue";
import http from "../../utils/index.js";
import cons from "../Apis/constant.js";
import router from "../../router/index.js";
import {ElNotification} from 'element-plus'

const centerDialogVisible = ref(false)


const activeIndex = ref(null);
const menuItems = reactive([
  {icon: 'Orange', route: '/anonymity_moments',},
  {icon: 'ChatDotRound', route: '/contact',},
  {icon: 'Message', route: '/email_default',},
  {icon: 'User', route: '/profile',},
  {icon: 'EditPen', route: '/more'},
]);
const handleMouseOver = (index) => {
  activeIndex.value = index;
}
const handleMouseOut = () => {
  activeIndex.value = null
}
const getFriendsInfoRequest = () => {
  http.get(cons.getFriendsInfo_apis, {
    params: {token: localStorage.getItem('token')}
  }).then((res) => {
    localStorage.setItem('friends_info', JSON.stringify(res.data['friends_info']))
    localStorage.setItem('newFriends_request', res.data['newFriends_request'])
  })
}
const exit = () => {
  centerDialogVisible.value = false
  router.push('/login')
  // window.localStorage.clear();
  ElNotification({
    title: '提示',
    message: '退出成功！',
    type: 'success',
  })
}
</script>

<template>
  <el-row style="height: 100%;width: 100%;">
    <el-menu
        router
        style="border: none;display: flex;flex-direction: row;width: 100%;height: 100% ;align-items: center;justify-content: flex-end;
        background-color: rgb(177, 220, 237);">
      <a href="#" style="margin-right: auto">
        <el-image style="width: 160px;height: 50px" src="/src/assets/logo.png"></el-image>
      </a>
      <el-menu-item v-for="(item, index) in menuItems" :key="index" :class="{'active': activeIndex === index}"
                    @mouseout="handleMouseOut" @mouseover="handleMouseOver(index)">
        <router-link :to="item.route" @click="getFriendsInfoRequest">
          <el-icon :style="{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }">
            <component :is="item.icon"/>
          </el-icon>
        </router-link>
      </el-menu-item>
      <el-menu-item>
        <a href="#" @click="centerDialogVisible = true">
          <el-icon>
            <SwitchButton/>
          </el-icon>
        </a>
      </el-menu-item>
      <el-dialog
          v-model="centerDialogVisible"
          title="注销提醒"
          width="500"
          :show-close="false"
          align-center
      >
        <el-text style="font-size:25px">确定要退出本次登录吗？</el-text>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="exit">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-menu>
  </el-row>
</template>

<style scoped>

.el-menu-item {
  width: 45px;
  font-size: 17px;
  border-radius: 10px;
  height: 45px;
  margin-right: 5px;
  justify-content: center;
}

.el-menu-item .el-icon {
  font-size: 22px;
  margin-right: 0;
  width: 30px;
  transition: transform 0.2s ease-in-out;
}

.el-menu-item:hover .el-icon {
  width: 35px;
}

.el-menu-item:hover {
  background-color: rgb(243, 243, 243);
}

.active {
  font-weight: 600;
}

a {
  color: black;
  text-decoration: none;
}

</style>
