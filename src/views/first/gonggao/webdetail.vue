<template>
  <div class="app">
    <div>
      <el-container>
        <div style="box-shadow:0px 0px 3px 3px #BBBBBB;background-color: rgb(255, 255, 255);">
          <div style="padding:20px">
            <div class="news_show">
              <div class="show_t" v-html="map.biaoti"> </div>
              <div style="text-align:center">
                <span class="fa_time">
                  发布人:{{ map.faburen }} &nbsp;&nbsp;
                </span>
              </div>
              <div v-html="map.neirong"></div>
              <div class="s_x clearfix">
                <template v-if="prev.id">
                  <router-link :to="'gonggaodetail?id=' + prev.id" class="s_prev">
                    上一篇：<span v-html="prev.biaoti"></span>
                  </router-link>
                </template>
                <template v-else>
                  <a href="javascript:;" class="s_prev">上一篇：没有了</a>
                </template>

                <template v-if="next.id">
                  <router-link :to="'/gonggaodetail?id=' + next.id" class="x_next">
                    下一篇：<span v-html="next.biaoti"></span>
                  </router-link>
                </template>
                <template v-else>
                  <a href="javascript:;" class="x_next">下一篇：没有了</a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
  import api from "@/api";
  import {
    extend
  } from "@/utils/extend";
  import Econtainer from ''
  export default {
    data() {
      return {
        loading: false, // 加载
        map: {
          bianhao: "",
          biaoti: "",
          tupian: "",
          neirong: "",
          faburen: "",
        },
        prev: {},
        next: {},
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
      loadDetail() {
        if (this.loading) return;
        this.loading = true;
        this.$get(api.gonggao.webdetail, {
            id: this.id,
          })
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
    created() {},
    mounted() {},
    destroyed() {},
  };
</script>