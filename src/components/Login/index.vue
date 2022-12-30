<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="login-bg1"></div>
      <div class="login-bg2"></div>
      <div class="login-bg3"></div>
    </div>
    <div class="login-wrap">
      <!-- logo -->
      <div class="login-logo">
        <!-- <img :src="logo" />
        <span>{{ title }}</span> -->
      </div>
      <!-- 内容 -->
      <div class="login-cot clearfix">
        <!-- 左边轮播图 -->
        <div class="login-cot-img">
          <!-- 轮播图 -->
          <el-carousel trigger="click">
            <el-carousel-item v-for="(item, index) in carouselImg" :key="index">
              <img :src="item" />
              <!-- <img :src="textImg[index]" :class="'textImg textImg' + [index]" /> -->
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 右边表单  -->
        <div class="login-cot-form">
          <h3 class="title">
            {{ title }}
            <span>{{ version }}</span>
          </h3>
          <login-form
            :btn_load="btn_load"
            :is_register="true"
            :is_other_login="{ is_scan: true, is_phone: true }"
            :is_captcha="is_captcha"
            @handleLogin="handleLogin"
          ></login-form>
        </div>
      </div>
      <!-- 底部 -->
      <div class="login-footer">
        <slot name="footer"> </slot>
      </div>
    </div>
    <div class="down-drawer" v-if="drawer">
      <h4>
        该浏览器可能会影响到您的体验，建议下载使用最新版
        <a href="https://www.google.cn/chrome/" target="_blank">chrome谷歌浏览器</a>
        。
      </h4>
    </div>
  </div>
</template>
<script>
import LoginForm from "./form.vue";
import settings from "@/settings";
export default {
  name: "login",
  components: { LoginForm },
  props: {
    // logo 轮播图
    infoConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: settings.title, //标题
      version: process.env.VUE_APP_VERSION, //版本
      logo: require("../../assets/logo.png"), //logo
      //轮播图
      carouselImg: [
        require("../../assets/login/img1.jpg"),
        require("../../assets/login/img2.jpg"),
        require("../../assets/login/img3.jpg")
      ],
      // 轮播图文字图片
      textImg: [
        require("../../assets/login/text1.png"),
        require("../../assets/login/text2.png"),
        require("../../assets/login/text3.png")
      ],
      // 提示下载浏览器弹窗
      drawer: true,
      // 登录加载
      btn_load: false,
      // 验证码重新获取
      is_captcha: false
    };
  },
  created() {
    setTimeout(() => {
      this.drawer = false;
    }, 10000);
  },
  methods: {
    // 登录操作
    handleLogin(data) {
      let type = data.type; // 1：登录 2：注册 3：忘记密码
      console.log(type);
      this.btn_load = true;
      const defaultSettings = JSON.stringify(settings);
      setTimeout(() => {
        this.$notify({
          title: "登录成功",
          type: "success"
        });
        sessionStorage.setItem("token", "asdasdasdasdasdasd");
        sessionStorage.setItem("sidebarStatus", 1);
        sessionStorage.setItem("defaultSettings",defaultSettings);
        this.$router.push("/").catch(() => {});
      }, 1500);
      // this.is_captcha = true;
      this.btn_load = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 768px;
  font-family: "MicrosoftYaHei";
  background-color: #fcf1df;
  overflow: hidden;
  background-repeat: no-repeat;
  // 背景图
  .login-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .login-bg1 {
      background: url("../../assets/login/bg1.png");
      background-size: 100% 100%;
      height: 244px;
    }
    .login-bg2 {
      background: url("../../assets/login/bg2.png");
      background-size: 100% 100%;
      height: 175px;
    }
    .login-bg3 {
      background: url("../../assets/login/bg3.png");
      background-size: 100% 100%;
      height: 500px;
    }
  }

  // 整个内容
  .login-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    overflow-y: auto;
    // logo
    .login-logo {
      margin: 50px 70px 10px;
      margin-top: 50px;
      margin-left: 70px;
      display: flex;
      align-items: center;
      font-size: 32px;
      img{
        width: 60px;
        height: 60px;
      }
    }
    .login-cot:hover {
      box-shadow: 0 10px 10px rgb(241 217 179 / 50%);
    }
    // 内容
    .login-cot {
      margin: auto;
      width: 1050px;
      height: 690px;
      background: #fff;
      border-radius: 10px;
      .login-cot-img {
        width: 46%;
        height: 690px;
        background: #59422e;
        float: left;
        overflow: hidden;
        border-radius: 10px 0px 0px 10px;
        ::v-deep .el-carousel__container {
          width: 100%;
          height: 690px;
        }
        ::v-deep .el-carousel__indicator--horizontal {
          padding: 30px 4px;
        }
        ::v-deep .el-carousel__button {
          width: 20px;
          background-color: #eac7a0;
        }
        img {
          width: 100%;
          height: 690px;
          position: relative;
        }
        img.textImg {
          position: absolute;
          z-index: 9;
        }
        img.textImg0 {
          width: 120px;
          height: 400px;
          top: 40px;
          left: 50px;
        }
        img.textImg1 {
          width: 67px;
          height: 321px;
          top: 40px;
          left: 50px;
        }
        img.textImg2 {
          width: 108px;
          height: 320px;
          top: 40px;
          right: 50px;
        }
      }
      .login-cot-form {
        float: left;
        width: 54%;
        height: 100%;
        .title {
          font-size: 32px;
          padding: 0;
          color: #333333;
          margin: 70px 20px 10px;
          text-align: center;
          font-weight: 550;
          font-family: "MicrosoftYaHei";
          span {
            display: block;
            font-size: 24px;
            font-weight: normal;
            text-align: center;
            color: #999999;
            padding-top: 10px;
          }
        }
      }
    }
    // footer
    .login-footer {
      line-height: 22px;
      color: #000201;
      font-size: 14px;
      text-align: center;
      padding: 5px 0;
    }
  }

  // 提示
  .down-drawer {
    position: fixed;
    top: 0px;
    width: 100%;
    text-align: center;
    background-color: #fff;
    box-shadow: 0 5px 10px rgb(0 0 0 / 20%);
    z-index: 99;
    h4 {
      margin: 5px;
      font-weight: 700;
    }
    a {
      text-decoration: underline;
      color: #cc1c1c;

      &:hover {
        color: #ff2c2c;
      }
    }
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .login-container .login-bg .login-bg1 {
    margin-top: 48px !important;
  }
  .login-container .login-bg .login-bg3 {
    margin-top: 90px !important;
  }
}
@media screen and (max-width: 1200px) {
  .login-cot-img {
    display: none !important;
  }
  .login-cot-form {
    width: 100% !important;
  }
  .login-cot {
    height: auto !important;
  }
  .login-cot-form .title {
    font-size: 26px !important;
    margin: 30px 20px 10px !important;
    span {
      font-size: 20px !important;
    }
  }
}
// 兼容样式调整
@media screen and (min-width: 768px) and (max-width: 1200px) {
  .login-cot {
    width: 50% !important;
  }
}
@media screen and (min-width: 768px) and (max-width: 860px) {
  .login-cot {
    width: 60% !important;
  }
}
@media screen and (max-width: 768px) {
  .login-cot {
    width: 70% !important;
  }
}
</style>
