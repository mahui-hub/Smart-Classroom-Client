<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="帐号">
          <el-input v-model="search.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus" v-if="username=='admin'">添加管理员</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" stripe highlight-current-row>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->

      <el-table-column label="帐号" align="center">
        <template slot-scope="{ row }"> {{ row.username }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="editItem(row)" v-if="row.username==username">编辑</el-button>
          <el-button type="text" @click="editItem(row)" v-if="username=='admin'&&row.username!=username">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)" v-if="username=='admin'&&row.username!=username">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- </el-card> -->
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini" :inline="true">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" :rules="rules">
          <el-form-item label="管理员账号" prop="username">
            <el-input placeholder="输入帐号" v-model="form.username" />
          </el-form-item>

          <el-form-item label="管理员密码" prop="pwd" v-if="oper == 'add'">
            <el-input placeholder="输入密码" v-model="form.pwd" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" v-if="oper == 'add'">确 定</el-button>
        <el-button type="primary" @click="submit1" v-if="oper == 'edit'">确 定</el-button>
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
        username: this.$store.state.user.session.username,
        oper: "",
        dialogVisible: false,
        headerTitle: "",
        loading: false,
        list: [],
        search: {
          username: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        form: {
          username: "",
          pwd: "",
        },
        rule,
        rules: {
          username: [{
              required: true,
              message: "请填写帐号"
            },
            {
              validator: rule.checkRemote,
              message: "内容重复了",
              checktype: "insert",
              module: "admins",
              col: "username",
              trigger: "blur",
            },
          ],
          pwd: [{
            required: true,
            message: "请填写密码"
          }],
        },
      };
    },
    methods: {
      editItem(row) {
        this.form = row;
        this.oper = "edit";
        this.operChange();
        this.dialogVisible = true;
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.admins.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加管理员账户成功");
                  this.dialogVisible = false;
                  // this.$emit("success", res.data);
                  this.$refs.formModel.resetFields();
                  // this.loadInfo();
                  this.loadList(1);
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
        this.$post(api.admins.create, {
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
      submit1() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.admins.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改信息成功");
                  this.dialogVisible = false;
                  this.loadList(1);
                  // this.$emit("success", res.data);
                  // this.$refs.formModel.resetFields();
                  // this.loadInfo1();
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
      loadInfo1() {
        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.admins.edit, {
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
      operChange() {
        if (this.oper == "add") {
          this.headerTitle = "添加管理员信息";
        } else {
          this.headerTitle = "编辑管理员信息";
        }
      },
      addSubmit() {
        this.oper = "add";
        this.dialogVisible = true;
        this.operChange();
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
        this.$post(api.admins.list, filter)
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
            this.$post(api.admins.delete, {
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
      var search = extend(this.search, this.$route.query);
      if (search.page) {
        this.page = Math.floor(this.$route.query.page);
        delete search.page;
      }
      if (search.pagesize) {
        this.pagesize = Math.floor(this.$route.query.pagesize);
        delete search.pagesize;
      }

      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>