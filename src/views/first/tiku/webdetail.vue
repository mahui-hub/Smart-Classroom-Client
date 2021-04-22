<template>
  <div class="tiku-detail" v-loading="loading">
    <div>
      <e-container>
        <div
          style="margin:15px 0 0 0;background-color:#FFFFFF;box-shadow:0px 0px 2px 2px #DDDDDD"
        >
          <e-module-widget-title title="题库详情">
            <div>
              <div class="common-title" style="margin-top: 4em;">
                <p>
                  <i></i>
                  <i></i>
                </p>
              </div>
              <div class="news_show">
                <span class="show_t" v-html="map.tikumingcheng"> </span>
                <span class="fa_time">
                  题库编号:{{ map.tikubianhao }} &nbsp;&nbsp; 教师:{{
                    map.jiaoshi
                  }}
                  &nbsp;&nbsp; 发布人:{{ map.faburen }} &nbsp;&nbsp;
                </span>
                <div v-html="map.tikumingcheng"></div>

                <e-paper-form
                  @submit="postPaper"
                  :list="webda"
                  danxuanti="单选题"
                  duoxuanti="多选题"
                  timu="shititimu"
                  type="leixing"
                ></e-paper-form>

                <!--   <div class="s_x clearfix">

                                    <template v-if="prev.id">
                                        <router-link :to="'tikudetail?id='+prev.id" class="s_prev">
                                            上一篇：<span v-html="prev.tikumingcheng"></span>
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <a href="javascript:;" class="s_prev">上一篇：没有了</a>
                                    </template>

                                    <template v-if="next.id">
                                        <router-link :to="'/tikudetail?id='+next.id" class="x_next">
                                            下一篇：<span v-html="next.tikumingcheng"></span>
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <a href="javascript:;" class="x_next">下一篇：没有了</a>
                                    </template>
                                </div>-->
                <br />
                <br />
                <br />
              </div>
            </div>
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
        tikubianhao: "",
        tikumingcheng: "",
        jiaoshi: "",
        faburen: "",
      },
      prev: {},
      next: {},
      webda: [],
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
    postPaper(paperList, time) {
      if (this.loading) return;
      this.loading = true;
      this.$post("/savePoper", {
        id: this.id,
        JSON: JSON.stringify(paperList),
        time: time,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == api.code.OK) {
            this.$message.success("评价课程完成");
            // this.$goto("/index");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err.message);
        });
      console.log(paperList);
    }, //001
    loadDetail() {
      if (this.loading) return;
      this.loading = true;
      this.$get(api.tiku.webdetail, {
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
