<template>
  <div class="app-container">
    <el-button type="primary" @click="is_show = !is_show">支付</el-button>

    <Pay :is_show="is_show"></Pay>
  </div>
</template>

<script>
import Pay from "@/components/Pay";
export default {
  components: { Pay },
  data() {
    return {
      is_show: false
    };
  },
  methods: {
    pay() {}
  }
};
</script>
