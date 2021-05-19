<template>
  <div class="app">
    <div class="courseType">
      <span class="title">课程类型：</span>
      <span v-for="m in mapkechengleixing2" :key="m.id" v-html="m.kechengleixing"
        @click="selectRadio('kechengleixing', m.kechengleixing)"></span>
    </div>
    <div class="course">
      <el-card class="box-card" v-for="o in kechenglist" :key="o.id">
        <div class="card-picture">
          <img :src="o.tupian" style="width:250px;height:150px;" />
          <div class="box">
            <span class="card-text">课程：</span>
            <span>{{ o.kechengmingcheng }}</span>
          </div>
          <div class="box">
            <span class="card-text">讲师：</span>
            <span>
              <e-select-view module="jiaoshi" :value="o.jiaoshiid" select="id" show="xingming"></e-select-view>
            </span>
            <el-button style="float: right; padding: 4px" type="text" @click="view(o.id)">开始学习</el-button>
          </div>
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
        search: {
          kechengbianhao: "",
          kechengmingcheng: "",
          kechengleixing: "",
          tupian: "",
          banjiid: "",
          banjimingcheng: "",
          kechengjieshao: "",
          faburen: "",
          jiaoshiid: "",
        },
        kechenglist: [],
        mapkechengleixing2: [],
      };
    },
    created() {
      this.search.banjiid = localStorage.getItem("banjiId");
      this.initKengcheng();
    },
    methods: {
      view(id) {
        this.$router.push("/kechengdetail?id=" + id);
      },
      initKengcheng() {
        if (localStorage.getItem("role") == "教师") {
          this.search.jiaoshiid = localStorage.getItem("jiaoshiid");
        }
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
      selectRadio(target, name) {
        console.log(name);
        this.search[target] = name;
        this.searchSubmit(1);
      },
      searchSubmit() {
        this.initKengcheng();
      },
    },
  };
</script>

<style scoped lang="scss">
  .app {
    padding: 40px 80px;
    background-color: #ecf7e1;

    .courseType {
      span {
        margin-right: 10px;
        font-size: 18px;
        cursor: pointer;
      }

      .title {
        font-weight: bolder;
        color: #17928d;
      }
    }

    .course {
      padding: 20px 0;
      margin-top: 20px;
      display: flex;

      .el-card {
        margin-right: 10px;

        .card-text {
          font-weight: bolder;
        }

        .box {
          margin-top: 10px;

          .el-button {
            padding: 5px;
            border: 1px solid #5a9c15;
            border-radius: 2px;
          }
        }
      }
    }
  }
</style>