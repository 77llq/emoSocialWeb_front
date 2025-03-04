<script setup>
import {ElDatePicker, ElInput, ElMessage, ElSelect, ElText} from 'element-plus';
import {reactive, ref} from "vue";
import cons from "../../components/Apis/constant.js";
import {v4 as uuidv4} from 'uuid';
import http from "../../utils/index.js";
import router from "../../router/index.js";

const uuid = uuidv4()

//注册逻辑
let buttonText = ref('下一步')
let Account_FormVisible = ref(true)
let Profile_FormVisible = ref(false)
let dialogVisible = ref(false)
const register_ruleFormRef = ref()
const register_DataForm = reactive({
  id: '',
  account: '',
  password: '',
  idNumber: '',
  name: '',
  email: '',
  gender: '',
  birthday: '',
})
const CheckAccount = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9]{6,12}$/
  if (!value.match(reg)) {
    callback(new Error('用户名格式为: 6到12位(字母,数字)'))
  } else {
    callback()
  }
}
const CheckPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== register_DataForm.password) {
    callback(new Error('两次输入密码不一致！'));
  } else {
    callback();
  }
};
const register_handleButtonClick = (register_ruleFormRef) => {
  // 开始校验
  if (buttonText.value === '下一步') {
    register_ruleFormRef.validateField(['account', 'password', 'confirm_password', 'type'], valid => {
      if (valid) {
        register_DataForm.id = uuidv4()
        http.post(cons.checkAccount_apis, register_DataForm).then((res) => {
          if (res.data === "success") {
            Account_FormVisible.value = false;
            Profile_FormVisible.value = true;
            buttonText.value = '完成';
          } else {
            ElMessage.error('账号已存在!')
          }
        })
      } else {
        console.log('error')
      }
    })
  } else {

    http.post(cons.register_apis, register_DataForm).then((res) => {
      if (res.data === "success") {
        ElMessage({
          message: '恭喜您!创建成功',
          type: 'success',
        })
        buttonText.value = '下一步'
        dialogVisible.value = false
        Account_FormVisible.value = true
        Profile_FormVisible.value = false
      } else {
        ElMessage.error('创建失败!')
        buttonText.value = '下一步'
        dialogVisible.value = false
        Account_FormVisible.value = true
        Profile_FormVisible.value = false
      }
    })
    register_ruleFormRef.resetFields()
    //  提交数据

  }
}
const register_rules = ref({
  account: [
    {
      required: true,
      message: '请填入用户名',
      trigger: 'blur'
    },
    {
      //用户名正则: 6到12位(数字,字母大小写)
      validator: CheckAccount,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      //密码正则: 至少8-16个字符(至少1个大写字母,1个小写字母和1个数字,其他可以是任意字符)
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: '密码格式为: 8-16个字符(至少1个大写字母,1个小写字母和1个数字)',
      trigger: 'blur'
    }
  ],
  confirm_password: [
    {
      required: true,
      validator: CheckPassword,
      trigger: 'blur'
    }
  ],
  idNumber: [
    {
      required: true,
      message: '请输入身份证号',
    },
    // {
    //   pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    //   message: '请输入正确的身份证号格式',
    //   trigger: 'blur'
    // }
  ],
  name: [
    {
      required: true,
      message: '请填入您的昵称',
      trigger: 'blur'
    },
  ],
  email: [
    {
      required: true,
      message: '请填入邮箱号',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '请输入正确的邮箱格式',
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择您的性别',
      trigger: 'blur'
    },
  ],
  birthday: [
    {
      required: true,
      message: '请填入您的生日',
      trigger: 'blur'
    },
  ],
})


//找回密码
let checkCodeBtn = reactive({
  text: '获取验证码',
  loading: false,
  disabled: false,
  duration: 10,
  timer: null
})
let Retrieve_dialogVisible = ref(false)
let random_code = ref('')
const retrieve_ruleFormRef = ref()
const retrieve_DataForm = reactive({
  retrieve_account: '',
  retrieve_password: '',
  retrieve_password_confirm: '',
  retrieve_confirm_code: '',
})
const CheckRetrievePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== retrieve_DataForm.retrieve_password) {
    callback(new Error('两次输入密码不一致！'));
  } else {
    callback();
  }
};
const retrieve_rules = ref({
  retrieve_account: [
    {
      required: true,
      message: '请填入用户名',
      trigger: 'blur'
    },
  ],
  retrieve_password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      //密码正则: 至少8-16个字符(至少1个大写字母,1个小写字母和1个数字,其他可以是任意字符)
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: '密码格式为: 8-16个字符(至少1个大写字母,1个小写字母和1个数字)',
      trigger: 'blur'
    }
  ],
  retrieve_password_confirm: [
    {
      required: true,
      validator: CheckRetrievePassword,
      trigger: 'blur'
    }
  ],
  retrieve_confirm_code: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入验证码'
    }
  ],
})
const getCheckCode = () => {
  // 倒计时期间按钮不能单击
  checkCodeBtn.disabled = true
  // 清除掉定时器
  checkCodeBtn.timer && clearInterval(checkCodeBtn.timer)
  // 开启定时器
  checkCodeBtn.timer = setInterval(() => {
    const tmp = checkCodeBtn.duration--
    checkCodeBtn.text = `${tmp}秒`
    if (tmp <= 0) {
      clearInterval(checkCodeBtn.timer)
      checkCodeBtn.duration = 10
      checkCodeBtn.text = '重新获取'
      checkCodeBtn.disabled = false
    }
  }, 1000)
  http.post(cons.retrieveAccount_apis, retrieve_DataForm)
}
const retrieve_handleButtonClick = (retrieve_ruleFormRef) => {
  retrieve_ruleFormRef.validate(valid => {
    if (valid) {
      http.put(cons.retrieveAccount_apis, retrieve_DataForm).then((res) => {
        if (res.data === 'success') {
          ElMessage({
            message: '修改成功!',
            type: 'success',
          })
          Retrieve_dialogVisible.value = false;
          retrieve_ruleFormRef.resetFields()
        } else {
          ElMessage.error('验证码有误!')
        }
      })
      //  提交数据
    } else {
      console.log('error!')
    }
  })
}


//登录逻辑
let login_dialogVisible = ref(false)
let user_profile = ref('')
const login_ruleFormRef = ref()
const login_Form = reactive({
  account: '',
  password: '',
})
const getProfileRequest = () => {
  console.log(localStorage.getItem('user_info'))
  http.get(cons.getProfile_apis, {
    params: {token: localStorage.getItem('token')}
  }).then((res) => {
    localStorage.setItem('user_info', JSON.stringify(res.data))
  })
  console.log(localStorage.getItem('user_info'))
}
const getRecommendRequest = () => {
  http.get(cons.getRecommendUsers_apis, {
    params: {
      token: localStorage.getItem('token')
    }
  }).then((res) => {
    localStorage.setItem('recommend_info', JSON.stringify(res.data))
  })
}
const login_handleButtonClick = (login_ruleFormRef) => {
  http.post(cons.login_apis, login_Form).then((res) => {
    if (res.data.mes === 'NoAccount') {
      ElMessage.error('无此账号! 请核对后再输入')
    }
    if (res.data.mes === 'InputError') {
      ElMessage.error('请输入完整信息!')
    }
    if (res.data.mes === 'WrongPassword') {
      ElMessage.error('密码有误! 请核对后再输入')
    }
    if (res.data.mes === 'LoginSuccess') {
      ElMessage({
        message: '登录成功!',
        type: 'success',
      })
      localStorage.setItem("token", res.data.access_token)
      localStorage.setItem("userType", res.data.type)
      getProfileRequest()
      getRecommendRequest()
      login_ruleFormRef.resetFields()
      login_dialogVisible.value = false
      if (res.data.type === '普通用户') {
        router.push('/default_moments')
      } else {
        router.push('/users_manage')
      }
    }
  })
}
</script>

<template>
  <video class="videoElement" muted loop autoplay
         disablepictureinpicture>
    <source src="/src/assets/login_bp_video.mp4" type="video/mp4">
  </video>
  <el-container class="outer">
    <el-container class="outer">

      <!--      左侧logo部分-->
      <el-aside style="display: flex;align-items: center;justify-content: center" width="55%">
        <!--        <el-image id="login_logo" src="src/assets/logo.png"></el-image>-->
      </el-aside>
      <!--右侧主体部分-->
      <el-aside style="display: flex;align-items: center;justify-content: center" width="45%">
        <el-main style="padding: 30px" type="flex">
          <!--        右侧主体部分上半部分-->
          <!--        第一行row: 正发生-->
          <el-row style="height: 37%;color: white">
            <h1 style="bottom: 70px;font-size: 75px;margin: 0">正发生</h1>
          </el-row>
          <!--          右侧主体部分下半部分-->
          <el-row style="height: 60%;flex-direction: column">
            <!--        第二行row: 注册部分-->
            <el-row style="height: 60%;flex-direction: column">
              <el-row>
                <h1 style="font-size: 35px;margin: 0;display: flex;color: white">现在就加入。</h1>
              </el-row>
              <!--            注册功能-->
              <el-row>
                <el-button id="login_button"
                           :style="{fontWeight:'bold',fontSize: '17px',color: 'black',backgroundColor:white,}"
                           @click="dialogVisible=true">
                  创建账号
                </el-button>
                <el-dialog v-if="dialogVisible" v-model="dialogVisible" :show-close="false"
                           style="height: 710px; border-radius: 20px" width="670"
                >
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="margin-top: 50px; justify-content: center;">
                    <el-form ref="register_ruleFormRef" :model="register_DataForm" :rules="register_rules">
                      <div v-show="Account_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            创建你的账号</h1>
                        </el-form-item>
                        <el-form-item prop="account">
                          <el-input v-model="register_DataForm.account" label="用户名"
                                    placeholder="账号"></el-input>

                        </el-form-item>
                        <el-form-item prop="password">

                          <el-input v-model="register_DataForm.password" label="密码" placeholder="密码"
                                    show-password type="password"></el-input>

                        </el-form-item>
                        <el-form-item prop="confirm_password">
                          <el-input v-model="register_DataForm.confirm_password" label="确认密码" placeholder="确认密码"
                                    show-password type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="idNumber">
                          <el-input v-model="register_DataForm.idNumber" label="身份证号"
                                    placeholder="身份证号"></el-input>
                        </el-form-item>
                      </div>
                      <div v-show="Profile_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            创建你的账号</h1>
                        </el-form-item>
                        <el-form-item prop="name">
                          <el-input v-model="register_DataForm.name" label="昵称" placeholder="昵称"></el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                          <el-input v-model="register_DataForm.email" label="邮箱" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item prop="birthday">
                          <el-date-picker v-model="register_DataForm.birthday" :editable="false"
                                          format="YYYY/MM/DD"
                                          value-format="YYYY-MM-DD"
                                          label="生日" placeholder="生日"
                                          style="width:500px;height: 50px"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="gender">
                          <el-select v-model="register_DataForm.gender" placeholder="性别">
                            <el-option value="男"></el-option>
                            <el-option value="女"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-form>

                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="register_handleButtonClick(register_ruleFormRef)">
                        {{ buttonText }}
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>
              </el-row>
              <!--            忘记密码-->
              <el-row>
                <el-button id="login_button" style="font-weight: bolder;color: black;font-size: 17px"
                           @click="Retrieve_dialogVisible=true">
                  忘记密码
                </el-button>
                <el-dialog v-if="Retrieve_dialogVisible" v-model="Retrieve_dialogVisible" :show-close="false"
                           style="height: 710px; border-radius: 20px" width="670"
                >
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="Retrieve_dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="margin-top: 50px; justify-content: center;">
                    <el-form ref="retrieve_ruleFormRef" :model="retrieve_DataForm" :rules="retrieve_rules">
                      <div v-show="Retrieve_dialogVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-bottom: 30px;margin-top: 40px;color: black">
                            找回你的账号</h1>
                        </el-form-item>
                        <el-form-item prop="retrieve_account">
                          <el-input v-model="retrieve_DataForm.retrieve_account" label="用户名"
                                    placeholder="账号"></el-input>
                        </el-form-item>
                        <el-form-item prop="retrieve_confirm_code" style="display: flex;flex-direction: column">
                          <el-input v-model="retrieve_DataForm.retrieve_confirm_code" label="验证码"
                                    placeholder="验证码将发送至您注册时绑定的邮箱" style="width: 78%">
                          </el-input>
                          <el-button style="margin-left: 7px;height: 50px;width: 103px" @click="getCheckCode"
                                     :disabled="checkCodeBtn.disabled" :loading="checkCodeBtn.loading">
                            {{ checkCodeBtn.text }}
                          </el-button>
                        </el-form-item>
                        <el-form-item prop="retrieve_password">
                          <el-input v-model="retrieve_DataForm.retrieve_password" label="新密码"
                                    placeholder="新密码"
                                    show-password type="password"></el-input>
                        </el-form-item>
                        <el-form-item prop="retrieve_password_confirm">
                          <el-input v-model="retrieve_DataForm.retrieve_password_confirm" label="确认新密码"
                                    placeholder="确认新密码"
                                    show-password type="password"></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="retrieve_handleButtonClick(retrieve_ruleFormRef)">
                        完成
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>
              </el-row>
              <el-row>
                <el-text style="font-size: 12px">注册即表示同意<a href="/public"
                                                                  style="color:#1D9BF0;text-decoration: none">服务条款</a>及<a
                    href="/public" style="color:#1D9BF0;text-decoration: none">隐私政策</a>。
                </el-text>
              </el-row>
            </el-row>
            <!--        第三行row: 登录部分-->
            <el-row style="flex-direction: column;margin-top: 20px;height: 30%">
              <el-row style="margin-bottom: 10px">
                <el-text style="font-size: 20px;font-weight: bolder;color: black;color: white">
                  已有账号?
                </el-text>
              </el-row>
              <el-row style="flex: 3;height: 100%">
                <el-button id="login_button" style="font-size: 17px;font-weight: bold ;color: #1D9BF0"
                           @click="login_dialogVisible=true">
                  登录
                </el-button>
                <el-dialog v-model="login_dialogVisible" :show-close="false" style="height: 510px; border-radius: 20px"
                           width="670">
                  <template #header>
                    <el-container>
                      <el-image src="src/assets/logo.png" style="width: 250px;margin: auto"></el-image>
                      <el-button id="close_button"
                                 style="height: 40px;width: 40px;border-radius: 50%;border: none;transition:all .5s;position: absolute; top: 10px;right: 10px"
                                 @click="login_dialogVisible = false">
                        <el-icon :size="23" color="black" style="font-weight: 5;">
                          <Close/>
                        </el-icon>
                      </el-button>
                    </el-container>
                  </template>
                  <el-container style="justify-content: center;">
                    <el-form ref="login_ruleFormRef" :model="login_Form">
                      <div v-show="Account_FormVisible">
                        <el-form-item>
                          <h1 style="font-size: 40px;margin-top: 40px;color: black;margin-bottom: 0">
                            登录你的账号</h1>
                        </el-form-item>
                        <el-form-item prop="account" style="margin-top: 50px">
                          <el-input v-model="login_Form.account" label="用户名" placeholder="账号"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" style="margin-bottom: 0">
                          <el-input v-model="login_Form.password" label="密码" placeholder="密码" show-password
                                    type="password"></el-input>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-container>
                  <template #footer>
                    <el-container style="justify-content: center;margin-bottom: 20px">
                      <el-button style="width: 500px;height: 50px;border-radius: 25px;font-size: 20px;font-weight: bold"
                                 type="primary"
                                 @click="login_handleButtonClick(login_ruleFormRef)">
                        确认
                      </el-button>
                    </el-container>
                  </template>
                </el-dialog>

              </el-row>
            </el-row>
          </el-row>
        </el-main>
      </el-aside>
    </el-container>
    <!--底部-->
    <el-footer style="text-align: center; display: flex; justify-content: center; align-items: flex-end;">
      <el-text>
        <a id="login_footer_link" href="/public">关于</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">状态</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">版本</a>
      </el-text>
      <el-text>
        <a id="login_footer_link" href="/public">技术</a>
      </el-text>
    </el-footer>
  </el-container>
</template>

<style scoped>

.videoElement {
  z-index: -1;
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: fill;
}

.outer {
  height: 100%;
  width: 100%;
}

#login_logo {
  font-size: 150px;
  font-family: HyFABadBoy, serif;
}

#login_button {
  width: 200px;
  height: 100%;
  opacity: 0.7;
}

#login_footer_link {
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 50px;
  text-decoration: none;
  font-size: 13px;
  color: #536471;
}

.el-text {
  margin-top: 10px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 0;
}

#close_button:hover {
  background-color: rgb(231, 231, 232);
}

.el-form-item {
  width: 500px;
}

.el-input, .el-select {
  width: 100%;
  height: 50px;
}

/deep/ .el-select__wrapper {
  height: 50px;
}

.el-row {
  margin-top: 10px;
}

.el-form-item {
  margin-bottom: 30px;
}


</style>
