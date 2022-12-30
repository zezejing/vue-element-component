<template>
  <div class="app-container">
    <el-button type="primary" @click="print">打印小票</el-button>
    <Print />
  </div>
</template>

<script>
import Print from "@/components/Print";
export default {
  components: { Print },
  methods: {
    print() {}
  }
};
</script>
