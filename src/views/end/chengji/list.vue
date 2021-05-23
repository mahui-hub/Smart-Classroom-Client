<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
        <!-- <el-form-item label="学号">
            <el-input v-model="search.xuehao"></el-input>
          </el-form-item> -->
        <el-form-item label="姓名">
          <el-input v-model="search.xingming"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="search.banji">
            <el-option label="请选择" value=""></el-option>
            <el-option :key="m.id" v-for="m in banjiList" :value="m.banjimingcheng" :label="m.banjimingcheng">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="search.zhuanye">
            <el-option label="请选择" value=""></el-option>
            <el-option :key="m.id" v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" style="width: 100%" highlight-current-row>
      <el-table-column type="index" label=" "></el-table-column>
      <!-- 序号 -->

      <el-table-column label="学号" align="center">
        <template slot-scope="{ row }"> {{ row.xuehao }} </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }"> {{ row.xingming }} </template>
      </el-table-column>
      <el-table-column label="班级" align="center">
        <template slot-scope="{ row }"> {{ row.banji }} </template>
      </el-table-column>
      <!-- <el-table-column label="专业" align="center">
        <template slot-scope="{ row }"> {{ row.zhuanye }} </template>
      </el-table-column> -->
      <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
      </el-table-column>
      <el-table-column label="成绩比例" align="center">
        <el-table-column label="考勤" align="center">
          <template slot-scope="{ row }"> {{ row.qimochengji }} </template>
        </el-table-column>
        <el-table-column label="学生互评" align="center">
          <template slot-scope="{ row }">
            {{ row.shenghupingchengji }}
          </template>
        </el-table-column>
        <el-table-column label="教师评价" align="center">
          <template slot-scope="{ row }">
            {{ row.jiaoshipingjiachengji }}
          </template>
        </el-table-column>
        <el-table-column label="随堂测试" align="center">
          <template slot-scope="{ row }">
            {{ row.suitangceshichengji }}
          </template>
        </el-table-column>
        <el-table-column label="抢答问题" align="center">
          <template slot-scope="{ row }">
            {{ row.qiangdawentichengji }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="总分" align="center">
        <template slot-scope="{ row }"> {{ row.zongfen }} </template>
      </el-table-column>
      <!-- <el-table-column label="添加人" align="center">
        <template slot-scope="{ row }"> {{ row.tianjiaren }} </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/chengjidetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>

          <el-button type="text" @click="
              $goto({ path: '/end/chengjiupdt', query: { id: row.id } })
            ">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <!-- <div>
      总分总和: {{ total.sum_zongfen }} 总分平均值:
      {{ total.avg_zongfen }} 总分最小值: {{ total.min_zongfen }} 总分最大值:
      {{ total.max_zongfen }}
    </div> -->
  </div>
</template>
<style type="text/scss" scoped lang="scss">
</style>
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
        search: {
          xuehao: "",
          xingming: "",
          banji: "",
          zhuanye: "",
          kechengid: ""
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        kechengmingchengList: [],
        banjiList: [],
        zhuanyeList: [],
      };
    },
    watch: {},
    computed: {},
    methods: {
      initKecheng(page) {
        // 防止重新点加载列表
        // 筛选条件
        var filter = extend(true, {}, {
          jiaoshiid: localStorage.getItem("jiaoshiid"),
          page: 1,
          pagesize: 10,
        });
        this.$post(api.kecheng.list, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
              var id = ""
              this.kechengmingchengList.map(function (item) {
                id = item.id
              })
              this.loadList(1, id)
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
        this.loadList(1);
      },
      sizeChange(e) {
        this.pagesize = e;
        this.loadList(1);
      },
      checkIssh,

      loadList(page, id) {
        // 防止重新点加载列表
        this.page = page;
        // 筛选条件
        if (localStorage.getItem("role") == "教师") {
          this.search.kechengid = id
        }
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });

        this.$post(api.chengji.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.list = []
              this.totalCount = res.data.totalCount;
              var array1 = res.data.list;
              var array = [];

              if (this.totalCount != 0) {
                array1.forEach((item) => {
                  array.push(item);
                });
                for (var i in array) {
                  this.list.push(array[i]);
                }
                // console.log(this.list)
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
      // 删除某行方法
      deleteItem(row) {
        this.$confirm("确定删除数据？", "提示", {
            // 弹出 确认框提示是否要删除
            type: "warning",
          })
          .then(() => {
            // 确定操作

            this.loading = true; // 滚动条
            this.$post(api.chengji.delete, {
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
      this.initKecheng()
      // this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>