<template>
  <div class="container">
    <el-card>
      <p>welcome</p>

      <div>
        <el-button @click="$router.push('/users')">用户管理</el-button>
      </div>

      <div>
        <el-button type="primary" @click="$router.push('/orders')">订单管理</el-button>
      </div>

      <div>
        <el-button @click="$router.push('/reports')">数据统计</el-button>
      </div>

      <div>
        <el-button @click="$router.push('/roles')">角色管理</el-button>
        <el-button @click="$router.push('/rights')">权限分配</el-button>
      </div>

      <div>
        <el-button type="success" @click="$router.push('/goods')">商品列表</el-button>
        <el-button type="success" @click="$router.push('/categories')">商品分类</el-button>
        <el-button type="success" @click="$router.push('/params')">商品分类参数</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
// .ability-modular {
//   width: 600px;
//   height: 300px;
//   border: #666 1px solid;
//   display: flex;

//   div {
//     width: 100px;
//     height: 100px;
//     margin: 20px;
//     // border: 1px solid yellowgreen;
//     flex-wrap: wrap;
//     background-color: skyblue;
//   }
// }

.container {
  p {
    font-size: 40px;
    font-weight: bold;
  }
  div {
    margin-top: 20px;
  }
}
</style>
