<template>
  <div class="app">
    <div>
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
                <tr v-for="(r, i) in list" :key="i">
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
    </div>
    <!-- <div style="margin-top:30px;">
      <div id="myChart" style="width: 100%; height: 400px;" ref="myChart"></div>
    </div> -->
    <div style="margin-top:30px;">
      <div id="myChart1" style="width: 100%; height: 400px;" ref="myChart1"></div>
    </div>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
  let echarts = require('echarts');
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
        ziyuanEcharts: [],
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
        ziyuanEcharts: [],
        ziyuanfenleilist: []
      };
    },
    watch: {},
    computed: {},
    methods: {
      initziyuanfenlei() {
        this.$post("/ziyuanfenlei_list.do").then(res => {
          var array = res.data.list
          for (var i = 0; i < array.length; i++) {
            this.ziyuanfenleilist.push(array[i].fenleimingcheng)
          }
          console.log(this.ziyuanfenleilist)
        })
      },
      getchart() {
        this.$post("ziyuanlist.do").then(result => {
          this.ziyuanEcharts = result.data.ziyuanEcharts1

          this.$nextTick(function () {
            //方法里面第一步// 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("myChart"));
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption({
              title: {
                text: '资源中心资源分析',
                subtext: '按照资源类型分',
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                left: 'center',
                top: 'bottom',
                data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
              },
              toolbox: {
                show: true,
                feature: {
                  mark: {
                    show: true
                  },
                  dataView: {
                    show: true,
                    readOnly: false
                  },
                  restore: {
                    show: true
                  },
                  saveAsImage: {
                    show: true
                  }
                }
              },
              series: [{
                  name: '半径模式',
                  type: 'pie',
                  radius: [20, 140],
                  center: ['25%', '50%'],
                  roseType: 'radius',
                  itemStyle: {
                    borderRadius: 5
                  },
                  label: {
                    show: false
                  },
                  emphasis: {
                    label: {
                      show: true
                    }
                  },
                  data: this.ziyuanEcharts
                },
                {
                  name: '面积模式',
                  type: 'pie',
                  radius: [20, 140],
                  center: ['75%', '50%'],
                  roseType: 'area',
                  itemStyle: {
                    borderRadius: 5
                  },
                  data: this.ziyuanEcharts

                }
              ]

            })
          })
        })
      },
      getchart1() {
        this.$post("ziyuanlist.do").then(result => {
          this.ziyuanEcharts = result.data.ziyuanEcharts1

          this.$nextTick(function () {
            //方法里面第一步// 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("myChart1"));
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption({
              title: {
                text: '资源中心资源分析',
                subtext: '按照资源类型分',
                left: 'left'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                data: this.ziyuanfenleilist
              },
              series: [{
                  name: '资源数量分析',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],
                  label: {
                    position: 'inner',
                    fontSize: 14,
                  },
                  labelLine: {
                    show: false
                  },
                  data: this.ziyuanEcharts
                },
                {
                  name: '资源数量分析',
                  type: 'pie',
                  radius: ['45%', '60%'],
                  labelLine: {
                    length: 30,
                  },
                  label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    borderRadius: 4,

                    rich: {
                      a: {
                        color: '#6E7079',
                        lineHeight: 22,
                        align: 'center'
                      },
                      hr: {
                        borderColor: '#8C8D8E',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                      },
                      b: {
                        color: '#4C5058',
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 33
                      },
                      per: {
                        color: '#fff',
                        backgroundColor: '#4C5058',
                        padding: [3, 4],
                        borderRadius: 4
                      }
                    }
                  },
                  data: this.ziyuanEcharts

                }
              ]

            })
          })
        })
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
      this.initziyuanfenlei()
    },
    mounted() {
      // this.getchart()
      this.getchart1()
    },
    destroyed() {},
  };
</script>