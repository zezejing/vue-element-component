const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const resolve = dir => path.join(__dirname, dir);

module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  lintOnSave: true,
  devServer: {
    host: "localhost",
    port: "8888",
    open: true,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_PATH
        // changeOrigin: true, // 允许websockets跨域
        // ws: true,
        // pathRewrite: {
        //   "^/api": ""
        // }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "path": require.resolve("path-browserify")
      }
    }
  },
  //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: true,
  /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   * */
  productionSourceMap: false,
  chainWebpack(config) {
    // 配置svg
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  }
});
