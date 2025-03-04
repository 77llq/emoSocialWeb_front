<script setup>


import Menu from "./Menu.vue";
import RightSide from "./RightSide.vue";
import LeftSide from "./LeftSide/LeftSide.vue";
</script>

<template>
  <el-header style="height:70px;width: 100%;background-color: rgb(177, 220, 237)">
    <Menu></Menu>
  </el-header>
  <el-container style="height: 90%;width: 100%;background-color: rgb(228, 239, 255);
  background-image: url(/src/assets/login-visual-2.svg);background-repeat: no-repeat">
    <!--    菜单-->
    <el-aside
        style="flex: 1.1;height: 100%;overflow: hidden;width: auto;opacity: 0.9;margin-left: 30px">
      <LeftSide></LeftSide>
    </el-aside>
    <!--header及变化的main-->
    <el-container style="flex: 2;margin-left: 20px">
      <el-main style="padding: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!--右侧边栏-->
    <RightSide></RightSide>
  </el-container>
</template>

<style scoped>

::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.moments_content {
  width: 50%;
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid #EFF3F4;
}

.share_icon a {
  display: flex;
  font-size: 25px;
  margin-right: 5px;
  margin-left: 5px;
}

/deep/ .el-input .el-input__wrapper {
  background: none;
  box-shadow: none;
  padding: 0;
  font-size: 15px;
}

</style>