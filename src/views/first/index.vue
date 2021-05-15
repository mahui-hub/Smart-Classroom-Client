<template>
  <div class="loginPage">
    <!-- 导航栏头部 -->
    <div class="loginPage-box w">
      <el-row>
        <span class="time"> {{week}} {{nowDate}} {{nowTime}}</span>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="7">
          <div class="baseInfo">
            <el-card class="box-card" style="height: 300px">
              <div slot="header" class="clearfix">
                <span v-if="role != '管理员'">欢迎您， <b>{{ $session.xingming }}</b></span>
                <span v-if="role == '管理员'">欢迎您， <b>{{ $session.cx }}</b></span>
                <el-button style="float: right; padding: 3px 0" type="text" v-if="role == '教师'"
                  @click.native="$router.push('/end/jiaoshiupdt')">修改资料</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" v-if="role == '管理员'"
                  @click.native="$router.push('/end/mod')">修改密码</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" v-if="role == '学生'"
                  @click.native="$router.push('/end/xueshengupdtself')">修改资料</el-button>

              </div>
              <div v-if="role == '学生'">
                <div class="box">
                  <span class="boxtitle">学号：</span>
                  <span>{{ $session.xuehao }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">性别：</span>
                  <span>{{ $session.xingbie }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">学院：</span>
                  <span>{{ $session.xueyuan }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">专业：</span>
                  <span>{{ $session.zhuanye }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">班级：</span>
                  <span>{{ $session.banji }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">QQ号：</span>
                  <span>{{ $session.qqhao }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">联系电话：</span>
                  <span>{{ $session.lianxidianhua }}</span>
                </div>
              </div>
              <div v-if="role == '管理员'">
                <div class="text">
                  <span class="boxtitle">用户角色：</span>
                  <span>{{ $session.cx }}</span>
                </div>
                <div class="text">
                  <span class="boxtitle">用户账号：</span>
                  <span>{{ $session.username }}</span>
                </div>
                <div class="text">
                  <span class="boxtitle">创建时间：</span>
                  <span>{{ $session.addtime }}</span>
                </div>
              </div>
              <div v-if="role == '教师'">
                <div class="box">
                  <span class="boxtitle">工号：</span>
                  <span>{{ $session.gonghao }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">姓名：</span>
                  <span>{{ $session.xingming }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">性别：</span>
                  <span>{{ $session.xingbie }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">学院：</span>
                  <span>{{ $session.xueyuan }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">职称：</span>
                  <span>{{ $session.zhicheng }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">QQ号：</span>
                  <span>{{ $session.qqhao }}</span>
                </div>
                <div class="box">
                  <span class="boxtitle">联系电话：</span>
                  <span>{{ $session.lianxidianhua }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="17">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-carousel indicator-position="outside" height="300px">
                <el-carousel-item v-for="item in bhtList" :key="item.id">
                  <div style="background-size: cover" @click="$goto(item.url)" :style="{
                      'background-image': 'url(' + item.image + ')',
                      width: '100%',
                      height: '300px',
                    }"></div>
                </el-carousel-item>
              </el-carousel>
            </el-col>
            <el-col :span="12">
              <el-tabs v-model="activeName" style="height: 300px">
                <el-tab-pane label="通知公告" name="first">
                  <div v-for="m in gonggaolist" :key="m.id">
                    <div style="margin: 10px 0">
                      <span @click="gonggaoDetail(m.id)" style="cursor: pointer">
                        {{ m.biaoti }}</span>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 首页内容 -->
    <div class="loginPage-box">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="el-icon-s-grid">课程资源</span>
          <el-form :model="search" :inline="true" style="float: right">
            <el-form-item prop="kechengmingcheng">
              <el-input clearable type="text" size="mini" style="width: 150px" v-model="search.kechengmingcheng"
                @keyup.enter.native="searchSubmit" placeholder="请输入课程名称">
              </el-input>
            </el-form-item>
            <el-form-item prop="kechengleixing">
              <el-radio-group v-model="search.kechengleixing">
                <el-radio label="" @click.native="selectRadio('kechengleixing', '')">全部</el-radio>
                <el-radio v-for="m in mapkechengleixing2" :key="m.kechengleixing" :label="m.kechengleixing"
                  @click.native="
                    selectRadio('kechengleixing', m.kechengleixing)
                  ">{{ m.kechengleixing }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="card-content">
          <el-card class="box-card" v-for="o in kechenglist" :key="o.id">
            <div slot="header" class="clearfix1">
              <!-- <span>课程名称：</span> -->
              <span class="card-text">{{ o.kechengmingcheng }}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="view(o.id)">查看</el-button>
            </div>
            <div class="card-picture">
              <img :src="o.tupian" style="width: 250px; height: 250px" />
            </div>
          </el-card>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";
  export default {
    data() {
      return {
        week: '',
        nowDate: '',
        nowTime: "",
        // updateTime: "1",
        token: "",
        activeName: "first",
        role: "",
        loading: false,
        bhtList: [],
        kechenglist: [],
        gonggaolist2: [],
        tiezilist3: [],
        suitangceshilist4: [],
        gonggaolist: [],
        search: {
          kechengbianhao: "",
          kechengmingcheng: "",
          kechengleixing: "",
          tupian: "",
          banjimingcheng: "",
          kechengjieshao: "",
          faburen: "",
          banjiid: "",
          jiaoshiid: "",
        },
        mapkechengleixing2: [],
      };
    },
    created() {
      this.loadPageData();
      this.loadList();
      this.role = localStorage.getItem("role");
      this.token = localStorage.getItem("token");
      this.panduan();
      this.nowTimes();
    },
    methods: {
      nowTimes() {
        this.timeFormate(new Date());
        setInterval(this.nowTimes, 30 * 1000);
      },
      timeFormate(timeStamp) {
        let year = new Date(timeStamp).getFullYear();
        let month = new Date(timeStamp).getMonth() + 1 < 10 ? 0 + (new Date(timeStamp).getMonth() + 1) : new Date(
          timeStamp).getMonth() + 1;
        let date = new Date(timeStamp).getDate() < 10 ? 0 + new Date(timeStamp).getDate() : new Date(timeStamp)
          .getDate();
        let hh = new Date(timeStamp).getHours() < 10 ? 0 + new Date(timeStamp).getHours() : new Date(timeStamp)
          .getHours();
        let mm = new Date(timeStamp).getMinutes() < 10 ? 0 + new Date(timeStamp).getMinutes() : new Date(timeStamp)
          .getMinutes();
        let ss = new Date(timeStamp).getSeconds() < 10 ? 0 + new Date(timeStamp).getSeconds() : new Date(timeStamp)
          .getSeconds();
        // return year + “年” + month + “月” + date +“日”+" “+hh+”:"+mm ;
        // this.nowDate = year + “-” + month + “-” + date +" “+” “+hh+”:"+mm ;
        this.nowDate = year + "-" + month + "-" + date;
        this.nowTime = hh + ":" + mm + ":" + ss;
        // console.log(this.nowTime);
        var dateString = this.nowDate;
        var dateObject = new Date(dateString);
        this.week = dateObject.getDay()
        if (this.week == 1) {
          this.week = "星期一"
        }
        if (this.week == 2) {
          this.week = "星期二"
        }
        if (this.week == 3) {
          this.week = "星期三"
        }
        if (this.week == 4) {
          this.week = "星期四"
        }
        if (this.week == 5) {
          this.week = "星期五"
        }
        if (this.week == 6) {
          this.week = "星期六"
        }
        if (this.week == 0) {
          this.week = "星期日"
        }
      },

      panduan() {
        if (localStorage.getItem("role") == "管理员") {
          this.initKengcheng();
        } else if (localStorage.getItem("role") == "学生") {
          this.search.banjiid = localStorage.getItem("banjiId");
          this.initKengcheng();
        } else if (localStorage.getItem("role") == "教师") {
          this.search.jiaoshiid = localStorage.getItem("jiaoshiid");
          this.initKengcheng();
        }
      },
      gonggaoDetail(id) {
        this.$router.push("/gonggaodetail?id=" + id);
      },
      searchSubmit() {
        this.initKengcheng();
      },
      selectRadio(target, name) {
        this.search[target] = name;
        this.searchSubmit(1);
      },
      view(id) {
        this.$router.push("/kechengdetail?id=" + id);
      },
      initKengcheng() {
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: 1,
          pagesize: 12,
        });

        this.$post(api.kecheng.weblist, filter)
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
      loadList() {
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: 1,
          pagesize: 5
        });
        this.$post(api.gonggao.weblist, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.gonggaolist = res.data.list;
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
      loadPageData() {
        if (this.loading) return;
        this.loading = true;
        this.$get("/index")
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
  };
</script>

<style lang="scss" scoped>
  .loginPage {
    .w {
      background-color: #ecf7e1;
    }

    .time {
      color: #5a9c15;
      font-size: 20px;
      font-weight: bold;
      float: right;
    }

    .loginPage-box {
      padding: 20px 60px;
    }

    .clearfix {
      span {
        font-size: 18px;
        font-weight: bolder;
        margin: 10px 0;
        color: #17928d;
      }
    }

    .clearfix1 {
      span {
        font-size: 14px;
        font-weight: bolder;
        margin: 10px 0;
        color: #17928d;
      }
    }

    .text {
      margin: 10px 0;
    }

    .box {
      padding-bottom: 8px;

      .boxtitle {
        font-weight: bolder;
      }
    }

    .el-card {
      background-color: transparent;
    }

    .el-card__body {
      padding: 0 20px;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }

    .card-content {
      display: flex;

      .box-card {
        margin-right: 15px;
      }

      .card-text {
        color: #797979;
      }
    }
  }
</style>