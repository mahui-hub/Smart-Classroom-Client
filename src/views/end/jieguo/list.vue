<template>
  <!-- 教学结果-----评价 -->
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="题库名称">
          <el-input v-model="search.tikumingcheng"></el-input>
        </el-form-item>
        <el-form-item label="试题题目">
          <el-input v-model="search.shititimu"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-select v-model="search.kechengid" clearable>
            <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <!-- <el-table-column label="评价结果编号" align="center">
        <template slot-scope="{ row }"> {{ row.kaoshibianhao }} </template>
      </el-table-column> -->
      <el-table-column label="评价人" align="center">
        <template slot-scope="{ row }"> {{ row.kaoshiren }} </template>
      </el-table-column>
      <!-- <el-table-column label="题库编号" align="center">
          <template slot-scope="{ row }"> {{ row.tikubianhao }} </template>
        </el-table-column> -->
      <el-table-column label="题库名称" align="center">
        <template slot-scope="{ row }"> {{ row.tikumingcheng }} </template>
      </el-table-column>

      <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
      </el-table-column>

      <el-table-column label="试题题目" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.shititimu }} </template>
      </el-table-column>
      <!-- <el-table-column label="题目类型" align="center">
          <template slot-scope="{ row }"> {{ row.leixing }} </template>
        </el-table-column> -->
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>
      <el-table-column label="评价人答案" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          {{ row.zimu }}.{{ row.daan }}
        </template>
      </el-table-column>
      <el-table-column label="试题得分" align="center">
        <template slot-scope="{ row }"> {{ row.defen }} </template>
      </el-table-column>
      <!-- <el-table-column label="字母" width="130">
          <template slot-scope="{ row }"> {{ row.zimu }} </template>
        </el-table-column> -->

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/jieguodetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>
          <!-- <el-button
              @click="
                $goto({ path: '/end/jieguoupdt', query: { id: row.id } })
              "
              type="text"
              >编辑</el-button
            > -->
          <el-button type="text" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
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
        loading: false,
        list: [],
        kechengmingchengList: [],
        search: {
          kechengid: "",
          tikumingcheng: "",
          shititimu: "",
          tikutype: "评价题库",
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
      checkIssh,

      loadList(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        // 筛选条件
        if (localStorage.getItem('role') == '教师') {
          this.search.tikutype = "测验题库"
        }
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
        this.$post(api.jieguo.list, filter)
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
            this.$post(api.jieguo.delete, {
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
      this.initKecheng();
      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>