<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      :disabled="disabled"
      @current-change="handleCurrentChange"
      size="small"
    />
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "Pagination",
  props: {
    // 总条数
    total: {
      required: true,
      type: Number
    },
    // 第几页
    page: {
      type: Number,
      default: 1
    },
    // 一页最多展示多少条
    limit: {
      type: Number,
      default: 20
    },
    // 配置一页可以展示多少调
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50, 100];
      }
    },
    // 组件布局，子组件名用逗号分隔
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    // 是否为分页按钮添加背景色
    background: {
      type: Boolean,
      default: true
    },
    // 是否自适应滚动
    autoScroll: {
      type: Boolean,
      default: true
    },
    // class样式
    hidden: {
      type: Boolean,
      default: false
    },
    // 分页是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$nextTick(() => {
        this.$emit("pagination", { page: this.currentPage, limit: val });
        if (this.autoScroll) {
          scrollTo(0, 800);
        }
      });
    },
    handleCurrentChange(val) {
      this.$nextTick(() => {
        this.$emit("pagination", { page: val, limit: this.pageSize });
        if (this.autoScroll) {
          scrollTo(0, 800);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination-container {
  text-align: right;
  display: flex;
  flex-direction: inherit;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  overflow: auto;
  .el-pagination {
    width: 100%;
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
