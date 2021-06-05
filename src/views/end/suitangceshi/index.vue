<template>
    <div v-loading="loading">
        <div>
            <e-container>
                <div style="margin:15px 0 0 0;box-shadow:0px 0px 3px 3px #BBBBBB">
                    <e-module-widget-title title="随堂列表">
                        <div class="fengjing clearfix">
                            <div style="margin-bottom: 20px">
                                <form action="javascript:;" @submit="searchSubmit" class="form-search">
                                    <table class="jd-search">
                                        <tbody>
                                            <tr>
                                                <td class="label">
                                                    题目 </td>
                                                <td>
                                                    <el-input type="text" style="width: 150px" v-model="search.timu"
                                                        placeholder="请输入关键词">

                                                    </el-input>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <el-button type="success" @click="searchSubmit">搜索</el-button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </div>

                            <el-row :gutter="20">
                                <el-col :md="6" v-for="r in list">
                                    <div class="card">
                                        <router-link :to="'/suitangceshidetail?id='+r.id">
                                            <e-img-box :src="r.tupian" pb="100"></e-img-box>
                                        </router-link>
                                        <div class="card-body">
                                            <div class="feng">
                                                <div class="feng-left">
                                                    <router-link :to="{path:'/suitangceshidetail',query:{id:r.id}}">
                                                        <h5 v-html="$substr(r.timu,15)"></h5>
                                                    </router-link>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </e-module-widget-title>

                </div>

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
    import objectDiff from 'objectdiff';


    /**
     * 后台列表页面
     */
    export default {
        data() {
            return {
                loading: false,
                list: [],
                search: {


                    bianhao: '',

                    timu: '',

                    tupian: '',

                    fujian: '',

                    xiangqing: '',

                    faburen: '',

                },
                page: 1, // 当前页
                pagesize: 12, // 页大小
                totalCount: 0, // 总行数
                total: {},

            }
        },
        watch: {},
        computed: {},
        methods: {
            searchSubmit() {
                this.loadList(1);
            },
            loadList(page) {
                // 防止重新点加载列表
                if (this.loading) return;
                this.loading = true;
                this.page = page;
                // 筛选条件
                var filter = extend(true, {}, this.search, {
                    page: page + "",
                    pagesize: this.pagesize + ""
                });
                var diff = objectDiff.diff(filter, this.$route.query);
                if (diff.changed != 'equal') { // 筛选的条件不一致则更新链接
                    this.$router.replace({ // 更新query
                        path: this.$route.path,
                        query: filter
                    });
                }
                this.$post(api.suitangceshi.weblist, filter).then(res => {
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
            selectRadio(target, name) {
                this.search[target] = name;
                this.searchSubmit(1);
            },
        },
        beforeRouteUpdate(to, form, next) {
            var search = extend(this.search, to.query)
            if (search.page) {
                this.page = Math.floor(to.query.page)
                delete search.page
            }
            if (search.pagesize) {
                this.pagesize = Math.floor(to.query.pagesize)
                delete search.pagesize
            }
            this.loadList(1);
            next();
        },
        created() {
            var search = extend(this.search, this.$route.query)
            if (search.page) {
                this.page = Math.floor(this.$route.query.page)
                delete search.page
            }
            if (search.pagesize) {
                this.pagesize = Math.floor(this.$route.query.pagesize)
                delete search.pagesize
            }
            this.loadList(this.page);
        },
        mounted() {},
        destroyed() {}
    }
</script>