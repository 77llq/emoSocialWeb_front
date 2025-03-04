<script setup>
import {ref} from "vue";

const checked1 = ref(true)
const receive_email = ref('')
const account_info = ref({
  account_name: '1771',
  account_email: '2785118462@qq.com',
  account_content: ''
})
</script>

<template>
  <el-container style="height: 100%;width: 100%;background-color: rgb(239,245,251);border-radius: 10px;">
    <el-header
        style="display: flex;flex:1;padding:10px;border-radius:10px 10px 0 0;background-color:rgb(193,217,243) ">
      <div style="padding-top: 10px">
        <el-text style="font-size: 30px;color: black;font-weight: bolder;">
          您好
        </el-text>
      </div>
    </el-header>
    <el-main style="display: flex;flex: 10;flex-direction: column;padding-top: 5px">
      <el-row style="color: red;flex-direction: row;align-items: center">
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
input {
  width: 80%;
  margin-left: 20px;
  outline: none;
  border: 1px solid black;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
}
</style>