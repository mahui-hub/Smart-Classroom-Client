<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="帖子标题">
          <el-input v-model="search.biaoti"></el-input>
        </el-form-item>
        <el-form-item label="帖子类型">
          <el-select v-model="search.fenlei">
            <el-option label="请选择" value=""></el-option>
            <el-option :key="m.id" v-for="m in tiezifenleiList" :value="m.id" :label="m.fenleimingcheng"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" label=" "></el-table-column>
      <!-- 序号 -->
      <el-table-column label="帖子编号" align="center">
        <template slot-scope="{ row }"> {{ row.tiezibianhao }} </template>
      </el-table-column>
      <el-table-column label="帖子标题" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.biaoti }} </template>
      </el-table-column>
      <el-table-column label="帖子类型" align="center">
        <template slot-scope="{ row }">
          <e-select-view module="tiezifenlei" :value="row.fenlei" select="id" show="fenleimingcheng"></e-select-view>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="center">
        <template slot-scope="{ row }">
          <span v-html="row.huifuneirong"></span>
        </template>
      </el-table-column>
      <el-table-column label="回复人" align="center">
        <template slot-scope="{ row }"> {{ row.huifuren }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button v-if="row.huifuren == username" @click="
              $goto({
                path: '/end/tiezihuifuupdt',
                query: { id: row.id },
              })
            " type="text">编辑</el-button>
          <!-- </el-tooltip>
              <el-tooltip content="删除" placement="top"> -->
          <el-button type="text" @click="deleteItem(row)" v-if="row.huifuren == username">删除 </el-button>
          <!-- </el-tooltip>
            </el-button-group> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
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

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        username: "",
        loading: false,
        list: [],
        search: {
          tiezibianhao: "",

          biaoti: "",

          fenlei: "",

          huifuneirong: "",

          huifuren: "",
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
        this.$post(api.tiezihuifu.list, filter)
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
            this.$post(api.tiezihuifu.delete, {
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
      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>