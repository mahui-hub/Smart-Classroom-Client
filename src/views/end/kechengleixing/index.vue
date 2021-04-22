<template>
  <div class="v-list">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="课程类型">
          <el-input v-model="search.kechengleixing"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >新增课程类型</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column label="课程类型" align="center">
        <template slot-scope="{ row }"> {{ row.kechengleixing }} </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- @click="
              $goto({
                path: '/end/kechengleixingupdt',
                query: { id: row.id },
              })
            " -->
          <el-button @click="edit(row)" type="text">编辑</el-button>

          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination
        @current-change="loadList"
        :current-page="page"
        :page-size="pagesize"
        @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <!-- 添加学生信息 -->
    <el-dialog
      :title="headerTitle"
      :visible.sync="dialogVisible"
      size="mini"
      :inline="true"
    >
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px">
          <el-form-item label="课程类型" prop="kechengleixing">
            <el-input
              placeholder="输入课程类型"
              v-model="form.kechengleixing"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" v-if="oper == 'add'"
          >确 定</el-button
        >
        <el-button type="primary" @click="submit1" v-if="oper == 'edit'"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
import api from "@/api";
import { remove, checkIssh } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      oper: "",
      headerTitle: "",
      dialogVisible: false,
      loading: false,
      form: {
        kechengleixing: "",
      },
      list: [],
      search: {
        kechengleixing: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数
      id: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    edit(row) {
      this.headerTitle = "编辑课程类型";
      this.dialogVisible = true;
      this.form = row;
      this.oper = "edit";
      this.id = row.id;
    },
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.kechengleixing.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.dialogVisible = false;
                this.loadList(1);
                this.$emit("success", res.data);
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
    submit1() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.kechengleixing.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("修改成功");
                this.dialogVisible = false;
                this.loadList(1);
                this.loadInfo1();
                this.$refs.formModel.resetFields();
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
      this.$post(api.kechengleixing.create, {
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
    loadInfo1() {
      // 更新数据,获取数据
      this.loading = true;
      var form = this.form;
      this.$post(api.kechengleixing.edit, {
        id: this.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            // this.form = res.data.mmm;
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
    addSubmit() {
      this.oper = "add";
      this.headerTitle = "新增课程类型";
      this.dialogVisible = true;
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
      this.$post(api.kechengleixing.list, filter)
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
          this.$post(api.kechengleixing.delete, {
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
