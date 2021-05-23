<template>
  <div class="app">
    <e-module-widget-title title="学生互评">
      <div class="form-search" style="margin-bottom: 20px">
        <el-form inline :model="search" size="mini">
          <el-form-item label="学生姓名">
            <el-input v-model="search.xingming"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="list-table">
        <el-table border :data="list" stripe highlight-current-row>
          <el-table-column type="index" align="center"></el-table-column>
          <!-- 序号 -->
          <el-table-column label="学号" align="center" prop="xuehao">
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="xingming">
          </el-table-column>
          <el-table-column label="性别" align="center" prop="xingbie">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <div v-if="row.hupingrens!=''">
                <div v-if="row.hupingrens.indexOf(username)==-1">
                  <el-button type="text" @click="huping(row)">
                    互评
                  </el-button>
                </div>
              </div>
              <div v-else>
                <el-button type="text" @click="huping(row)">
                  互评
                </el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 10px; text-align: center">
        <el-pagination @current-change="loadList" :current-page="page" :page-size="15"
          layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </e-module-widget-title>

    <el-dialog :title="headtitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel1" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="学号" prop="xuehao">
            <el-input v-model="form.xuehao" disabled> </el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="form.xingming" disabled> </el-input>
          </el-form-item>
          <el-form-item label="课程名称" prop="kechengid" required>
            <el-select v-model="form.kechengid" style="width: 100%">
              <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="互评分数" prop="hupingfenshu" :rules="[
                { validator: rule.checkNumber, message: '请输入一个有效数字' },
              ]">
            <el-input placeholder="请输入互评分数" v-model="form.hupingfenshu" />
          </el-form-item>

          <el-form-item label="互评人" prop="hupingren">
            <el-input v-model="form.hupingren" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
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
  import rule from "@/utils/rule";

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        headtitle: "",
        rule,
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          banjiid: "",
          xingming: "",
        },
        form: {
          chishu: 0,
          kechengid: "",
          xuehao: "",
          xingming: "",
          hupingneirong: "",
          hupingfenshu: "",
          hupingren: "",
          xueshengid: 0,
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
        banjiList: [],
        zhuanyeList: [],
        kechengmingchengList: [],
        username: ""
      };
    },
    watch: {},
    computed: {},
    methods: {
      huping(row) {
        this.headtitle = "对" + row.xingming + "同学进行评价";
        this.form = row;
        this.form.hupingren = this.$store.state.user.session.username;
        this.dialogVisible = true;
      },
      submit1() {
        this.$refs.formModel1
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            this.form.chishu = 1;
            var form = this.form;
            this.$post(api.xueshenghuping.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("评价成功");
                  this.dialogVisible = false;
                  this.$refs.formModel1.resetFields();
                  this.loadList1(1);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      initKecheng() {
        const params = {};
        params.kechengbianhao = "";
        params.kechengmingcheng = "";
        params.kechengleixing = "";
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
      kechengFormatter(row) {
        var name = "";
        this.kechengmingchengList.forEach(function (item) {
          if (row.kechengid == item.id) {
            name = item.kechengmingcheng;
          }
        });
        return name;
      },
      searchSubmit() {
        this.loadList(1);
      },
      loadList1(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        this.search.banjiid = localStorage.getItem("banjiId");
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          chishu: 1,
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
        this.$post(api.xuesheng.weblist, filter)
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
      loadList(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        this.search.banjiid = localStorage.getItem("banjiId");
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
        this.$post(api.xuesheng.weblist, filter)
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
      selectRadio(target, name) {
        this.search[target] = name;
        this.searchSubmit(1);
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
      this.initKecheng();
      this.username = localStorage.getItem("username")
    },
    mounted() {},
    destroyed() {},
  };
</script>