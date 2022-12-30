<template>
  <div>
    <el-dialog
    :title="title"
    :visible.sync="show"
    width="520px"
    :append-to-body="true"
    class="lock-screen"
    @closed="closed"
    @open="closed"
    >
      <div>
        <img src="@/assets/user.png" class="user-avatar" />
        <p class="user-name-version">小镜子</p>
      </div>
      <el-form :model="formData" ref="ruleForm" label-position="left" size="small" label-width="80px" @submit.native.prevent>
        <el-form-item prop="password" label="锁屏密码" :rules="[
        {required: true, message: '请输入锁屏密码'}
        ]">
          <el-input
            ref="password"
            v-model.trim="formData.password"
            placeholder="请输入锁屏密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLock"
            clearable
            show-password
          />
        </el-form-item>
        <el-button class="lock-btn" type="primary" size="small" @click="handleLock">锁定</el-button>
      </el-form>
    </el-dialog>

    <el-dialog
    title=""
    :visible.sync="is_lock_screen"
    width="520px"
    :append-to-body="true"
    class="lock-screen-main"
    :fullscreen="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    >
      <div class="login-container">
        <div class="login-wrap1">
          <div class="login-logo">
            <img src="./assets/logo.png" />
          </div>
          <div class="login-cot1">
            <img src="./assets/user.png" class="user-avatar" />
            <p class="user-name-version">小镜子</p>
            <el-input
              placeholder="请输入解锁密码"
              v-model="unlock"
              type="password"
              clearable
              @keyup.enter.native="handleUnLock()"
              show-password
            >
              <!-- <template slot="append">
                <svg-icon icon-class="lock" class="lock-icon" @click="unLock"></svg-icon>
                <svg-icon icon-class="out" class="lock-icon" @click="outLock"></svg-icon>
              </template> -->
            </el-input>
            <div class="unlock-btn">
              <el-button type="text" @click="goLogin">返回登录</el-button>
              <el-button type="text" @click="handleUnLock">进入系统</el-button>
            </div>
          </div>
          <div class="login-footer">
            <p>
              Copyright ©2022-{{ nowData }} 技术支持 Miss Wang QQ：842731712 wechat：Eliauk-Wangjing
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Logout } from "@/utils/";
import moment from "moment";
import md5 from "js-md5";
export default {
  props: {
    // 锁定屏幕弹窗
    title: {
      type: String,
      default: "锁定屏幕"
    },
    // 父组件控制显示隐藏
    is_show: {
      tyoe: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      // 弹窗显示状态
      show: false,
      // 输入密码
      formData: {
        password: ""
      },
      // 显示锁屏
      is_lock_screen: false,
      // 解锁密码
      unlock: "",
      nowData: moment().format("YYYY")
    };
  },
  created(){
    const pas = sessionStorage.getItem("LOCK_SCREEN");
    this.is_lock_screen = pas ? true : false;
  },
  methods: {
    // 锁定屏幕
    handleLock() {
      this.$refs.ruleForm.validate(valid => {
        if(valid) {
          sessionStorage.setItem("LOCK_SCREEN", md5(this.formData.password));
          this.show = false;
          this.is_lock_screen = true;
        }
      });
    },
    // 锁定屏幕弹窗打开/关闭
    closed() {
      if(this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
    // 解锁/进入系统
    handleUnLock() {
      const pas = sessionStorage.getItem("LOCK_SCREEN");
      if (this.unlock == "" || this.unlock == undefined) {
        this.$notify.warning({
          title: "提示",
          message: "请输入解锁密码。",
          duration: 1500
        });
        return;
      }  else if (md5( this.unlock) != pas) {
       this.unlock = "";
        this.$notify.error({
          title: "错误",
          message: "解锁密码错误，请输入登陆密码解锁。",
          duration: 1500
        });
        return;
      } else if(md5(this.unlock) == pas) {
        this.is_lock_screen = false;
        sessionStorage.removeItem("LOCK_SCREEN");
        this.unlock = "";
        this.$router.push("/");
      }
    },
    // 退出/返回登录
    goLogin() {
      Logout();
    }
  },
  watch: {
    is_show: {
      handler() {
        this.show = !this.show;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
$bg: #fcf1df;
::v-deep.lock-screen {
  .el-dialog__body {
    padding: 20px;
    border-top: 1px solid #ebebeb;
    text-align: center;

    .lock-btn {
      width: 100%;
      margin: 10px 0 30px;
    }
  }
}
::v-deep.lock-screen-main {
  .el-dialog__header,.el-dialog__body {
    padding: 0
  }
  .el-dialog__body {
    height: 100%;
  }
}
.user-avatar {
  width: 70px;
  height: 70px;
}
.user-name-version {
  margin: 0px 0 20px;
}
/* ::v-deep.login-container .el-input {
  display: inline-table !important;
  height: 47px !important;
  width: 100% !important;
}
::v-deep.login-container .el-input__inner {
  height: 47px !important;
  border-radius: 5px 0px 0px 5px !important;
  -webkit-appearance: none !important;
  background-color: #fff !important;
  background-image: none !important;
  border: 1px solid #dcdfe6 !important;
  box-sizing: border-box !important;
  color: #606266 !important;
  font-size: inherit !important;
  height: 47px !important;
  line-height: 47px !important;
  outline: 0 !important;
  padding: 0 15px !important;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
  width: 100% !important;
} */
/* .login-container .el-input-group__append {
  border-left: 0;
}
.login-container .el-input-group--prepend .el-input__inner,
.login-container .el-input-group__append {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.login-container .el-input-group__append,
.login-container .el-input-group__prepend {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
} */
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: "MicrosoftYaHei";
  background-color: $bg;
  overflow: hidden;
  background-repeat: no-repeat;
  .login-wrap1 {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    overflow-y: auto;
    background: url("./assets/lock-bg.jpg");
    background-size: cover;
    background-position: center;
    .login-logo {
      width: 250px;
      height: 71px;
      margin-left: 70px;
      margin-top: 30px;
    }
    .login-cot1 {
      display: flex;
      width: 320px;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      .user-name-version {
        font-size: 28px;
        text-align: center;
        color: #fff;
        margin: 10px 0 20px 0;
      }
      .unlock-btn {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .el-button--text {
          font-size: 16px;
          font-weight: 600;
          text-decoration: underline;
        }
      }
    }
  }
  .login-footer {
    width: 100%;
    p {
      line-height: 22px;
      color: #cc9756;
      font-size: 14px;
      text-align: center;
    }
  }
}
/* @media screen and (min-width: 1024px) and (max-width: 1200px) {
  .login-container .login-wrap1 {
    background-size: auto 100% !important;
  }
} */
@media screen and (min-width: 1024px) and (max-width: 1200px) and (orientation: portrait) {
  .login-container .login-wrap1 .login-cot1 {
    margin-top: auto;
  }
}
/* @media screen and (min-width: 768px) and (max-width: 1024px) {
  .login-container .login-wrap1 {
    background-size: auto 100% !important;
  }
} */
@media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .login-container .login-wrap1 .login-cot1 {
    margin-top: 150px;
  }
}
</style>
