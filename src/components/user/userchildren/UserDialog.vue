<template>
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVivue"
    width="30%"
    @close="addDialogClose"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="addForm"
      status-icon
      :rules="addFormRules"
      ref="ruleFormRef"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" type="email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="addForm.mobile" type="tell"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVivue = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    // 定义邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobil = (rule, value, cb) => {
      const regPone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regPone.test(value)) {
        return cb
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 添加用户显示与隐藏
      addDialogVivue: false,
      // 添加用户验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // ,
          // {
          //   validator: checkEmail,
          //   trigger: 'blur',
          // },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // ,
          // {
          //   validator: checkMobil,
          //   trigger: 'blur',
          // },
        ],
      },
    }
  },
}
</script>

<style>
</style>