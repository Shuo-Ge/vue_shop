<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="警告：只允许第三级分类设置相关的属性"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="castList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >动态属性</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >静态属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTabCata" style="width: 100%" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showDialog(scope.row.arrt_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数、属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDiologClose"
    >
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDiologClose"
    >
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存商品信息
      castList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //   保存级联选择的数据
      selectCateKeys: [],
      //   显示的标签页
      activeName: 'many',
      // 动态参数数据
      manyTabData: [],
      // 静态参数数据
      onlyTabCata: [],
      // 对话框显示与隐藏
      addDialogVisible: false,
      // 双向绑定数据
      addForm: {
        attr_name: '',
      },
      // 添加验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      // 修改对话框显示与隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 修改表单验证
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      // 文本框的显示
      inputVisible: false,
      // 文本框绑定的值
      inputValue: '',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品失败')
      }
      this.castList = res.data
    },
    // 级联选择框选中改变的变化
    handleChange() {
      this.getParamsData()
    },
    // 标签页点击事件
    handleClick() {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      //  判断是否是三级分类
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTabData = []
        this.onlyTabCata = []
        return
      }
      //   证明是三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.isId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('请求错误')
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 文本框的显示
        item.inputVisible = false
        // 文本框绑定的值
        item.inputValue = ''
      })

      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabCata = res.data
      }
    },
    // 重置表单
    addDiologClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交表单添加
    addParams() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return
        const { data: res } = await this.$http.post(
          `categories/${this.isId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 打开编辑对话框
    async showDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.isId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('查询失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭重置修改表单
    editDiologClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改提交按钮
    async editParams() {
      const { data: res } = await this.$http.put(
        `categories/${this.isId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('提交失败')
      }
      this.$message.success('提交成功')
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 删除的业务逻辑
    async removeParams(attr_id) {
      const comfirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (comfirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.isId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 文本失去焦点或者按下enter建
    async handleInputConfirm(row) {
      // 判断文本是否有值
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 须要发送的请求
      this.saveAttrVals(row)
    },
    // 将对attra_vals的数据保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.isId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    // 按下按钮显示文本
    showInput(row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    isId() {
      if (this.selectCateKeys.length == 3) {
        return this.selectCateKeys[2]
      }
      return null
    },
    // 改变title文本
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 120px;
}
</style>