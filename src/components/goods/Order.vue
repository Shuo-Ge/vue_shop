<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="6">
          <el-input
            v-model="querInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="showQuery"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            <div>{{ scope.row.create_time | dataFormate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" @click="showDiaolgOrder"
            >编辑</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-location"
            @click="showProgressBox"
            >地址</el-button
          >
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDiologClose"
      >
        <el-form
          :model="addressForm"
          status-icon
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="县/市" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <span>这是一段信息</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      querInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20,
      },
      //   保存订单数据
      orderList: [],
      // 总数
      total: 0,
      //   对话框显示与隐藏
      dialogVisible: false,
      // 绑定表单数据
      addressForm: {
        address1: [],
        address2: '',
      },
      //   验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请输入市县区', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      //   物流进度对话框
      progressVisible: false,
      //   物流信息
      progressInfo: {},
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    //   获取订单数据
    async getOrder() {
      const { data: res } = await this.$http.get('orders', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求订单数据失败')
      }
      console.log(res.data)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getOrder()
    },
    handleCurrentChange(newNum) {
      this.querInfo.pagenum = newNum
      this.getOrder()
    },
    showQuery() {
      this.getOrder()
    },
    // 展示对话框
    showDiaolgOrder() {
      this.dialogVisible = true
    },
    // 重置表单
    addDiologClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流信息
    // async showProgressBox() {
    // this.progressVisible = true
    //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('查询失败')
    //   }
    //   this.progressInfo = res.data
    //   this.progressVisible = false
    // },
  },
}
</script>

<style>
</style>