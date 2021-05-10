<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini" :rules="rules">
        <!-- <el-form-item label="教师工号">
          <el-input v-model="search.gonghao"></el-input>
        </el-form-item> -->
        <el-form-item label="教师姓名">
          <el-input v-model="search.xingming"></el-input>
        </el-form-item>
        <el-form-item label="所属学院">
          <el-input v-model="search.xueyuan"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所教班级">
          <el-select
            v-model="search.suojiaobanji"
            style="width:100%;"
            clearable
          >
            <el-option
              v-for="m in banjiList"
              :key="m.banjimingcheng"
              :value="m.banjimingcheng"
              :label="m.banjimingcheng"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加教师信息</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" stripe highlight-current-row>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column label="教师工号" align="center">
        <template slot-scope="{ row }"> {{ row.gonghao }} </template>
      </el-table-column>
      <el-table-column label="教师姓名" align="center">
        <template slot-scope="{ row }"> {{ row.xingming }} </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="{ row }"> {{ row.xingbie }} </template>
      </el-table-column>
      <el-table-column label="职称" align="center">
        <template slot-scope="{ row }"> {{ row.zhicheng }} </template>
      </el-table-column>
      <el-table-column label="所属学院" align="center">
        <template slot-scope="{ row }"> {{ row.xueyuan }} </template>
      </el-table-column>
      <!-- <el-table-column label="所教班级" align="center" min-width="100">
        <template slot-scope="{ row }"> {{ row.suojiaobanji }} </template>
      </el-table-column> -->
      <el-table-column label="QQ号" align="center">
        <template slot-scope="{ row }"> {{ row.qqhao }} </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }"> {{ row.shouji }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/jiaoshidetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>

          <el-button @click="$goto({ path: '/end/jiaoshiupdt', query: { id: row.id } })" type="text">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
      <!-- 添加教师 -->
      <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
        <div class="form-database-form">
          <el-form :model="form" ref="formModel" :rules="rules1" label-width="100px">
            <el-form-item label="教师工号" prop="gonghao">
              <el-input placeholder="请输入工号" v-model="form.gonghao" />
            </el-form-item>

            <el-form-item label="密码" prop="mima" required>
              <el-input placeholder="请输入密码" type="password" v-model="form.mima" />
            </el-form-item>

            <el-form-item label="教师姓名" prop="xingming" required>
              <el-input placeholder="请输入教师姓名" v-model="form.xingming" />
            </el-form-item>

            <el-form-item label="所属学院" prop="xueyuan" required>
              <el-input placeholder="请输入教师所属学院" v-model="form.xueyuan" />
            </el-form-item>

            <el-form-item label="教师职称" prop="xingming" required>
              <el-input placeholder="请输入教师职称" v-model="form.zhicheng" />
            </el-form-item>

            <el-form-item label="性别" prop="xingbie" required>
              <el-select v-model="form.xingbie" style="width:100%;">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="教师QQ号" prop="qqhao" required>
              <el-input placeholder="请输入教师QQ号" v-model="form.qqhao" />
            </el-form-item>

            <el-form-item label="联系方式" prop="shouji" required>
              <el-input placeholder="请输入联系方式" v-model="form.shouji" />
            </el-form-item>

            <!-- <el-form-item label="所教班级" prop="suojiaobanji" required>
            <el-select
              v-model="form.suojiaobanji"
              multiple="multiple"
              style="width:100%;"
            >
              <el-option
                v-for="m in banjiList"
                :key="m.banjimingcheng"
                :value="m.banjimingcheng"
                :label="m.banjimingcheng"
              ></el-option>
            </el-select>
          </el-form-item> -->

            <el-form-item label="教师简介" prop="xiangqing">
              <el-input v-model="form.xiangqing" type="textarea" :rows="3"></el-input>
              <!-- <e-editor v-model="form.xiangqing"></e-editor> -->
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
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
        rules1: {
          gonghao: [{
              required: true,
              message: "请输入6位工号",
              trigger: "blur",
            },
            {
              min: 6,
              max: 6,
              message: "长度为6个字符"
            },
          ],
          qqhao: [{
              required: true,
              message: "请填写QQ号，用于在线交流",
              trigger: "blur",
            },
            {
              min: 6,
              max: 10,
              message: "QQ号长度在6-10字符"
            },
          ],
          lianxidianhua: [{
              required: true,
              message: "请填写联系方式",
              trigger: "blur"
            },
            {
              validator: rule.checkPhone,
              message: "请输入正确手机号码"
            },
          ],
        },
        banjiList: [],
        rule,
        headerTitle: "",
        dialogVisible: false,
        rules: {
          gonghao: [{
              required: true,
              message: "请填写工号"
            },
            {
              validator: rule.checkRemote,
              message: "内容重复了",
              checktype: "insert",
              module: "jiaoshi",
              col: "gonghao",
              trigger: "blur",
            },
          ],
          mima: [{
            required: true,
            message: "请填写密码"
          }],
        },
        form: {
          gonghao: "",
          mima: "",
          xingming: "",
          xingbie: "",
          qqhao: "",
          shouji: "",
          suojiaobanji: [],
          xiangqing: "",
          xueyuan: "",
          zhicheng: "",
        },
        loading: false,
        list: [],
        search: {
          gonghao: "",
          xueyuan: "",
          xingming: "",
          suojiaobanji: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
      };
    },
    methods: {
      addSubmit() {
        this.dialogVisible = true;
        this.headerTitle = "添加教师信息";
      },

      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.jiaoshi.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加教师信息成功");
                  this.dialogVisible = false;
                  this.$emit("success", res.data);
                  this.$refs.formModel.resetFields();
                  this.loadInfo();
                  this.loadList1(1);
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
        this.$post(api.jiaoshi.create, {
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
        this.$post(api.jiaoshi.create, {
            id: this.$route.query.id,
          })
          .then((res) => {
            if (res.code == api.code.OK) {
              this.banjiList = res.data.banjiList;
              console.log(this.banjiList);
              // extend(this, res.data);
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
      loadList1(page) {
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
        this.$post(api.jiaoshi.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.list = res.data.list;
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
        this.$post(api.jiaoshi.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              // this.list = res.data.banjiList;
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
            this.$post(api.jiaoshi.delete, {
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
      this.loadInfo1();
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