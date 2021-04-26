<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
      
        <el-form-item label="题目">
          <el-input v-model="search.timu"></el-input>
        </el-form-item>
        <el-form-item label="回答人">
          <el-input v-model="search.huidaren"></el-input>
        </el-form-item>
        <el-form-item label="打分">
          <el-input
            type="text"
            style="width: 80px"
            v-model="search.dafen_start"
          ></el-input>
          -<el-input
            type="text"
            style="width: 80px"
            v-model="search.dafen_end"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" stripe highlight-current-row>
      <el-table-column type="index" label=" "></el-table-column>
      <!-- 序号 -->

      <el-table-column label="题目" align="center">
        <template slot-scope="{ row }"> {{ row.timu }} </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>
      <el-table-column label="回答人" align="center">
        <template slot-scope="{ row }"> {{ row.huidaren }} </template>
      </el-table-column>
      <el-table-column label="打分" align="center">
        <template slot-scope="{ row }"> {{ row.dafen }} </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{ row }"> {{ row.beizhu }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $goto({
                path: '/end/datipingyuedetail',
                query: { id: row.id },
              })
            "
            type="text"
            >详情</el-button
          >

          <el-button
            type="text"
            @click="
              $goto({
                path: '/end/datipingyueupdt',
                query: { id: row.id },
              })
            "
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
  </div>
</template>
<style type="text/scss" scoped lang="scss">
</style>
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

        timu: "",

        huidaren: "",

        dafen_start: "",
        dafen_end: "",

        beizhu: "",
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
      this.$post(api.datipingyue.list, filter)
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
          this.$post(api.datipingyue.delete, {
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
