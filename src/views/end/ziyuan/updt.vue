<template>
    <div class="ziyuan-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                                    <el-page-header @back="$router.go(-1)" content="编辑资源">
                    </el-page-header>
                            </div>
            <div class="form-database-form">
                

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item label="编号" prop="bianhao" :rules="[{required:true, message:'请填写编号'}]">
                                            <el-input placeholder="输入编号" style="width:250px;" v-model="form.bianhao" />                                    </el-form-item>

                                <el-form-item label="标题" prop="biaoti">
                                            <el-input placeholder="输入标题" style="width:250px;" v-model="form.biaoti" />                                    </el-form-item>

                                <el-form-item label="分类" prop="fenlei">
                                            <el-select v-model="form.fenlei" >
<el-option v-for="m in tiezifenleiList" :value="m.fenleimingcheng" :label="m.fenleimingcheng"></el-option>
</el-select>                                    </el-form-item>

                                <el-form-item label="图片" prop="tupian">
                                            <e-upload-image v-model="form.tupian"></e-upload-image>                                    </el-form-item>

                                <el-form-item label="附件" prop="fujian">
                                            <e-upload-file v-model="form.fujian"></e-upload-file>                                    </el-form-item>

                                <el-form-item label="详情" prop="xiangqing">
                                            <e-editor v-model="form.xiangqing"></e-editor>                                    </el-form-item>

                                <el-form-item label="发布人" prop="faburen">
                                            <el-input v-model="form.faburen" readonly style="width: 250px;"></el-input>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.ziyuan-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'ziyuan-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
bianhao:rule.getID(),
                    biaoti:'',
                    fenlei:'',
                    tupian:'',
                    fujian:'',
                    xiangqing:'',
faburen:this.$store.state.user.session.username,
                                    
                },

                        tiezifenleiList:[],
            
            }
        },
                watch: {
                        id: {
                handler() {
                    this.loadInfo();
                }
            }
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
                        id: {
                type: [String, Number],
                required: true
            },
                    },

        computed: {},
        methods: {
            submit(){
                this.$refs.formModel.validate().then(res=>{
                    if(this.loading)return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.ziyuan.update , form).then(res=>{
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

                                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.ziyuan.edit , {
                    id:this.id
                }).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK){
                        extend(this , res.data);
                        this.form = res.data.mmm;

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
