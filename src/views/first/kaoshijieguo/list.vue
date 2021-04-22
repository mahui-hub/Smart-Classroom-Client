<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="题库名称">
          <el-input v-model="search.tikumingcheng"></el-input>
        </el-form-item>
        <el-form-item label="评价编号">
          <el-input v-model="search.kaoshibianhao"></el-input>
        </el-form-item>
        <el-form-item label="单选题得分">
          <el-input
            type="text"
            style="width:100px;"
            v-model="search.danxuantidefen_start"
          ></el-input>
          -
          <el-input
            type="text"
            style="width:100px;"
            v-model="search.danxuantidefen_end"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search"
            >查询</el-button
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
      <el-table-column label="评价编号" align="center">
        <template slot-scope="{ row }"> {{ row.kaoshibianhao }} </template>
      </el-table-column>
      <el-table-column label="评价人" align="center">
        <template slot-scope="{ row }"> {{ row.kaoshiren }} </template>
      </el-table-column>
      <el-table-column label="题库编号" align="center">
        <template slot-scope="{ row }"> {{ row.tikubianhao }} </template>
      </el-table-column>
      <el-table-column label="题库名称" align="center">
        <template slot-scope="{ row }"> {{ row.tikumingcheng }} </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <!-- <el-table-column label="单选题得分" align="center">
          <template slot-scope="{ row }"> {{ row.danxuantidefen }} </template>
        </el-table-column>
        <el-table-column label="多选题得分" align="center">
          <template slot-scope="{ row }"> {{ row.duoxuantidefen }} </template>
        </el-table-column> -->

      <el-table-column label="总得分" align="center">
        <template slot-scope="{ row }"> {{ row.zongdefen }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $goto({
                path: '/admin/kaoshijieguodetail',
                query: { id: row.id },
              })
            "
            type="text"
            >详情</el-button
          >

          <!-- <el-tooltip content="编辑" placement="top">
                <el-button
                  icon="el-icon-edit"
                  @click="
                    $goto({
                      path: '/admin/kaoshijieguoupdt',
                      query: { id: row.id },
                    })
                  "
                  type="warning"
                  size="mini"
                ></el-button>
              </el-tooltip> -->

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

    <div>
      总得分总和: {{ total.sum_zongdefen }} 总得分平均值:
      {{ total.avg_zongdefen }} 总得分最小值:
      {{ total.min_zongdefen }} 总得分最大值: {{ total.max_zongdefen }}
    </div>
    <div>
      <span>得出结论：</span>
      <!-- <span v-if="(row.duoxuantidefen+row.danxuantidefen)/total.sum_zongdefen">该教师教学评价为及格</span> -->
      <span v-if="0.85 < total.sum_zongdefen / 20 <= 1"
        >该教师教学评价为优秀</span
      >
      <span v-if="0.75 < total.sum_zongdefen / 20 <= 0.85"
        >该教师教学评价为良好</span
      >
      <span v-if="0.6 < total.sum_zongdefen / 20 <= 0.75"
        >该教师教学评价为合格</span
      >
      <span v-if="total.sum_zongdefen / 20 < 0.6">该教师教学评价为不合格</span>
    </div>
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
        tikumingcheng: "",

        kaoshibianhao: "",

        danxuantidefen_start: "",
        danxuantidefen_end: "",
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
      this.$post(api.kaoshijieguo.list, filter)
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
          this.$post(api.kaoshijieguo.delete, {
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
