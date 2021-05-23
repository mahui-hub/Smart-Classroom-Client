<template>
  <div class="app">
    <e-module-widget-title title="教学评价">
      <div class="list-table">
        <el-table border :data="list" stripe highlight-current-row>
          <el-table-column type="index" align="center"></el-table-column>
          <!-- 序号 -->
          <el-table-column label="题库名称" align="center" prop="tikumingcheng">
          </el-table-column>
          <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
          </el-table-column>
          <el-table-column label="发布人" align="center">
            <template slot-scope="{ row }">
              {{ row.faburen }}
            </template>
          </el-table-column>
          <el-table-column label="添加时间" align="center">
            <template slot-scope="{ row }">
              {{ row.addtime }}
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button @click="xingxi(row)" type="text" v-if="row.pingjiarens.indexOf(username)==-1">
                评价课程
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-top: 10px; text-align: center">
        <el-pagination @current-change="loadList" :current-page="page" :page-size="15"
          layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </e-module-widget-title>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
  import api from "@/api";
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
        kechengmingchengList: [],
        dialogVisible: false,
        form1: {
          kechengmingcheng: "",
        },
        loading: false,
        list: [],
        search: {
          kechengid: "",
          tikumingcheng: "",
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
        id: "",
        array: [],
        username: ""
      };
    },
    watch: {},
    computed: {},
    methods: {
      submit2() {
        this.$router.push("/tikudetail?id=" + this.id);
      },
      xingxi(row) {
        this.$router.push("/tikudetail?id=" + row.id);
      },
      initKecheng(page) {
        const params = {};
        params.kechengbianhao = "";
        params.kechengmingcheng = "";
        params.kechengleixing = "";
        params.banjiid = localStorage.getItem("banjiId");
        params.pagesize = 10;
        params.page = 1;
        this.$post(api.kecheng.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
              for (var i in this.kechengmingchengList) {
                this.loadList(page, this.kechengmingchengList[i].id);
              }
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
      searchSubmit() {
        this.list = []
        this.initKecheng(1);
        // this.loadList(1);
      },
      loadList(page, id) {
        this.loading = true;
        this.page = page;
        this.array = [];
        this.search.kechengid = id;
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          tikutype: "评价题库",
          page: page + "",
          pagesize: this.pagesize + "",
        });
        this.$post(api.tiku.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.list = []
              this.totalCount = res.data.totalCount;
              // extend(this, res.data);
              var array1 = res.data.list;
              var array = [];
              array1.forEach((item) => {
                array.push(item);
              });
              if (this.totalCount != 0) {
                for (var i in array) {
                  this.list.push(array[i]);
                }
              }
              this.totalCount = this.list.length
              // console.log(this.list)
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
      this.initKecheng(1);
      this.username = localStorage.getItem("username")
    },
    mounted() {},
    destroyed() {},
  };
</script>