<template>
    <div class="version" v-if="isVersion">{{ version }}</div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      version: process.env.VUE_APP_VERSION
    };
  },
  computed: {
    ...mapState({
      isVersion: (state) => state.settings.isVersion
    })
  }
};
</script>