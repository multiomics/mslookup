<template>
  <div class="index-container">
      <!--<div class="banner">-->
          <!--<div class="content-wrapper">-->
              <!--<h1 class="title">BioContainers</h1>-->
              <!--<p class="description">Bioinformatics more accessible and reproducible</p>-->
          <!--</div>-->
      <!--</div>-->
      <div class="content">
          <div>Search peptide evidences</div>
          <div class="search-wrapper">
            <!-- <Input v-model="keywords" icon="ios-search" placeholder="Search" style="width:100%" @on-enter="addKeyword"/> -->
            <Input v-model="keywords" search placeholder="Search" enter-button="Search" style="width:100%" @on-search="search"/>
          </div>
          <!-- <Divider /> -->
          <!-- <div class="search-options-wrapper">
              <div class="filter-wrapper">
                  <div class="sort">
                        <span class="name">Sorts by:</span>
                        <div class="sortOption">
                            <Select v-model="sortType" style="width:90px" @on-change="sortTypeClick">
                                <Option v-for="item in sortTypeArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                  </div>
                  <div class="sort">
                        <span class="name">Sorts Order:</span>
                        <div class="sortOption">
                            <Select v-model="sortOrder" style="width:90px" @on-change="sortOrderClick">
                                <Option v-for="item in sortOrderArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                  </div>
                  <div class="sort">
                        <span class="name">Refine Results:</span>
                        <div class="sortOption">
                            <Select v-model="facetName" style="width:90px" @on-change="facetNameChange">
                                <Option v-for="item in facetNameArray" :value="item" :key="item">{{item}}</Option>
                            </Select>
                            <Icon type="ios-arrow-forward" style="font-size: 12px"/>
                            <Select class="facet-value-select" v-model="facetValue" style="width:150px;position: relative;" @on-change="facetValueChange" filterable>
                                <Option v-for="item in facetValueArray" :value="item.value" :key="item.value">{{ item.value }} ({{item.count}})</Option>
                            </Select>
                        </div>
                  </div>
              </div>
              <div class="search-button-wrapper">
                  <Button type="primary" @click="search">Search</Button>
              </div>
          </div> -->
          <div class="tag-wrapper" style="margin-top: 10px;" >
            <Tag v-for="item in tagsArray" type="border" :color="item.value?'warning':'primary'" :key="item.name+item.value" :name="item.name+item.value" closable @on-close="removeFacetTag">{{item.name}}<span v-if="item.value">-></span>{{item.value}}</Tag>
          </div>
          <div class="container-wrapper">
                  <Row :gutter="16">
<!--                      <Col span="6">-->
<!--                          <Card>-->
<!--                            <p slot="title"><a class="tool-name">Response (ongoing...)</a></p>-->
<!--                            <p>-->
<!--                                <CheckboxGroup v-model="social" style="display: flex; flex-direction: column;">-->
<!--                                    <Checkbox label="found">-->
<!--                                        <span>Found</span>-->
<!--                                    </Checkbox>-->
<!--                                    <Checkbox label="notfound">-->
<!--                                        <span>Not Found</span>-->
<!--                                    </Checkbox>-->
<!--                                    <Checkbox label="notapplicable">-->
<!--                                        <span>Not Applicable</span>-->
<!--                                    </Checkbox>-->
<!--                                </CheckboxGroup>-->
<!--                            </p>-->
<!--                            -->
<!--                          </Card>-->
<!--                      </Col>-->
                      <Col>
                          <template v-if="dataFound">
                            <Card v-for="item in cardList" class="card" v-bind:key="item.id">
                              <p slot="title"><a class="tool-name" @click="gotoPTMDetails(item.usi)">{{item.peptideSequence}} [charge:{{item.charge}}] [precursor m/z:{{item.mz}}]</a> </p>
                              <p style="display: flex" slot="extra">
                                  <!-- <span>
                                      <Icon type="md-cloud-download" size="22"/>
                                  </span> -->
                              </p>
                              <div class="card-content-wrapper">
                                <div class="left">
                                  <div>
                                    <div style="font-weight:bold; display: inline-block; width: 144px">Proteins Mapped:</div>
                                    <Tooltip  v-for="tagItem in item.proteinAccessions" :content="tagItem" placement="top-start">
                                     <Tag style="width: 140px">
                                        {{tagItem}}
                                      </Tag>
                                    </Tooltip>
                                  </div>
                                  <div style="margin-top: 10px">
                                    <div style="font-weight:bold; display: inline-block; width: 144px;">Gene Accessions:</div>
                                    <Tooltip  v-for="tagItem in item.geneAccessions" :content="tagItem" placement="top-start">
                                        <Tag style="width: 140px">
                                          {{tagItem}}
                                        </Tag>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            </Card>
                            <div class="page-wrapper">
                                <Page :total="total" :current="page" :page-size="pageSize" size="small" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
                            </div>
                          </template>
                          <div v-if="!dataFound" class="no-data-container">
                              No Data...
                          </div>
                      </Col>
                  </Row>
          </div>

      </div>
      <Spin fix v-if="loading"></Spin>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
        publicPath: process.env.BASE_URL.replace(/\/$/, ''),
        keywords:'AAAA*A',
        total:0,
        page:1,
        pageSize:30,
        cardList:[],
        loading:true,
        dataFound:false,
        filter:'All',
        resultsTableCol:[
            {
                title: 'Container',
                key: 'container'
            },
            {
                title: 'Description',
                key: 'description'
            },
            {
                title: 'Real Name',
                key: 'realname'
            },
            {
                title: 'Last Modified',
                key: 'lastmodified'
            },
            {
                title: 'Starred/Starts',
                key: 'starredstarts'
            },
            {
                title: 'Popularity',
                key: 'popularity'
            },
            {
                title: 'Registry Link',
                key: 'registrylink'
            },
        ],
        resutls:[
            {
                container: 'John Brown',
                description: 18,
                realname: 'New York No. 1 Lake Park',
                lastmodified: '2016-10-03',
                starredstarts:'test',
                popularity:'test',
                registrylink:'test'
            },
            {
                container: 'John Brown',
                description: 18,
                realname: 'New York No. 1 Lake Park',
                lastmodified: '2016-10-03',
                starredstarts:'test',
                popularity:'test',
                registrylink:'test'
            },
            {
                container: 'John Brown',
                description: 18,
                realname: 'New York No. 1 Lake Park',
                lastmodified: '2016-10-03',
                starredstarts:'test',
                popularity:'test',
                registrylink:'test'
            },
            {
                container: 'John Brown',
                description: 18,
                realname: 'New York No. 1 Lake Park',
                lastmodified: '2016-10-03',
                starredstarts:'test',
                popularity:'test',
                registrylink:'test'
            },
        ],
        filters:[
            {
                name:'All',
                type:'primary',
            },
            {
                name:'ID',
                type:'default',
            },
            {
                name:'Name',
                type:'default',
            },
            {
                name:'Description',
                type:'default',
            },
        ],
        sortType:'default',
        sortTypeArray:[
            {
                label:'Default',
                value:'default',
            },
            {
                label:'Pull No',
                value:'pulls',
            },
        ],
        sortOrder:'asc',
        sortOrderArray:[
            {
                label:'Asc',
                value:'asc',
            },
            {
                label:'Desc',
                value:'desc',
            },
        ],
        query:{
          // offset:0,
          // limit:30
        },
        licenseColor:{
          Apache: 'brightgreen',
          MIT:'green',
          GPL:'blue',
          BSD:'yellow',
          CC:'blueviolet',
          Artistic:'important'
        },
        facetNameArray:[],
        facetValueArray:[],
        facetValue:'',
        facetName:'',
        tagsArray:[]
    }
  },
  methods:{
    // rowClick(row){
    //   console.log('row',row);
    //     this.$router.push({name:'Containerdetails',params:{id:row.ID}});
    // },
    // filterClick(index){
    //     for(let i in this.filters){
    //       this.filters[i].type = 'default';
    //     }

    //     this.filter = this.filters[index].name;
    //     this.filters[index].type = 'primary';


    //     if(index == 0){
    //       for(let i in this.filters){
    //           if(i == index){
    //             this.filter = this.filters[i].name;
    //             this.filters[i].type = 'primary';
    //           }
    //           else
    //             this.filters[i].type = 'default';
    //       }
    //     }
    //     else{
    //         this.filters[0].type = 'default';
    //         if(this.filters[index].type == 'primary')
    //             this.filters[index].type = 'default';
    //         else{
    //             this.filter = this.filters[index].name;
    //             this.filters[index].type = 'primary';
    //         }
    //     }
    // },
    // sortTypeClick(index){
    //   console.log(this.sortType)
    //   this.search();
    //     /*
    //       for(let i in this.sorts){
    //           if(i == index)
    //             this.sorts[i].type = 'primary';
    //           else
    //             this.sorts[i].type = 'default';
    //       }*/
    // },
    // sortOrderClick(index){
    //   console.log(this.sortOrder)
    //   this.search();
    //     /*
    //       for(let i in this.sorts){
    //           if(i == index)
    //             this.sorts[i].type = 'primary';
    //           else
    //             this.sorts[i].type = 'default';
    //       }*/
    // },
    search(){
        this.loading=true;
        this.dataFound=false;
        this.cardList=[];
        // if(this.query.description)
        //   delete this.query.description;
        // if(this.query.id)
        //   delete this.query.id;
        // if(this.query.toolname)
        //   delete this.query.toolname;

        // if(this.filter == 'Description')
        //  this.query.description = this.keywords;
        // else if(this.filter == 'ID')
        //   this.query.id = this.keywords;
        // else if(this.filter == 'Name')
        //   this.query.toolname = this.keywords;
        // else if(this.filter == 'All'){
        //   this.query['all_fields_search'] = this.keywords;
        // }

        // this.query.sort_field = this.sortType
        // this.query.sort_order = this.sortOrder

        // this.query.page = this.page
        // this.query.pageSize = this.pageSize
        this.query.pageSize = 100
        this.query.peptideSequenceRegex = this.keywords
        this.$http
            .get(this.$store.state.baseApiURL + 'spectra/findByPepSequence/count',{params:{peptideSequenceRegex:this.keywords}})
            .then(function(res){
              // this.total = res.body
              this.total = res.body
              this.$http
                  .get(this.$store.state.baseApiURL + 'spectra/findByPepSequence',{params:this.query})
                  .then(function(res){
                    this.loading=false;
                    console.log(res.body)
                    let tempLength = res.body.length;
                    if(tempLength > 0){
                        // let limit = res.headers.map.last_page[0].split('&')[0].split('=')[1];
                        // let offset = res.headers.map.last_page[0].split('&')[1].split('=')[1];
                        // this.total = parseInt(limit)+parseInt(offset);
                        this.dataFound=true;
                        for(let i=0; i<tempLength; i++){
                            var item = {
                              usi:res.body[i].usi,
                              peptideSequence:res.body[i].peptideSequence,
                              proteinAccessions:res.body[i].proteinAccessions,
                              geneAccessions:res.body[i].geneAccessions,
                              charge:res.body[i].precursorCharge,
                              mz:res.body[i].precursorMz,
                            };
                            // for(let j in res.body[i].proteinAccessions){
                            //   item.proteinAccessions+=res.body[i].proteinAccessions[j]+';'
                            // }
                            // for(let j in res.body[i].geneAccessions){
                            //   item.geneAccessions+=res.body[i].geneAccessions[j]+';'
                            // }
                            this.cardList.push(item);
                        }
                    }
                    else{
                      this.dataFound=false;
                    }

                  },function(err){
                      console.log('err',err);
                      this.dataFound=false;
                      this.loading=false;
                      this.$Notice.error({
                          title: 'Server Error',
                          desc: err.body.error
                      });
                  });
            },function(err){

            });

    },
    pageChange(page){
      this.page= page-1;
      // this.current=page;
      // this.query.offset = parseInt(this.pageSize) * (parseInt(page)-1) + 1;
      // console.log(page,this.pageSize,this.query.offset);
      this.search();
    },
    pageSizeChange(pageSize){
      this.pageSize = pageSize;
      // this.query.limit = this.pageSize;
      this.search();
    },
    gotoPTMDetails(usi){
      //this.$router.push({name:'dataset',params:{id:id}});
      //this.$router.push({name:'tools',params:{id:id}});
      window.open('http://ipsa.multiomics.info/?usi='+usi)
    },
    // getFacets(){
    //     this.$http
    //         .get(this.$store.state.baseApiURL + 'ga4gh/trs/v2/facets')
    //         .then(function(res){
    //           let tempLength = res.body.length;
    //           if(tempLength > 0){
    //               this.facetObj = {}
    //               this.facetName = res.body[0].facet
    //               this.facetValueArray = res.body[0].values
    //               for(let i in res.body){
    //                 let item = res.body[i]
    //                 this.facetNameArray.push(item.facet)
    //                 this.facetObj[item.facet] = item.values
    //               }
    //           }
    //           else{
    //             this.$Notice.error({
    //                 title: 'No facets: Server Error',
    //                 desc: err.body.error
    //             });
    //           }
    //         },function(err){
    //             console.log('err',err);
    //             this.$Notice.error({
    //                 title: 'No facets: Server Error',
    //                 desc: err.body.error
    //             });
    //         });
    // },
    // facetNameChange(index){
    //   this.facetValueArray = this.facetObj[index]
    //   this.facetValue=''
    // },
    // facetValueChange(index){
    //   for(let i in this.tagsArray){
    //     if(this.tagsArray[i].name == this.facetName && this.tagsArray[i].value == index){
    //       this.facetValue=''
    //       this.$Notice.error({
    //           title: 'Repeated Facets',
    //           desc: 'Do not add the repeated facets!'
    //       });
    //       return
    //     }
    //   }
    //   if(index){
    //       let item = {
    //         name:this.facetName,
    //         value:index
    //       }
    //       this.tagsArray.push(item)
    //   }
    // },
    // removeFacetTag(event, name){
    //   console.log('name',name)
    //   for(let i in this.tagsArray){
    //     if((this.tagsArray[i].name+this.tagsArray[i].value) == name){
    //         this.tagsArray.splice(i, 1);
    //     }
    //   }
    // },
    // addKeyword(){
    //   for(let i in this.tagsArray){
    //     if(this.tagsArray[i].name == this.keywords){
    //       this.$Notice.error({
    //           title: 'Repeated Keywords',
    //           desc: 'Do not add the repeated keywords!'
    //       });
    //       return
    //     }
    //   }
    //   if(this.keywords){
    //       let item = {
    //         name:this.keywords,
    //         value:''
    //       }
    //       this.tagsArray.push(item)
    //       this.keywords = ''
    //   }
    // }
  },
  watch:{
    // tagsArray: function(val,oldVal){
    //       this.query.facets = ''
    //       for(let i in val){
    //         if(val[i].value){// it is a facet, if value is null, it is the keyword
    //           this.query.facets+=val[i].name+':'+val[i].value+','
    //         }
    //       }
    //       let reg=/,$/gi
    //       this.query.facets=this.query.facets.replace(reg,"");
    //       console.log('watch',this.query.facets)
    // },
    page: function(val, oldVal){
      this.query.page = val - 1
      this.search()
    },
    pageSize: function(val, oldVal){
      this.query.pageSize = val
      this.search()
    }
  },
  mounted(){
    this.search();
    // this.getFacets();
  }
}

var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];

function abbreviateNumber(number){

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .search-wrapper{
      width: 100%;
      text-align: center;
      margin: 20px auto 30px auto;
    }
    .search-options-wrapper{
      margin: 20px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .filter-wrapper{
      display: flex;
    }
    .filter-wrapper .sort{
      margin-left: 10px;
    }
    .sortOption{
      display: inline-block;
      position: relative;
    }
    .filter-wrapper .name{
      font-size: 0.875rem
    }
    .results-wrapper{
      width: 80%;
      margin: 30px auto 0 auto;
    }
    .update-statistics{
      width: 80%;
      margin: 30px auto 0 auto;
    }
    .issue-statistics{
      width: 80%;
      margin: 30px auto 0 auto;
    }
    .banner{
      background-color: #eb8c1f;
      color: #ffffff;
      padding: 3rem 0;
    }
    .triangle-down:before{

      /*background-image:url('static/triangle.svg');*/
    }
    .triangle:before{
      background-repeat: no-repeat;
      background-size: 100% 100%;
      content: '';
      display: block;
      width: 100%;
      left: 0;
      height: 30px;
      /*background-image:url('static/triangle.svg');*/
    }
    .spin-container{
      display: inline-block;
      width: 100%;
      height: 100px;
      position: relative;
    }
    .no-data-container{
      width: 100%;
      text-align: center;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .content-wrapper{
      width: 80%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-wrap: wrap;
    }
    .title{
      font-size: 4.5rem;
      font-weight: 300;
      line-height: 1.2;
    }
    .description{
      font-size: 1.25rem;
      font-weight: 300;
    }
    .content{
      position: relative;
      min-height: 300px;
      margin-top: 60px;
      margin-bottom: 6rem;
      font-size: 1.1rem;
      line-height: 1.6;
      width: 80%;
      margin-right: auto;
      margin-left: auto;
      padding-top: 60px;
    }
    .card-content-wrapper{
      display: flex;
      justify-content: space-between;
    }
    .card-content-wrapper .left{
      width: 100%;
      max-height: 180px;
      overflow-y: auto;
    }
    .card-content-wrapper .right{
      display: flex;
      align-items: end;
      font-size: 30px;
    }
    .content h1{
      border-bottom: 1px solid #e4973e;
      font-weight: 500;
      padding-top: 60px;
      color: #eb8c1f;
    }
    .container-wrapper{
      /*margin-top: 50px;*/
    }
    .description-wrapper{
      margin-bottom: 5px;
      white-space: normal;
      width: 100%;
      text-align:justify;
    }
    .tag-wrapper{
      margin-bottom: 5px;
      display: inline-block;
    }
    .card{
      display: inline-block;
      /*height: 150px;
      min-height: 150px;*/
      overflow: hidden;
      width: 100%;
      transition: all 0.15s ease-out;
      -webkit-transition: all 0.15s ease-out;
    }
    .tooltip-content{
        white-space: normal;
        width: 200px;
    }
    .page-wrapper{
      text-align: center;
      font-size: 12px;
    }
    .filter-button{
      min-width: 70px;
    }
    .tool-name{
      /*
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;*/
    }
    .license-img{
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
</style>

<style>
    .update-statistics .ivu-card-head{
      background-color: #d9edf7 !important;
    }
    .update-statistics .ivu-card-bordered{
      border: 1px solid #bce8f1 !important;
      border-color: #bce8f1 !important;
    }
    .issue-statistics .ivu-card-head{
      background-color: #dff0d8 !important;
    }
    .issue-statistics .ivu-card-bordered{
      border: 1px solid #d6e9c6 !important;
      border-color: #d6e9c6 !important;
    }
    .description-wrapper textarea{
      resize: none !important;
      outline: none !important;
      border:none !important;
    }
    .description-wrapper .ivu-input{
      border: none !important;
      cursor: default;
    }
    .description-wrapper .ivu-input[disabled]{
      background: none;
    }
    .facet-value-select .ivu-select-dropdown{
      max-width: 300px;
    }
    /*
    table tr:last-child td:first-child {
        border-bottom-left-radius: 10px;
    }

    table tr:last-child td:last-child {
        border-bottom-right-radius: 10px;
    }
    */
</style>
