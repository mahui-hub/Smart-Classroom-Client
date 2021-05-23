<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
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
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" stripe highlight-current-row>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->

      <el-table-column label="课程名称" align="center">
        <template slot-scope="{ row }"> {{ row.kechengmingcheng }} </template>
      </el-table-column>
      <el-table-column label="问题标题" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.wentibiaoti }} </template>
      </el-table-column>
      <el-table-column label="问题内容" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.wentineirong }} </template>
      </el-table-column>
      <el-table-column label="答疑内容" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.dayineirong }} </template>
      </el-table-column>
      <el-table-column label="发布人" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.xuehao }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/wentisousuodetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>
          <el-button @click="edit(row)" v-if="row.xuehao == username" type="text">编辑</el-button>

          <el-button type="text" v-if="row.xuehao == username" @click="deleteItem(row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 添加答疑问题 -->
    <el-dialog title="添加答疑问题" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="课程名称" prop="kechengmingcheng" required>
            <!-- <el-input
              placeholder="请输入课程名称"
              v-model="form.kechengmingcheng"
            /> -->
            <el-select v-model="form.kechengmingcheng" style="width: 100%" clearable>
              <el-option v-for="m in kechengmingchengList" :key="m.kechengmingcheng" :value="m.kechengmingcheng"
                :label="m.kechengmingcheng"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="问题标题" prop="wentibiaoti" required>
            <el-input type="textarea" v-model="form.wentibiaoti"></el-input>
          </el-form-item>

          <el-form-item label="问题内容" prop="wentineirong" required>
            <el-input type="textarea" v-model="form.wentineirong"></el-input>
          </el-form-item>

          <el-form-item label="答疑内容" prop="dayineirong" required>
            <el-input type="textarea" :rows="5" v-model="form.dayineirong"></el-input>
          </el-form-item>

          <el-form-item label="发布人" prop="xuehao" required>
            <el-input v-model="form.xuehao" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑答题内容 -->
    <el-dialog title="编辑答疑问题" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form :model="form1" ref="formModel1" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="课程名称" prop="kechengmingcheng" required>
            <el-input placeholder="输入课程名称" v-model="form1.kechengmingcheng" />
          </el-form-item>

          <el-form-item label="问题标题" prop="wentibiaoti" required>
            <el-input type="textarea" v-model="form1.wentibiaoti"></el-input>
          </el-form-item>

          <el-form-item label="问题内容" prop="wentineirong" required>
            <el-input type="textarea" v-model="form1.wentineirong" :rows="2"></el-input>
          </el-form-item>

          <el-form-item label="答疑内容" prop="dayineirong" required>
            <el-input type="textarea" v-model="form1.dayineirong" :rows="4"></el-input>
          </el-form-item>

          <el-form-item label="发布人" prop="xuehao">
            <el-input v-model="form1.xuehao" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
  import api from "@/api";
  import {
    remove,
    checkIssh
  } from "@/utils/utils";
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
        kechengmingchengList: [],
        rule,
        form: {
          kechengmingcheng: "",
          wentibiaoti: "",
          wentineirong: "",
          dayineirong: "",
          xuehao: this.$store.state.user.session.username,
        },
        dialogVisible: false,
        dialogVisible1: false,
        form1: {
          kechengmingcheng: "",
          wentibiaoti: "",
          wentineirong: "",
          dayineirong: "",
          xuehao: this.$store.state.user.session.username,
        },
        username: "",
        loading: false,
        list: [],
        search: {
          kechengmingcheng: "",
          wentibiaoti: "",
          wentineirong: "",
        },
        search1: {
          jiaoshiid: "",
          banjiid: ""
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
      };
    },
    watch: {},
    computed: {},
    methods: {
      edit(row) {
        console.log(row);
        this.dialogVisible1 = true;
        this.form1 = row;
      },
      submit1() {
        this.$refs.formModel1
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form1;

            this.$post(api.wentisousuo.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改成功");
                  this.dialogVisible1 = false;
                  this.loadList(1);
                  this.$refs.formModel1.resetFields();
                  // this.loadInfo3();
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
      loadInfo3() {
        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.wentisousuo.edit, {
            id: this.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.form = res.data.mmm;
            } else {
              this.$message.error(res.msg);
              this.$router.go(-1);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.$router.go(-1);
          });
      },
      initKecheng() {
        // 防止重新点加载列表
        // 筛选条件
        if (localStorage.getItem("role") == "教师") {
          this.search1.jiaoshiid = localStorage.getItem("jiaoshiid")
        } else if (localStorage.getItem("role") == "学生") {
          this.search1.banjiid = localStorage.getItem("banjiId")
        }
        var filter = extend(true, {}, this.search1, {
          page: 1,
          pagesize: 10,
        });

        this.$post(api.kecheng.list, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
              // extend(this, res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.wentisousuo.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加成功");
                  this.dialogVisible = false;
                  this.loadList(1);
                  // this.$emit("success", res.data);
                  this.$refs.formModel.resetFields();
                  this.loadInfo();
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
      loadInfo() {
        var form = this.form;
        // 获取模块得数据
        this.loading = true;
        this.$post(api.wentisousuo.create, {
            id: this.$route.query.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
            } else {
              this.$message.error(res.msg);
              this.$router.go(-1);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.$router.go(-1);
          });
      },
      addSubmit() {
        this.dialogVisible = true;
      },
      searchSubmit() {
        this.loadList(1);
      },
      sizeChange(e) {
        this.pagesize = e;
        this.loadList(1);
      },
      checkIssh,

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
          this.$router.push({
            // 更新query
            path: this.$route.path,
            query: filter,
          });
        }
        this.$post(api.wentisousuo.list, filter)
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
      // 删除某行方法
      deleteItem(row) {
        this.$confirm("确定删除数据？", "提示", {
            // 弹出 确认框提示是否要删除
            type: "warning",
          })
          .then(() => {
            // 确定操作

            this.loading = true; // 滚动条
            this.$post(api.wentisousuo.delete, {
                // 提交后台
                id: row.id,
              })
              .then((res) => {
                this.loading = false;
                if (res.code != api.code.OK) {
                  this.$message.error(res.msg);
                } else {
                  remove(this.list, row);
                }
              })
              .catch((err) => {
                // 访问网络错误
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch(() => {
            // 取消操作
          });
      },
    },
    beforeRouteUpdate(to, form, next) {
      extend(this.search, to.query);
      this.loadList(1);
      next();
    },
    created() {
      this.username = localStorage.getItem("username");
      var search = extend(this.search, this.$route.query);
      if (search.page) {
        this.page = Math.floor(this.$route.query.page);
        delete search.page;
      }
      if (search.pagesize) {
        this.pagesize = Math.floor(this.$route.query.pagesize);
        delete search.pagesize;
      }
      this.initKecheng();
      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>