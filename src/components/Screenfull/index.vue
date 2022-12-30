<template>
  <el-tooltip effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="top">
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click.native="handleFullScreen"
    />
  </el-tooltip>
</template>

<script>
export default {
  name: "Screenfull",
  props: {
    // 需要全屏展示的div元素id
    full_id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isFullscreen: false
    };
  },
  mounted() {
    window.onresize = () => {
      if (!this.checkFull()) {
        this.isFullscreen = false;
      }
    };
    //监听按键事件
    window.addEventListener("keydown", this.KeyDown, true);
  },
  methods: {
    //监听解决F11打开后无法esc退出同时退出全屏的按钮也失效问题。
    KeyDown(event) {
      if (event.keyCode === 122) {
        event.returnValue = false;
        this.handleFullScreen(); //这里是触发全屏的方法
      }
    },
    // 判断是否全屏模式
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      let isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    // 全屏 退出全屏
    handleFullScreen() {
      let element = document.getElementById(this.full_id);
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.isFullscreen = !this.isFullscreen;
    }
  }
};
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
