<template>
  <div class="header">
    <el-row :gutter="10">
      <el-col :span="5" class="logo">
        <span> {{ setting.title }}</span>
      </el-col>
      <el-col :span="16">
        <!-- 改为element导航栏 -->
        <el-menu :default-active="activeIndex" mode="horizontal" background-color="#ffffff" text-color="#5a9c15"
          active-text-color="#5a9c15" @select="handleSelect" menu-trigger="click" class="myElMenu">
          <el-menu-item v-for="m in menuList" :key="m.id" :index="m.id" v-if="m.role == role">
            <router-link :to="m.path">{{ m.menuName }}</router-link>
          </el-menu-item>
        </el-menu>
        <!--main menu end-->
      </el-col>
      <el-col :span="3">
        <div class="header_account_area">
          <template v-if="$session.username">
            <el-dropdown>
              <el-button type="primary" size="mini">
                {{ $session.username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user-solid" @click.native="end">个人中心
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning" @click.native="logout">退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" size="mini" @click="$router.push('/login')">登录
            </el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";

  const setting = require("@/setting");
  export default {
    data() {
      return {
        role: "",
        activeIndex: "1",
        showSearch: false,
        keyword: "",
        setting,
        listMenukechengleixing: [],
        menuList: [{
            id: "1",
            menuName: "首页",
            path: "/",
            role: "管理员",
          },
          {
            id: "1",
            menuName: "首页",
            path: "/",
            role: "教师",
          },
          {
            id: "1",
            menuName: "首页",
            path: "/",
            role: "学生",
          },
          {
            id: "2",
            menuName: "课程中心",
            path: "/kecheng",
            role: "管理员",
          },
          {
            id: "2",
            menuName: "课程中心",
            path: "/kecheng",
            role: "教师",
          },
          {
            id: "2",
            menuName: "课程中心",
            path: "/kecheng",
            role: "学生",
          },
          {
            id: "3",
            menuName: "公告信息",
            path: "/gonggao",
            role: "教师",
          },
          {
            id: "3",
            menuName: "公告信息",
            path: "/gonggao",
            role: "管理员",
          },
          {
            id: "3",
            menuName: "公告信息",
            path: "/gonggao",
            role: "学生",
          },
          {
            id: "5",
            menuName: "交流互动",
            path: "/tiezi",
            role: "学生",
          },
          {
            id: "5",
            menuName: "交流互动",
            path: "/tiezi",
            role: "教师",
          },
          {
            id: "5",
            menuName: "交流互动",
            path: "/tiezi",
            role: "管理员",
          },

          {
            id: "7",
            menuName: "教学评价",
            path: "/tiku",
            role: "学生",
          },
          {
            id: "8",
            menuName: "抢答问题",
            path: "/wentiqiangda",
            role: "学生",
          },
          {
            id: "9",
            menuName: "在线答疑",
            path: "/wentisousuo",
            role: "学生",
          },
          {
            id: "4",
            menuName: "学生互评",
            path: "/xuesheng",
            role: "学生",
          },
          {
            id: "10",
            menuName: "在线考勤",
            path: "/keqiankaoqin",
            role: "学生",
          },

          {
            id: "11",
            menuName: "随堂测试",
            path: "/suitangceshi",
            role: "学生",
          },
          {
            id: "6",
            menuName: "资源中心",
            path: "/ziyuan",
            role: "学生",
          },
          {
            id: "6",
            menuName: "资源中心",
            path: "/ziyuan",
            role: "教师",
          },
          {
            id: "6",
            menuName: "资源中心",
            path: "/ziyuan",
            role: "管理员",
          },
        ],
      };
    },
    methods: {
      end() {
        this.$router.push("/end/sy");
      },
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
      searchKeyword() {
        var filter = {};
        filter["kechengmingcheng"] = this.keyword;
        this.$router.push({
          path: "/kecheng",
          query: filter,
        });
      },
      logout() {
        this.$confirm("确定退出登录？", "确认信息").then(() => {
          // 退出登录
          localStorage.clear();
          this.$store.dispatch("user/logout");
          this.$router.push("/login");
        });
      },
      // 课程信息
      loadListMenu(module, target) {
        this.$post(api.search.all, {
          table: module,
          order: "id desc"
        }).then(
          (res) => {
            this[target] = res.data;
          }
        );
      },
    },
    created() {
      this.loadListMenu("kechengleixing", "listMenukechengleixing");
      this.role = localStorage.getItem("role");
    },
    mounted() {},
    destroyed() {},
  };
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 5px #3f556b;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;

    .el-row {
      .logo {
        text-align: center;

        span {
          font-size: 22px;
          font-weight: bolder;
          color: #5a9c15;
          line-height: 60px;
        }
      }
    }

    .header_account_area {
      text-align: center;
      line-height: 60px;
    }
  }
</style>