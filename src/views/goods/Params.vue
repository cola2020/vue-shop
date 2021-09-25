<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cate_select">
        <el-col>
          <span>选择商品分类</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader v-model="selectCateKeys" :options="catelist" :props="cateProps" @change="cateChanged" clearable></el-cascader>
        </el-col>
      </el-row>

      <!-- tab区域 -->
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加</el-button>
          <!-- 动态参数的表格 -->
          <el-table :data="manyTableData" style="width: 100%">
            <!-- 展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- scope.row相当于res.data 相当于manyTableData-->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>

                <!-- 添加属性的按钮 -->
                <!-- <div class="addattr_box"> -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加新属性</el-button>
                <!-- </div> -->
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="DeleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->

          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addAttribute">添加</el-button>
          <!-- 静态属性的表格 -->
          <el-table :data="onlyTableData" style="width: 100%">
            <!-- 展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- scope.row相当于res.data 相当于manyTableData-->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>

                <!-- 添加属性的按钮 -->
                <!-- <div class="addattr_box"> -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加新属性</el-button>
                <!-- </div> -->
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="DeleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!--  -->
    </el-card>

    <!-- 对话框区域 -->
    <!-- 添加参数和静态属性的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 提交参数的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
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
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
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
      // 保存商品分类的数组
      catelist: [],
      // 指定级联选择器的配置对象
      cateProps: {
        expandTrigger: 'hover ',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // checkStrictly: true,
      },
      // 级联选择器选中的商品的id数组
      selectCateKeys: [],
      // 被选中的页签
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加对话框是否可见
      addDialogVisible: false,
      // 存储需要添加参数或者属性数据
      addForm: {
        attr_name: '',
      },
      // 验证添加数据的规则
      addFormRules: {
        attr_name: [{ required: true, message: `请输入内容`, trigger: 'blur' }],
      },
      // 控制修改对话框是否可见
      editDialogVisible: false,
      // 根据id查询到的需要修改的数据
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        attr_name: [{ required: true, message: `请输入内容`, trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 获取所有的商品列表分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择框选中发生变化触发
    async cateChanged() {
      this.getParamsData()
    },
    // tab栏切换
    tabChange() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取分类参数列表数据
    async getParamsData() {
      // 如果选中的是三级子节点
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选中项的id数组
      // console.log(this.selectCateKeys)
      // 根据当前所选的分类以及所处于的面板，获取所对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // 将attr_vals里面的字符串转换成数组
      res.data.forEach((item) => {
        ;(item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []),
          // item.attr_vals = item.attr_vals.split(' ')

          // 控制添加属性的文本框显示 默认为false
          (item.inputVisible = false),
          // 添加属性的文本框绑定的数据
          (item.inputValue = '')
      })

      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addParams() {
      // console.log(this.$refs.addFormRef)
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        })

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }

        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 添加静态属性
    addAttribute() {
      this.addDialogVisible = true
    },
    // 监听添加参数、属性对话框关闭
    addDialogClose() {
      console.log(this.$refs.addFormRef)
      this.$refs.addFormRef.resetFields()
    },
    // 显示修改对话框
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: { attr_sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        })

        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }

        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.addDialogVisible = false
      })
      this.editDialogVisible = false
    },
    // 删除参数信息
    async DeleteParams(attr_id) {
      const confirmResult = await this.$confirm('真的要删除吗?', '警告', {
        confirmButtonText: '真的',
        cancelButtonText: '算了',
        type: 'warning',
      }).catch((err) => err)
      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      // 点击确定执行删除
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除数据失败！')
      }
      this.$message.success('删除成功！')
      this.getParamsData()
    },
    // 添加属性的文本框失去焦点，或者点击 enter 后出发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理

      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },

    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(','),
      })

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },

    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },

    // 按下按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      // 当页面全部渲染完成之后，执行该函数
      // row.inputVisible = true执行完这行代码并不说明输入框渲染完成
      // 如果页面还没有完全渲染，即input还没有渲染，就不能获取到获取input
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },

  computed: {
    // 计算属性监听级联选择器是否有选中
    // 选中则可以添加，未选中不能添加
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中的分类的id
    cateId() {
      if (this.selectCateKeys.length == 3) {
        return this.selectCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.cate_select {
  margin: 15px 0;
}

.el-cascader {
  margin-left: 15px;
}

.el-tag {
  margin: 0 15px;
}

.el-input {
  width: 120px;
}
// .addattr_box{
//   margin-left: 15px;
// }
</style>