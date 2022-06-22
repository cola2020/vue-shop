<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header style="height: 60px">
      <div>
        <span @click="goHomePage()">电商后台管理系统</span>
      </div>
      <!-- <el-button type="info" round @click="logout" size="small">logout</el-button> -->
      <el-dropdown @command="handleCommand">
        <!-- <span class="el-dropdown-link"> 下拉菜单 </span> -->
        <div class="avator"></div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="signout">退出</el-dropdown-item>
        </el-dropdown-menu>
        <!--  -->
      </el-dropdown>
    </el-header>
    <!-- 页面主体 -->
    <el-container class="content-content">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!-- 侧边栏菜单区域 -->
        <!-- 开启路由模式 -->
        <el-menu
          background-color="#34495e"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          ref="subMenu"
          @open="handleOpen"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <span class="span_style">{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavstate('/' + subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
            <!-- /二级菜单 -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'el-icon-user',
        103: 'el-icon-help',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-tickets',
        145: 'el-icon-data-line',
      },
      // 是否被折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      // 保存当前展开的 menu 的 index
      index: 0,
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getmenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(res)
    },
    // 折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavstate(activePath) {
      // console.log("hello");
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    },

    // 获取 menu 的 index
    handleOpen(key) {
      // console.log(key)
      this.index = key
    },

    //
    async handleCommand(command) {
      if (command == 'home') {
        this.$router.push('/welcome')
        this.$refs.subMenu.close(this.index)
      } else if (command == 'signout') {
        this.logout()
      }
    },

    // 点击标题回到首页
    goHomePage() {
      this.$router.push('/welcome')
    },
  },
  // 页面显示之前进行的操作
  created() {
    // console.log('hello');
    this.getmenuList(), (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  watch: {
    $route(to, from) {
      // console.log('from', from.path) //从哪来
      // console.log(to.path) //到哪去
      if (to.path === '/welcome') {
        // console.log(11)
        this.activePath = ''
        window.sessionStorage.setItem('activePath', '')

        this.$refs.subMenu.close(this.index)
        // console.log(22)
        // console.log(this.$refs.subMenu)
        // window.location.reload()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

  div {
    // background-color: red;
    display: flex;
    align-items: center;
    // justify-content: center;
    font-size: 20px;

    span {
      margin-left: 10px;
      cursor: pointer;
    }

    // 头像的样式
    .avator {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 20px;
      background-color: #ffffff;
    }
  }
}

// 侧边栏
.el-aside {
  background-color: #34495e;
  height: 100%;
  overflow-x: hidden;
  // position: absolute;
  // top: 60px;
  transition: width 0.5s;
  // position: fixed;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  // margin-left: 200px;
  // margin-top: 60px;
  // position: absolute;
  // left: 200px;
  // overflow-y: scroll;
}

.home_container {
  height: 100%;
}

.content-content {
  // margin-top: 60px;
  height: 100vh - 60px;
}

.span_style {
  margin-left: 5px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
