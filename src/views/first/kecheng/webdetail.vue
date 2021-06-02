<template>
  <div class="app">
    <el-row :gutter="8" class="app-box">
      <div style="margin:20px 0;">
        <span class="show_t b">课程详情</span>
        <el-divider></el-divider>
      </div>
      <el-col :span="12">
        <div class="grid-content bg-purple">
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
      <el-row :gutter="40">
        <el-col :span="8">
          <div id="myChart" style="width: 100%; height: 300px" ref="myChart"></div>
        </el-col>
        <el-col :span="16">
          <el-form :inline="true" size="mini" :label-suffix="':'">
            <el-form-item label="资源名称">
              <el-input v-model="search.ziyuanname"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSubmit" icon="el-icon-plus" v-if="role!='管理员'">上传课件资源</el-button>
            </el-form-item>
          </el-form>
          <el-table border :data="list" style="width: 100%" highlight-current-row stripe>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="资源名称">
                    <span>{{ props.row.ziyuanname }}</span>
                  </el-form-item>
                  <el-form-item label="课件">
                    <span>
                      <e-file-list v-model="props.row.fujian"></e-file-list>
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="课程名称" align="center" prop="kechengmingcheng" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="发布人" align="center" prop="faburen">
            </el-table-column>
            <el-table-column label="添加时间" align="center" prop="addtime" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-button @click="edit(row)" type="text" v-if="row.faburen==username">编辑
                </el-button>
                <el-button type="text" @click="deleteItem(row)" v-if="row.faburen==username">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:30px;">
            <el-table border :data="wendanlist" style="width: 100%" highlight-current-row stripe>
              <el-table-column type="index" align="center"></el-table-column>
              <el-table-column label="课程名称" align="center" prop="kechengmingcheng" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="发布人" align="center" prop="name">
              </el-table-column>
              <el-table-column label="文件数" align="center" prop="value">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

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
    <el-dialog title="添加课件资源" :visible.sync="dialogVisible2" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" :rules="rules" label-width="100px">
          <el-form-item label="课程名称" prop="kechengmingcheng">
            <el-select v-model="form.kechengmingcheng" style="width: 100%" clearable @change="handleChange">
              <el-option v-for="m in kechenglist" :key="m.id" :value="m.kechengmingcheng" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称" prop="ziyuanname">
            <el-input placeholder="请输入资源名称" v-model="form.ziyuanname" />
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="课件资源" prop="fujian" required>
            <e-upload-file v-model="form.fujian"></e-upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑课件资源" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form :model="form1" ref="formModel1" :rules="rules" label-width="100px">
          <el-form-item label="课程名称" prop="kechengmingcheng">
            <el-select v-model="form1.kechengmingcheng" style="width: 100%" clearable @change="handleChange">
              <el-option v-for="m in kechenglist" :key="m.id" :value="m.kechengmingcheng" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称" prop="ziyuanname">
            <el-input placeholder="请输入资源名称" v-model="form1.ziyuanname" />
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form1.faburen" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="课件资源" prop="fujian" required>
            <e-upload-file v-model="form1.fujian"></e-upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
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
  import {
    remove,
    checkIssh
  } from "@/utils/utils";
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";
  export default {
    data() {
      return {
        username: this.$store.state.user.session.username,
        list: [],
        wendanlist: [],
        search: {
          kechengmingcheng: "",
          ziyuanname: ""
        },
        comment: {
          pingfen: null,
          pinglunneirong: "",
          biao: "",
          biaoid: 0,
          biaoti: "",
        },
        role: "",
        isLoading: false,
        dialogVisible1: false,
        dialogVisible2: false,
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
        form: {
          kechengmingcheng: "",
          ziyuanname: "",
          fujian: "",
          faburen: this.$store.state.user.session.username
        },
        form1: {
          kechengmingcheng: "",
          ziyuanname: "",
          fujian: [],
          faburen: this.$store.state.user.session.username
        },
        kechenglist: [],
        rules: {
          ziyuanname: [{
            required: true,
            message: "请输入资源名称",
            trigger: "blur"
          }, ],

        },
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
      handleChange(val) {
        var a = ""
        this.kechenglist.map(function (item) {
          if (item.kechengmingcheng == val) {
            a = item.id
          }
        })
        this.form.kechengid = a
        this.form1.kechengid = a
      },
      edit(row) {
        this.form1 = row;
        this.dialogVisible1 = true;
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
            this.$post(api.kechengziyuan.delete, {
                // 提交后台
                id: row.id,
              })
              .then((res) => {
                this.loading = false;
                if (res.code != api.code.OK) {
                  this.$message.error(res.msg);
                } else {
                  remove(this.list, row);
                  this.getchart()
                  this.initziyuan()
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
      initKengcheng() {
        const params = {}
        params.page = 1
        params.pagesize = 12

        if (localStorage.getItem("role") == "教师") {
          params.jiaoshiid = localStorage.getItem("jiaoshiid");
        } else if (localStorage.getItem("role") == "学生") {
          params.banjiid = localStorage.getItem("banjiId");
        }

        this.$post(api.kecheng.weblist, params)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.mapkechengleixing2 = res.data.mapkechengleixing2;
              this.kechenglist = res.data.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      searchSubmit() {
        this.initziyuan();
      },
      initziyuan() {
        var filter = extend(true, {}, {
          ziyuanname: this.search.ziyuanname,
          kechengid: this.id,
          page: 1,
          pagesize: 12,
        });
        this.$post(api.kechengziyuan.list, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.list = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.kechengziyuan.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加课件资源成功");
                  this.getchart()
                  this.initziyuan()
                  this.dialogVisible2 = false;
                  this.$refs.formModel.resetFields();

                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(e => {
                this.loading = false;
                this.$message.error(e.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      submit1() {
        this.$refs.formModel1
          .validate().then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form1;
            this.$post(api.kechengziyuan.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改课件资源成功");
                  this.$refs.formModel1.resetFields();
                  this.dialogVisible1 = false;
                  this.getchart()
                  this.initziyuan()
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
      addSubmit() {
        this.dialogVisible2 = true;
        this.$nextTick(() => {
          this.$refs.formModel.resetFields();
        });
      },
      getchart() {
        var banjiid = localStorage.getItem("banjiId");
        this.$post("kechengziyuan_echart.do", {
            // banjiid: banjiid,
            kechengid: this.id
          })
          .then((result) => {
            //  this.echartList = result.data.echartList
            this.wendanlist = result.data.wendangshu
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
      this.initziyuan()
      this.initKengcheng()
      this.role = localStorage.getItem('role')
    },
    mounted() {
      this.getchart()
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