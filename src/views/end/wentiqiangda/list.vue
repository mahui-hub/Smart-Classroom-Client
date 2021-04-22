<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          抢答问题管理
        </span>
      </div>
      <!-- 搜索 -->
      <div class="form-search">
        <el-form :model="search" :inline="true" size="mini">
          <!-- <el-form-item label="编号">
            <el-input v-model="search.bianhao"></el-input>
          </el-form-item> -->
          <el-form-item label="问题标题">
            <el-input v-model="search.biaoti"></el-input>
          </el-form-item>
          <!-- <el-form-item label="发布人">
            <el-input v-model="search.faburen"></el-input>
          </el-form-item> -->
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
              >发起抢答</el-button
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
        <el-table-column type="index" align="center"></el-table-column>
        <!-- 序号 -->

        <el-table-column label="抢答编号" align="center">
          <template slot-scope="{ row }">
            {{ row.bianhao }}
          </template>
        </el-table-column>
        <el-table-column label="问题标题" align="center">
          <template slot-scope="{ row }">
            {{ row.biaoti }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="图片" align="center">
          <template slot-scope="{ row }">
            <e-img :src="row.tupian" style="max-width:120px" />
          </template>
        </el-table-column> -->
        <el-table-column label="抢答人数" align="center">
          <template slot-scope="{ row }">
            {{ row.qiangdarenshu }}
          </template>
        </el-table-column>
        <el-table-column label="已抢人数" align="center">
          <template slot-scope="{ row }">
            {{ row.yiqiangrenshu }}
          </template>
        </el-table-column>
        <el-table-column label="附件" align="center">
          <template slot-scope="{ row }">
            <e-file-list v-model="row.fujian"></e-file-list>
          </template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="{ row }">
            {{ row.faburen }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <!-- <el-button @click="$goto('/admin/qiangdawentiadd?id='+row.id)" type="success"
                                       icon="el-icon-plus" size="mini">
                                抢答问题添加
                            </el-button>
                            <el-button type="info" @click="'/admin/qiangdawenti?wentiqiangdaid='+row.id"
                                       icon="el-icon-search" size="mini">
                                抢答问题查询
                            </el-button>-->
            <!-- <el-tooltip content="详情" placement="top"> -->
            <el-button
              @click="
                $goto({
                  path: '/admin/wentiqiangdadetail',
                  query: { id: row.id },
                })
              "
              type="text"
              >详情</el-button
            >
            <!-- </el-tooltip> -->
            <!-- <el-tooltip content="编辑" placement="top"> -->
            <el-button
              @click="
                $goto({
                  path: '/admin/wentiqiangdaupdt',
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
    <el-dialog title="发起抢答" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="120px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="抢答编号"
            prop="bianhao"
            :rules="[{ required: true, message: '请填写编号' }]"
          >
            <el-input placeholder="输入编号" disabled v-model="form.bianhao" />
          </el-form-item>

          <el-form-item label="问题标题" prop="biaoti" required>
            <el-input placeholder="请输入问题标题" v-model="form.biaoti" />
          </el-form-item>
          <!-- 后续添加 -->
          <el-form-item label="所属班级" prop="banji">
            <el-select v-model="form.banji" multiple>
              <!-- <el-option :label="'附件'" :value="'1'">附件</el-option>
              <el-option :label="'问题详情'" :value="'0'">问题详情</el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item
            label="设置抢答人数"
            prop="qiangdarenshu"
            :rules="[
              { validator: rule.checkNumber, message: '输入一个有效数字' },
            ]"
          >
            <el-input placeholder="输入抢答人数" v-model="form.qiangdarenshu" />
          </el-form-item>

          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="tupian">
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>
          <el-form-item label="上传问题类型" prop="changeleixing">
            <el-select v-model="form.changeleixing">
              <el-option :label="'附件'" :value="'1'">附件</el-option>
              <el-option :label="'问题详情'" :value="'0'">问题详情</el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="附件"
            prop="fujian"
            v-if="form.changeleixing == '1'"
          >
            <e-upload-file v-model="form.fujian"></e-upload-file>
          </el-form-item>

          <el-form-item
            label="问题详情"
            prop="xiangqing"
            v-if="form.changeleixing == '0'"
          >
            <e-editor v-model="form.xiangqing"></e-editor>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
      rule,
      form: {
        bianhao: rule.getID(),
        biaoti: "",
        tupian: "",
        qiangdarenshu: "",
        fujian: "",
        changeleixing: "",
        xiangqing: "",
        faburen: this.$store.state.user.session.username,
      },
      oper: "",
      headerTitle: "",
      dialogVisible: false,
      loading: false,
      list: [],
      search: {
        bianhao: "",

        biaoti: "",

        faburen: "",
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
    submit() {
      this.$refs.formModel
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.wentiqiangda.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.loadList(1);
                this.$emit("success", res.data);
                this.$refs.formModel.resetFields();
                this.loadInfo();
                this.dialogVisible = false;
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
      this.$post(api.wentiqiangda.create, {
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

          this.$post(api.pingyuewenti.insert, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("添加成功");
                this.$emit("success", res.data);
                this.$refs.formModel.resetFields();
                this.$router.go(-1);
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
      this.$post(api.pingyuewenti.create, {
        id: this.$route.query.id,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            var readMap = res.data.readMap;
            for (var i in form) {
              if (readMap[i] && i != "id") {
                form[i] = res.data.readMap[i];
              }
            }
            form.huidawentiid = readMap.id;
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
      this.$post(api.wentiqiangda.list, filter)
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
          this.$post(api.wentiqiangda.delete, {
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
