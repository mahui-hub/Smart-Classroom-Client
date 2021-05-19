<template>
  <div class="app">
    <div class="app-header">
      <el-form inline ref="formModel" :model="search">
        <el-form-item label="公告标题" prop="biaoti">
          <el-input placeholder="请输入公告标题" v-model="search.biaoti" />
        </el-form-item>
        <el-form-item label="课程名称" prop="biaoti">
          <el-input placeholder="请输入课程名称" v-model="search.kechengmingcheng" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-bottom">
      <el-card class="box-card" v-for="r in list" :key="r.id">
        <div slot="header" class="clearfix">
          <span class="header-title">{{ r.biaoti }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="view(r.id)">查看</el-button>
        </div>
        <div class="item">
          <img :src="r.tupian" alt="" />
        </div>
      </el-card>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .app {
    padding: 40px 80px;

    .app-bottom {
      display: flex;

      .box-card {
        width: 23%;
        margin-right: 10px;
      }

      .clearfix {
        display: flex;
        justify-content: space-between;

        .header-title {
          width: 80%;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
    }
  }
</style>
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
        loading: false,
        list: [],
        search: {
          bianhao: "",
          biaoti: "",
          tupian: "",
          neirong: "",
          faburen: "",
          kechengmingcheng: "",
          banjiid: "",
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
        array: [],
      };
    },
    methods: {
      panduan() {
        if (localStorage.getItem("role") == "管理员") {
          this.loadList1();
        } else if (localStorage.getItem("role") == "学生") {
          this.loadList1(0);
          this.initKengcheng();
        } else if (localStorage.getItem("role") == "教师") {
          this.loadList1(0);
          this.initKengcheng1();
        }
      },
      initKengcheng() {
        // 筛选条件
        const params = {};
        params.kechengleixing = "";
        params.jiaoshiid = "";
        params.kechengbianhao = "";
        params.kechengmingcheng = "";
        params.banjiid = localStorage.getItem("banjiId");
        params.page = 1;
        params.pagesize = 12;

        this.$post(api.kecheng.weblist, params)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              var list = res.data.list;
              for (var i in list) {
                this.loadList1(list[i].id);
              }
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      initKengcheng1() {
        // 筛选条件
        const params = {};
        params.kechengleixing = "";
        params.jiaoshiid = localStorage.getItem("jiaoshiid");
        params.kechengbianhao = "";
        params.kechengmingcheng = "";
        params.banjiid = "";
        params.page = 1;
        params.pagesize = 12;
        this.$post(api.kecheng.weblist, params)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              var list = res.data.list;
              for (var i in list) {
                this.loadList1(list[i].id);
              }
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      loadList1(id) {
        this.search.kechengid = id;
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: 1,
          pagesize: 10,
        });
        this.$post(api.gonggao.weblist, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              var array1 = res.data.list;
              array1.forEach((item) => {
                this.array.push(item);
              });
              // console.log(this.array);
              this.list = this.array;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      view(id) {
        this.$router.push("/gonggaodetail?id=" + id);
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
        this.$post(api.gonggao.weblist, filter)
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
      this.panduan();
    },
    mounted() {},
    destroyed() {},
  };
</script>