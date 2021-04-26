<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <!-- <el-form-item label="学号">
            <el-input v-model="search.xuehao"></el-input>
          </el-form-item> -->
        <el-form-item label="姓名">
          <el-input v-model="search.xingming"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="kechengid">
          <el-select v-model="search.kechengid" style="width: 100%" clearable>
            <el-option
              v-for="m in kechengmingchengList"
              :key="m.id"
              :value="m.id"
              :label="m.kechengmingcheng"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" style="width: 100%" highlight-current-row>
      <el-table-column type="index" label=""></el-table-column>
      <!-- 序号 -->
      <el-table-column
        label="课程名称"
        align="center"
        :formatter="kechengFormatter"
      >
      </el-table-column>
      <el-table-column label="学号" align="center">
        <template slot-scope="{ row }"> {{ row.xuehao }} </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }"> {{ row.xingming }} </template>
      </el-table-column>

      <!-- <el-table-column label="互评内容">
          <template slot-scope="{ row }"> {{ row.hupingneirong }} </template>
        </el-table-column> -->
      <el-table-column label="互评分数" align="center">
        <template slot-scope="{ row }"> {{ row.hupingfenshu }} </template>
      </el-table-column>
      <el-table-column label="互评人" align="center">
        <template slot-scope="{ row }"> {{ row.hupingren }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $goto({
                path: '/end/xueshenghupingdetail',
                query: { id: row.id },
              })
            "
            type="text"
            >详情</el-button
          >
  <!-- @click="
              $goto({
                path: '/end/xueshenghupingupdt',
                query: { id: row.id },
              }) -->
            <!-- " -->
          <el-button
            v-if="row.hupingren == username"
          @click="edit(row)"
            type="text"
            >编辑</el-button
          >

          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
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
    <el-dialog :title="headtitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form
          :model="form"
          ref="formModel1"
          label-width="100px"
          status-icon
          validate-on-rule-change
        >
          <el-form-item label="学号" prop="xuehao">
            <el-input v-model="form.xuehao" disabled> </el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="form.xingming" disabled> </el-input>
          </el-form-item>
          <el-form-item label="课程名称" prop="kechengid" required>
            <el-select v-model="form.kechengid" style="width: 100%">
              <el-option
                v-for="m in kechengmingchengList"
                :key="m.id"
                :value="m.id"
                :label="m.kechengmingcheng"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="互评分数"
            prop="hupingfenshu"
            :rules="[
              { validator: rule.checkNumber, message: '请输入一个有效数字' },
            ]"
          >
            <el-input
              placeholder="请输入互评分数"
              v-model="form.hupingfenshu"
            />
          </el-form-item>

          <el-form-item label="互评人" prop="hupingren">
            <el-input v-model="form.hupingren" readonly disabled></el-input>
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
import { remove } from "@/utils/utils";
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
      headtitle: "",
      dialogVisible: false,
      username: "",
      loading: false,
      list: [],
      search: {
        xuehao: "",
        xingming: "",
        kechengid: "",
        hupingfenshu_start: "",
        hupingfenshu_end: "",
      },
      form: {
        chishu: "",
        kechengid: "",
        xuehao: "",
        xingming: "",
        hupingneirong: "",
        hupingfenshu: "",
        hupingren: "",
        xueshengid: 0,
      },
      total: {},
      page: 1, // 当前页
      pagesize: 10, // 页大小
      totalCount: 0, // 总行数
      kechengmingchengList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    edit(row){
this.form=row
this.dialogVisible=true
    },
    submit1() {
      this.$refs.formModel1
        .validate()
        .then((res) => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.xueshenghuping.update, form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message.success("编辑成功");
                this.dialogVisible=false
                this.loadList(1)

                this.$refs.formModel1.resetFields();
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
    kechengFormatter(row) {
      var name = "";
      this.kechengmingchengList.forEach(function (item) {
        if (row.kechengid == item.id) {
          name = item.kechengmingcheng;
        }
      });
      return name;
    },
    initKecheng() {
      const params = {};
      params.kechengbianhao = "";
      params.kechengmingcheng = "";
      params.kechengleixing = "";
      params.pagesize = 10;
      params.page = 1;

      this.$post(api.kecheng.list, params)
        .then((res) => {
          if (res.code == api.code.OK) {
            this.kechengmingchengList = res.data.list;
            // extend(this, res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
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
      this.$post(api.xueshenghuping.listhupingren, filter)
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
          this.$post(api.xueshenghuping.delete, {
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
    this.username = localStorage.getItem("username");
    this.initKecheng();
    this.loadList(1);
  },
  mounted() {},
  destroyed() {},
};
</script>
