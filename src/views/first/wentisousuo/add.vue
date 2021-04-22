<template>
    <div class="wentisousuo-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                                <span class="title"> 添加问题搜索</span>
                            </div>
            <div class="form-database-form">
                

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item label="课程名称" prop="kechengmingcheng">
                                            <el-input placeholder="输入课程名称" style="width:450px;" v-model="form.kechengmingcheng" />                                    </el-form-item>

                                <el-form-item label="问题标题" prop="wentibiaoti">
                                            <el-input type="textarea" v-model="form.wentibiaoti"></el-input>                                    </el-form-item>

                                <el-form-item label="问题内容" prop="wentineirong">
                                            <el-input type="textarea" v-model="form.wentineirong"></el-input>                                    </el-form-item>

                                <el-form-item label="答疑内容" prop="dayineirong">
                                            <el-input type="textarea" v-model="form.dayineirong"></el-input>                                    </el-form-item>

                                <el-form-item label="学号" prop="xuehao">
                                            <el-input v-model="form.xuehao" readonly style="width: 250px;"></el-input>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.wentisousuo-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'wentisousuo-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
                    kechengmingcheng:'',
                    wentibiaoti:'',
                    wentineirong:'',
                    dayineirong:'',
xuehao:this.$store.state.user.session.username,
                                    
                },

            
            }
        },
                watch: {
                    },
        props: {
            isRead:{
                type:Boolean,
                default:true
            },
            btnText:{
                type:String,
                default:'提交'
            },
                    },

        computed: {},
        methods: {
            submit(){
                this.$refs.formModel.validate().then(res=>{
                    if(this.loading)return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.wentisousuo.insert , form).then(res=>{
                        this.loading = false;
                        if(res.code == api.code.OK){
                            this.$message.success('添加成功');
                            this.$emit('success' , res.data);
                            this.$refs.formModel.resetFields();
                                                        this.loadInfo();
                                                    }else{
                            this.$message.error(res.msg);
                        }
                    }).catch(err=>{
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err=>{
                    console.log(err.message);
                })

            },
            loadInfo(){

                                var form = this.form;
                // 获取模块得数据
                this.loading = true;
                this.$post(api.wentisousuo.create , {
                    id:this.$route.query.id
                }).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK){
                        extend(this , res.data);
                                            }else{
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
                            },
                    },
        created() {
            this.loadInfo();
                    },
        mounted() {
                    },
        destroyed() {
                    }
    }
</script>
