<template>
  <div class="app">
    <div>
      <e-container>
        <div style="margin:15px 0 0 0;box-shadow:0px 0px 2px 2px #DDDDDD">
          <e-module-widget-title title="资源列表">
            <div class="list-table">
              <table width="100%" border="1" class="table table-list table-bordered table-hover">
                <thead>
                  <tr align="center">
                    <th>编号</th>
                    <th>标题</th>
                    <th>分类</th>
                    <th>图片</th>
                    <th>附件</th>
                    <th>发布人</th>
                    <th width="180" align="center">添加时间</th>
                    <!--   <th width="80" align="center">操作</th>-->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in list">
                    <td>{{ r.bianhao }}</td>
                    <td>{{ r.biaoti }}</td>
                    <td>{{ r.fenlei }}</td>
                    <td>
                      <e-img :src="r.tupian" style="max-width:120px" />
                    </td>
                    <td>
                      <e-file-list v-model="r.fujian"></e-file-list>
                    </td>
                    <td>{{ r.faburen }}</td>

                    <td align="center" v-text="r.addtime"></td>

                    <!--      <td align="center">
                                        <el-button @click="$goto('/ziyuandetail?id='+r.id)">
                                            详细
                                        </el-button>
                                    </td>-->
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="margin-top: 10px;text-align: center">
              <el-pagination @current-change="loadList" :current-page="page" :page-size="15"
                layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
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

          fenlei: "",

          tupian: "",

          fujian: "",

          xiangqing: "",

          faburen: "",
        },
        page: 1, // 当前页
        pagesize: 12, // 页大小
        totalCount: 0, // 总行数
        total: {},
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
        this.$post(api.ziyuan.weblist, filter)
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