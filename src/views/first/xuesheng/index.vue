<template>
  <div v-loading="loading">
    <div>
      <e-container>
        <div style="margin:15px 0 0 0;box-shadow:0px 0px 2px 2px #DDDDDD">
          <e-module-widget-title title="学生互评">
            <div class="form-search" style="margin-bottom: 20px">
              <el-form inline @submit.prevent.stop :inline="true" size="mini">
                <el-form-item inline="1">
                  <i class="glyphicon glyphicon-search"></i>
                </el-form-item>

                <el-form-item label="学号">
                  <el-input v-model="search.xuehao"></el-input>
                </el-form-item>

                <el-form-item label="姓名">
                  <el-input v-model="search.xingming"></el-input>
                </el-form-item>

                <el-form-item label="班级">
                  <el-select v-model="search.banji">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                      v-for="m in banjiList"
                      :value="m.banjimingcheng"
                      :label="m.banjimingcheng"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="专业">
                  <el-select v-model="search.zhuanye">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                      v-for="m in zhuanyeList"
                      :value="m.zhuanye"
                      :label="m.zhuanye"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    @click="searchSubmit"
                    icon="el-icon-search"
                    >查询</el-button
                  >
                </el-form-item>
              </el-form>
            </div>

            <div class="list-table">
              <table
                width="100%"
                border="1"
                class="table table-list table-bordered table-hover"
              >
                <thead>
                  <tr align="center">
                    <th>学号</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>班级</th>
                    <th>专业</th>
                    <th>联系电话</th>
                    <th>QQ号</th>
                    <th>头像</th>
                    <th width="180" align="center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in list">
                    <td>{{ r.xuehao }}</td>
                    <td>{{ r.xingming }}</td>
                    <td>{{ r.xingbie }}</td>
                    <td>{{ r.banji }}</td>
                    <td>{{ r.zhuanye }}</td>
                    <td>{{ r.lianxidianhua }}</td>
                    <td>{{ r.qqhao }}</td>
                    <td>
                      <e-img :src="r.touxiang" style="max-width:120px" />
                    </td>

                    <td align="center">
                      <el-tooltip content="互评" placement="top">
                        <el-button
                          @click="
                            $goto({
                              path: '/xueshenghupingadd',
                              query: { id: r.id },
                            })
                          "
                          icon="el-icon-info"
                          type="info"
                          size="mini"
                        ></el-button>
                      </el-tooltip>
                    </td>
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
        xuehao: "",

        xingming: "",

        xingbie: "",

        banji: "",

        zhuanye: "",

        lianxidianhua: "",

        qqhao: "",

        touxiang: "",

        xiangqing: "",
      },
      page: 1, // 当前页
      pagesize: 12, // 页大小
      totalCount: 0, // 总行数
      total: {},

      banjiList: [],
      zhuanyeList: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
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
      this.$post(api.xuesheng.weblist, filter)
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
    selectRadio(target, name) {
      this.search[target] = name;
      this.searchSubmit(1);
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
