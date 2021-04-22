<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          屏蔽词列表
        </span>
      </div> -->
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="关键字">
          <el-input v-model="search.guanjianzi"></el-input>
        </el-form-item>
        <el-form-item label="替换词">
          <el-input v-model="search.tihuanci"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >添加屏蔽词</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <!-- <el-table-column type="index" label="#"></el-table-column> -->
      <!-- 序号 -->

      <el-table-column label="关键字" align="center">
        <template slot-scope="{ row }"> {{ row.guanjianzi }} </template>
      </el-table-column>
      <el-table-column label="替换词" align="center">
        <template slot-scope="{ row }"> {{ row.tihuanci }} </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <!-- @click="
              $goto({
                path: '/end/pingbiciupdt',
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
    <!-- </el-card> -->
    <el-dialog title="添加屏蔽词" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="关键字"
            prop="guanjianzi"
            required
            :rules="[
              { required: true, message: '请填写关键字' },
              {
                validator: rule.checkRemote,
                message: '内容重复了',
                checktype: 'insert',
                module: 'pingbici',
                col: 'guanjianzi',
                trigger: 'blur',
              },
            ]"
          >
            <el-input placeholder="请输入关键字" v-model="form.guanjianzi" />
          </el-form-item>

          <el-form-item label="替换词" prop="tihuanci">
            <el-input placeholder="请输入替换词" v-model="form.tihuanci" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑屏蔽词" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form1"
          ref="formModel1"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="关键字"
            prop="guanjianzi"
            required
            :rules="[
              { required: true, message: '请填写关键字' },
              {
                validator: rule.checkRemote,
                message: '内容重复了',
                checktype: 'update',
                module: 'pingbici',
                col: 'guanjianzi',
                id: '{{   form.id   }}',
                trigger: 'blur',
              },
            ]"
          >
            <el-input placeholder="请输入关键字" v-model="form1.guanjianzi" />
          </el-form-item>

          <el-form-item label="替换词" prop="tihuanci">
            <el-input placeholder="请输入替换词" v-model="form1.tihuanci" />
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
import { remove, checkIssh } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";
import rule from "@/utils/rule";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      id: "",
      rule,
      form1: {
        guanjianzi: "",
        tihuanci: "",
      },
      form: {
        guanjianzi: "",
        tihuanci: "***",
      },
      dialogVisible1: false,
      dialogVisible: false,
      loading: false,
      list: [],
      search: {
        guanjianzi: "",
        tihuanci: "",
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
      this.dialogVisible1 = true;
      this.id = row.id;
      this.form1 = row;
    },
    submit1() {
      this.$refs.formModel1
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form1;

          this.$post(api.pingbici.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("修改成功");
                this.dialogVisible1 = false;
                this.loadList(1);
                // this.$emit("success", res.data);
                this.$refs.formModel1.resetFields();
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
      var form = this.form1;
      this.$post(api.pingbici.edit, {
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
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.pingbici.insert, form)
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
      this.$post(api.pingbici.create, {
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
      this.loadInfo();
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
      this.$post(api.pingbici.list, filter)
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
          this.$post(api.pingbici.delete, {
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
