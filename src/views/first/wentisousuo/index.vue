<template>
  <div v-loading="loading">
    <div>
      <e-container>
        <div style="margin:15px 0 0 0;box-shadow:0px 0px 2px 2px #DDDDDD">
          <e-container>
            <el-tabs type="border-card">
              <el-tab-pane label="问题搜索">
                <div class="form-search" style="margin-bottom: 20px">
                  <el-form inline @submit.prevent.stop size="mini">
                    <el-form-item inline="1">
                      <i class="glyphicon glyphicon-search"></i>
                    </el-form-item>

                    <el-form-item label="课程名称">
                      <el-input v-model="search.kechengmingcheng"></el-input>
                    </el-form-item>

                    <el-form-item label="问题标题">
                      <el-input v-model="search.wentibiaoti"></el-input>
                    </el-form-item>

                    <el-form-item label="问题内容">
                      <el-input v-model="search.wentineirong"></el-input>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="searchSubmit"
                        icon="el-icon-search"
                        >查询
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <div
                  style="margin:15px 0 0 0;box-shadow:0px 0px 2px 2px #DDDDDD"
                >
                  <e-module-widget-title title="问题搜索">
                    <div class="list-table">
                      <table
                        width="100%"
                        border="1"
                        class="table table-list table-bordered table-hover"
                      >
                        <thead>
                          <tr align="center">
                            <th>课程名称</th>
                            <th>问题标题</th>
                            <th>问题内容</th>
                            <th>答疑内容</th>
                            <th>发布人</th>
                            <th width="180" align="center">添加时间</th>
                            <!--  <th width="80" align="center">操作</th>-->
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(r, i) in list">
                            <td>{{ r.kechengmingcheng }}</td>
                            <td>{{ r.wentibiaoti }}</td>
                            <td>{{ r.wentineirong }}</td>
                            <td>{{ r.dayineirong }}</td>
                            <td>{{ r.xuehao }}</td>

                            <td align="center" v-text="r.addtime"></td>

                            <!--   <td align="center">
                                                        <el-button @click="$goto('/wentisousuodetail?id='+r.id)">
                                                            详细
                                                        </el-button>
                                                    </td>-->
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style="margin-top: 10px;text-align: center">
                      <el-pagination
                        @current-change="loadList"
                        :current-page="page"
                        :page-size="15"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount"
                      >
                      </el-pagination>
                    </div>
                  </e-module-widget-title>
                </div>
              </el-tab-pane>
              <el-tab-pane label="求助教师">
                <div class="form-search" style="margin-bottom: 20px">
                  <el-form inline @submit.prevent.stop>
                    <el-form-item inline="1">
                      <i class="glyphicon glyphicon-search"></i>
                    </el-form-item>

                    <el-form-item label="工号">
                      <el-input v-model="search.gonghao"></el-input>
                    </el-form-item>

                    <el-form-item label="姓名">
                      <el-input v-model="search.xingming"></el-input>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="searchSubmit"
                        icon="el-icon-search"
                        >查询
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <div
                  style="margin:15px 0 0 0;box-shadow:0px 0px 2px 2px #DDDDDD"
                >
                  <e-module-widget-title title="求助教师">
                    <div class="list-table">
                      <el-table
                        :data="jiaoshilist1"
                        stripe
                        :cell-style="CellStyle"
                        :header-row-style="{
                          background: '#693',
                          color: '#fff',
                        }"
                        class="table table-list table-bordered table-hover"
                      >
                        <el-table-column
                          fixed
                          prop="gonghao"
                          label="教师工号"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="xingming"
                          label="姓名"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="xingbie"
                          label="性别"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="qqhao"
                          label="QQ号"
                          align="center"
                        >
                          <template slot-scope="{ row }"
                            ><span @click="lianjie(row.qqhao)">
                              {{ row.qqhao }}
                            </span></template
                          >
                        </el-table-column>
                        <el-table-column
                          prop="shouji"
                          label="手机"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="suojiaobanji"
                          label="所教班级"
                          align="center"
                        >
                        </el-table-column>
                      </el-table>
                    </div>

                    <!-- <div style="margin-top: 10px;text-align: center">
                      <el-pagination
                        @current-change="loadList"
                        :current-page="page"
                        :page-size="15"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount"
                      >
                      </el-pagination>
                    </div> -->
                  </e-module-widget-title>
                </div>
              </el-tab-pane>
            </el-tabs>
          </e-container>
        </div>
      </e-container>
    </div>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>

<script>
import api from "@/api";
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
        kechengmingcheng: "",

        wentibiaoti: "",

        wentineirong: "",

        dayineirong: "",

        xuehao: "",
      },
      page: 1, // 当前页
      pagesize: 12, // 页大小
      totalCount: 0, // 总行数
      total: {},
      jiaoshilist1: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    CellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label == "QQ号") {
        return "color:#389DFF;text-decoration: underline;cursor: pointer;";
      }
    },
    lianjie(QQ) {
      window.open(
        "http://wpa.qq.com/msgrd?v=3&uin=" + QQ + "&site=qq&menu=yes",
        "_blank"
      );
    },
    searchSubmit() {
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
        this.$router.replace({
          // 更新query
          path: this.$route.path,
          query: filter,
        });
      }
      this.$post(api.wentisousuo.weblist, filter)
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
  },
  beforeRouteUpdate(to, form, next) {
    var search = extend(this.search, to.query);
    if (search.page) {
      this.page = Math.floor(to.query.page);
      delete search.page;
    }
    if (search.pagesize) {
      this.pagesize = Math.floor(to.query.pagesize);
      delete search.pagesize;
    }
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
    this.loadList(this.page);
  },
  mounted() {},
  destroyed() {},
};
</script>
