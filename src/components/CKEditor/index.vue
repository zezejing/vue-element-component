<template>
  <ckeditor
    :editor="editor"
    v-model="editorData"
    :config="editorConfig"
    @ready="onReady"
  ></ckeditor>
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn"; //中文包
// import MyUploadAdapter from "./MyUploadAdapter.js";
export default {
  name: "CKEditor",
  props: {
    // 绑定的值
    value: {
      type: String,
      default: ""
    },
    // 提示信息
    placeholder: {
      type: String,
      default: "请输入内容"
    }
  },
  data() {
    return {
      // 编辑器组件需要获取编辑器实例
      editor: ClassicEditor,
      editorData: this.value,
      editorConfig: {
        // 可以控制编辑器的提示文本
        placeholder: this.placeholder,
        language: "zh-cn"
      }
    };
  },
  watch: {
    value(val) {
      if (!this.editor) {
        return;
      }
      // 外部内容发生变化时，将新值赋予编辑器
      if (val !== this.editorData) {
        this.editorData = this.value;
      }
    },
    editorData(val) {
      if (val !== this.value) {
        // 编辑器内容发生变化时，告知外部，实现 v-model 双向监听效果
        this.$emit("input", val);
      }
    }
  },
  created() {
    // 编辑器组件创建时将外部传入的值直接赋予编辑器
    this.editorData = this.value;
  },
  methods: {
    onReady(editor) {
      // 自定义上传图片插件
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        // return new MyUploadAdapter(loader);
      };
    }
  }
};
</script>
<style lang="scss">
.ck-editor__editable {
  min-height: 400px !important;
}
</style>
