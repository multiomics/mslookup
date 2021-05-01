<template>
    <iframe ref="lorikeetIframe" class="spectrum-iframe" :src="iframeURL"></iframe>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
        iframeURL: this.$store.state.baseURL + '/IPSA-master/VisualizeUploadedData.html?usi=NIST%3Acptac2_human_hcd_itraq_selected_part2_2015.msp%3Aindex%3A600798',
    }
  },
  methods:{
   
  },
  watch:{
    // page: function(val, oldVal){
    //   this.query.page = val - 1
    //   this.search()
    // },
  },
  mounted(){
     // this.search();
    // this.getFacets();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .spectrum-iframe{
        width: 100%;
        height: 100%;
        border-width:0;
    }
</style>

<style>
   
</style>
