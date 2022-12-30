<template>
  <fragment v-if="!column.child">
    <fragment v-if="column.type == 'selection'">
      <!--复选框（START）-->
      <el-table-column
        type="selection"
        :width="column.width ? column.width : 55"
        :align="column.align ? column.align : 'center'"
        :key="column.prop + '_' + index"
        :selectable="checkSelectable"
      >
      </el-table-column>
      <!--复选框（END）-->
    </fragment>
    <fragment v-else-if="column.type == 'index'">
      <!--序号（START）-->
      <el-table-column
        :label="column.label ? column.label : '序号'"
        :min-width="column.minWidth ? column.minWidth : 60"
        :align="column.align ? column.align : 'left'"
        :sortable="column.sort || false"
        :sort-method="(a, b) => sortHandle(a, b, index, column.prop)"
        :key="column.prop + '_' + index"
        fixed="left"
      >
        <template slot-scope="scope">
          <slot name="index" :scope="scope" v-if="showPage">{{
            scope.$index + 1 + page.perpage * (page.page - 1)
          }}</slot>
          <slot name="index" :scope="scope" v-else>{{ scope.$index + 1 }}</slot>
        </template>
      </el-table-column>
    </fragment>
    <fragment v-else>
      <!-- 默认渲染列-渲染每一列的汉字 -->
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        :align="column.align"
        :header-align="column.head_align ? column.head_align : 'center'"
        :width="column.width"
        :fixed="column.fixed"
        :min-width="column.minWidth"
        :show-overflow-tooltip="column.tooltip === false ? column.tooltip : true"
        :key="column.prop + '_' + index"
        :sortable="column.sort || false"
        :sort-method="(a, b) => sortHandle(a, b, index, column.prop)"
      >
        <template slot-scope="scope" slot="header">
          <template v-if="column.head_slot">
            <slot :name="column.head_slot" v-bind="scope"></slot>
          </template>
          <template v-else>
            {{ column.label }}
            <el-tooltip
              effect="light"
              placement="top"
              :scope="scope"
              v-if="column.header"
              popper-class="atooltip"
            >
              <div slot="content" v-for="(item, index) in column.header.split('；')" :key="index">
                {{ item }}
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </template>
        <template slot-scope="scope">
          <!-- 双击复制 -->
          <!-- 如不需要双击复制，在外部column添加 nodbclick = true -->
          <slot :name="column.prop" :scope="scope">
            <span @dblclick="copy(scope.row, column)"
              >{{ handleProp(scope.row, column.prop) }}
            </span>
          </slot>
        </template>
      </el-table-column>
    </fragment>
  </fragment>
  <fragment v-else>
    <el-table-column :prop="column.prop" :label="column.label" :align="column.align">
      <el-table-column width="1" class-name="btable-hide-col"></el-table-column>
      <child-column
        v-for="(item, i) in column.child"
        :key="i"
        :index="i"
        :column="item"
        :showPage="showPage"
        :page="page"
        :sortMethod="sortMethod"
        @cell-db-click="cellDbClick"
      >
        <!-- <template slot-scope="data">
          <slot name="column" :data="data" />
        </template> -->
        <!-- 注意：如果是vue2中的话customSlots可以替换为$scopedSlots，而且下面setup中的取值也不需要了 -->
        <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
          <!-- 以之前的名字命名插槽，同时把数据原样绑定 -->
          <slot :name="slot" v-bind="scope" />
        </template>
      </child-column>
    </el-table-column>
  </fragment>
</template>
<script>
export default {
  props: {
    child: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    },
    // 自定义排序方法
    sortMethod: {
      type: Function,
      default: () => {}
    },
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
    column: {
      type: Object,
      required: true
    },
    children: {
      //child识别字段,用于识别多级表头字段
      type: String,
      required: false,
      default: "child"
    }
  },
  mounted() {
    // setTimeout(() => {
    // }, 5000);
    // <template v-for="(column, index) in showItems">
    //       <template :slot="'column_' + column.prop">aaa</template>
    //       <!--复选框（START）-->
    // <el-table-column
    //   v-if="column.type == 'selection'"
    //   type="selection"
    //   :width="column.width ? column.width : 55"
    //   :align="column.align ? column.align : 'center'"
    //   :key="column.prop + '_' + index"
    //   :selectable="checkSelectable"
    // >
    // </el-table-column>
    //       <!--复选框（END）-->
    // <!--序号（START）-->
    // <el-table-column
    //   v-else-if="column.type == 'index'"
    //   :label="column.label ? column.label : '序号'"
    //   :min-width="column.minWidth ? column.minWidth : 60"
    //   :align="column.align ? column.align : 'left'"
    //   :sortable="column.sort || false"
    //   :sort-method="(a, b) => sortHandle(a, b, index, column.prop)"
    //   :key="column.prop + '_' + index"
    //   fixed="left"
    // >
    //   <template slot-scope="scope">
    //     <slot name="index" :scope="scope" v-if="showPage">{{
    //       scope.$index + 1 + page.perpage * (page.page - 1)
    //     }}</slot>
    //     <slot name="index" :scope="scope" v-else>{{ scope.$index + 1 }}</slot>
    //   </template>
    // </el-table-column>
    //       <!-- 默认渲染列-渲染每一列的汉字 -->
    //       <el-table-column
    //         v-else
    //         :prop="column.prop"
    //         :label="column.label"
    //         :align="column.align"
    //         :header-align="column.head_align ? column.head_align : 'center'"
    //         :width="column.width"
    //         :fixed="column.fixed"
    //         :min-width="column.minWidth"
    //         :show-overflow-tooltip="true"
    //         :key="column.prop + '_' + index"
    //         :sortable="column.sort || false"
    //         :sort-method="(a, b) => sortHandle(a, b, index, column.prop)"
    //       >
    //         <template slot-scope="scope" slot="header">
    //           {{ column.label }}
    //           <el-tooltip
    //             effect="light"
    //             placement="top"
    //             :scope="scope"
    //             v-if="column.header"
    //             popper-class="atooltip"
    //           >
    //             <div slot="content" v-for="(item, index) in column.header.split('；')"
    //              :key="index">
    //               {{ item }}
    //             </div>
    //             <i class="el-icon-question"></i>
    //           </el-tooltip>
    //         </template>
    //         <template slot-scope="scope">
    //           <!-- 双击复制 -->
    //           <!-- 如不需要双击复制，在外部column添加 nodbclick = true -->
    //           <slot :name="column.prop" :scope="scope">
    //             <span @dblclick="copy(scope.row, column)"
    //               >{{ handleProp(scope.row, column.prop) }}
    //             </span>
    //           </slot>
    //         </template>
    //       </el-table-column>
    //     </template>

  },
  methods: {
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
     * 修改表格prop
     */
    handleProp(row, prop) {
      if (prop && prop.indexOf(".") !== -1) {
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
     * 禁用当前行选中
     * 调用父组件的自定义方法获取返回值，返回false 代表禁用
     * */
    checkSelectable(row) {
      let status = true;
      this.$emit("checkSelectable", row, (val) => {
        status = val;
      });
      return status;
    }
  },
  render(h) {
    function interite(arr) {
      return arr.map((item) => {
        if (item.child) {
          return h("el-table-column", { attrs: { label: item.label } }, interite(item.child));
        } else {
          let name = "column_";
          if (item.prop) {
            name += item.prop;
          } else if (item.type) {
            name += item.type;
          }
          return h("slot", { attrs: { name } });
        }
      });
    }
    let children = interite(this.child);
    let el = h("template", {}, children);
    return el;
  }
};
</script>
