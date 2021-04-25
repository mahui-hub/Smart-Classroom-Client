<template>
  <div v-loading="loading">
    <div>
      <e-container>
        <el-row :gutter="15">
          <el-col :md="24">
            <div
              style="
                margin: 15px 0 0 0;
                box-shadow: 0px 0px 2px 2px #dddddd;
                background: #ffffff;
                padding: 10px;
              "
            >
              <e-module-widget-title title="教学评价">
                <div class="list-table">
                  <table
                    width="100%"
                    border="1"
                    class="table table-list table-bordered table-hover"
                  >
                    <thead>
                      <tr align="center">
                        <th>题库编号</th>
                        <th>题库名称</th>
                        <th>课程名称</th>
                        <!-- <th>教师</th> -->
                        <th>发布人</th>
                        <th width="180" align="center">添加时间</th>
                        <th width="80" align="center">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, i) in list">
                        <td>{{ r.tikubianhao }}</td>
                        <td>{{ r.tikumingcheng }}</td>
                        <td>{{ r.kechengid }}</td>
                        <!-- <td>{{ r.jiaoshi }}</td> -->
                        <td>{{ r.faburen }}</td>

                        <td align="center" v-text="r.addtime"></td>

                        <td align="center">
                          <!-- <el-button @click="$goto('/tikudetail?id=' + r.id)">
                            详细
                          </el-button> -->
                          <el-button @click="xingxi(r)"> 详细 </el-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="margin-top: 10px; text-align: center">
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
          </el-col>
          <el-col :md="8"> </el-col>
        </el-row>
      </e-container>
    </div>
    <!-- <el-dialog
      title="选择课程进行评价"
      :visible.sync="dialogVisible"
      size="mini"
    >
      <div class="form-database-form">
        <el-form :model="form1" ref="formModel" label-width="100px">
          <el-form-item label="课程名称" prop="kechengmingcheng" required>
            <el-select v-model="form1.kechengmingcheng" style="width:100%">
              <el-option
                v-for="m in kechengmingchengList"
                :key="m.kechengmingcheng"
                :value="m.kechengmingcheng"
                :label="m.kechengmingcheng"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit2">确 定</el-button>
      </span>
    </el-dialog> -->
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
      kechengmingchengList: [],
      dialogVisible: false,
      form1: {
        kechengmingcheng: "",
      },
      loading: false,
      list: [],
      search: {
        tikubianhao: "",

        tikumingcheng: "",

        jiaoshi: "",

        faburen: "",
      },
      page: 1, // 当前页
      pagesize: 12, // 页大小
      totalCount: 0, // 总行数
      total: {},
      id: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    submit2() {
      this.$router.push("/tikudetail?id=" + this.id);
    },
    xingxi(row) {
      // this.dialogVisible = true;
      // this.id = row.id;
      this.$router.push("/tikudetail?id=" + row.id);
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
      this.$post(api.tiku.weblist, filter)
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
