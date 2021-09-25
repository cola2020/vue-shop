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
      <!-- 提示区域 -->
      <el-alert title="编辑商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form表单需要包围tab栏 -->
      <el-form :model="editForm" :rules="editRules" ref="ruleForm" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop>
              <el-cascader
                v-model="editForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="editForm.goods_introduce"></quill-editor>
            <el-button class="btn" @click="edit" type="primary">确认修改</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="picPreviewVisible" width="50%">
      <img :src="previewPath" class="previewPic" />
    </el-dialog>
  </div>
</template>

<script>
var _ = require('lodash')

export default {
  data() {
    return {
      activeIndex: '0',
      // 编辑表单数据对象
      editForm: {},
      // 编辑表单规则
      editRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
      // 商品分类列表数据
      cateList: [],
      // 级联选择框配置项
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片路径
      previewPath: [],
      // 控制图片预览窗口是否显示
      picPreviewVisible: false,
    }
  },
  created() {
    // 获取编辑商品数据
    this.editForm = this.$store.state.goodInfo
    // 调用获取分类列表数据
    this.getCateList()
    // 得到转换后的 goods_cat值
    var newAyy = []
    this.editForm.goods_cat.split(',').forEach((item) => newAyy.push(item - 0))
    this.editForm.goods_cat = newAyy
  },
  methods: {
    // 获取分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表数据失败！')
      }

      this.cateList = res.data
    },
    // 级联选择项变化触发
    handleChange() {
      // 选中非三级叶子节点分类清空
      console.log(this.editForm.goods_cat)
      if (this.editForm.goods_cat.length !== 3) this.editForm.goods_cat = []
    },
    // tab栏切换之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      // 如果在第一个栏中的商品分类没有选中则不可以切换tab栏
      if (oldActiveName === '0' && this.editForm.goods_cat.length !== 3) {
        this.$message.error('请先选中商品分类！')
        return false
      }
    },
    // tab栏单击事件
    async tabClicked() {
      // 访问的是动态参数列表
      if (this.activeIndex === '1') {
        // 获取动态参数列表
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' },
        })

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        // 将attr_vals 转换为数组格式存储
        res.data.forEach((item) => {
          // 空数组不需要转换
          item.attr_vals.length === 0 ? (item.attr_vals = []) : (item.attr_vals = item.attr_vals.split(','))
        })
        // 成功获取数据 保存数据
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }

      // 访问的是静态属性列表
      if (this.activeIndex === '2') {
        // 获取静态属性列表
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' },
        })

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败！')
        }

        // 成功获取数据 保存数据
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      // 保存图片预览路径
      this.previewPath = file.response.data.url
      // 显示预览图片对话框
      this.picPreviewVisible = true
    },
    // 处理移除图片效果
    handleRemove(file) {
      console.log(file)
      // 1. 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片的索引值
      const index = this.editForm.pics.findIndex((item) => item.pic === filePath)
      // 2. 掉用数组的splice方法, 把图片信息对象，从pics数组中删除
      this.editForm.pics.splice(index, 1)
      console.log(this.editForm.pics)
    },
    // 监听图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象push到 pics数组中
      this.editForm.pics.push(picInfo)
      console.log(this.editForm.pics)
    },
    // 监听单击编辑按钮
    edit() {
      console.log(this.editForm.goods_introduce)
      // 表单核实
      this.$refs.ruleForm.validate(async (valid) => {
        // 验证失败 提示用户
        if (!valid) return this.$message.error('请填写必要的表单项')

        // 执行编辑业务逻辑
        // loadsh cloneDeep(obj)
        // 深拷贝表单 解决级联选择器数据只能是数组的冲突问题
        var form = _.cloneDeep(this.editForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.editForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.editForm.attrs.push(newInfo)
        })
        // 将处理过的动态参数和静态属性保存到深拷贝的form中
        form.attrs = this.editForm.attrs
        console.log(form)

        // 发起请求编辑商品
        const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, form)
        console.log(res)
        if (res.meta.status !== 201) this.$message.success('编辑商品失败!')

        this.$message.success('编辑商品成功！')
        // 跳转到商品列表页面
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    // 分类id
    cateId() {
      // 如果选中不是三级分类返回null 否则返回商品id
      if (this.editForm.goods_cat.length !== 3) return null
      return this.editForm.goods_cat[2]
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewPic {
  width: 100%;
}
.btn {
  margin-top: 15px;
}
</style>