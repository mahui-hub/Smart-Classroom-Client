<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :inline="true" size="mini" :label-suffix="':'">
        <el-form-item label="学院名称">
          <el-select v-model="search.xueyuan" style="width:100%;" clearable>
            <el-option v-for="v in xueyuanlist" :value="v.xueyuan" :label="v.xueyuan" :key="v.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称">
          <el-input v-model="search.zhuanye"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加专业</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" style="width: 100%" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="学院名称" align="center">
        <template slot-scope="{ row }"> {{ row.xueyuan }} </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center">
        <template slot-scope="{ row }"> {{ row.zhuanye }} </template>
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
    <el-dialog title="添加专业" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" :rules="rules" label-width="100px">
          <el-form-item label="学院名称" prop="zhuanye">
            <el-select v-model="form.xueyuan" style="width:100%;">
              <el-option v-for="v in xueyuanlist" :value="v.xueyuan" :label="v.xueyuan" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业名称" prop="zhuanye">
            <el-input placeholder="输入专业名称" v-model="form.zhuanye" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑专业" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form :model="form1" ref="formModel1" :rules="rules" label-width="100px">
          <el-form-item label="学院名称" prop="zhuanye">
            <el-select v-model="form1.xueyuan" style="width:100%;">
              <el-option v-for="v in xueyuanlist" :value="v.xueyuan" :label="v.xueyuan" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业名称" prop="zhuanye">
            <el-input placeholder="输入专业名称" v-model="form1.zhuanye" />
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
   * 后台列表页面------------专业录入
   */
  export default {
    data() {
      return {
        xueyuanlist: [],
        dialogVisible1: false,
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          xueyuan: "",
          zhuanye: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        form: {
          id: "",
          addtime: "",
          zhuanye: "",
        },
        form1: {
          id: "",
          addtime: "",
          zhuanye: "",
        },
        rules: {
          zhuanye: [{
            required: true,
            message: "请输入专业名称",
            trigger: "blur"
          }, ],
        },
        id: "",
      };
    },
    methods: {
      initXueyuan() {
        const params = {}
        params.page = 1
        params.pagesize = 10
        this.$post(api.xueyuan.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.xueyuanlist = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      loadInfo() {
        // 获取模块得数据
        this.loading = true;
        this.$post(api.zhuanye.create, {
            id: this.form.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      addSubmit() {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.formModel.resetFields();
        });
      },
      edit(row) {
        this.form1 = row;
        this.dialogVisible1 = true;
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
        this.$post(api.zhuanye.list, filter)
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
            this.$post(api.zhuanye.delete, {
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
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.zhuanye.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加专业成功");
                  this.loadList(1);
                  this.dialogVisible = false;
                  this.$refs.formModel.resetFields();
                  this.loadInfo();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(e => {
                this.loading = false;
                this.$message.error(e.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      submit1() {
        this.$refs.formModel1
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form1;
            this.$post(api.zhuanye.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改专业成功");
                  this.$refs.formModel1.resetFields();
                  this.dialogVisible1 = false;
                  this.loadList(1);
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
      this.initXueyuan()
      this.loadList(1);
    },
  };
</script>

<style type="text/scss" scoped lang="scss"></style>