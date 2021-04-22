<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          答疑问题列表
        </span>
      </div>
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
            <el-button
              type="primary"
              @click="searchSubmit"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
              >新增答疑内容</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table border :data="list" stripe highlight-current-row>
        <el-table-column type="index" align="center"></el-table-column>
        <!-- 序号 -->

        <el-table-column label="课程名称" align="center">
          <template slot-scope="{ row }"> {{ row.kechengmingcheng }} </template>
        </el-table-column>
        <el-table-column label="问题标题" show-overflow-tooltip align="center">
          <template slot-scope="{ row }"> {{ row.wentibiaoti }} </template>
        </el-table-column>
        <el-table-column label="问题内容" show-overflow-tooltip align="center">
          <template slot-scope="{ row }"> {{ row.wentineirong }} </template>
        </el-table-column>
        <el-table-column label="答疑内容" show-overflow-tooltip align="center">
          <template slot-scope="{ row }"> {{ row.dayineirong }} </template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="{ row }"> {{ row.xuehao }} </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              @click="
                $goto({
                  path: '/admin/wentisousuodetail',
                  query: { id: row.id },
                })
              "
              type="text"
              >详情</el-button
            >

            <el-button
              @click="
                $goto({
                  path: '/admin/wentisousuoupdt',
                  query: { id: row.id },
                })
              "
              type="text"
              >编辑</el-button
            >

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
    </el-card>
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item label="课程名称" prop="kechengmingcheng" required>
            <el-input
              placeholder="请输入课程名称"
              v-model="form.kechengmingcheng"
            />
          </el-form-item>

          <el-form-item label="问题标题" prop="wentibiaoti" required>
            <el-input type="textarea" v-model="form.wentibiaoti"></el-input>
          </el-form-item>

          <el-form-item label="问题内容" prop="wentineirong" required>
            <el-input
              type="textarea"
              v-model="form.wentineirong"
              :rows="2"
            ></el-input>
          </el-form-item>

          <el-form-item label="答疑内容" prop="dayineirong" required>
            <el-input
              type="textarea"
              v-model="form.dayineirong"
              :rows="5"
            ></el-input>
          </el-form-item>

          <el-form-item label="发布人" prop="xuehao">
            <el-input v-model="form.xuehao" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
import api from "@/api";
import { remove } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      oper: "",
      dialogVisible: false,
      headerTitle: "",
      loading: false,
      list: [],
      search: {
        kechengmingcheng: "",

        wentibiaoti: "",

        wentineirong: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数
      form: {
        kechengmingcheng: "",
        wentibiaoti: "",
        wentineirong: "",
        dayineirong: "",
        xuehao: this.$store.state.user.session.username,
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
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
      this.oper = "add";
      this.dialogVisible = true;
      this.headerTitle = "新增答疑内容";
    },
    searchSubmit() {
      this.loadList(1);
    },
    sizeChange(e) {
      this.pagesize = e;
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
        this.$router.push({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      this.$post(api.wentisousuo.listxuehao, filter)
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
                this.loadList(1);
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
