<template>
  <div class="uploadWrapper">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li
        v-for="(item, index) in imgList"
        :key="item + index"
        :style="{
          width: width,
          height: height
        }"
        v-dragging="{ item: item, list: imgList, group: 'item' }"
      >
        <el-image
          :src="item"
          :preview-src-list="imgList"
          :style="{
            width: width,
            height: height
          }"
        >
        </el-image>
        <div class="el-upload-list__item-actions">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(item)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(item)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </li>
      <el-upload
        ref="uploadRef"
        action="#"
        :show-file-list="false"
        :limit="limit"
        :accept="accept"
        :class="{ hide: hideUpload, img_upload: type === 1 }"
        :style="{ width: width, height: height }"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :http-request="httpRequest"
      >
        <!-- 图片 -->
        <i class="el-icon-plus uploadIcon" v-if="type === 1"></i>
        <!-- 文件 -->
        <el-button v-else type="primary" :icon="icon" size="small">{{ text }}</el-button>
      </el-upload>
      <div class="text-item-list" v-if="type === 2">
        <div class="text-name" v-for="(item, index) in fileNameList" :key="index">
          <span>{{ item.name }}</span>
          <span @click="handRemoveFileName(item, index)">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
            <i class="el-icon-close"></i>
          </span>
        </div>
      </div>
    </ul>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    // 上传类型默认图片 1：图片 2：文件
    type: {
      type: Number,
      default: 1
    },
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 限制上传的图片数量
    limit: {
      type: Number,
      default: 6
    },
    // 限制上传图片的文件大小(kb)
    size: {
      type: Number,
      default: 500
    },
    // 是否是单图上传(单图上传就是已传图片和上传按钮重叠)
    isSingle: {
      type: Boolean,
      default: false
    },
    // 图片显示的宽度(px)
    width: {
      type: String,
      default: "100%"
    },
    // 图片显示的高度(px)
    height: {
      type: String,
      default: "100%"
    },
    // 文件上传类型
    accept: {
      type: String,
      default: ""
    },
    // 默认按钮的图标
    icon: {
      type: String,
      default: "el-icon-upload2"
    },
    // 默认按钮的文字
    text: {
      type: String,
      default: "上传文件"
    }
  },
  computed: {
    imgList: {
      get() {
        return this.value;
      },
      set(val) {
        if (val.length < this.imgList.length) {
          // 判断是删除图片时同步el-upload数据
          this.syncElUpload(val);
        }
        // 同步v-model
        this.$emit("imageUrl", this.imgList);
      }
    },
    // 控制达到最大限制时隐藏上传按钮
    hideUpload() {
      return this.imgList.length >= this.limit;
    }
  },
  data() {
    return {
      // 放大图
      dialogImageUrl: "",
      // 放大弹框显示隐藏
      dialogVisible: false,
      disabled: false,
      // 文件上传列表文件
      fileNameList: []
    };
  },
  methods: {
    // 同步el-upload数据
    syncElUpload(val) {
      const imgList = val || this.imgList;
      this.$refs.uploadRef.uploadFiles = imgList.map((v, i) => {
        return {
          name: "pic" + i,
          url: v,
          status: "success"
        };
      });
    },
    // 删除图片
    handleRemove(index) {
      this.imgList.splice(index, 1);
    },
    // 删除文件
    handRemoveFileName(item, index) {
      this.fileNameList.splice(index, 1);
      // 获取到该组件调用handleRemove方法删除file对象
      this.$refs.uploadRef.handleRemove(item);
    },
    // 放大图
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 下载图片
    handleDownload(url) {
      window.open(url);
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      if (this.type === 1) {
        this.$message.warning(`图片超限，最多可上传${this.limit}张图片`);
      } else {
        this.$message.warning(`文件超限，最多可上传${this.limit}个文件`);
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    async beforeUpload(file) {
      const fileType = {
        imgType: ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/bmp"],
        excelType: ["xls", "xlsx"]
      };
      if (this.type === 1) {
        // 图片
        const isJPG = fileType.imgType.indexOf(file.type) > -1;
        // 图片大小
        const isLt5K = file.size / 1024 / 1024 < 0.5;
        if (!isJPG) {
          this.$message.warning("上传图片只能是 jpeg,jpg,png,gif,bmp 格式!");
          return isJPG;
        }
        if (!isLt5K) {
          this.$message.warning("上传图片大小不能超过500KB!");
          return isLt5K;
        }
      } else {
        // 文件
        const fileMsg = file.name.substring(file.name.lastIndexOf(".") + 1);
        const isExcel = fileType.excelType.indexOf(fileMsg) > -1;
        if (!isExcel) {
          this.$message.warning("只能上传 xls、xlsx格式的文件");
          return isExcel;
        }
      }

      // 此处进行上传接口调用
      let data = null;
      data = new FormData();
      data.append("file", file);
      await axios({
        url: "", //上传接口地址
        method: "POST",
        data,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        }
      })
        .then(res => {
          if (this.isMsg) {
            this.$message.success("上传成功");
          }
          this.$emit("upload-success", res.data);
        })
        .catch(e => {
          this.$message.error(e.response.data.message);
        });
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    httpRequest(data) {
      if (this.type === 2) {
        this.fileNameList.push(data.file);
      }
      this.$emit("httpRequest", data.file);
    }
  }
};
</script>
<style lang="scss" scoped>
.uploadWrapper {
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    li {
      position: relative;
      margin-bottom: 5px;
      margin-right: 10px;
      .shadow {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
        padding: 2px;
        cursor: pointer;
      }
      &:hover {
        .shadow {
          opacity: 1;
        }
      }
    }
  }
  ::v-deep .img_upload .el-upload {
    width: 100%;
    height: 100%;
    border: 1px dashed #c0ccda;
  }
  ::v-deep .hide {
    display: none !important;
  }
  ::v-deep .el-upload--text {
    text-align: left;
  }
  .text-item-list {
    width: 100%;
    // 文件列表
    .text-name {
      width: 100%;
      color: #be4141;
      font-size: 14px;
      cursor: pointer;
      line-height: 26px;
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      margin-top: 10px;
      .el-icon-upload-success {
        color: #67c23a;
        margin-right: -14px;
      }
      .el-icon-close {
        color: #606266;
        opacity: 0;
      }
    }
    .text-name:hover {
      background-color: #f5f7fa;
      .el-icon-upload-success {
        opacity: 0;
      }
      .el-icon-close {
        opacity: 1;
      }
    }
  }
  /* 上传按钮 */
  .uploadIcon {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fbfdff;
    border-radius: 6px;
    font-size: 20px;
    color: #999;

    .limitTxt,
    .uploading {
      position: absolute;
      bottom: 10%;
      left: 0;
      width: 100%;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
