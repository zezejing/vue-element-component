<template>
  <el-select
    v-model="data_id"
    :placeholder="placeholder || `请选择${name}`"
    @change="changeData"
    clearable
    filterable
    collapse-tags
    :no-data-text="`未搜索到${name}`"
    loading-text="搜索中"
    :filter-method="remoteMethod"
    :loading="loading"
    :multiple="multiple"
    @visible-change="visibleChange"
    :default-first-option="true"
    :disabled="disabled"
  >
    <div style="text-align: center; margin-bottom: 10px" v-show="multiple && isShowCheck">
      <el-checkbox v-model="checked" @change="dataSelectAll">全选</el-checkbox>
    </div>
    <el-option
      v-for="item in options"
      :key="item[value] + Math.random()"
      :label="item[label]"
      :value="item[value]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    // 搜索placeholder
    placeholder: {
      type: String,
      default: ""
    },
    // 搜索名称
    name: {
      type: String,
      default: "门店"
    },
    // option选项的value键名
    value: {
      type: String,
      default: "id"
    },
    // option选项的label键名
    label: {
      type: String,
      default: "name"
    },
    // 传进来的选中数据
    id: [String, Number, Array],
    // 筛选项数据
    list: Array,
    // 多选数据分隔符
    separator: {
      type: String,
      default: "_"
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 传值类型
    type: {
      type: String,
      default: "String"
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 全拼的键名，默认为q
    q: {
      type: String,
      default: "q"
    },
    // 简拼的键名，默认为j
    j: {
      type: String,
      default: "j"
    }
  },
  data() {
    return {
      // 选中数据ID
      data_id: [],
      // 搜索数据加载状态
      loading: false,
      // 简拼搜索添加防抖
      methodTimer: null,
      // 获取到全部的数据
      allOptions: [],
      // 展示的数据
      options: [],
      // 全选、反选
      checked: false,
      // 是否显示全选按钮
      isShowCheck: true
    };
  },
  methods: {
    // 监听选择值变化
    changeData(val) {
      if (this.multiple) {
        if (val.length === this.allOptions.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        if (this.type === "String") {
          this.$emit("update:id", val.join(this.separator));
          this.$emit("change", val.join(this.separator));
        } else if (this.type === "Array") {
          this.$emit("update:id", val);
          this.$emit("change", val);
        }
      } else {
        this.$emit("update:id", val);
        this.$emit("change", val);
      }
    },
    // 搜索输入字符监控
    remoteMethod(query) {
      if (this.methodTimer) {
        clearTimeout(this.methodTimer);
      }
      if (query !== "") {
        this.isShowCheck = false;
        this.loading = true;
        if (this.methodTimer) {
          clearTimeout(this.methodTimer);
        }
        query = query.toLowerCase();
        this.methodTimer = setTimeout(() => {
          this.options = this.allOptions.filter(i => {
            return (
              (i[this.q] && i[this.q].indexOf(query) !== -1) ||
              (i[this.j] && i[this.j].indexOf(query) !== -1) ||
              (i[this.label] && i[this.label].indexOf(query) !== -1)
            );
          });
          this.loading = false;
          clearTimeout(this.methodTimer);
        }, 500);
      } else {
        this.loading = false;
        this.isShowCheck = true;
        this.computedOptions();
      }
    },
    // 给可选项赋值全部数据
    computedOptions() {
      this.options = JSON.parse(JSON.stringify(this.allOptions));
    },
    // 下拉框显示隐藏事件
    visibleChange(val) {
      if (val) {
        this.computedOptions();
      }
    },
    // 选择门店全选&&反选
    dataSelectAll() {
      this.data_id = [];
      if (this.checked) {
        this.data_id = this.allOptions.map(item => {
          return item[this.value];
        });
      }
      this.changeData(this.data_id);
    }
  },
  watch: {
    // 监听门店数据变化
    list: {
      handler(val) {
        if (val.length) {
          const options = JSON.parse(JSON.stringify(val));
          this.allOptions = options.map(i => {
            return Object.assign(i, this.$pinyin(i[this.label], this.q, this.j));
          });
          this.computedOptions();
        } else {
          this.allOptions = [];
          this.options = [];
        }
      },
      deep: true,
      immediate: true
    },
    id: {
      handler(val) {
        if (this.multiple) {
          let isTrue = false;
          if (this.type === "String") {
            isTrue = this.data_id.join(this.separator) != val;
          } else {
            isTrue = this.data_id.join(this.separator) != val.join(this.separator);
          }
          if (isTrue) {
            if (!val) {
              this.checked = false;
              this.data_id = [];
            } else {
              if (this.type === "String") {
                this.data_id = val.split(this.separator);
              } else {
                this.data_id = val;
              }
              this.computedOptions();
            }
          }
        } else {
          this.data_id = val;
          this.computedOptions();
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-select {
  width: 100%;
}
::v-deep.el-select .el-select__tags {
  .el-tag {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
