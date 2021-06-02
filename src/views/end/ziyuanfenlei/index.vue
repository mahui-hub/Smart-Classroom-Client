<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">

    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="资源分类">
          <el-input v-model="search.fenlei"></el-input>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">新增资源分类</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" highlight-current-row stripe border>
      <el-table-column type="index" label=" " align="center"></el-table-column>
      <!-- 序号 -->

      <el-table-column label="资源分类" align="center">
        <template slot-scope="{ row }"> {{ row.fenleimingcheng }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="edit(row)" type="text">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="分类名称" prop="fenlei" required>
            <el-input placeholder="请输入分类名称" v-model="form.fenlei" />
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

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        ziyuanfenleilist: [],
        oper: "",
        headerTitle: "",
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          fenlei: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        form: {
          id: "",
          fenlei: "",
          addtime: "",
        },
      };
    },
    watch: {

    },
    computed: {},
    methods: {
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.ziyuanfenlei.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加资源分类成功");
                  this.dialogVisible = false;
                  this.loadList(1);
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
        this.$post(api.ziyuanfenlei.create, {
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
      edit(row) {
        this.oper = "edit";
        this.form = row;
        this.dialogVisible = true;
        this.operChange();
      },
      addSubmit() {
        this.oper = "add";
        this.dialogVisible = true;
        this.operChange();
      },
      operChange() {
        if (this.oper == "add") {
          this.headerTitle = "添加资源分类";
        } else {
          this.headerTitle = "编辑资源分类";
        }
      },
      submit1() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.ziyuanfenlei.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改成功");
                  this.dialogVisible = false;
                  this.loadList(1);
                  this.loadInfo1();
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
        this.$post(api.ziyuanfenlei.edit, {
            id: this.form.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.form = res.data.mmm;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
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
        this.$post(api.ziyuanfenlei.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.ziyuanfenleilist = res.data.list;
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
            this.$post(api.ziyuanfenlei.delete, {
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