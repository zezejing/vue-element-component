import axios from "axios";
/**
 * 自定义上传图片插件
 */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const data = new FormData();
    data.append("imgfile", await this.loader.file);
    // 上传图片接口图片调用功能
  }
}

export default MyUploadAdapter;
