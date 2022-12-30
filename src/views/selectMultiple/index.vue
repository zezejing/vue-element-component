<template>
  <div class="app-container">
    <h3>单选、全拼、简拼下拉框</h3>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <select-multiple
          :id.sync="shop1"
          :list="shops"
          name="适用门店"
          placeholder="请选择适用门店"
          :multiple="false"
        ></select-multiple>
      </el-col>
    </el-row>
    <h3>多选、全拼、简拼下拉框</h3>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <select-multiple
          :id.sync="shop"
          :list="shops"
          name="适用门店"
          placeholder="请选择适用门店"
          type="Array"
        ></select-multiple>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import SelectMultiple from "@/components/SelectMultiple";
export default {
  components:{
    SelectMultiple
  },
  data() {
    return {
      shop1:"",
      shop: [],
      shops: [
        {
          id: 1001,
          name: "测试门店1",
          q: "ceshimendian1",
          j: "csmd1"
        },
        {
          id: 1002,
          name: "测试门店2",
          q: "ceshimendian2",
          j: "csmd2"
        },
        {
          id: 1003,
          name: "测试门店3",
          q: "ceshimendian3",
          j: "csmd3"
        },
        {
          id: 1004,
          name: "测试门店4",
          q: "ceshimendian4",
          j: "csmd4"
        },
        {
          id: 1005,
          name: "测试门店5",
          q: "ceshimendian5",
          j: "csmd5"
        }
      ]
    };
  }
};
</script>
