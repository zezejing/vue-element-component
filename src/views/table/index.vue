<template>
  <div class="app-container">
    <b-table
      :data="listData"
      :columns.sync="defaultHead"
      :loading="listLoading"
      :showsummary="true"
      :showHandle="true"
      :showSearch="true"
      :page="{ total: 100, page: 10, perpage: 1 }"
      @pagination="pagination"

    >
      <slot slot="search">
        <el-form ref="searchForm" :model="searchForm" label-width="70px" size="small">
          <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item label="会员姓名" prop="name">
                <el-input
                  v-model.trim="searchForm.name"
                  placeholder="请搜索会员姓名"
                  @change="search"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item label="会员手机" prop="phone">
                <el-input
                  v-model.trim="searchForm.phone"
                  placeholder="请搜索会员手机"
                  @change="search"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
              <el-form-item label="会员性别" prop="sex">
                <el-input
                  v-model.trim="searchForm.sex"
                  placeholder="请搜索会员性别"
                  @change="search"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-button type="primary" icon="el-icon-search" @click="search" size="small"
                >查询</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="resetForm('searchForm')"
                size="small"
                >重置</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </slot>
    </b-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索表单
      searchForm: {},
      // 表格数据加载
      listLoading: false,
      // 列表数据
      listData: [
        {
          amount: "120.00",
          discount_value: "230.00"
        },
        {
          amount: "220.00",
          discount_value: "330.00"
        },
        {
          amount: "420.00",
          discount_value: "530.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        },
        {
          amount: "620.00",
          discount_value: "730.00"
        }
      ],
      // 表格头部数据---全部的
      defaultHead: [
        {
          type: "index"
        },
        {
          prop: "order_no",
          label: "退款单号",
          align: "center",
          minWidth: "180",
          fixed: "left"
        },
        {
          prop: "pay_no",
          label: "支付单号",
          align: "center",
          minWidth: "180"
        },

        {
          prop: "shop_name",
          label: "消费门店",
          align: "center",
          minWidth: "120",
          child: [
            {
              prop: "user_name",
              label: "店长",
              align: "center",
              minWidth: "120"
            },
            {
              label: "收银员",
              child: [
                {
                  label: "男收银员",
                  child: [
                    {
                      prop: "nan1",
                      label: "男1",
                      align: "center",
                      minWidth: "120"
                    },
                    {
                      prop: "nan2",
                      label: "男2",
                      align: "center",
                      minWidth: "120"
                    }
                  ]
                },
                {
                  label: "女收银员",
                  child: [
                    {
                      prop: "nv1",
                      label: "女1",
                      align: "center",
                      minWidth: "120"
                    },
                    {
                      prop: "nv2",
                      label: "女2",
                      align: "center",
                      minWidth: "120"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          prop: "name",
          label: "会员姓名",
          align: "center",
          minWidth: "110"
        },
        {
          prop: "cellphone",
          label: "会员手机号",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "amount",
          label: "订单总金额",
          align: "center",
          minWidth: "125",
          sort: true,
          hj: "price"
        },
        {
          prop: "discount_value",
          label: "优惠金额",
          align: "center",
          minWidth: "125",
          hj: "price"
        },
        {
          prop: "payment",
          label: "支付金额",
          align: "center",
          minWidth: "125"
        },
        {
          prop: "pay_way",
          label: "支付方式",
          align: "center",
          minWidth: "100"
        },

        {
          prop: "product_name",
          label: "项目名称",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "code",
          label: "项目编码",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "total_num",
          label: "套餐总次数",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "use_num",
          label: "使用次数",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "refund_num",
          label: "退款次数",
          align: "center",
          minWidth: "120"
        },
        {
          prop: "refund_payment",
          label: "退款金额",
          align: "center",
          minWidth: "125"
        },
        {
          prop: "refund_way",
          label: "退款方式",
          align: "center",
          minWidth: "125"
        },
        {
          prop: "notes",
          label: "备注信息",
          align: "center",
          minWidth: "150"
        },
        {
          prop: "create_user_name",
          label: "申请人",
          align: "center",
          minWidth: "100"
        },
        {
          prop: "created_at",
          label: "申请日期",
          align: "center",
          minWidth: "170"
        },
        {
          prop: "audit_user_name",
          label: "审核人",
          align: "center",
          minWidth: "100"
        },
        {
          prop: "audit_time",
          label: "审核日期",
          align: "center",
          minWidth: "170"
        },
        {
          prop: "reason",
          label: "审核原因",
          align: "center",
          minWidth: "150"
        },
        {
          prop: "audit_state_name",
          label: "审核状态",
          align: "center",
          minWidth: "100",
          fixed: "right"
        },
        {
          prop: "handle",
          label: "操作",
          width: "220",
          align: "center",
          fixed: "right"
        }
      ]
    };
  },
  methods: {
    // 搜索
    search() {},
    // 重置
    resetForm() {},
    //分页数据
    pagination() {}
  }
};
</script>
