<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="课程名称" prop="kechengid">
          <el-select v-model="search.kechengid" style="width: 100%" clearable>
            <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题">
          <el-input v-model="search.biaoti"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">新增公告</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" stripe highlight-current-row>
      <el-table-column type="index" align="center" label=" "></el-table-column>
      <!-- 序号 -->

      <el-table-column label="公告编号" align="center">
        <template slot-scope="{ row }"> {{ row.bianhao }} </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.biaoti }} </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" show-overflow-tooltip :formatter="kechengType">
      </el-table-column>
      <el-table-column label="发布人" align="center" min-width="100">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/gonggaodetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>
          <!-- @click="$goto({ path: '/end/gonggaoupdt', query: { id: row.id } })" -->
          <el-button v-if="row.faburen == username" @click="edit(row)" type="text">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- 公告信息 -->
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="公告编号" prop="bianhao" required>
            <el-input placeholder="请输入编号" v-model="form.bianhao" disabled />
          </el-form-item>

          <el-form-item label="公告标题" prop="biaoti" required>
            <el-input placeholder="请输入公告标题" v-model="form.biaoti" required
              :rules="[{ required: true, message: '请填写公告标题' }]" />
          </el-form-item>
          <el-form-item label="公告类型" prop="gonggaotype" required>
            <el-select v-model="form.gonggaotype" style="width: 100%">
              <el-option v-for="m in gonggaotypeList" :key="m.gonggaotype" :value="m.gonggaotype" :label="m.gonggaotype"
                :disabled="m.disabled!=role"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称" prop="kechengid" v-if="form.gonggaotype == '课程公告'" required>
            <el-select v-model="form.kechengid" style="width: 100%">
              <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen" required>
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>

          <el-form-item label="公告图片" prop="tupian" required>
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>

          <el-form-item label="公告内容" prop="neirong" required>
            <u-editor :content="form.neirong" @returnValue="returnValue"></u-editor>
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
  import uEditor from '@/components/ueditor/index'
  /**
   * 后台列表页面
   */
  export default {
    components: {
      uEditor
    },
    data() {
      return {
        role: "",
        username: "",
        gonggaotypeList: [{
            gonggaotype: "系统公告",
            disabled: "管理员"
          },
          {
            gonggaotype: "课程公告",
            disabled: "教师"
          },
        ],
        kechengmingchengList: [],
        oper: "",
        headerTitle: "",
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          bianhao: "",
          biaoti: "",
          kechengid: "",
          faburen: ''
        },
        search1: {
          jiaoshiid: ""
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        form: {
          gonggaotype: "",
          kechengid: "",
          bianhao: rule.getID(),
          biaoti: "",
          tupian: "",
          neirong: "",
          faburen: this.$store.state.user.session.username,
        },
        id: "",
      };
    },
    watch: {},
    computed: {},
    methods: {
      returnValue(value) {
        this.form.neirong = value
      },
      panduan() {
        if (localStorage.getItem("role") == "教师") {
          this.search.faburen = localStorage.getItem("username");
          this.loadList1();
        } else {
          this.loadList1();
        }
      },
      initKecheng() {
        // 防止重新点加载列表
        // 筛选条件
        if (this.role == "教师") {
          this.search1.jiaoshiid = localStorage.getItem("jiaoshiid")
        }
        console.log(this.search1.jiaoshiid)
        var filter = extend(true, {}, this.search1, {
          page: 1,
          pagesize: 10,
        });
        this.$post(api.kecheng.list, filter)
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
      kechengType(row) {
        var name = "";
        if (row.kechengid != 0) {
          this.kechengmingchengList.map(function (item) {
            if (item.id == row.kechengid) {
              name = item.kechengmingcheng;
            }
          });
          return name;
        } else {
          return "---";
        }
      },
      searchSubmit() {
        this.loadList(1);
      },
      addSubmit() {
        this.oper = "add";
        this.dialogVisible = true;
        this.operChange();
      },
      operChange() {
        if (this.oper == "add") {
          this.headerTitle = "添加公告信息";
        } else {
          this.headerTitle = "编辑公告信息";
        }
      },
      edit(row) {

        this.oper = "edit";
        this.operChange()
        this.form = row;
        this.id = row.id;
        this.dialogVisible = true;
        if (row.kechengid == 0) {
          this.form.gonggaotype = "系统公告";
        } else {
          this.form.gonggaotype = "课程公告";
        }
      },
      submit1() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.gonggao.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改成功");
                  this.dialogVisible = false;
                  this.loadList1();
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
        this.$post(api.gonggao.edit, {
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
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.gonggao.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加成功");
                  this.dialogVisible = false;
                  this.loadList1();
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
        this.$post(api.gonggao.create, {
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
      sizeChange(e) {
        this.pagesize = e;
        this.loadList(1);
      },
      checkIssh,
      loadList1() {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;

        console.log(this.pagesize);
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: this.page + "",
          pagesize: 10,
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
        this.$post(api.gonggao.list, filter)
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
        console.log(this.pagesize);
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
        this.$post(api.gonggao.list, filter)
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
            this.$post(api.gonggao.delete, {
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
      this.panduan()
      this.role = localStorage.getItem("role")
      this.initKecheng();
      this.username = localStorage.getItem("username");
    },
    mounted() {},
    destroyed() {},
  };
</script>