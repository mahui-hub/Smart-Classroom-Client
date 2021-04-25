<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">
          评阅问题列表788
        </span>
      </div> -->
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
        <!-- <el-form-item label="抢答编号">
            <el-input v-model="search.bianhao"></el-input>
          </el-form-item> -->
        <el-form-item label="问题标题">
          <el-input v-model="search.biaoti"></el-input>
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
        <!-- <el-form-item label="发布人">
            <el-input v-model="search.faburen"></el-input>
          </el-form-item> -->
        <!-- <el-form-item label="抢答人">
            <el-input v-model="search.qiangdaren"></el-input>
          </el-form-item> -->
        <el-form-item label="评分">
          <el-input
            type="text"
            v-model="search.pingfen_start"
            style="width: 80px"
          ></el-input>
          -<el-input
            type="text"
            v-model="search.pingfen_end"
            style="width: 80px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="评阅简介">
            <el-input v-model="search.pingyuejianjie"></el-input>
          </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->

      <!-- <el-table-column label="抢答编号" align="center">
        <template slot-scope="{ row }"> {{ row.bianhao }} </template>
      </el-table-column> -->
      <el-table-column label="问题标题" align="center">
        <template slot-scope="{ row }"> {{ row.biaoti }} </template>
      </el-table-column>
      <el-table-column
        label="课程名称"
        align="center"
        :formatter="kechengFormatter"
      >
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>
      <el-table-column label="抢答人" align="center">
        <template slot-scope="{ row }"> {{ row.qiangdaren }} </template>
      </el-table-column>
      <el-table-column label="评分" align="center">
        <template slot-scope="{ row }"> {{ row.pingfen }} </template>
      </el-table-column>
      <el-table-column label="评阅简介" align="center">
        <template slot-scope="{ row }"> {{ row.pingyuejianjie }} </template>
      </el-table-column>
      <el-table-column label="评阅人" align="center">
        <template slot-scope="{ row }"> {{ row.pingyueren }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $goto({
                path: '/end/pingyuewentidetail',
                query: { id: row.id },
              })
            "
            type="text"
            >详情</el-button
          >

          <el-button
            @click="
              $goto({
                path: '/end/pingyuewentiupdt',
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
    <!-- </el-card> -->
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
import api from "@/api";
import { remove, checkIssh } from "@/utils/utils";
import { extend } from "@/utils/extend";
import objectDiff from "objectdiff";

/**
 * 后台列表页面
 */
export default {
  data() {
    return {
      loading: false,
      list: [],
      search: {
        bianhao: "",
        kechengid: "",
        biaoti: "",

        faburen: "",

        qiangdaren: "",

        pingfen_start: "",
        pingfen_end: "",

        pingyuejianjie: "",
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
     initKecheng() {
      const params = {};
      params.kechengbianhao = "";
      params.kechengmingcheng = "";
      params.kechengleixing = "";
      params.jiaoshiid=localStorage.getItem('jiaoshiid')
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
    kechengFormatter(row) {
      var name = "";
      this.kechengmingchengList.forEach(function (item) {
        if (row.kechengid == item.id) {
          name = item.kechengmingcheng;
        }
      });
      return name;
    },
    panduan() {
      if (localStorage.getItem("role") == "教师") {
        this.search.faburen = localStorage.getItem("username");
        this.loadList(1);
      } else {
        this.loadList(1);
      }
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
      this.$post(api.pingyuewenti.list, filter)
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
          this.$post(api.pingyuewenti.delete, {
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
    this.initKecheng()
    this.panduan();
  },
  mounted() {},
  destroyed() {},
};
</script>
