<template>
  <div class="xuesheng-detail" v-loading="loading">
    <div>
      <e-container>
        <el-row :gutter="15">
          <el-col :md="24" :sm="24">
            <div style="margin:15 px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
              <div class="row4 hjlgf">
                <div class="row clearfix">
                  <div class="row1">
                    <e-image-toggle :images="map.touxiang"></e-image-toggle>
                  </div>
                  <div class="row2">
                    <section class="product-details add-cart">
                      <header class="entry-header">
                        <h1
                          class="entry-title uppercase"
                          v-text="map.xingming"
                        ></h1>
                      </header>
                      <article class="entry-content">
                        <figure>
                          <ul class="entry-meta unstyled">
                            <li>
                              <span class="key">学号:</span>
                              <span class="value">{{ map.xuehao }}</span>
                            </li>
                          </ul>
                          <ul class="entry-meta unstyled">
                            <li>
                              <span class="key">性别:</span>
                              <span class="value">{{ map.xingbie }}</span>
                            </li>
                          </ul>
                          <ul class="entry-meta unstyled">
                            <li>
                              <span class="key">联系电话:</span>
                              <span class="value">{{ map.lianxidianhua }}</span>
                            </li>
                          </ul>
                          <!--     <ul class="entry-meta unstyled">
                                                        <li>
                                                            <span class="key">头像:</span>
                                                            <span class="value"><e-img :src="map.touxiang"
                                                                                       style="max-width:120px"/></span>
                                                        </li>
                                                    </ul>-->

                          <div class="rate-bar inline-middle">
                            <div
                              class="rateit"
                              data-rateit-backingfld="#backing0"
                              data-rateit-starwidth="12"
                              data-rateit-starheight="12"
                              data-rateit-resetable="false"
                              data-rateit-ispreset="true"
                              data-rateit-min="0"
                              data-rateit-max="5"
                            ></div>
                          </div>
                        </figure>
                      </article>
                    </section>
                  </div>
                </div>
                <div v-html="map.xiangqing"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </e-container>
    </div>
    <div>
      <e-container>
        <el-row :gutter="15">
          <el-col :md="24" :sm="24">
            <div style="margin:15px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
              <e-module-widget-title title="评价列表">
                <e-comments
                  module="xuesheng"
                  :lists="comments"
                  :biaoti="map.xingming"
                  user="xuesheng"
                  headimg="touxiang"
                  name="xingming"
                >
                </e-comments>
              </e-module-widget-title>
            </div>
          </el-col>
        </el-row>
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
        xuehao: "",
        mima: "",
        xingming: "",
        xingbie: "",
        banji: "",
        lianxidianhua: "",
        touxiang: "",
        jiguan: "",
        xiangqing: "",
      },
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
      this.$get(api.xuesheng.webdetail, {
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
