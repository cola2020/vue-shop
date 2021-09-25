<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" size="small" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="TreeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="font-size: 20px; color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="font-size: 20px; color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditCateDialog(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCateDialog(scope.row.id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          :page-sizes="[2, 5, 10, 15]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 对话框视图 -->
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed()">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类列表数据
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总数据条数，用于分页
      total: 0,
      // 为表格指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '真的有效吗',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示模板列的名称
          template: 'isok',
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          // 表示模板列的名称
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          // 表示模板列的名称
          template: 'operation',
        },
      ],
      // 控制添加分类对话框的隐藏与显示
      addCateDialogVisible: false,
      // 添加的分类信息
      addCateForm: {
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类的验证杠规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'click',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      // 所选中的父级分类和子级分类的id
      selectKeys: [],
    }
  },
  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(res.data)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize变化
    handleSizeChange(newSzie) {
      this.queryInfo.pagesize = newSzie
      this.getCateList()
    },
    // 监听页码值的变化
    handleCurrentChange(newPsge) {
      this.queryInfo.pagenum = newPsge
      this.getCateList()
    },
    // 显示添加商品分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: '2' },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败！')
      }
      // console.log(res.data);
      this.parentCateList = res.data
    },
    // 监听级联选择器选中的内容变化
    parentCateChanged() {
      console.log(this.selectKeys)
      // 如果selectKeys中的length大于0，说明选择你红了父级分类
      // 最后一项为分级分类的id
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类事件
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加对话框关闭,重置表单数据
    addCateDialogClosed() {
      // this.addCateForm.cat_name = ''
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    //
    showEditCateDialog(id) {
      console.log(id)
    },
  },
  created() {
    this.getCateList()
    // console.log(this.cateList)
  },
}
</script>

<style lang="less" scoped>
.TreeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>