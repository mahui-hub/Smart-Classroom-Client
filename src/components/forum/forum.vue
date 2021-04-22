<template>
  <div class="detail-bbs">
    <div class="read_t">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EUser from "./user";
export default {
  name: "e-forum",
  components: { EUser },
  data() {
    return {};
  },
  props: {
    map: Object,
    replyList: Array,
    user: Object,
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>

<style type="text/scss" lang="scss">
.cc:after {
  content: "\20";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.detail-bbs {
  .read_t {
    border-bottom: 1px solid #dedede;
  }
  .floot_left {
    width: 160px;
    background: #f5f5f5;
    border-right: 1px solid #eaeaea;
    vertical-align: top;
  }
  .readName {
    font: bold 12px/18px Arial;
    padding: 10px 0 15px 0px;
    margin-bottom: -5px;
  }
  .readLevel {
    line-height: 25px;
  }
  .floot_leftdiv {
    overflow: hidden;
  }
  .face_img img {
    padding: 3px;
    border: 1px solid #eaeaea;
    background: #ffffff;
  }
  .readLevel img {
    display: block;
  }
  .readUser_info .one {
    padding: 0 0 5px;
  }
  .cc {
    *zoom: 1;
  }
  .readUser_info dt {
    width: 60px;
    float: left;
    margin-right: 5px;
  }
  .readUser_info dd {
    float: left;
    width: 70px;
    color: #666;
  }

  .readUser_info ul.two {
    line-height: 18px;
  }
  .readUser_info ul.two li {
    float: left;
    width: 49.5%;
    padding: 2px 0;
    height: 18px;
  }
  .readUser_info ul.two li a {
    display: block;
    text-indent: 20px;
  }
  .add_fol {
    background: url(./images/add_fol.png) no-repeat;
  }
  .floot_right {
    background: #ffffff;
    padding: 10px 20px 0;
    vertical-align: top;
  }
  .s6 {
    color: #666;
  }

  .tipTop {
    padding: 0 0 10px;
    border-bottom: 1px dotted #ccc;
    margin-bottom: 10px;
  }
  .fr {
    float: right;
  }
  .s6 {
    color: #666;
  }

  .mr5 {
    margin-right: 5px;
  }
  .s2 {
    color: #f50;
  }
  .cp {
    cursor: pointer;
  }
  .b,
  b {
    font-weight: 700;
  }
  .tpc_content {
    font-family: Arial;
    padding: 0 2px 20px;
    margin: 0;
    line-height: 1.8em;
  }
  .f14 {
    font-size: 14px;
  }
  .mb10 {
    margin-bottom: 10px;
  }

  .floot_bottom {
    vertical-align: bottom;
    padding: 0 20px;
  }
  .tipBottom {
    padding: 10px 0;
    /*border-top: 1px dotted #ccc;*/
    /*margin-top: 10px;*/
  }

  .readbot a {
    list-style: none;
    padding: 0 0 0 1.5em;
    margin: 0;
    float: left;
    cursor: pointer;
    background: url(./images/yin.gif) no-repeat;
    width: 3.5em;
    height: 16px;
  }
  .readbot .r-reply {
    background-position: 0 -100px;
  }
  .readbot .r-score {
    background-position: 0 -120px;
  }
  .readbot .r-recommend {
    background-position: 0 -180px;
  }
  .readbot .r-quote {
    background-position: 0 -80px;
  }
  .flootbg {
    background: #eaeaea;
    height: 4px;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
}
</style>
