<template>
  <div class="table" id="b-table">
    <!-- 搜索部分 -->
    <div class="search-info" v-if="showSearch">
      <slot name="search"></slot>
    </div>
    <div class="b-table-handle" v-if="showHandle">
      <div class="right">
        <slot name="handle"></slot>
      </div>
      <div class="left">
        <!-- 表格密度 -->
        <el-popover
          class="density-popover"
          placement="bottom"
          width="70"
          trigger="click"
          :append-to-body="false"
          v-model="density_visible"
        >
          <div class="dropdown-list">
            <div
              class="dropdown-item"
              v-for="(item, index) in dropdownList"
              :key="index"
              :class="table_size === index ? 'dropdown-selected' : ''"
              @click="handleChangeDensity(index)"
            >
              {{ item }}
            </div>
          </div>
          <el-tooltip slot="reference" class="item" effect="dark" content="密度" placement="top">
            <svg-icon class="svg-icon" icon-class="colum_height"></svg-icon>
          </el-tooltip>
        </el-popover>
        <!-- 列设置 -->
        <el-popover placement="bottom-end" width="320" trigger="click" :append-to-body="false">
          <div class="check-box">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              class="check-flex"
              v-model="checkboxVal"
              @change="handleCheckedChange"
            >
              <el-checkbox
                v-for="(itemCheck, index) in showItems.filter((i) => i.prop)"
                :key="itemCheck.prop + '_' + index"
                :label="itemCheck.prop"
              >
                {{ itemCheck.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <el-tooltip slot="reference" class="item" effect="dark" content="列设置" placement="top">
            <svg-icon class="svg-icon" icon-class="colum_setting"></svg-icon>
          </el-tooltip>
        </el-popover>
        <!-- 是否全屏 -->
        <screenfull :full_id="'b-table'" />
      </div>
    </div>
    <el-table
      id="iTable"
      :class="[tableClass, showHandle ? 'table-no-top' : 'table-top']"
      v-loading="loading"
      element-loading-text="加载中..."
      :data="data"
      :stripe="options.stripe"
      :border="options.border"
      :highlight-current-row="options.highlightCurrentRow"
      :header-row-style="options.headerRowStyle"
      :lazy="options.lazy"
      :height="options.height"
      :max-height="options.max_height || '500px'"
      :load="loadGetData"
      :show-summary="showsummary"
      ref="mutipleTable"
      style="width: 100%"
      @row-click="clickRow"
      @row-dblclick="dblclickRow"
      @row-contextmenu="contextmenu"
      @header-click="headClick"
      @header-contextmenu="headcontextmenu"
      @select="select"
      @select-all="selectAll"
      @current-change="rowChange"
      @selection-change="handleSelectionChange"
      @sort-change="handleChangeSort"
      :default-sort="defaultSort"
      :summary-method="getSummaries"
      :key="tableKey"
      :size="table_size"
    >
      <!--region 数据列-->
      <el-table-column width="1" class-name="btable-hide-col"></el-table-column>
      <fragment v-for="(column, index) in columns" :key="index">
        <child-column
          :index="index"
          :column="column"
          :showPage="showPage"
          :page="page"
          :sortMethod="sortMethod"
          @cell-db-click="cellDbClick"
          @checkSelectable="checkSelectable"
        >
          <!-- <template slot-scope="data">
              <slot name="column" :data="data" />
            </template> -->
          <!-- 注意：此处遍历值不一样，如果是vue2中的话customSlots可以替换为$scopedSlots，而且下面setup中的取值也不需要了 -->
          <!-- vue2：$scopedSlots -->
          <!-- vue3:
              setup() {
                const { proxy } = getCurrentInstance()
                const customSlots = reactive({
                  ...proxy.$slots
                })

                return {
                customSlots
                }
              } -->

          <!-- #[slot]="scope"  可以理解为 v-slot:slot = 'scope'   v-slot:'插槽名称' = '传过来的值' -->
          <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
            <!-- 以之前的名字命名插槽，同时把数据原样绑定 -->
            <slot :name="slot" v-bind="scope" />
          </template>
        </child-column>
      </fragment>
      <!--endregion-->
    </el-table>

    <!-- 分页 -->
    <pagination
      v-if="showPage"
      :total="page.total"
      :page="page.page"
      :limit="page.perpage"
      :disabled="loading"
      @pagination="pagination"
    />
  </div>
</template>
<script>
// 全屏
import Screenfull from "@/components/Screenfull";
export default {
  components: {
    Screenfull
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 数据列表; 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    columns: {
      type: Array,
      default: () => []
    },
    // table 表格的控制参数
    options: {
      type: Object,
      default: function () {
        return {
          stripe: true, // 是否为斑马纹 table
          highlightCurrentRow: false, // 是否要高亮当前行
          border: true, //是否有纵向边框
          lazy: false, //是否需要懒加载
          max_height: "",
          headerRowStyle: {
            backgroundColor: "#f8f8f8"
          }
        };
      }
    },
    // 添加表格class名
    tableClass: {
      type: String,
      default: "hxTable"
    },
    // 是否展示分页
    showPage: {
      type: Boolean,
      default: true
    },
    // 分页数据
    page: {
      type: Object,
      default: () => ({
        total: 0,
        page: 1,
        perpage: 20
      })
    },
    // 表格数据加载
    loading: {
      type: Boolean,
      default: false
    },
    // 默认排序
    defaultSort: {
      type: Object,
      default: () => ({})
    },
    // 自定义排序方法
    sortMethod: {
      type: Function,
      default: () => {}
    },
    // 显示合计
    showsummary: {
      type: Boolean,
      default: false
    },
    // 显示合计,价格精度-保留几位小数
    precision: {
      type: Number,
      default: () => 2
    },
    // 手动传入总计
    count_sum: {
      type: Object,
      default: () => ({})
    },
    // 是否显示表格上方显示区域
    showHandle: {
      type: Boolean,
      default: false
    },
    // 是否显示搜索部分
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 多行选中
      multipleSelection: [],
      // 每次切换列显示隐藏，更新key
      tableKey: 0,
      // 自定义列绑定值
      checkboxVal: [],
      // checkout 全部的绑定值
      defaultFormThead: [],
      // 是否全选
      checkAll: true,
      // 全选按钮的展示状态
      isIndeterminate: false,
      // 需要展示的列
      showItems: [],
      // slots数据
      customSlots: [],
      // 拷贝的columns数据
      copyColumn: [],
      // 表格密度值
      table_size: "medium",
      // 表格密度值
      dropdownList: {
        medium: "默认",
        small: "中等",
        mini: "紧凑"
      },
      // 密度列表是否显示
      density_visible: false
    };
  },
  // mounted() {
  //   // setTimeout(() => {
  //   //   console.log(this.$refs.aaaa.$slots);
  //   // }, 3000);
  //   const { proxy } = getCurrentInstance();
  //   const customSlots = reactive({
  //     ...proxy.$slots
  //   });
  //   this.customSlots = customSlots;
  //   console.log(customSlots);
  // },

  methods: {
    /**
     * 列表懒加载，必须先开启懒加载
     * */
    loadGetData(row, treeNode, resolve) {
      //懒加载事件数据
      let data = {
        row: row,
        treeNode: treeNode,
        resolve: resolve
      };
      this.$emit("loadGetData", data);
    },
    /**
     * 修改表格prop
     */
    handleProp(row, prop) {
      if (prop.indexOf(".") !== -1) {
        let props = prop.split(".");
        if (row[props[0]]) {
          return row[props[0]][props[1]] || row[props[0]][props[1]] === 0
            ? row[props[0]][props[1]]
            : "";
        } else {
          return "";
        }
      } else {
        return row[prop] || row[prop] === 0 ? row[prop] : "";
      }
    },
    /**
     * 多行选中
     * */
    handleSelectionChange(val) {
      // 多行选中
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
    /**
     * 禁用当前行选中
     * 调用父组件的自定义方法获取返回值，返回false 代表禁用
     * // 父组件使用方法
        checkSelectable(row, cb) {
          // 判断是否需要禁用
          if (row.key === 1) {
            cb(true);
          } else {
            cb(false);
          }
        },
     * */
    checkSelectable(row, cb) {
      this.$emit("checkSelectable", row, (val) => {
        cb(val);
      });

    },
    /**
     * 当前组件表格点击复制
     * */
    copy(row, columns) {
      if (!columns.nodbclick) {
        let text = this.handleProp(row, columns.prop);
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            this.$message("复制成功");
            this.$emit("cell-db-click");
          });
        }
      }
    },
    // 子组件传出的点击复制成功
    cellDbClick() {
      this.$emit("cell-db-click");
    },
    /**
     * 单击行事件
     * */
    clickRow(row, column, event) {
      let data = {
        row: row,
        column: column,
        event: event
      };
      this.$refs.mutipleTable.toggleRowSelection(data.row);
      this.$emit("clickRow", data);
    },
    /**
     * 双击行事件
     * */
    dblclickRow(row, column, event) {
      let data = {
        row: row,
        column: column,
        event: event
      };
      this.$emit("dblclickRow", data);
    },
    /**
     * 右键行事件-没去掉页面默认的
     * */
    contextmenu(row, column, event) {
      let data = {
        row: row,
        column: column,
        event: event
      };
      this.$emit("contextmenu", data);
    },
    /**
     * 头部列点击事件
     * */
    headClick(column, event) {
      let data = {
        column: column,
        event: event
      };
      this.$emit("headClick", data);
    },
    /**
     * 头部列右键点击事件
     * */
    headcontextmenu(column, event) {
      let data = {
        column: column,
        event: event
      };
      this.$emit("headcontextmenu", data);
    },
    /**
     * 当前行发生改变时的事件
     * */
    rowChange(currentRow, oldCurrentRow) {
      let data = {
        currentRow: currentRow,
        oldCurrentRow: oldCurrentRow
      };
      this.$emit("rowChange", data);
    },
    /**
     * 用户手动勾选复选框触发
     * */
    select(sel, row) {
      let data = {
        sel: sel,
        row: row
      };
      this.$emit("select", data);
    },
    /**
     * 用户点击全选触发
     * */
    selectAll(sel) {
      let data = {
        sel: sel
      };
      this.$emit("selectAll", data);
    },
    /**
     * 表格合计
     */
    getSummaries(param) {
      const { columns, data } = param;
      const cols = JSON.parse(JSON.stringify(this.columns));
      const constArr = cols.map((i) => {
        if (i.hj === "num" && i.prop) {
          return i.prop;
        }
        return "";
      });
      const mentArr = cols.map((i) => {
        if (i.hj === "price" && i.prop) {
          return i.prop;
        }
        return "";
      });
      const sums = [];
      columns.forEach((column, index) => {
        let is_count = Object.keys(this.count_sum).length > 0;
        if (index === 0) {
          sums[index] = is_count ? "总计" : "合计";
          return;
        }
        if (is_count && this.count_sum[column.property] !== undefined) {
          sums[index] = this.count_sum[column.property];
        } else if (
          mentArr.indexOf(column.property) !== -1 ||
          constArr.indexOf(column.property) !== -1
        ) {
          // column.property  当前列的绑定值  scope.row.xxx
          const values = data.map((item) => Number(item[column.property]));
          // 判断当前的值不为NaN
          if (!values.every((value) => isNaN(value))) {
            // 求和
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (mentArr.indexOf(column.property) !== -1) {
              sums[index] = sums[index].toFixed(this.precision);
            }
          } else {
            sums[index] = "N/A";
          }
        }
      });
      return sums;
    },

    // 表格排序
    handleChangeSort(row, column) {
      // console.log(row, column);
      this.$emit("change-sort", row, column);
    },

    // 表格排序
    sortHandle(row, row1, index, prop) {
      if (this.sortMethod(row, row1, index, prop)) {
        return this.sortMethod(row, row1, index, prop);
      } else {
        if (!Number(row[prop]) || Number(row[prop]) === 0) {
          return -1;
        }
        if (Number(row[prop]) < Number(row1[prop])) {
          return -1;
        } else {
          return 1;
        }
      }
    },

    // 分页
    pagination(val) {
      let { limit, page } = val;
      // 根据当前总条数、当前每页展示条数来判断当前页码是否超标；
      // 是的话就将当前总条数、当前每页展示条数的最大页码赋值给组件；
      // 例：total: 99   pagesize: 10  page: 10；
      // 此时切换pagesize为30，如果继续按照page：10去计算，那就是10*30 = 300；
      // 但是数据一共就99条，因此要更新页码为：Math.ceil(99 / 30) = 4；3*30 < 99 < 4*30,就ok了。
      // ，唯一美中不足的是，由于pagesize和page的改变都会触发分页组件的Pagination方法,所以会导致调用两次接口，但数据是一样的
      // 目前还没想到要怎么处理，难不成要在<Pagination/>里边另写一个触发更改分页的方法？
      let max_page = Math.ceil(this.page.total / limit);
      if (max_page < page) {
        page = max_page;
        this.$emit("pagination", { limit, page });
      } else {
        this.$emit("pagination", { limit, page });
      }
    },

    // 操作自定义列
    handleDefaultHead(data) {
      this.defaultFormThead = data.filter((i) => i.prop).map((i) => i.prop);
      this.checkboxVal = data.filter((i) => i.prop).map((i) => i.prop);
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkboxVal = val ? this.defaultFormThead : [];
      this.isIndeterminate = false;
      this.handleHead();
    },
    // 判断是否是全选
    handleCheckedChange(value) {
      this.handleHead();
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.defaultFormThead.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.defaultFormThead.length;
    },
    // 表格头部变化
    handleHead() {
      this.$emit("update:columns", this.handleShowColumn(this.copyColumn));
    },
    // 操作选择隐藏/显示列
    handleShowColumn(columns) {
      let arr = [];
      columns = JSON.parse(JSON.stringify(columns));
      columns.forEach((i) => {
        if (i.child) {
          let child = this.handleShowColumn(i.child);
          if (child.length) {
            i.child = child;
            arr.push(i);
          }
        } else {
          if (!i.prop || this.checkboxVal.indexOf(i.prop) !== -1) {
            // console.log(i);
            arr.push(i);
          }
        }
      });
      return arr;
    },
    // 操作传入列数据
    handleItems(val) {
      let arr = [];
      val.forEach((item) => {
        if (item.child) {
          arr.push(...this.handleItems(item.child));
        } else {
          arr.push(item);
        }
      });

      return arr;
    },
    // 获取密度值
    handleChangeDensity(value) {
      this.table_size = value;
      this.density_visible = false;
      this.$nextTick(() => {
        this.$refs.mutipleTable.doLayout();
      });
    }
  },
  watch: {
    columns: {
      handler(val) {
        // 表格宽度计算公式：每个字宽度默认为14.5，(元)宽度默认30 + padding左右各20 = 50
        if (!this.showItems.length) {
          this.showItems = this.handleItems(val);
          this.handleDefaultHead(this.showItems);
        }
        if (!this.copyColumn.length) {
          this.copyColumn = JSON.parse(JSON.stringify(val));
        }
        this.tableKey++;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss">
.el-icon-question {
  color: #cc9756;
}
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #cc9756;
}
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: #fff;
}
.atooltip {
  border: 1px solid #cc9756 !important;
  color: #cc9756;
}
.table-top {
  margin-top: 20px !important;
}
.table-no-top {
  margin-top: 0 !important;
}
.table {
  background-color: #fff;
  .el-table {
    margin-bottom: 20px;
    /* table 固定列表滚动条滑动问题 */
    .el-table__fixed,
    .el-table__fixed-right {
      pointer-events: none;
    }
    .el-table__fixed > *,
    .el-table__fixed-right > * {
      pointer-events: all;
    }
    .el-table__fixed {
      height: 100% !important; //设置高优先，以覆盖内联样式
    }
  }
  .el-table thead {
    color: #333;
    background-color: #f8f8f8;
  }
  .b-table-handle {
    border-bottom: none;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right {
      flex: 1;
    }
    .left {
      // width: 160px;
      padding-left: 50px;
      .svg-icon {
        font-size: 20px;
        margin-right: 12px;
      }
      .el-popover__reference-wrapper:focus-visible,
      .svg-icon:focus {
        outline: none;
      }
      .density-popover {
        .el-popover {
          min-width: 70px;
          padding: 0;
        }
        .dropdown-list {
          padding: 10px 0;
          .dropdown-item {
            line-height: 36px;
            padding: 0 20px;
            margin: 0;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
            text-align: center;
          }
          .dropdown-item:hover {
            color: #0960bd !important;
            background-color: #e3f4fc !important;
          }
        }
      }
    }
  }
}
.dropdown-selected {
  background-color: #e3f4fc !important;
  color: #0960bd !important;
}

.check-box {
  max-height: 350px;
  overflow-y: auto;

  .check-flex {
    display: none;
    display: flex;
    flex-wrap: wrap;

    .el-checkbox {
      width: 50%;
      margin-right: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      &:nth-child(2n) {
        padding-left: 10px;
      }

      .el-checkbox__label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
// 搜索
.search-info {
  background: #f5f5f5;
  padding: 20px;
}
.btable-hide-col {
  width: 0px !important;
  border: none !important;
}
</style>
