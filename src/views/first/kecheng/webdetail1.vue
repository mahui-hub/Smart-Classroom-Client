<template>
  <div class="kecheng-detail" v-loading="loading">
    <div>
      <e-container>
        <div style="margin:15px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
          <div>
            <div class="common-title" style="margin-top: 4em;">
              <p>
                <i></i>
                <i></i>
              </p>
            </div>
            <div class="news_show">
              <span class="show_t" v-html="map.kechengmingcheng"> </span>
              <span class="fa_time">
                课程类型1212:{{ map.kechengleixing }} &nbsp;&nbsp; 班级名称:{{
                  map.banjimingcheng
                }}
                &nbsp;&nbsp; 发布人:{{ map.faburen }} &nbsp;&nbsp;
              </span>
              <div v-html="map.kechengjieshao"></div>
              <div class="s_x clearfix">
                <template v-if="prev.id">
                  <router-link
                    :to="'kechengdetail?id=' + prev.id"
                    class="s_prev"
                  >
                    上一篇：<span v-html="prev.kechengmingcheng"></span>
                  </router-link>
                </template>
                <template v-else>
                  <a href="javascript:;" class="s_prev">上一篇：没有了</a>
                </template>

                <template v-if="next.id">
                  <router-link
                    :to="'/kechengdetail?id=' + next.id"
                    class="x_next"
                  >
                    下一篇：<span v-html="next.kechengmingcheng"></span>
                  </router-link>
                </template>
                <template v-else>
                  <a href="javascript:;" class="x_next">下一篇：没有了</a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </e-container>
    </div>
    <div>
      <e-container>
        <div style="margin:15px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
          <e-module-widget-title title="评论列表">
            <e-comments
              module="kecheng"
              :lists="comments"
              :biaoti="map.kechengmingcheng"
              user="xuesheng"
              headimg="touxiang"
              name="xingming"
            >
            </e-comments>
          </e-module-widget-title>
        </div>
      </e-container>
    </div>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
import api from "@/api";
import { extend } from "@/utils/extend";
export default {
  data() {
    return {
      loading: false, // 加载
      map: {
        kechengbianhao: "",
        kechengmingcheng: "",
        kechengleixing: "",
        tupian: "",
        banjimingcheng: "",
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
