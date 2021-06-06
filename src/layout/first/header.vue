<template>
  <div class="header">
    <el-row :gutter="10">
      <el-col :span="4" class="logo">
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
      </el-col>

      <el-col :span="4">
        <template v-if="role!='管理员'">
          <el-dropdown style="float:left">
            <el-badge :value="list.length" class="item" type="warning">
              <el-button type="primary" size="mini">我的消息
              </el-button>
            </el-badge>
            <el-dropdown-menu slot="dropdown">
              <div v-for="o in list" :key="o.id">
                <el-dropdown-item v-if="role=='教师'" @click.native="dialogTableVisible = true">
                  <span v-if="o.dayineirong==''">
                    <el-tag type="danger">暂未解答</el-tag>
                    <span style="margin-left:10px;">您有一条来自 {{o.qiuzhuren}}的消息</span>
                  </span>
                  <span v-if="o.dayineirong!=''">
                    <el-tag type="success">已解答</el-tag>
                    <span style="margin-left:10px;">您有一条来自 {{o.qiuzhuren}}的消息</span>
                  </span>
                </el-dropdown-item>
                <el-dropdown-item v-if="role=='学生'" @click.native="dialogTableVisible = true">
                  <span v-if="o.dayineirong==''">
                    <el-tag type="danger">暂未解答</el-tag>
                    <span style="margin-left:10px;">您将收到来自 {{o.jiedaren}}的消息</span>
                  </span>
                  <span v-if="o.dayineirong!=''">
                    <el-tag type="success">已解答</el-tag>
                    <span style="margin-left:10px;">您有一条来自 {{o.jiedaren}}的消息</span>
                  </span>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-if="$session.username">
          <el-dropdown style="float:right">
            <el-button type="primary" size="mini" style="margin-right:0">
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

      </el-col>
    </el-row>
    <el-dialog title="答疑问题列表" :visible.sync="dialogTableVisible" width="65%" :modal-append-to-body="false">
      <el-table border :data="list" stripe highlight-current-row>
        <el-table-column type="index" label=" "></el-table-column>
        <el-table-column label="课程名称" align="center" show-overflow-tooltip :formatter="kechengFormatter">
        </el-table-column>
        <el-table-column label="问题标题" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }"> {{ row.wentibiaoti }} </template>
        </el-table-column>
        <el-table-column label="问题内容" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }"> {{ row.wentineirong }} </template>
        </el-table-column>
        <el-table-column label="答疑内容" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div v-if="row.dayineirong==''">
              <el-tag type="danger">暂未解答</el-tag>
            </div>
            <div v-else>
              <span> {{ row.dayineirong }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="答疑状态" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div v-if=" row.dayineirong==''">
              <el-tag type="danger">暂未解答</el-tag>
            </div>
            <div v-else>
              <el-tag type="success">已解答</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="success" @click="dayiItem(row)" v-if="role=='教师'">解答</el-button>
            <el-button type="success" @click="dayiItem(row)" v-if="role=='学生'">查看答案</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="答疑问题列表" :visible.sync="dialogVisible" :modal-append-to-body="false">
      <el-collapse v-model="activeName" accordion v-if="role=='学生'">
        <div v-for="o in list" :key="o.id">
          <el-collapse-item title="问题标题" name="1">
            <div>{{o.wentibiaoti}}</div>
          </el-collapse-item>
          <el-collapse-item title="问题内容" name="2">
            <div>{{o.wentineirong}}</div>
          </el-collapse-item>
          <el-collapse-item title="求助人" name="3">
            <div>{{o.qiuzhuren}}</div>
          </el-collapse-item>
          <el-collapse-item title="答疑内容" name="4">
            <div>{{o.dayineirong}}</div>
          </el-collapse-item>
        </div>
      </el-collapse>
      <span slot="footer" class="dialog-footer" v-if="role=='学生'">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      <div class="form-database-form" v-if="role=='教师'">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="问题标题" prop="wentibiaoti">
            <el-input v-model="form.wentibiaoti" disabled> </el-input>
          </el-form-item>
          <el-form-item label="问题内容" prop="wentineirong">
            <el-input v-model="form.wentineirong" type="textarea" :rows="3" disabled> </el-input>
          </el-form-item>
          <el-form-item label="求助人" prop="qiuzhuren">
            <el-input v-model="form.qiuzhuren" disabled> </el-input>
          </el-form-item>
          <el-form-item label="答疑内容" prop="dayineirong">
            <el-input v-model="form.dayineirong" type="textarea" :rows="3"> </el-input>
          </el-form-item>
          <el-form-item label="解答人" prop="jiedaren">
            <el-input v-model="form.jiedaren" disabled> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" v-if="role!='学生'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
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
        form: {
          kechengid: "",
          dayineirong: "",
          wentibiaoti: "",
          wentineirong: "",
          qiuzhuren: this.$store.state.user.session.username,
          jiedaren: ""
        },
        activeName: 1,
        dialogTableVisible: false,
        dialogVisible: false,
        list: [],
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
      dayiItem(row) {
        if (this.role == '学生') {
          if (row.dayineirong == '') {
            this.$message({
              message: '您的问题暂未解答哦!',
              type: 'warning'
            });
            return
          } else {
            this.dialogVisible = true
          }
        }
        if (this.role == '教师') {
          if (row.dayineirong != '') {
            this.$message({
              message: '您已解答问题!',
              type: 'warning'
            });
            return
          } else {
            this.dialogVisible = true
            this.form = row
          }
        }
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            var form = this.form;
            this.$post(api.liuyan.update, form)
              .then((res) => {
                if (res.code == api.code.OK) {
                  this.$message.success("解答成功");
                  this.dialogVisible = false;
                  this.dialogTableVisible = false;
                  this.$refs.formModel.resetFields();
                  this.$router.go(0)
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      kechengFormatter(row) {
        var name = "";
        this.kechengmingchengList.forEach(function (item) {
          if (row.kechengid == item.id) {
            name = item.kechengmingcheng;
          }
        });
        return name;
      },
      initKecheng() {
        const params = {};
        params.banjiid = localStorage.getItem("banjiId");
        params.pagesize = 10;
        params.page = 1;
        this.$post(api.kecheng.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      loadList() {
        const params = {}
        if (localStorage.getItem('role') == "教师") {
          params.jiedaren = localStorage.getItem('username')
        } else if (localStorage.getItem('role') == "学生") {
          params.qiuzhuren = localStorage.getItem('username')
        }
        this.$post(api.liuyan.weblist, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.list = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {

            this.$message.error(err.message);
          });
      },
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
      this.loadList()
      this.initKecheng()
    },
    mounted() {},
    destroyed() {},
  };
</script>

<style lang="scss" scoped>
  .el-badge {
    vertical-align: unset;
  }

  .header {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 5px #3f556b;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    line-height: 60px;
    padding-top: 5px;

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


  }
</style>
<style lang="scss">
  .el-badge__content {
    margin-top: 13px;
    margin-right: 10px;
  }
</style>