<script setup>
import {ref, reactive} from "vue"
import {MoreFilled} from "@element-plus/icons-vue";
import {v4 as uuidv4} from "uuid";
import http from "../../utils/index.js";
import cons from "../Apis/constant.js";
import {ElDatePicker, ElMessage} from "element-plus";

const uuid = uuidv4()
// 新增用户
const dialogFormVisible = ref(false)
const activeIndex = ref(null);
const formLabelWidth = '120px'
const form = reactive({
  id: '',
  account: '',
  password: '',
  idNumber: '',
  name: '',
  email: '',
  gender: '',
  birthday: '',
})
const options = [
  {
    value: '男',
    label: '男',
  },
  {
    value: '女',
    label: '女',
  },

]
const addNewAdmin = () => {
  dialogFormVisible.value = true
}
const cancelAdd = () => {
  dialogFormVisible.value = false
  form.account = ''
  form.password = ''
  form.idNumber = ''
  form.name = ''
  form.email = ''
  form.gender = ''
  form.birthday = ''
}
const confirmAdd = () => {
  // dialogFormVisible.value = false
  form.id = uuidv4()
  http.post(cons.createAdminAccount_apis, {
    dataForm: form,
  }).then((res) => {
    if (res.data['code'] === 'success') {
      ElMessage({
        message: '创建成功!',
        type: 'success'
      })
      form.account = ''
      form.password = ''
      form.idNumber = ''
      form.name = ''
      form.email = ''
      form.gender = ''
      form.birthday = ''
      dialogFormVisible.value = false
    }
    if (res.data['code'] === 'already') {
      ElMessage({
        message: '账号重复!',
        type: 'error'
      })
    }
    if (res.data['code'] === 'error') {
      ElMessage({
        message: '格式有误!',
        type: 'error'
      })
    }
  })

}
///

const menuItems = ref([
  {label: '用户管理', icon: 'User', route: '/users_manage', clickEvent: ''},
  {label: '动态管理', icon: 'Film', route: '/moments_manage', clickEvent: ''},
  {label: '公告管理', icon: 'Service', route: '/notice_board', clickEvent: ''},
  {label: '资料管理', icon: 'Postcard', route: '/edit_profile', clickEvent: ''},
  {label: '新增用户', icon: 'Plus', route: '#', clickEvent: addNewAdmin},
]);


function handleMouseOver(index) {
  activeIndex.value = index;
}

function handleMouseOut() {
  activeIndex.value = null;
}


</script>

<template>
  <el-container style="height: 100%;width: 100%">
    <!--    菜单-->
    <el-aside style="border-right:1px solid #EFF3F4;overflow: hidden;height: 100%;width: 20%;">
      <el-row style="float: right;height: 100%;width: 100%;">
        <el-menu router
                 style="border: none;display: flex;flex-direction: column;width: 100%;height: 100% ;align-items: center;">
          <a href="" style="display: block;margin-top: 50px;">
            <el-image src="src/assets/logo.png" style="width: 70%;margin-left: 40px"></el-image>
          </a>
          <el-menu-item v-for="(item, index) in menuItems" :key="index" :class="{'active': activeIndex === index}"
                        @mouseout="handleMouseOut" @mouseover="handleMouseOver(index)">

            <router-link :to="item.route" @click=item.clickEvent>
              <el-icon :style="{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }">
                <component :is="item.icon"/>
              </el-icon>
              <span
                  :style="{transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)','font-weight': activeIndex === index ? '600' : '400'}">
      {{ item.label }}
      </span>
            </router-link>
          </el-menu-item>
          <el-dialog v-model="dialogFormVisible" title="新增管理员用户" width="500">
            <el-form :model="form">
              <el-form-item label="管理员账号" :label-width="formLabelWidth">
                <el-input v-model="form.account" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="管理员密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" autocomplete="off" show-password type="password"/>
              </el-form-item>
              <el-form-item label="管理员身份号" :label-width="formLabelWidth">
                <el-input v-model="form.idNumber" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="昵称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-select v-model="form.gender">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="生日" :label-width="formLabelWidth">
                <el-date-picker v-model="form.birthday" :editable="false"
                                format="YYYY/MM/DD"
                                value-format="YYYY-MM-DD"
                                label="生日" placeholder="生日"
                                style="width:500px;"></el-date-picker>
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click=cancelAdd>取消</el-button>
                <el-button type="primary" @click=confirmAdd>
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-menu>
      </el-row>
    </el-aside>
    <!--header及变化的main-->
    <el-container style="flex: 2">
      <el-main style="padding: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style scoped>

.el-menu-item {
  margin-bottom: 20px;
  width: 90%;
  font-size: 17px;
  border-radius: 10px;
  height: 50px;
}

.el-menu-item .el-icon {
  font-size: 25px;
  width: 30px;
  padding-right: 20px;
  transition: transform 0.2s ease-in-out;
}

.el-menu-item:hover .el-icon {
  width: 35px;
}


.el-menu-item:hover {
  background-color: rgb(243, 243, 243);
}

.el-menu-item:first-of-type {
  margin-top: 50px;
}

.active {
  font-weight: 600;
}

a {
  color: black;
  text-decoration: none;
}

</style>
