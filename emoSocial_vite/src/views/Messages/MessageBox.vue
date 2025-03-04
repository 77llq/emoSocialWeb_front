<script setup>
import {ref, onMounted} from 'vue'

const input = ref('')
let avatar_url = ref('')
onMounted(() => {
  let user_info = localStorage.getItem('user_info')
  avatar_url.value = JSON.parse(user_info)['avatar_url']
  avatar_url = avatar_url.value
})
</script>

<template>
  <el-container style="width: 100%;height: 100%;padding: 20px 12px 12px">
    <el-container class="outside_container">
      <el-aside
          style="display: flex;flex: 1.1;background-color: rgb(46, 46, 46);border-top-left-radius: 3px;border-bottom-left-radius: 3px;
flex-direction: column;align-items: center;padding-top: 38px">
        <el-row style="height:34px;width: 34px;">
          <el-image :src=avatar_url></el-image>
        </el-row>
        <el-row style="margin-top: 26px">
          <router-link to="/contact_default">
            <el-icon class="icon_hover">
              <User/>
            </el-icon>
          </router-link>
        </el-row>
        <el-row style="margin-top: 17px">
          <router-link to="/message_default">
            <el-icon class="icon_hover">
              <ChatRound/>
            </el-icon>
          </router-link>
        </el-row>

      </el-aside>
      <el-container style="flex: 13.5">
        <router-view></router-view>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>

.outside_container {
  width: 100%;
  height: 90%;
  border-radius: 3px;
  opacity: 0.95;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.1), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.1); /* 下部阴影效果 */
}

.icon_hover {
  color: rgb(151, 151, 151);
  font-size: 22px
}

::v-deep .el-input__prefix-inner > :first-child.el-input__icon {
  margin-left: 6px;
}

::v-deep .el-input .el-input__inner::placeholder {
  font-size: 13px;
}

.icon_hover:hover {
  color: rgb(171, 171, 171);
}
</style>