<script setup>

import {onMounted, ref} from "vue"
import http from "/src/utils/index.js";
import cons from "/src/components/Apis/constant.js";
import {ElNotification} from "element-plus";

const tableData = ref([
  {
    id: '',
    account: '',
    avatar: '',
    name: '',
    email: '',
    gender: '',
    birthday: '',
    isNumber: '',
  },
])
onMounted(() => {
  http.get(cons.getAllUsers_apis).then((res) => {
    let data = res.data['data']
    tableData.value = data.map((item) => {
      const obj = {
        avatar: item.avatar,
        birthday: item.birthday,
        email: item.email,
        gender: item.gender,
        account: item.account,
        id: item.id,
        name: item.name,
        idNumber: item.idNumber,
      }
      return obj
    })
  })
})
const handleClick = () => {
}
const delete_account = (id) => {
  http.delete(cons.deleteAccount_apis, {
    params: {
      id: id
    }
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElNotification({
        message: '删除成功!',
        type: 'success',
      })
    }
  })
}
</script>

<template>
  <div style="height: 100%;width: 100%;padding: 50px;box-sizing: inherit">
    <el-container
        style="height: 100%;width: 100%;border-radius: 10px;padding: 30px 30px 10px;background-color: white;
        box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.2);
flex-direction: column;align-items: center">
      <el-table :data="tableData" border height="100%"
                style="width: 100%;box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2), /* 上部阴影效果 */ 0px 5px 10px rgba(0, 0, 0, 0.2);"
                stripe>
        <el-table-column prop="avatar" width="80">
          <template #default="scope">
            <el-image :src="scope.row.avatar" style="width:50px;height:50px"/>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="用户id" width="180"/>
        <el-table-column prop="account" label="用户账号" width="120"/>
        <el-table-column prop="name" label="昵称" width="90"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="gender" label="性别" width="80"/>
        <el-table-column prop="idNumber" label="生日"/>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">

            <el-popconfirm confirm-button-text="是的"
                           cancel-button-text="暂不"
                           title="确定要删除本名用户吗?"
                           width="200"
                           @confirm="delete_account(scope.row.id)">
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="10" style="margin-top: 10px"/>
    </el-container>
  </div>
</template>

<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>