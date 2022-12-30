<template>
  <div class="app-container">
    <h3>图片上传</h3>
    <upload
      :accept="accept_img"
      :value="imgUrl"
      width="148px"
      height="148px"
      :limit="2"
      @httpRequest="imgHttpRequest"
    ></upload>
    <h3>文件上传</h3>
    <upload :type="2" :limit="2" :accept="accept_excel" @httpRequest="fileHttpRequest"></upload>
  </div>
</template>
<script>
import upload from "@/components/Upload";
export default {
  components: { upload },
  data() {
    return {
      // 图片的上传类型
      accept_img: ".jpg,.jpeg,.png,.gif,.bmp",
      // 图片
      imgUrl: [
        "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
      ],
      accept_excel: ".xls,.xlsx"
    };
  },
  methods: {
    // 图片
    imgHttpRequest(file) {
      console.log(file);
    },
    // 文件
    fileHttpRequest(file) {
      console.log(file);
    }
  }
};
</script>
