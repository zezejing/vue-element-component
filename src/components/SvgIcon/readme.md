### SVG 组件

#### 使用场景

SVG，即可缩放矢量图形（Scalable Vector Graphics），是一种 XML 应用，可以以一种简洁、可移植的形式表示图形信息。
1、任意放缩。 用户可以任意缩放图像显示，而不会破坏图像的清晰度、细节等。
2、文本独立。 SVG 图像中的文字独立于图像，文字保留可编辑和可搜寻的状态。
3、较小文件。 总体来讲，SVG 文件比那些 GIF 和 JPEG 格式的文件要小很多，因而下载也很快。
4、超级颜色控制
5、....
由于用的地方比较多，考虑封装全局 svg-icon 组件，然后通过 vue.component()挂载到全局

#### 更新日志

1、编写 SvgIcon 通用组件，路径：src/components/SvgIcon
2、通过在 main.js 文件中引入 icons，在 src 目录下添加 icons 文件（index.js：将组件挂载到全局；svg 目录：存放 svg 图标），文件名可以自己取（建议取好理解的）
3、改造项目的 webpack 配置 vue.config.js 文件；安装 svg-sprite-loader 配置完后项目重启就可以使用啦
4、举例：<svg-icon icon-name="svg-icon" icon-class="colum_height"></svg-icon>
