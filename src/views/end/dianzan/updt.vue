<template>
    <div class="dianzan-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                                    <el-page-header @back="$router.go(-1)" content="编辑点赞">
                    </el-page-header>
                            </div>
            <div class="form-database-form">
                

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item v-if="isRead" label="帖子编号" prop="tiezibianhao">
                                            {{  form.tiezibianhao  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="标题" prop="biaoti">
                                            {{  form.biaoti  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="分类" prop="fenlei">
                                             <e-select-view module="tiezifenlei" :value="form.fenlei" select="id" show="fenleimingcheng"></e-select-view>                                    </el-form-item>

                                <el-form-item v-if="isRead" label="发布人" prop="faburen">
                                            {{  form.faburen  }}                                    </el-form-item>

                                <el-form-item label="备注" prop="beizhu">
                                            <el-input type="textarea" v-model="form.beizhu"></el-input>                                    </el-form-item>

                                <el-form-item label="点赞人" prop="dianzanren">
                                            <el-input v-model="form.dianzanren" readonly style="width: 250px;"></el-input>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.dianzan-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'dianzan-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
                    tiezibianhao:'',
                    biaoti:'',
                    fenlei:'',
faburen:this.$store.state.user.session.username,                    beizhu:'',
dianzanren:this.$store.state.user.session.username,
            tieziid:0,
                        
                },

            
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

                    this.$post(api.dianzan.update , form).then(res=>{
                        this.loading = false;
                        if(res.code == api.code.OK){
                            this.$message.success('添加成功');
                            this.$emit('success' , res.data);
                            this.$refs.formModel.resetFields();
                                                        this.$router.go(-1);
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
                this.$post(api.dianzan.edit , {
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
