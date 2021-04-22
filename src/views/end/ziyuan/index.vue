<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          资源列表
        </span>
      </div> -->
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="资源编号">
          <el-input v-model="search.bianhao"></el-input>
        </el-form-item>
        <el-form-item label="资源标题">
          <el-input v-model="search.biaoti"></el-input>
        </el-form-item>
        <el-form-item label="论坛分类">
          <el-select v-model="search.fenlei"
            ><el-option label="请选择" value=""></el-option>
            <el-option
              :key="m.fenleimingcheng"
              v-for="m in tiezifenleiList"
              :value="m.fenleimingcheng"
              :label="m.fenleimingcheng"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus"
            >添加资源</el-button
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

      <el-table-column label="资源编号" align="center">
        <template slot-scope="{ row }"> {{ row.bianhao }} </template>
      </el-table-column>
      <el-table-column label="资源标题" align="center">
        <template slot-scope="{ row }"> {{ row.biaoti }} </template>
      </el-table-column>
      <el-table-column label="资源分类" align="center">
        <template slot-scope="{ row }"> {{ row.fenlei }} </template>
      </el-table-column>
      <!-- <el-table-column label="图片" align="center">
          <template slot-scope="{ row }">
            <e-img :src="row.tupian" style="max-width:120px" />
          </template>
        </el-table-column> -->
      <el-table-column label="附件" align="center">
        <template slot-scope="{ row }">
          <e-file-list v-model="row.fujian"></e-file-list>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $goto({
                path: '/end/ziyuandetail',
                query: { id: row.id },
              })
            "
            type="text"
            >详情</el-button
          >
          <el-button
            @click="$goto({ path: '/end/ziyuanupdt', query: { id: row.id } })"
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
    <!-- </el-card> -->
    <el-dialog title="添加资源" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item
            label="资源编号"
            prop="bianhao"
            :rules="[{ required: true, message: '请填写编号' }]"
          >
            <el-input
              disabled
              placeholder="请输入编号"
              v-model="form.bianhao"
            />
          </el-form-item>

          <el-form-item label="资源标题" prop="biaoti">
            <el-input placeholder="请输入标题" v-model="form.biaoti" />
          </el-form-item>

          <el-form-item label="论坛分类" prop="fenlei">
            <el-select v-model="form.fenlei" style="width:100%;">
              <el-option
                v-for="m in tiezifenleiList"
                :value="m.fenleimingcheng"
                :key="m.id"
                :label="m.fenleimingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="tupian">
            <e-upload-image v-model="form.tupian"></e-upload-image>
          </el-form-item>

          <el-form-item label="附件" prop="fujian" required>
            <e-upload-file v-model="form.fujian"></e-upload-file>
          </el-form-item>

          <el-form-item label="详情" prop="xiangqing">
            <e-editor v-model="form.xiangqing"></e-editor>
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
      dialogVisible: false,
      form: {
        bianhao: rule.getID(),
        biaoti: "",
        fenlei: "",
        tupian: "",
        fujian: "",
        xiangqing: "",
        faburen: this.$store.state.user.session.username,
      },
      loading: false,
      list: [],
      search: {
        bianhao: "",

        biaoti: "",

        fenlei: "",
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数

      tiezifenleiList: [],
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

          this.$post(api.ziyuan.insert, form)
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
      this.$post(api.ziyuan.create, {
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
      this.$post(api.ziyuan.list, filter)
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
          this.$post(api.ziyuan.delete, {
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
