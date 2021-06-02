<template>
  <div class="app">
    <e-module-widget-title title="问题抢答">
      <div class="form-search" style="margin-bottom: 20px">
        <el-form inline :model="search" size="mini">
          <el-form-item label="问题标题">
            <el-input v-model="search.biaoti"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="list-table">
        <el-table border :data="list" stripe highlight-current-row>
          <el-table-column type="index" align="center"></el-table-column>
          <!-- 序号 -->
          <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
          </el-table-column>
          <el-table-column label="问题内容" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }"> {{ row.biaoti }} </template>
          </el-table-column>
          <el-table-column label="抢答人数" align="center">
            <template slot-scope="{ row }">
              {{ row.qiangdarenshu }}
            </template>
          </el-table-column>
          <el-table-column label="已抢人数" align="center">
            <template slot-scope="{ row }">
              {{ row.yiqiangrenshu }}
            </template>
          </el-table-column>
          <el-table-column label="附件" align="center">
            <template slot-scope="{ row }">
              <e-file-list v-model="row.fujian"></e-file-list>
            </template>
          </el-table-column>
          <el-table-column label="发布人" align="center">
            <template slot-scope="{ row }"> {{ row.faburen }} </template>
          </el-table-column>
          <el-table-column label="添加时间" align="center">
            <template slot-scope="{ row }"> {{ row.addtime }} </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }" v-if="row.qiangdarenshu > row.yiqiangrenshu && isQiang">
              <el-button type="text" @click="qiangda(row)" v-if="row.qiangdarens.indexOf(username)==-1">
                问题抢答
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-top: 10px; text-align: center">
        <el-pagination @current-change="initKecheng" :current-page="page" :page-size="15"
          layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </e-module-widget-title>

    <!-- 问题抢答 -->
    <el-dialog title="抢答问题" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px">
          <el-form-item label="抢答编号" prop="bianhao">
            <el-input v-model="form.bianhao" disabled></el-input>
          </el-form-item>
          <el-form-item label="问题内容" prop="biaoti">
            <el-input v-model="form.biaoti" disabled></el-input>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" disabled></el-input>
          </el-form-item>
          <el-form-item label="抢答人" prop="qiangdaren">
            <el-input v-model="form.qiangdaren" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="回答内容" prop="beizhu">
            <el-input type="textarea" v-model="form.beizhu"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss">
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
        username: '',
        isQiang: true,
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          bianhao: "",
          biaoti: "",
          tupian: "",
          qiangdarenshu_start: "",
          qiangdarenshu_end: "",
          yiqiangrenshu_start: "",
          yiqiangrenshu_end: "",
          fujian: "",
          xiangqing: "",
          faburen: "",
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
        kechengmingchengList: [],
        form: {
          kechengid: "",
          bianhao: "",
          biaoti: "",
          tupian: "",
          faburen: this.$store.state.user.session.username,
          beizhu: "",
          qiangdaren: this.$store.state.user.session.username,
          wentiqiangdaid: 0,
        },
      };
    },
    watch: {},
    computed: {},
    methods: {
      qiangda(row) {
        // this.form=row
        this.loadInfo(row.id);
        this.dialogVisible = true;
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.qiangdawenti.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("抢答问题成功");
                  this.isQiang = false;
                  this.dialogVisible = false;
                  this.$refs.formModel.resetFields();
                  this.initKecheng(1);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      loadInfo(id) {
        var form = this.form;
        // 获取模块得数据
        this.loading = true;
        this.$post(api.qiangdawenti.create, {
            id: id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              var readMap = res.data.readMap;
              for (var i in form) {
                if (readMap[i] && i != "id") {
                  form[i] = res.data.readMap[i];
                }
              }
              form.wentiqiangdaid = readMap.id;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
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
      },
      loadList(page, id) {
        // 防止重新点加载列表
        this.loading = true;
        this.page = page;
        // 筛选条件
        this.search.kechengid = id;
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });
        this.list = []
        this.$post(api.wentiqiangda.weblist, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
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
      this.username = localStorage.getItem('username')
      // this.loadList(this.page);
    },
    mounted() {},
    destroyed() {},
  };
</script>