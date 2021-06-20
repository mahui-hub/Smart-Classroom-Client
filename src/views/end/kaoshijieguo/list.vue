<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :model="search" :inline="true" size="mini">
        <el-form-item label="试卷名称">
          <el-input v-model="search.tikumingcheng"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="kechengid">
          <el-select v-model="search.kechengid" style="width: 100%" clearable>
            <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" style="width: 100%" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="评价人" align="center">
        <template slot-scope="{ row }"> {{ row.kaoshiren }} </template>
      </el-table-column>
      <el-table-column label="试卷编号" align="center">
        <template slot-scope="{ row }"> {{ row.tikubianhao }} </template>
      </el-table-column>
      <el-table-column label="试卷名称" align="center">
        <template slot-scope="{ row }"> {{ row.tikumingcheng }} </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" :formatter="kechengFormatter">
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <el-table-column label="总得分" align="center">
        <template slot-scope="{ row }"> {{ row.zongdefen}} </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="100">
        <template slot-scope="{ row }">
          <el-button @click="
              $goto({
                path: '/end/kaoshijieguodetail',
                query: { id: row.id },
              })
            " type="text">详情</el-button>

          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
          <el-button type="text" @click="fenxiItem(row)">教学分析 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px; text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog title="教学分析" :visible.sync="dialogVisible">
      <div class="form-database-form">
        <div id="myChart" style="width: 100%; height: 350px;" ref="myChart"></div>
        <div style="margin-top:30px;">
          <div style="font-size: 20px;font-weight: bold;color: #19dab6;">得出结论：</div>
          <div v-if="0.85 < value <= 1" class="titleStyle">该课程教学评价为优秀</div>
          <div v-if="0.75 < value <= 0.85" class="titleStyle"> 该课程教学评价为良好</div>
          <div v-if="0.6 < value <= 0.75" class="titleStyle">该课程教学评价为合格</div>
          <div v-if="value < 0.6" class="titleStyle">该课程教学评价为不合格</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .titleStyle {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #a96666;
  }
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
        dialogVisible: false,
        kechengmingchengList: [],
        loading: false,
        list: [],
        search: {
          tikumingcheng: "",
          kechengid: "",
          tikutype: "评价问卷",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        echartsList: [],
        value: ""
      };
    },
    watch: {},
    computed: {},
    methods: {
      getchart() {
        this.$nextTick(function () {
          //方法里面第一步// 基于准备好的dom，初始化echarts实例
          let myChart = echarts.init(document.getElementById("myChart"));
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption({
            title: {
              text: '教学分析',
              left: 'right'
            },
            series: [{
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 1,
              splitNumber: 8,
              axisLine: {
                lineStyle: {
                  width: 6,
                  color: [
                    [0.25, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1, '#7CFFB2']
                  ]
                }
              },
              pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                length: 12,
                lineStyle: {
                  color: 'auto',
                  width: 2
                }
              },
              splitLine: {
                length: 20,
                lineStyle: {
                  color: 'auto',
                  width: 5
                }
              },
              axisLabel: {
                color: '#464646',
                fontSize: 20,
                distance: -60,
                formatter: function (value) {
                  if (value === 0.875) {
                    return '优';
                  } else if (value === 0.625) {
                    return '中';
                  } else if (value === 0.375) {
                    return '良';
                  } else if (value === 0.125) {
                    return '差';
                  }
                }
              },
              title: {
                offsetCenter: [0, '-20%'],
                fontSize: 18
              },
              detail: {
                fontSize: 30,
                offsetCenter: [0, '0%'],
                valueAnimation: true,
                formatter: function (value) {
                  return Math.round(value * 100) + '分';
                },
                color: 'auto'
              },
              data: this.echartsList
            }]
          })
        })
      },
      fenxiItem(row) {

        this.echartsList.push({
          name: "该课程教学评价等级",
          value: row.zongdefen / 100
        })
        this.$nextTick(() => {
          this.getchart()
        })
        this.value = row.zongdefen / 100
        this.dialogVisible = true

      },
      initKecheng() {
        const params = {};
        params.kechengbianhao = "";
        params.kechengmingcheng = "";
        params.kechengleixing = "";
        params.pagesize = 10;
        params.page = 1;
        this.$post(api.kecheng.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
              // extend(this, res.data);
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
        console.log(name)
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

      loadList(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        // 筛选条件
        if (localStorage.getItem('role') == '教师') {
          this.search.tikutype = "测验试卷"
        }
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });
        var diff = objectDiff.diff(filter, this.$route.query);
        if (diff.changed != "equal") {
          // 筛选的条件不一致则更新链接
          this.$router.push({
            // 更新query
            path: this.$route.path,
            query: filter,
          });
        }
        this.$post(api.kaoshijieguo.list, filter)
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
      // 删除某行方法
      deleteItem(row) {
        this.$confirm("确定删除数据？", "提示", {
            // 弹出 确认框提示是否要删除
            type: "warning",
          })
          .then(() => {
            // 确定操作

            this.loading = true; // 滚动条
            this.$post(api.kaoshijieguo.delete, {
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
      this.initKecheng();
      this.loadList(1);
    },
    mounted() {

    },
    destroyed() {},
  };
</script>