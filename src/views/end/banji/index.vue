<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="学院名称">
          <el-input v-model="search.xueyuan"></el-input>
        </el-form-item>
        <el-form-item label="专业名称">
          <el-select v-model="search.zhuanye">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye" :key="m.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input v-model="search.banjimingcheng"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加班级</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column label="学院名称" align="center">
        <template slot-scope="{ row }"> {{ row.xueyuan }} </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center">
        <template slot-scope="{ row }"> {{ row.zhuanye }} </template>
      </el-table-column>
      <el-table-column label="班级名称" align="center">
        <template slot-scope="{ row }"> {{ row.banjimingcheng }} </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- @click="
                $goto({ path: '/admin/banjiupdt', query: { id: row.id } })
              " -->
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
        <el-form :model="form" ref="formModel" label-width="100px" :rules="rules">
          <el-form-item label="学院名称" prop="xueyuan">
            <el-select v-model="form.xueyuan" style="width:100%;">
              <el-option v-for="v in xueyuanlist" :value="v.xueyuan" :label="v.xueyuan" :key="v.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业名称" prop="zhuanye">
            <el-select v-model="form.zhuanye" style="width:100%">
              <el-option v-for="m in zhuanyeList" :key="m.id" :value="m.zhuanye" :label="m.zhuanye"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="班级名称" prop="banjimingcheng">
            <el-input placeholder="请输入班级名称" v-model="form.banjimingcheng" />
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
        xueyuanlist: [],
        oper: "",
        headerTitle: "",
        dialogVisible: false,
        form: {
          xueyuan: "",
          zhuanye: "",
          banjimingcheng: "",
        },
        loading: false,
        list: [],
        search: {
          xueyuan: "",
          zhuanye: "",
          banjimingcheng: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        zhuanyeList: [],
        rules: {
          xueyuan: [{
            required: true,
            message: "请输入学院名称",
            trigger: "blur"
          }, ],
          zhuanye: [{
            required: true,
            message: "请选择专业",
            trigger: "change"
          }],
          banjimingcheng: [{
            required: true,
            message: "请输入班级名称",
            trigger: "blur"
          }, ],
        },
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
      operChange() {
        if (this.oper == "add") {
          this.headerTitle = "添加班级信息";
        } else {
          this.headerTitle = "编辑班级信息";
        }
      },
      edit(row) {
        this.form = row;
        this.oper = "edit";
        this.dialogVisible = true;
        this.operChange();
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

            this.$post(api.banji.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  if (this.oper == "add") {
                    this.$message.success("添加班级信息成功");
                  } else {
                    this.$message.success("修改班级信息成功");
                  }
                  this.loadList(1);
                  this.dialogVisible = false;
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
        this.$post(api.banji.create, {
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
        this.$post(api.banji.list, filter)
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
            this.$post(api.banji.delete, {
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
      this.initXueyuan()
      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>