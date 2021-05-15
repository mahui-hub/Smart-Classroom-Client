<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible :style="{ overflow: 'auto' }">
      <div class="logo">
        <span>智慧课堂教学系统</span>
      </div>
      <div>
        <a-menu theme="dark" :open-keys="openKeys" @openChange="onOpenChange" mode="inline"
          :default-selected-keys="defaultSelectedKeys">
          <a-sub-menu v-for="r in menus" :key="r.label" style="height:100%;">
            <span slot="title">
              <span class="el-icon-s-platform" v-text="r.label"></span></span>
            <a-menu-item v-for="(v, b) in r.children" :key="b">
              <router-link :to="v.to">
                {{ v.label }}
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;display:flex;justify-content: space-between;">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)" />
        <div class="toolbar">
          <el-button type="text" @click="but(1)" size="large">
            前端首页
          </el-button>
          <el-button type="text" @click="but(2)" size="large">
            修改密码
          </el-button>
          <el-button type="text" @click="but(3)" size="large">
            退出
          </el-button>
        </div>
      </a-layout-header>
      <a-layout-content :style="{
          margin: '24px 16px 0',
          padding: '20px',
          background: '#fff',
          minHeight: '280px',
        }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import api from "@/api";
  import menu from "@/layout/end/sidebar";
  export default {
    data() {
      return {
        collapsed: false,
        active: 0,
        showExitDialog: false,
        defaultSelectedKeys: [0],
        rootSubmenuKeys: [],
        openKeys: [],
      };
    },
    computed: {
      menus() {
        var cx = this.$session.cx;
        return menu[cx];
      },
    },
    methods: {
      initArray() {
        var array = [];
        var array1 = [];
        this.menus.map(function (e) {
          array.push(e.label);
          array.push(array[0]);
        });
        this.rootSubmenuKeys = array;
        this.openKeys = array1;
      },
      onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(
          (key) => this.openKeys.indexOf(key) === -1
        );
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys;
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      },
      but(id) {
        if (id == 1) {
          this.$router.push("/index");
        } else if (id == 2) {
          this.$router.push("/end/mod");
        } else if (id == 3) {
          this.logout();
        }
      },
      logout() {
        this.$confirm("确定退出登录？").then(() => {
          // 退出登录
          this.$store
            .dispatch("user/logout")
            .then((res) => {
              if (res.code == api.code.OK) {
                this.$message.success("退出成功");
                localStorage.clear();
                this.$router.replace("/index");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        });
      },
    },
    created() {
      this.initArray();
    },
    mounted() {},
    destroyed() {},
  };
</script>

<style lang="scss" scoped>
  #components-layout-demo-custom-trigger {
    height: 100%;

    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    .toolbar {
      text-align: right;
    }
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    margin: 16px 0;
    text-align: center;

    // position: fixed;
    span {
      text-align: center;
      margin: 50px 0;
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      font-size: 18px;
      font-weight: bolder;
      background-image: -webkit-linear-gradient(bottom, red, #fd8403, yellow);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .ant-layout-sider-children {
    overflow-y: scroll;
  }
</style>