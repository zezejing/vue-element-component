<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%"
      :show-summary="showsummary"
      :stripe="options.stripe"
      :border="options.border"
      :highlight-current-row="options.highlightCurrentRow"
      :lazy="options.lazy"
      @selection-change="handleSelectionChange"
      :row-key="rowKey"
    >
      <!-- 复选框 -->
      <template v-for="(tableData, index) in tableDatas">
        <el-table-column
          v-if="tableData.type == 'selection'"
          type="selection"
          :width="tableData.width ? tableData.width : 55"
          :align="tableData.align ? tableData.align : 'center'"
          :key="tableData.prop + '_' + index"
          :reserve-selection="true"
        >
          <!-- selectable 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选 -->
        </el-table-column>

        <!-- 序号 -->
        <el-table-column
          v-else-if="tableData.type == 'index'"
          :label="tableData.label ? tableData.label : '序号'"
          :width="tableData.width"
          :min-width="tableData.minWidth ? tableData.minWidth : 50"
          :align="tableData.align ? tableData.align : 'left'"
          :sortable="tableData.sort || false"
          :key="tableData.prop + '_' + index"
          fixed="left"
        >
          <!-- sortable 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 -->
          <!-- 展示分页 -->
          <!-- <template slot-scope="scope">
            <slot name="index" :scope="scope" v-if="showPage">{{
              scope.$index + 1 + page.perpage * (page.page - 1)
            }}</slot>
            <slot name="index" :scope="scope" v-else>{{
              scope.$index + 1
            }}</slot>
          </template> -->
          <template slot-scope="scope">
            <slot name="index" :scope="scope">{{ scope.$index + 1 }}</slot>
          </template>
        </el-table-column>

        <!-- 默认渲染列-渲染每一列的汉字 -->
        <el-table-column
          v-else
          :prop="tableData.prop"
          :label="tableData.label"
          :align="tableData.align"
          :header-align="tableData.head_align ? tableData.head_align : 'center'"
          :width="tableData.width"
          :fixed="tableData.fixed"
          :min-width="tableData.minWidth"
          :show-overflow-tooltip="true"
          :key="tableData.prop + '_' + index"
          :sortable="tableData.sort || false"
        >
          <!-- show-overflow-tooltip 当内容过长被隐藏时显示 tooltip -->
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    // 需要展示的列
    tableDatas: {
      type: Array,
      default() {
        return [];
      }
    },
    // 列表数据
    data: {
      type: Array,
      default: () => []
    },
    // 表格加载
    loading: {
      type: Boolean,
      default: false
    },
    // table 表格的控制参数
    options: {
      type: Object,
      default: function () {
        return {
          stripe: true, // 是否为斑马纹 table
          highlightCurrentRow: false, // 是否要高亮当前行
          border: true, //是否带有纵向边框
          lazy: false //是否懒加载子节点数据
        };
      }
    },
    // 是否在表尾显示合计行
    showsummary: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 选中的数据
      multipleSelection: [],
      multipleSelectionArr: []
    };
  },
  methods: {
    // 全选反选方法
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelectionArr = [];
      this.multipleSelection.forEach((e) => {
        this.multipleSelectionArr.push(e);
      });
      let result = {};
      let finalResult = [];
      for (let i = 0; i < this.multipleSelectionArr.length; i++) {
        result[this.multipleSelectionArr[i].id]
          ? ""
          : (result[this.multipleSelectionArr[i].id] =
              true && finalResult.push(this.multipleSelectionArr[i]));
      }
    },
    rowKey(row) {
      return row.id;
    }
  }
};
</script>
<style lang="less" >
</style>
