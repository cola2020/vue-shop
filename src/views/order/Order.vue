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
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 显示数据的table区域 -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="订单号" prop="order_number"> </el-table-column>
        <el-table-column label="价格" prop="order_price"> </el-table-column>

        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="ordersList">
            <el-tag v-if="ordersList.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>

        <el-table-column label="下单时间" width="180px" prop="create_time">
          <template v-slot="ordersList">
            {{ ordersList.row.create_time | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddressDialog"> </el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页面导航区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>

    <!-- 对话框区域 -->
    <!-- 展修改地址对话框 -->
    <el-dialog title="提示" :visible.sync="showAddressDialogVisible" width="50%" @close="showAddressDialogClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="address1Props" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showAddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="showProgressDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      // 存储获取到的订单列表
      ordersList: [],
      // 存储分页的信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 订单总数
      total: 0,
      // 控制修改地址的对话框是否可见
      showAddressDialogVisible: false,
      // 保存地址数据
      addressForm: {
        address1: [],
        address2: '',
      },
      // 验证地址
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '抱歉,请输入详细地址', trigger: 'blur' }],
      },
      // 城市数据
      cityData: cityData,
      // 地址级联选择器配置对象
      address1Props: {
        expandTrigger: 'hover',
      },
      // 控制显示物流进度对话框显示
      showProgressDialogVisible: false,
      // 存储物流进度
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ],
    }
  },
  methods: {
    // 监听页面显示数据条数变化
    handleSizeChange(newSize) {
      //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听页码的变化
    handleCurrentChange(newCurrent) {
      //   console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getOrdersList()
    },
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }

      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 展示修改订单信息的对话框
    edit(row) {
      console.log(row)
    },
    // 显示修改地址的对话框
    showAddressDialog() {
      this.showAddressDialogVisible = true
    },
    // 显示修改地址的对话框关闭
    showAddressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流进度
    // async showProgressBox() {
    //   const { data: res } = await this.$http.get('kuaidi/11')
    //   console.log(res);
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取物流消息失败！')
    //   }

    //   this.progressInfo = res.data
    //   console.log(this.progressInfo);
    //   this.showProgressDialogVisible = true
    // },
    async showProgressBox() {
      // const { data: res } = await this.$http.get('/kuaidi/12121212')

      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败！')
      // }

      // this.progressInfo = res.data
      // console.log(this.progressInfo);
      this.showProgressDialogVisible = true
      // console.log(this.progressInfo)
    },
  },
  created() {
    this.getOrdersList()
  },
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
</style>