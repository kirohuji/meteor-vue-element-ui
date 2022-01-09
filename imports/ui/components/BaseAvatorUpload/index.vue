<template>
  <div>
    <pan-thumb
      :image="value || ''"
      :height="'100px'"
      :width="'100px'"
      :hoverable="false"
      @click.native="imagecropperShow = true"
    />
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import PanThumb from "../PanThumb";
import ImageCropper from "../ImageCropper";
export default {
  props: ['value'],
  components: {
    PanThumb,
    ImageCropper,
  },
  data () {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: "https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191",
    };
  },
  methods: {
    cropSuccess (resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
      this.$emit('input', this.image)
    },
    close () {
      this.imagecropperShow = false;
    },
  },
};
</script>

<style></style>
