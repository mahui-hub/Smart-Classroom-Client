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
      <el-table-column label="课程名称" align="center" :formatter="kechengFormatter" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="成绩比例" align="center">
        <el-table-column label="期末成绩" align="center">
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
      <!-- <el-table-column label="等级评定" align="center">

 

      </el-table-column> -->

      <el-table-column label="操作" align="center" min-width="150px">
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
    <!-- <div id="myChart" style="width: 100%; height: 50px;" ref="myChart"></div> -->
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
  let echarts = require('echarts');
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
        echartsData: []
      };
    },
    watch: {},
    computed: {},
    methods: {
      huoqudata() {
        var obj = {}
        for (var i = 0; i < this.list.length; i++) {
          obj.value = this.list[i].zongfen / 100
          obj.name = this.list[i].xingming
        }
        this.echartsData.push(obj)
      },
      // getchart() {
      //   // var a=this.total.sum_zongfen
      //   this.$nextTick(function () {
      //     //方法里面第一步// 基于准备好的dom，初始化echarts实例
      //     let myChart = echarts.init(document.getElementById("myChart"));
      //     // 使用刚指定的配置项和数据显示图表。
      //     myChart.setOption({
      //       title: {
      //         text: '帖子数据资源分析',
      //         left: 'right'
      //       },
      //       series: [{
      //         type: 'gauge',
      //         startAngle: 180,
      //         endAngle: 0,
      //         min: 0,
      //         max: 1,
      //         splitNumber: 8,
      //         axisLine: {
      //           lineStyle: {
      //             width: 6,
      //             color: [
      //               [0.25, '#FF6E76'],
      //               [0.5, '#FDDD60'],
      //               [0.75, '#58D9F9'],
      //               [1, '#7CFFB2']
      //             ]
      //           }
      //         },
      //         pointer: {
      //           icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
      //           length: '12%',
      //           width: 20,
      //           offsetCenter: [0, '-60%'],
      //           itemStyle: {
      //             color: 'auto'
      //           }
      //         },
      //         axisTick: {
      //           length: 12,
      //           lineStyle: {
      //             color: 'auto',
      //             width: 2
      //           }
      //         },
      //         splitLine: {
      //           length: 20,
      //           lineStyle: {
      //             color: 'auto',
      //             width: 5
      //           }
      //         },
      //         axisLabel: {
      //           color: '#464646',
      //           fontSize: 20,
      //           distance: -60,
      //           formatter: function (value) {
      //             if (value === 0.875) {
      //               return '优';
      //             } else if (value === 0.625) {
      //               return '中';
      //             } else if (value === 0.375) {
      //               return '良';
      //             } else if (value === 0.125) {
      //               return '差';
      //             }
      //           }
      //         },
      //         title: {
      //           offsetCenter: [0, '-20%'],
      //           fontSize: 30
      //         },
      //         detail: {
      //           fontSize: 50,
      //           offsetCenter: [0, '0%'],
      //           valueAnimation: true,
      //           formatter: function (value) {
      //             return Math.round(value * 100) + '分';
      //           },
      //           color: 'auto'
      //         },
      //         data: this.echartsData
      //       }]
      //     })
      //   })
      // },
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
                this.huoqudata()
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
    mounted() {
      // this.getchart()
    },
    destroyed() {},
  };
</script>