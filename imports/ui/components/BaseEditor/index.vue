<template>
  <Tinymce ref="editor" v-bind="$attrs" :height="400" menubar="" width="1000" :value="value" />
</template>

<script>
import Tinymce from './Tinymce'

export default {
  name: 'CreateArticle',
  props: ['value'],
  components: { Tinymce }
}
</script>

<style></style>
