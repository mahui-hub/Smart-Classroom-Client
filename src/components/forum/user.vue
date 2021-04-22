<template>
  <div class="floot_leftdiv">
    <div class="readName b">
      <a href="javascript:;">
        {{ nickname }}
      </a>
    </div>
    <a href="javascript:;" id="card_sf_2920754_4754" class="userCard face_img">
      <e-img
        class="pic"
        v-if="headimg"
        :src="headimg"
        width="120"
        height="120"
        border="0"
      />
      <img
        class="pic"
        v-else
        src="./images/default.gif"
        width="120"
        height="120"
        border="0"
      />
    </a>
    <div class="readLevel mb5" v-if="level">
      <span
        >级别: <a href="javascript:;">{{ level }}</a></span
      >
    </div>
    <div class="readUser_info cc mb10">
      <slot></slot>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
<style type="text/scss" lang="scss">
.floot_leftdiv {
  text-align: center;
}
</style>
<script>
export default {
  name: "e-user",
  data() {
    return {};
  },
  props: {
    nickname: String,
    headimg: String,
    level: String,
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
  destroyed() {},
};
</script>
