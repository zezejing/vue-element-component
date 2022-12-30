<template>
  <div class="app-container">
    <ckeditor v-model="detail"></ckeditor>

    <h3 v-if="detail">编辑器内容：</h3>
    {{ detail }}
  </div>
</template>
<script>
import ckeditor from "@/components/CKEditor/index";
export default {
  components: { ckeditor },
  data() {
    return {
      detail: ""
    };
  }
};
</script>
