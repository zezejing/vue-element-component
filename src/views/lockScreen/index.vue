<template>
  <div class="app-container">
    <el-button type="primary" @click="is_show = !is_show">锁定屏幕</el-button>

    <lock-screen :is_show="is_show"/>
  </div>
</template>

<script>
import LockScreen from "@/components/LockScreen/index";
export default {
  components: { LockScreen },
  data() {
    return {
      is_show: false
    };
  }
};
</script>
