<template>
  <div class="app">
    <el-tabs type="card">
      <el-tab-pane label="问题搜索">
        <div class="form-search" style="margin-bottom: 20px">
          <el-form inline @submit.prevent.stop size="mini">
            <el-form-item label="课程名称">
              <el-input v-model="search.kechengmingcheng"></el-input>
            </el-form-item>
            <el-form-item label="问题标题">
              <el-input v-model="search.wentibiaoti"></el-input>
            </el-form-item>
            <el-form-item label="问题内容">
              <el-input v-model="search.wentineirong"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="list-table">
          <el-table border :data="list" stripe highlight-current-row>
            <el-table-column type="index" label=" "></el-table-column>
            <!-- 序号 -->
            <el-table-column label="课程名称" align="center" show-overflow-tooltip :formatter="kechengFormatter">
              <!-- <template slot-scope="{ row }"> {{ row.kechengmingcheng }} </template> -->
            </el-table-column>
            <el-table-column label="问题标题" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }"> {{ row.wentibiaoti }} </template>
            </el-table-column>
            <el-table-column label="问题内容" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }"> {{ row.wentineirong }} </template>
            </el-table-column>
            <el-table-column label="求助人" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }"> {{ row.qiuzhuren }} </template>
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
            <el-table-column label="解答人" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }"> {{ row.jiedaren }} </template>
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
                <el-button type="success" @click="viewItem(row)">查看答案</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="margin-top: 10px;text-align: center">
          <el-pagination @current-change="loadList" :current-page="page" :page-size="15"
            layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="求助教师">
        <div class="form-search" style="margin-bottom: 20px">
          <el-form inline @submit.prevent.stop>
            <el-form-item label="工号">
              <el-input v-model="search.gonghao"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="search.xingming"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="list-table">
          <el-table :data="jiaoshilist1" border :cell-style="CellStyle" stripe highlight-current-row>
            <el-table-column type="index" label=" "></el-table-column>
            <el-table-column prop="gonghao" label="教师工号" align="center">
            </el-table-column>
            <el-table-column prop="xingming" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="xingbie" label="性别" align="center">
            </el-table-column>
            <el-table-column prop="qqhao" label="QQ号" align="center">
              <template slot-scope="{ row }">
                <el-link type="warning" @click="lianjie(row.qqhao)"> {{ row.qqhao }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="shouji" label="联系电话" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <!-- @click="editItem(row)" -->
                <el-button type="success" @click="dayiItem(row)">求助</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="在线答疑" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="课程名称" prop="kechengid">
            <el-select v-model="form.kechengid" style="width: 100%" clearable>
              <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题标题" prop="wentibiaoti">
            <el-input v-model="form.wentibiaoti"> </el-input>
          </el-form-item>
          <el-form-item label="问题内容" prop="wentineirong">
            <el-input v-model="form.wentineirong" type="textarea" :rows="3"> </el-input>
          </el-form-item>
          <el-form-item label="求助人" prop="qiuzhuren">
            <el-input v-model="form.qiuzhuren" disabled> </el-input>
          </el-form-item>
          <!-- <el-form-item label="答疑内容" prop="dayineirong">
            <el-input v-model="form.dayineirong"> </el-input>
          </el-form-item> -->
          <el-form-item label="解答人" prop="jiedaren">
            <el-input v-model="form.jiedaren" disabled> </el-input>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="答疑问题列表" :visible.sync="dialogVisible1">
      <el-collapse v-model="activeName" accordion>
        <div v-for="o in list1" :key="o.id">
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>

<script>
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";
  import objectDiff from "objectdiff";

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        activeName: 1,
        kechengmingchengList: [],
        dialogVisible: false,
        dialogVisible1: false,
        loading: false,
        list: [],
        list1: [],
        search: {
          kechengmingcheng: "",
          wentibiaoti: "",
          wentineirong: "",
          dayineirong: "",
          xuehao: "",
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
        jiaoshilist1: [],
        form: {
          kechengid: "",
          wentibiaoti: "",
          wentineirong: "",
          qiuzhuren: this.$store.state.user.session.username,
          jiedaren: ""
        }
      };
    },
    watch: {},
    computed: {},
    methods: {
      kechengFormatter(row) {
        var name = "";
        this.kechengmingchengList.forEach(function (item) {
          if (row.kechengid == item.id) {
            name = item.kechengmingcheng;
          }
        });
        return name;
      },
      dayiItem(row) {
        this.form.jiedaren = row.gonghao
        this.dialogVisible = true
        this.initKecheng(row.id)
      },
      viewItem(row) {
        this.list1 = []
        if (row.dayineirong == '') {
          this.$message({
            message: '问题暂未解答!',
            type: 'error'
          });
          return
        } else {
          this.list1.push(row)
          this.dialogVisible1 = true
          this.form = row
        }

      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            var form = this.form;
            this.$post(api.liuyan.insert, form)
              .then((res) => {
                if (res.code == api.code.OK) {
                  this.$message.success("求助成功");
                  this.dialogVisible = false;
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
      initKecheng(jiaoshiid) {
        const params = {};
        params.banjiid = localStorage.getItem("banjiId");
        params.jiaoshiid = jiaoshiid
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
      CellStyle(row, column, rowIndex, columnIndex) {
        if (row.column.label == "QQ号") {
          return "color:#389DFF;text-decoration: underline;cursor: pointer;";
        }
      },
      lianjie(QQ) {
        window.open(
          "http://wpa.qq.com/msgrd?v=3&uin=" + QQ + "&site=qq&menu=yes",
          "_blank"
        );
      },
      searchSubmit() {
        this.loadList(1);
      },
      loadList(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });
        var diff = objectDiff.diff(filter, this.$route.query);
        if (diff.changed != "equal") {
          // 筛选的条件不一致则更新链接
          this.$router.replace({
            // 更新query
            path: this.$route.path,
            query: filter,
          });
        }
        this.$post(api.liuyan.weblist, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
    },
    beforeRouteUpdate(to, form, next) {
      var search = extend(this.search, to.query);
      if (search.page) {
        this.page = Math.floor(to.query.page);
        delete search.page;
      }
      if (search.pagesize) {
        this.pagesize = Math.floor(to.query.pagesize);
        delete search.pagesize;
      }
      this.loadList(1);
      next();
    },
    created() {
      var search = extend(this.search, this.$route.query);
      if (search.page) {
        this.page = Math.floor(this.$route.query.page);
        delete search.page;
      }
      if (search.pagesize) {
        this.pagesize = Math.floor(this.$route.query.pagesize);
        delete search.pagesize;
      }
      this.loadList(this.page);
      this.initKecheng()
    },
    mounted() {},
    destroyed() {},
  };
</script>