<template>
  <div class="app">
    <el-row :gutter="8" class="app-box">
      <div style="margin:20px 0;">
        <span class="show_t b">课程详情</span>
        <el-divider></el-divider>
      </div>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <!-- <video-player ref="videoPlayer" :playsinline="true" class="vjs-custom-skin" :options="playerOptions">
          </video-player> -->
          <e-video :src="map.kechengshipin"></e-video>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <div class="show_t b">
            <span v-html="map.kechengmingcheng"> </span>
          </div>
          <div class="show_t w">
            <span>讲师：</span>
            <span>
              <e-select-view module="jiaoshi" :value="map.jiaoshiid" select="id" show="xingming"></e-select-view>
            </span>
          </div>
          <div class="show_t w">
            <span>发布人：</span>
            <span v-html="map.faburen"></span>
          </div>
          <div class="show_t w">
            <span>课程类型:</span>
            <span>
              <e-select-view module="kechengleixing" :value="map.kechengleixing" select="id" show="kechengleixing">
              </e-select-view>
            </span>
          </div>
          <div class="show_t w">
            <span>课程文档:</span>
            <e-file-list v-model="map.kechengwendang"></e-file-list>
          </div>
          <div class="show_t w">
            <span>课程介绍:</span>
            <span v-html="map.kechengjieshao" class="long"></span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="pingjia">
      <div id="myChart" style="width: 100%; height: 300px" ref="myChart"></div>
    </div>
    <div class="pingjia">
      <div>
        <span class="show_t b">课程评价</span>
        <span>
          <el-button type="success" class="add" @click="comment1">我来评论</el-button>
        </span>
        <el-divider content-position="left">快来评论吧</el-divider>
      </div>

      <div>
        <e-module-widget-title>
          <e-comments :module="map.kechengmingcheng" :lists="comments" :biaoti="map.kechengmingcheng" user="xuesheng"
            headimg="touxiang" name="xingming">
          </e-comments>
        </e-module-widget-title>
      </div>
    </div>
    <el-dialog title="课程评价——发表评论" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form ref="form" :model="comment" status-icon validate-on-rule-change label-width="100px">
          <el-form-item label="评分" prop="pingfen">
            <el-rate v-model="comment.pingfen"></el-rate>
          </el-form-item>
          <el-form-item label="评论内容" prop="pinglunneirong" required :rules="[{ required: true, message: '请输入评论内容' }]">
            <el-input type="textarea" v-model="comment.pinglunneirong" placeholder="请输入评论内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitComment">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //引入video样式
  let echarts = require('echarts');
  import "video.js/dist/video-js.css";
  import "vue-video-player/src/custom-theme.css";
  //引入hls.js
  import "videojs-contrib-hls.js/src/videojs.hlsjs";
  import {
    formatImageSrc
  } from "@/utils/utils";
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";
  export default {
    data() {
      return {
        comment: {
          pingfen: null,
          pinglunneirong: "",
          biao: "",
          biaoid: 0,
          biaoti: "",
        },
        isLoading: false,
        dialogVisible: false,
        loading: false, // 加载
        map: {
          kechengbianhao: "",
          kechengmingcheng: "",
          kechengleixing: "",
          tupian: "",
          kechengwendang: "",
          kechengshipin: "",
          kechengjieshao: "",
          faburen: "",
        },
        prev: {},
        next: {},
        comments: [],
      };
    },
    props: {
      id: {
        type: [String, Number],
        required: true,
      },
    },
    watch: {
      id: {
        handler() {
          this.loadDetail();
        },
        immediate: true,
      },
    },
    computed: {},
    methods: {
      getchart() {
        var banjiid = localStorage.getItem("banjiId");
        this.$post("kechengziyuan_echart.do", {
            // banjiid: banjiid,
            kechengid: this.id
          })
          .then((result) => {
            //  this.echartList = result.data.echartList

            console.log(result.data.xueshengrenshu[0].value)
            this.echartList = [{
              name: '未上传',
              value: result.data.xueshengrenshu[0].value - result.data.yishangchuan[0].value
            }, {
              name: '已上传',
              value: result.data.yishangchuan[0].value
            }]
            this.$nextTick(function () {
              //方法里面第一步// 基于准备好的dom，初始化echarts实例
              let myChart = echarts.init(document.getElementById("myChart"));
              // 使用刚指定的配置项和数据显示图表。
              myChart.setOption({
                title: {
                  text: "文件上传人数统计",
                  left: "right",
                },
                tooltip: {
                  trigger: "item",
                },
                legend: {
                  orient: "vertical",
                  left: "left",
                },
                series: [{
                  type: "pie",
                  radius: "50%",
                  data: this.echartList,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                  },
                }, ],
              });
            });
          })
          .catch((result) => {});
      },
      comment1() {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
      },
      submitComment() {
        this.$refs.form.validate().then(() => {
          var comment = this.comment;
          // comment.biao = this.module;
          // comment.biaoti = this.biaoti;
          comment.biao = 'kecheng';
          comment.biaoti = this.map.kechengmingcheng;
          comment.pinglunren = this.$session.username;
          comment.biaoid = this.$route.query.id;
          this.isLoading = true;
          this.$post(api.pinglun.insert, comment)
            .then((res) => {
              this.isLoading = false;
              if (res.code == api.code.OK) {
                comment[this.name] = this.$session[this.name];
                comment[this.headimg] = this.$session[this.headimg];
                comment.addtime = "刚刚";
                this.dialogVisible = false;
                // this.$refs.form.resetFields();
                this.comments.unshift(extend(true, {}, comment));
                this.$message.success("评论成功");
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.isLoading = false;
              this.$message.error(err.message);
            });
        });
      },
      loadDetail() {
        if (this.loading) return;
        this.loading = true;
        this.$get(api.kecheng.webdetail, {
            id: this.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
              this.map = res.data.map;
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
    created() {
      // this.loadDetail();
    },
    mounted() {
      this.getchart()
      // console.log(this.map);
    },
    destroyed() {},
  };
</script>
<style scoped lang="scss">
  .app {
    .app-box {
      background-color: #ecf7e1;
    }

    .show_t {
      margin: 10px;
    }

    .b {
      font-size: 24px;
      font-weight: bolder;
      text-align: center;
    }

    .w {
      font-size: 18px;
      font-weight: 500;

      span {
        margin-right: 10px;
      }
    }

    .add {
      float: right;
      font-size: 18px;
      cursor: pointer;
      font-weight: bolder;
      // color: #ecf7e1;
    }

    .long {
      font-size: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
    }

    .pingjia {
      padding: 40px 0;
    }
  }
</style>