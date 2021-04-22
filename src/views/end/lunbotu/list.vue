<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          轮播图列表
        </span>
      </div> -->
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
        <el-form-item label="标题">
          <el-input v-model="search.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table
      border
      :data="list"
      style="width: 100%"
      highlight-current-row
      stripe
    >
      <el-table-column type="index" label=" "></el-table-column>
      <!-- 序号 -->

      <el-table-column label="标题" align="center">
        <template slot-scope="{ row }"> {{ row.title }} </template>
      </el-table-column>
      <el-table-column label="连接地址" align="center">
        <template slot-scope="{ row }"> {{ row.url }} </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="{ row }">
          <e-img :src="row.image" style="max-width:120px" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- @click="edit(row)" -->
          <!-- @click="$goto({ path: '/end/lunbotuupdt', query: { id: row.id } })" -->
          <el-button
            @click="$goto({ path: '/end/lunbotuupdt', query: { id: row.id } })"
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
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="标题"
            prop="title"
            required
            :rules="[{ required: true, message: '请填写标题' }]"
          >
            <el-input placeholder="请输入标题" v-model="form.title" />
          </el-form-item>
          <el-form-item
            label="连接地址"
            prop="url"
            required
            :rules="[{ required: true, message: '请填写连接地址' }]"
          >
            <el-input placeholder="请输入连接地址" v-model="form.url" />
          </el-form-item>
          <el-form-item
            label="图片"
            prop="image"
            required
            :rules="[{ required: true, message: '请填写图片' }]"
          >
            <e-upload-image v-model="form.image"></e-upload-image>
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
<style scoped lang="scss"></style>
<script>
import api from "@/api";
import rule from "@/utils/rule";
import { remove, checkIssh } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      rule,
      id: "",
      form: {
        title: "",
        image: "",
        url: "",
      },
      oper: "",
      headerTitle: "",
      dialogVisible: false,
      loading: false,
      list: [],
      search: {
        title: "",
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
      this.form = row;
      this.oper = "edit";
      this.dialogVisible = true;
      this.operChange();
      this.id = row.id;
    },
    submit1() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.lunbotu.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.loadList(1);
                this.dialogVisible = false;
                // this.$emit("success", res.data);
                this.$refs.formModel.resetFields();
                this.loadInfo2();
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
    loadInfo2() {
      // 更新数据,获取数据
      this.loading = true;
      var form = this.form;
      this.$post(api.lunbotu.edit, {
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
        this.headerTitle = "添加轮播图";
      } else {
        this.headerTitle = "编辑轮播图";
      }
    },
    addSubmit() {
      this.oper = "add";
      this.dialogVisible = true;
      this.operChange();
    },
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.lunbotu.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.loadList(1);
                this.dialogVisible = false;
                // this.$emit("success", res.data);
                this.$refs.formModel.resetFields();
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
      var form = this.form;
      // 获取模块得数据
      this.loading = true;
      this.$post(api.lunbotu.create, {
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
      this.$post(api.lunbotu.list, filter)
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
          this.$post(api.lunbotu.delete, {
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
