<template>
    <div class="suitangceshi-detail" v-loading="loading">
        <div>
            <e-container>
                <el-row :gutter="15">
                    <el-col :md="24" :sm="24">
                        <div style="margin:15px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
                            <div>
                                <div class="common-title" style="margin-top: 4em;">
                                    <p>
                                        <i></i>
                                        <i></i>
                                    </p>
                                </div>
                                <div class="news_show">
                                    <span class="show_t" v-html="map.timu">
                                    </span>
                                    <span class="fa_time">
                                        编号:{{ map.bianhao }} &nbsp;&nbsp;
                                        附件:<e-file-list v-model="map.fujian"></e-file-list> &nbsp;&nbsp;
                                        发布人:{{ map.faburen }} &nbsp;&nbsp;
                                        <el-button type="success" @click="$router.push('/datiadd?id='+map.id)">答题
                                        </el-button>
                                    </span>

                                    <div v-html="map.xiangqing"></div>
                                    <div class="s_x clearfix">

                                        <template v-if="prev.id">
                                            <router-link :to="'suitangceshidetail?id='+prev.id" class="s_prev">
                                                上一篇：<span v-html="prev.timu"></span>
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <a href="javascript:;" class="s_prev">上一篇：没有了</a>
                                        </template>

                                        <template v-if="next.id">
                                            <router-link :to="'/suitangceshidetail?id='+next.id" class="x_next">
                                                下一篇：<span v-html="next.timu"></span>
                                            </router-link>
                                        </template>
                                        <template v-else>
                                            <a href="javascript:;" class="x_next">下一篇：没有了</a>
                                        </template>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </el-col>

                </el-row>
            </e-container>
        </div>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
</style>
<script>
    import api from '@/api';
    import {
        extend
    } from '@/utils/extend';

    export default {
        data() {
            return {
                loading: false, // 加载
                map: {
                    bianhao: '',
                    timu: '',
                    tupian: '',
                    fujian: '',
                    xiangqing: '',
                    faburen: '',
                },
                prev: {},
                next: {},
            }
        },
        props: {
            id: {
                type: [String, Number],
                required: true
            }
        },
        watch: {
            id: {
                handler() {
                    this.loadDetail();
                },
                immediate: true
            },
        },
        computed: {},
        methods: {
            loadDetail() {
                if (this.loading) return;
                this.loading = true;
                this.$get(api.suitangceshi.webdetail, {
                    id: this.id
                }).then(res => {
                    this.loading = false;
                    if (res.code == api.code.OK) {
                        extend(this, res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error(err.message);
                });
            },

        },
        created() {},
        mounted() {},
        destroyed() {}
    }
</script>