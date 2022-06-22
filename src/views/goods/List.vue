<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡牌视图区域 -->
    <el-card>
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <!-- append：代表放在紧贴在依赖组件的后面 -->
            <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage()">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 显示数据的table区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" width="140px" prop="goods_price"> </el-table-column>
        <el-table-column label="商品数量" width="140px" prop="goods_number"> </el-table-column>
        <el-table-column label="商品重量" width="140px" prop="goods_weight"> </el-table-column>
        <el-table-column label="添加时间" width="180px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editById(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页面导航区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 对话框区域 -->
    <!-- 修改用户信息对话框 -->
    <!-- <el-dialog title="修改商品信息" :visible.sync="editGoodsdDialogVisible" width="50%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods()">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 存储分页的一些信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 数据条数，用于分页
      total: 0,
      // 存储商品列表的数据
      goodsList: [],
      // 控制修改用户对话框的显示
      editGoodsdDialogVisible: false,
    }
  },
  methods: {
    // 监听页面显示数据条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    // 监听页码的变化
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getGoodsList()
    },

    // 获取商品数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })


      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.total = res.data.total
      this.goodsList = res.data.goods
    },

    // 查询商品
    async queryGoods() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },

    // 显示修改商品的对话框
    async showEditGoodsDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      this.editGoodsdDialogVisible = true
    },

    // 编辑商品
    editGoods() {
      this.editGoodsdDialogVisible = false
    },

    // 删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm('真的要删除码?', '提示', {
        confirmButtonText: '真的',
        cancelButtonText: '算了',
        type: 'warning',
      }).catch((error) => {
        return error
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },

    // 添加商品
    goAddGoodsPage() {
      this.$router.push('goods/add')
    },
    // 监听编辑按钮
    async editById(id) {
      // 根据id查询商品
      const { data: res } = await this.$http.get(`goods/${id}`)

      // 获取商品失败 提示用户
      if (res.meta.status !== 200) return this.$message.error('获取商品数据失败！')

      // 获取成功 保存数据到vuex
      this.$store.commit('setGoodInfo', res.data)
      // 跳转到edit组件
      this.$router.push('/goods/edit')
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style lang="less" scoped>
</style>