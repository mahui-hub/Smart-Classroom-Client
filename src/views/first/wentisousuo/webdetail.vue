<template>
    <div class="wentisousuo-detail" v-loading="loading">
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
                    kechengmingcheng: '',
                    wentibiaoti: '',
                    wentineirong: '',
                    dayineirong: '',
                    xuehao: '',
                },
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
                this.$get(api.wentisousuo.webdetail, {
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