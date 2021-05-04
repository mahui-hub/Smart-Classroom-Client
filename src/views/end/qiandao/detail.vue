<template>

    <div class="qiandao-detail" v-loading="loading" ref="print">
        <el-page-header @back="goBack" content="详情页面"></el-page-header>
        <div class="admin-detail">

            <div class="detail detail-selectupdate">
                <div class="detail-title">
                    课程信息：
                </div>
                <div class="detail-content">
                    <p>课程编号：{{ map.kechengbianhao }}</p>
                    <p>课程名称：{{ map.kechengmingcheng }}</p>
                    <p>课程类型：{{  map.kechengleixing  }}</p>
                </div>
            </div>
            <div class="detail detail-datetime">
                <div class="detail-title">
                    开始时间：
                </div>
                <div class="detail-content">
                    {{ map.kaishishijian }}
                </div>
            </div>
            <div class="detail detail-datetime">
                <div class="detail-title">
                    结束时间：
                </div>
                <div class="detail-content">
                    {{ map.jieshushijian }}
                </div>
            </div>
            <div class="detail detail-datetime">
                <div class="detail-title">
                    签到时间：
                </div>
                <div class="detail-content">
                    {{ map.qiandaoshijian }}
                </div>
            </div>
            <div class="detail detail-textuser">
                <div class="detail-title">
                    发布人：
                </div>
                <div class="detail-content">
                    {{ map.faburen }}
                </div>
            </div>
            <div class="detail detail-textuser">
                <div class="detail-title">
                    签到人：
                </div>
                <div class="detail-content">
                    {{ map.qiandaoren }}
                </div>
            </div>

        </div>
        <div class="mt10">
            <el-button type="default" class="hidePrint" @click="$router.go(-1)">
                返回
            </el-button>
            <el-button type="success" class="hidePrint" @click="$print">
                打印本页
            </el-button>
        </div>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
    .qiandao-detail{
    .admin-detail {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        .detail {
            width: 50%;
            padding: 5px;
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #DEDEDE;
            .detail-title {
                width: 120px;
                text-align: right;
              flex-shrink: 0;
            }
            .detail-content {
                flex-grow: 1;
            }
        }
        .detail.detail-images {
            width: 100%;
            flex-wrap: wrap;
            .detail-title {
                display: none;
            }

            .detail-content {
                width: 100%;
                padding: 10px;
            }
        }
        .detail.detail-editor,.detail.detail-dataset  {
            width: 100%;
            flex-wrap: wrap;
            .detail-title {
                width: 100%;
                padding: 10px;
                margin-top: 10px;
                background: #9a0606;
                color: #ffffff;
                text-align: left;
            }
            .detail-content{
                padding: 10px;
            }
        }
    }
}
</style>
<script>
    import api from '@/api';
    import {
        extend
    } from '@/utils/extend';


    export default {
        data() {
            return {
                loading: false,
                map: {},

            }
        },
        props: {
            id: {
                type: [String, Number],
                required: true
            },
        },
        watch: {
            id: {
                handler() {
                    this.loadDetail();
                },
                immediate: true
            }
        },
        computed: {},
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            loadDetail() {
                if (this.loading) return;
                this.loading = true;
                this.$get(api.qiandao.detail, {
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