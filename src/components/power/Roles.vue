<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addUsersViews">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="elTagClose(scope.row, item.id)" closable>
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 左侧二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="elTagClose(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右侧三集权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="elTagClose(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editRoles(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delRoled(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="getRoulesDialog(scope.row)"
                >分配权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 打开添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 主体内容 -->
      <el-form :model="usersLisr" label-width="70px" ref="usersLisrRef">
        <el-form-item label="角色名称">
          <el-input v-model="usersLisr.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="usersLisr.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打开编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%">
      <!-- 主体内容 -->
      <el-form :model="editFrom" ref="usersLisrRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesbtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      @close="defkeys = []"
      title="分配权限"
      :visible.sync="ShowDialogVisible"
      width="50%"
    >
      <!-- 树形结构 -->
      <el-tree
        :data="rightsList"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        :props="treeProps"
        show-checkbox
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ShowDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存角色数据
      roleList: [],
      // 添加对话框显示隐藏
      adddialogVisible: false,
      // 编辑对话框显示隐藏
      editDialogVisible: false,
      // 分配权限对话框显示与隐藏
      ShowDialogVisible: false,
      // 接收角色信息
      usersLisr: {
        roleName: '',
        roleDesc: '',
      },
      // 接收修改角色的值
      editFrom: {},
      // 保存权限数据
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的结点值
      defkeys: [],
      // 当前即将分配权限的角色id
      roldId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      this.roleList = res.data
    },
    // 打开添加角色对话框
    addUsersViews() {
      this.adddialogVisible = true
    },
    // 确定添加
    async addDialog() {
      const { data: res } = await this.$http.post('roles', this.usersLisr)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      // 关闭对话框
      this.adddialogVisible = false
      // 提示添加成功
      this.$message.success('添加成功')
      // 刷新数据
      this.getRoleList()
    },
    // 关闭对话框重置
    addDialogClose() {
      // this.$refs.usersLisrRef.resetFields()
      this.usersLisr = {}
    },
    // 删除角色信息
    async delRoled(id) {
      const removeResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (removeResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getRoleList()
      this.$message.success('删除成功')
    },
    // 编辑角色信息对话框
    async editRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 修改用户提交
    async editRolesbtn() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editFrom.roleId,
        {
          roleName: this.editFrom.roleName,
          roleDesc: this.editFrom.roleDesc,
        }
      )
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      // 关闭对话框
      this.editDialogVisible = false
      // 刷新数据
      this.getRoleList()
      // 打印成功提示消息
      this.$message.success('修改成功')
    },

    // 删除三级权限
    async elTagClose(roules, rightId) {
      const confirmRoules = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmRoules !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${roules.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      roules.children = res.data
    },
    // 显示分配权限对话框获取数据
    async getRoulesDialog(role) {
      this.roldId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rightsList = res.data
      this.getLeafKets(role, this.defkeys)
      this.ShowDialogVisible = true
    },
    // 通过递归获取角色下面的所有三集权限，并保存到defkeys 数组中
    getLeafKets(node, arr) {
      // 如果不包含 node.children属性则是三集权限
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKets(item, arr)
      })
    },
    // 点击为角色分配权限
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roldId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.ShowDialogVisible = false
    },
  },
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>