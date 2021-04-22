<template>
    <div v-loading="loading">
            </div>
</template>
<style type="text/scss" scoped lang="scss">
    </style>
<script>
    import api from '@/api';
    import { extend } from '@/utils/extend';
    import objectDiff from 'objectdiff';

    
    /**
     * 后台列表页面
     */
    export default {
        data() {
            return {
                loading:false,
                list:[],
                search:{

                    
                                                                laoshixingming:'',
                    
                                                                kemu:'',
                    
                                    },
                page:1, // 当前页
                pagesize:12, // 页大小
                totalCount:0, // 总行数
                total:{},

                        }
        },
        watch: {
                    },
        computed: {
                    },
                methods: {
            searchSubmit(){
                this.loadList(1);
            },
            loadList( page ){
                // 防止重新点加载列表
                if(this.loading)return;
                this.loading = true;
                this.page = page;
                // 筛选条件
                var filter = extend(true , {} , this.search , {page:page+"", pagesize: this.pagesize+""});
                var diff = objectDiff.diff(filter, this.$route.query);
                if (diff.changed != 'equal') { // 筛选的条件不一致则更新链接
                    this.$router.replace({  // 更新query
                        path: this.$route.path,
                        query: filter
                    });
                }
                this.$post(api.qiuzhujiaoshi.weblist , filter).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK)
                    {
                        extend(this , res.data);
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch(err=>{
                    this.loading = false;
                    this.$message.error(err.message);
                });
            },
                    },
        beforeRouteUpdate(to,form,next){
            var search = extend(this.search , to.query)
            if(search.page)
            {
                this.page = Math.floor(to.query.page)
                delete search.page
            }
            if(search.pagesize)
            {
                this.pagesize = Math.floor(to.query.pagesize)
                delete search.pagesize
            }
            this.loadList(1);
            next();
        },
        created() {
            var search = extend(this.search , this.$route.query)
            if(search.page)
            {
                this.page = Math.floor(this.$route.query.page)
                delete search.page
            }
            if(search.pagesize)
            {
                this.pagesize = Math.floor(this.$route.query.pagesize)
                delete search.pagesize
            }
            this.loadList(this.page);
                    },
        mounted() {
                    },
        destroyed() {
                    }
    }
</script>
