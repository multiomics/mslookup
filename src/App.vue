<template>
  <div id="app">
    <defaultNav/>
    <router-view/>
  </div>
</template>

<script>
import defaultNav from '@/components/Nav'
export default {
  name: 'app',
  components:{
    defaultNav,
  },
  methods:{
    
  },
  mounted(){
      
  }
}
</script>

<style>
html,body {
    min-width: 840px !important;
    height: 100vh;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
/*a{
  color: #fff !important;
}
::-webkit-scrollbar{
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #171a21;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(255,255,255,0.2); 
    box-shadow: inset 0 0 6px rgba(0,0,0,0.2); 
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
}
::placeholder{
  font-size: 12px
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}*/
</style>
