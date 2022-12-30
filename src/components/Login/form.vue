<template>
  <div class="login-box" :class="{ login_top: !is_register && activeName == 1 }">
    <div class="login-content">
      <div v-if="activeName != 4">
        <el-tabs
          v-model="activeName"
          @tab-click="handleTabClick"
          v-if="is_register && activeName != 3"
        >
          <el-tab-pane label="登录" name="1"></el-tab-pane>
          <el-tab-pane label="注册" name="2"></el-tab-pane>
        </el-tabs>
        <el-divider v-if="activeName == 3" class="forget-password" content-position="center"
          >找回密码</el-divider
        >
      </div>
      <el-divider v-else class="forget-password" content-position="center">微信扫码登录</el-divider>
      <!-- 表单 -->
      <el-form
        ref="formData"
        :model="formData"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :rules="formDataRules"
      >
        <!-- 登录 -->
        <div v-if="activeName != 4">
          <el-form-item
            prop="account"
            :rules="[
              {
                required: true,
                message: '请输入账号',
                trigger: ['blur', 'change']
              }
            ]"
            v-if="!is_phone_login"
          >
            <el-input
              ref="account"
              v-model.trim="formData.account"
              placeholder="请输入账号"
              name="account"
              type="text"
              tabindex="1"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-user"
              clearable
            />
          </el-form-item>
          <el-form-item
            prop="username"
            :rules="[
              {
                required: true,
                message: '请输入您的姓名',
                trigger: ['blur', 'change']
              }
            ]"
            v-if="activeName == 2"
          >
            <el-input
              ref="username"
              v-model.trim="formData.username"
              placeholder="请输入您的姓名"
              name="username"
              type="text"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-user"
              clearable
            />
          </el-form-item>
          <el-form-item
            prop="phone"
            :rules="[
              {
                required: true,
                message: '请输入手机号',
                trigger: ['blur', 'change']
              },
              {
                pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                message: '请输入正确的手机号',
                trigger: ['blur', 'change']
              }
            ]"
            v-if="
              (activeName == 1 && is_phone_login) ||
              ((activeName == 2 || activeName == 3) && !is_phone_login)
            "
          >
            <el-input
              ref="phone"
              v-model.trim="formData.phone"
              placeholder="请输入手机号"
              name="phone"
              type="text"
              tabindex="3"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-phone"
              clearable
            />
          </el-form-item>
          <el-form-item
            prop="code"
            :rules="[
              {
                required: true,
                message: '请输入手机验证码',
                trigger: ['blur', 'change']
              }
            ]"
            v-if="
              (activeName == 1 && is_phone_login) ||
              ((activeName == 2 || activeName == 3) && !is_phone_login)
            "
          >
            <el-input
              ref="code"
              placeholder="请输入手机验证码"
              name="code"
              tabindex="4"
              v-model.trim="formData.code"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-key"
              maxLength="6"
              clearable
            />
            <el-button
              type="text"
              @click.prevent="handleSendCode"
              :disabled="isSendCode"
              class="captcha-code"
              :loading="loadingCode"
            >
              {{ show ? "获取验证码" : count + "秒后重新获取" }}
            </el-button>
          </el-form-item>
          <el-form-item prop="password" v-if="!is_phone_login">
            <el-input
              ref="password"
              v-model.trim="formData.password"
              placeholder="请输入密码"
              name="password"
              tabindex="5"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-lock"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirm_password" v-if="activeName != 1">
            <el-input
              ref="confirm_password"
              v-model.trim="formData.confirm_password"
              placeholder="请输入确认密码"
              name="confirm_password"
              tabindex="6"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              prefix-icon="el-icon-lock"
              clearable
              show-password
            />
          </el-form-item>
          <!-- 图片验证码 -->
          <el-form-item
            prop="captcha"
            class="captcha-container"
            :rules="[
              {
                required: true,
                message: '请输入验证码',
                trigger: ['blur', 'change']
              }
            ]"
            v-if="activeName == 1 && !is_gees"
          >
            <el-input
              ref="captcha"
              v-model="formData.captcha"
              class="captcha-input"
              placeholder="请输入验证码"
              name="captcha"
              type="text"
              minlength="4"
              maxlength="4"
              tabindex="7"
              clearable
              prefix-icon="el-icon-key"
              @keyup.enter.native="handleLogin"
            />
            <el-image class="captcha-img" :src="formData.captchaImg" @click="getCaptcha" />
          </el-form-item>
        </div>
        <!-- 二维码登录 -->
        <div v-else class="login-code">
          <img src="../../assets/login/code.png" alt="" />
          <p>扫码后点击"确认"，即可完成登录</p>
        </div>
      </el-form>
    </div>
    <!-- 登录 -->
    <div class="back_password" v-if="activeName == 1 && !is_phone_login">
      <el-button type="text" @click="handlePassword(1)">忘记密码?</el-button>
    </div>
    <div class="back_password" v-if="activeName == 3">
      <span class="back_text">已有账号？</span>
      <el-button type="text" @click="handlePassword(2)">去登录</el-button>
    </div>
    <el-button
      id="login-button"
      v-if="activeName != 4"
      class="login-button"
      type="primary"
      :loading="btn_load"
      :disabled="btn_load"
      @click="handleLogin"
      >{{ activeName == 1 ? "登 录" : activeName == 2 ? "注 册" : "确认修改" }}</el-button
    >
    <el-button
      class="login-button return-button"
      icon="el-icon-back"
      v-if="is_phone_login"
      @click="handlePassword(2)"
      >{{ activeName != 4 ? "账号密码登录" : "返 回" }}</el-button
    >
    <div v-if="activeName == 1 && !is_phone_login">
      <template v-if="is_other_login.is_scan || is_other_login.is_phone">
        <el-divider content-position="center">其他登录方式</el-divider>
        <div class="other-login">
          <span
            class="other-login-item"
            v-if="is_other_login.is_scan"
            @click="handleChangeLogin('4')"
          >
            <svg-icon icon-class="wechat"></svg-icon>
            <span>微信登录</span>
          </span>
          <span
            class="other-login-item"
            v-if="is_other_login.is_phone"
            @click="handleChangeLogin('1')"
          >
            <svg-icon icon-class="phone-login"></svg-icon>
            <span>手机验证登录</span>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getCaptcha, getUcenter, getGees } from "@/api/verify";
export default {
  name: "login",
  props: {
    // 按钮加载状态
    btn_load: {
      type: Boolean,
      default: () => false
    },
    // 是否需要注册
    is_register: {
      type: Boolean,
      default: () => false
    },
    // 是否需要其他登录方式
    is_other_login: {
      type: Object,
      default: () => ({
        is_scan: false, //微信扫码
        is_phone: false //手机号验证码
      })
    },
    // 使用极验验证码
    is_gees: {
      type: Boolean,
      default: () => false
    },
    // 是否重新获取图片验证码
    is_captcha: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    // 监听是否重新获取图片验证码
    is_captcha: {
      handler(val) {
        if (val) {
          this.formData.captcha = "";
          this.reset_captcha();
          this.getFormFocus();
        }
      }
    }
  },
  data() {
    let reg = /^[_0-9a-zA-Z]{6,16}$/;
    let validate_password = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error("请输入6-16位密码，只能是数字、字母和下划线"));
      } else {
        if (this.formData.confirm_password !== "") {
          this.$refs.formData.validateField("confirm_password");
        }
        callback();
      }
    };
    let validate_confirm_password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 登录、注册切换值
      activeName: "1",
      // 表单
      formData: {
        // 登录账号
        account: "",
        // 用户姓名
        username: "",
        // 手机号
        phone: "",
        // 手机号验证码
        code: "",
        // 密码
        password: "",
        // 确认密码
        confirm_password: "",
        // 图片验证码
        captcha: "",
        // 验证码图片
        captchaImg: "",
        // 验证码key
        captchaKey: "",

        // 极验验证
        challenge: "",
        validate: "",
        seccode: "",

        // 极验验证是否通过
        captcha_code: false
      },
      // 表单验证
      formDataRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"]
          },
          { validator: validate_password, trigger: ["blur", "change"] }
        ],
        confirm_password: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: ["blur", "change"]
          },
          { validator: validate_confirm_password, trigger: ["blur", "change"] }
        ]
      },
      // 图片验证码
      captchaImg: "",

      // 注册
      // 发送验证码状态
      loadingCode: false,
      // 判断验证码是否发送
      isSendCode: false,
      // 发送验证码后
      count: "",
      show: true,
      timer: null,

      // 手机验证登录
      is_phone_login: false,

      // 极验验证码加载
      isGeetLoading: false
    };
  },
  created() {
    // 获取图片验证码
    this.reset_captcha();
  },
  methods: {
    // 获取验证码
    reset_captcha() {
      if (!this.is_gees) {
        this.getCaptcha();
      }
    },
    // 登录 注册切换
    handleTabClick() {
      this.resetForm();
      this.is_phone_login = false;
      this.reset_captcha();
    },
    // 忘记密码
    handlePassword(type) {
      this.resetForm();
      this.activeName = type === 1 ? "3" : "1";
      this.is_phone_login = false;
      this.reset_captcha();
    },
    // 其他方式登录
    handleChangeLogin(type) {
      this.resetForm();
      this.activeName = type;
      this.is_phone_login = true;
      this.reset_captcha();
    },
    resetForm() {
      this.formData = {
        // 登录账号
        account: "",
        // 用户姓名
        username: "",
        // 手机号
        phone: "",
        // 手机号验证码
        code: "",
        // 密码
        password: "",
        // 确认密码
        confirm_password: "",
        // 图片验证码
        captcha: "",
        // 验证码图片
        captchaImg: "",
        // 验证码key
        captchaKey: "",
        // 极验验证
        challenge: "",
        validate: "",
        seccode: "",

        // 极验验证是否通过
        captcha_code: false
      };
      this.$refs["formData"].resetFields();
    },
    // 获取图片验证码
    async getCaptcha() {
      await getCaptcha()
        .then((res) => {
          this.formData.captchaImg = res.img;
          this.formData.captchaKey = res.key;
        })
        .catch(() => {});
    },
    // 发送手机验证码
    async handleSendCode() {
      if (this.formData.phone === "") {
        this.$notify.warning({
          title: "提示",
          message: "手机号不能为空！！",
          offset: 80
        });
      } else {
        await getUcenter({ cellphone: this.formData.phone })
          .then(() => {
            this.$notify.success({
              title: "成功",
              message: "短信发送成功！！",
              offset: 80
            });
            const TIME_COUNT = 60;
            if (!this.timer) {
              this.loadingCode = false;
              this.isSendCode = true;
              this.count = TIME_COUNT;
              this.show = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.show = true;
                  this.isSendCode = false;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          })
          .catch(() => {
            this.loadingCode = false;
          });
      }
    },
    // 极验验证码初始化
    getCaptchaGees() {
      let _this = this;
      _this.isGeetLoading = true;
      getGees()
        .then((res) => {
          if (res.code === 200) {
            let data = res.data;
            // 初始化极验
            _this.$initGeet(
              {
                gt: data.gt,
                challenge: data.challenge,
                new_captcha: true, // 用于宕机时表示是新验证码的宕机
                offline: false, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                product: "bind", // 产品形式，包括：float，popup，bind
                width: "100%"
              },
              _this.handlerPopup
            );
            _this.isGeetLoading = false;
          }
        })
        .catch(() => {
          _this.isGeetLoading = false;
        });
    },
    // 二次校验滑动验证码
    handlerPopup(captchaObj) {
      let _this = this;
      captchaObj
        .onReady(function () {
          captchaObj.verify();
        })
        .onSuccess(function () {
          let validate = captchaObj.getValidate();
          _this.formData.challenge = validate.geetest_challenge;
          _this.formData.validate = validate.geetest_validate;
          _this.formData.seccode = validate.geetest_seccode;
          if (!validate) {
            _this.$message.error("请先完成点击按钮进行验证！");
            _this.formData.captcha_code = false;
          } else {
            _this.formData.captcha_code = true;
            _this.handleComLogin();
          }
        })
        .onError(function () {
          //监听验证出错事件，提供用户或者刷新页面重试
          captchaObj.reset();
        })
        .onClose(function () {
          //对于product为bind形式的验证。当用户关闭弹出来的验证时，会触发该回调。
        });
    },
    // 确认登录
    handleComLogin() {
      this.$emit("handleLogin", this.formData);
    },
    // 登录方法
    handleLogin() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 1：登录 2：注册 3：忘记密码
          this.formData.type = this.activeName;
          //是否为手机验证码登录
          this.formData.is_phone_login = this.is_phone_login;
          if (this.is_gees && this.activeName == 1 && !this.formData.captcha_code) {
            this.getCaptchaGees();
          } else {
            this.handleComLogin();
          }
        } else {
          this.getFormFocus();
          return false;
        }
      });
    },
    // 获取表单焦点
    getFormFocus() {
      setTimeout(() => {
        let isError = document.getElementsByClassName("is-error");
        if (isError[0].querySelector("input")) {
          isError[0].querySelector("input").focus();
        }
      }, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.login-box {
  padding: 0 85px 40px;
  .el-tabs {
    padding: 0 80px 20px;
    ::v-deep .el-tabs__item {
      padding: 0;
    }
    ::v-deep .el-tabs__nav {
      width: 100%;
      text-align: center;
      .el-tabs__active-bar,
      .el-tabs__item {
        width: 50% !important;
      }
    }
  }
  .forget-password {
    .el-divider__text {
      font-size: 20px;
    }
  }
  // 图片验证码
  .captcha-container {
    .captcha-img {
      position: absolute;
      right: 0;
      height: 36px;
      margin: 2px;
    }
  }
  // 发送手机验证码按钮
  .captcha-code {
    position: absolute;
    right: 1px;
    height: 100%;
    cursor: pointer;
    width: 120px;
  }
  // 忘记密码
  .back_password {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    .back_text {
      color: #969799;
    }
  }
  // 按钮
  .login-button {
    width: 100%;
  }
  .el-divider--horizontal {
    margin: 40px 0;
  }
  // 其他登录方式
  .el-divider__text {
    color: #999;
  }
  .other-login {
    display: flex;
    justify-content: space-evenly;
    .other-login-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      svg {
        font-size: 36px;
      }
      span {
        padding-top: 8px;
        color: #666;
        font-size: 14px;
      }
    }
  }
  // 返回按钮
  .return-button {
    margin-left: 0px;
    margin-top: 20px;
  }
  // 二维码
  .login-code {
    text-align: center;
    p {
      color: #999;
      margin: 0;
      font-size: 14px;
    }
  }
}
.login_top {
  margin-top: 70px;
}

// 兼容样式调整
@media screen and (max-width: 1200px) {
  .login-box {
    padding: 0 60px 40px;
    .el-tabs {
      padding: 0 80px 10px;
    }
    .el-divider--horizontal {
      margin: 20px 0;
    }
    .forget-password {
      .el-divider__text {
        font-size: 16px;
      }
    }
  }
}
</style>
