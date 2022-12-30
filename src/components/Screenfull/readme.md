### 全屏/退出全屏 组件

#### 使用场景

由于用的地方比较多，考虑封装全局 全屏/退出全屏 组件，然后通过 vue.component()挂载到全局

#### 更新日志

1、编写 Screenfull 通用组件，路径：src/components/Screenfull
2、举例使用 <screenfull :full_id="'b-table'" /> full_id传入的值为需要全屏的模块id名
