import * as echarts from 'echarts';  

// mojo module
mstrmojo.requiresCls('mstrmojo.CustomVisBase');

const { GraphicModel } = mstrmojo.customviz;
const { ENUM_RAW_DATA_FORMAT } = mstrmojo.models.template.DataInterface;

var $ARR = mstrmojo.array ; 
var $DEFAULT_CONTEXT_MENU =  mstrmojo.DEFAULT_CONTEXT_MENU ;
var $LINETYPE = {NONE: 99, THIN: 1, THICK: 2, DASHED: 3, DOTTED: 4}

mstrmojo.plugins.EChartCandle.EChartCandle = mstrmojo.declare(
  mstrmojo.CustomVisBase,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartCandle.EChartCandle',
    cssClass: 'echartcandle',
    errorMessage: mstrmojo.desc("EChartCandle.900" ,"Either there is not enough data to display the visualization or the visualization configuration is incomplete.").replace(/^\[+|\]+$/g , "") , // 'Either there is not enough data to display the visualization or the visualization configuration is incomplete.',
    errorDetails: mstrmojo.desc("EChartCandle.901" ,"This visualization requires one or more attributes and one metric.").replace(/^\[+|\]+$/g , "") , // 'This visualization requires one or more attributes and one metric.',
    useRichTooltip: false,
    reuseDOMNode: false,
    draggable: false,
    supportNEE: true,
    isMobile :  window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString ? true : false   , 
    init(props) {
      this._super(props);
      this.setDefaultPropertyValues({
        upcolor :  {fillColor: mstrmojo.desc("EChartCandle.105" ,"#00da3c").replace(/^\[+|\]+$/g , "")  , fillAlpha : 100} ,     
        downcolor : {fillColor: mstrmojo.desc("EChartCandle.106" ,"#ec0000").replace(/^\[+|\]+$/g , "")  , fillAlpha : 100} ,         
        MA1 : "true" , MA1V : 5 , 
        MA2 : "true" , MA2V : 20 , 
        MA3 : "true" , MA3V : 60 , 
        MA4 : "true" , MA4V : 120 , 
        xAxisLabel : "true" , 
        xAxisLabelFont :  { fontSize: '14pt', fontFamily: 'Open Sans',  fontWeight : false ,  fontColor: '#4a4a4a' } ,
        xAxisBorder: {lineColor: "#333333" , lineStyle : $LINETYPE.THIN }  , 
        xBorder : {lineColor: "#c0c0c0" , lineStyle : $LINETYPE.NONE }  , 
        xBandingColor : {fillColor:"transparent" , fillAlpha : 50}  , 
        yAxisLabel : "true" , 
        yAxisLabelFont :  { fontSize: '14pt', fontFamily: 'Open Sans',  fontWeight : false ,  fontColor: '#4a4a4a' } , 
        yAxisBorder: {lineColor: "#333333" , lineStyle : $LINETYPE.THIN }  , 
        yBorder : {lineColor: "#c0c0c0" , lineStyle : $LINETYPE.THIN } , 
        yBandingColor : {fillColor:"transparent" , fillAlpha : 50}  ,
      }); 
    }, 

    getContextMenuConfig: function getContextMenuConfig(graphicModel) {
      var commonConfig = [
          {
              type: $DEFAULT_CONTEXT_MENU.GO_TO_TARGETS
          }
      ];
      
      var customConfig = [					
          ];
      return {
          common: commonConfig,
          custom: customConfig
      };
    },          
    getVizData : function getVizData(rawData) { 
      var me = this ; 
      var openM , openI ,  closeM , closeI, lowestM , lowestI , highestM , highestI , volumeM , volumeI ; 
    openM =  this.zonesModel &&  this.zonesModel.getDropZoneObjectsByIndex(1)[0]  ; 
    closeM =  this.zonesModel &&  this.zonesModel.getDropZoneObjectsByIndex(2)[0]  ; 
    lowestM =  this.zonesModel &&  this.zonesModel.getDropZoneObjectsByIndex(3)[0]  ; 
    highestM =  this.zonesModel &&  this.zonesModel.getDropZoneObjectsByIndex(4)[0]  ; 
    volumeM =  this.zonesModel &&  this.zonesModel.getDropZoneObjectsByIndex(5)[0]  ;  
    openI = openM &&  this.zonesModel && this.dataInterface.getUnitById(openM.id) && this.dataInterface.getUnitById(openM.id).depth -1 ;
    closeI =closeM &&  this.zonesModel && this.dataInterface.getUnitById(closeM.id) && this.dataInterface.getUnitById(closeM.id).depth -1 ;
    lowestI = lowestM &&  this.zonesModel && this.dataInterface.getUnitById(lowestM.id) && this.dataInterface.getUnitById(lowestM.id).depth -1 ;
    highestI = highestM && this.zonesModel && this.dataInterface.getUnitById(highestM.id) && this.dataInterface.getUnitById(highestM.id).depth -1 ;
    volumeI = volumeM &&  this.zonesModel && this.dataInterface.getUnitById(volumeM.id) && this.dataInterface.getUnitById(volumeM.id).depth -1 ;

      var vizData  = {}; 
      var  categoryData  = [] ;
      var  values  = [] ;  
      var  volumes  = [] ;
      var selectors = [] ; 

      $ARR.forEach ( rawData, function (row,i) { 
        var headers = row.headers,
        mvalues = row.values ;  
        var tvalue = [] ; 
        categoryData.push (headers[0].name) ;                  
        for (var j =0 ; j<mvalues.length-1; j++) {
           tvalue.push (mvalues[j].rv) ; 
         }         
        selectors.push(row.headers[0].attributeSelector ) ; 
/*          tvalue[0] = mvalues[openI]  && mvalues[openI].rv ; 
         tvalue[1] = mvalues[closeI]  && mvalues[closeI].rv ; 
         tvalue[2] = mvalues[lowestI]  && mvalues[lowestI].rv ; 
         tvalue[3] = mvalues[highestI]  && mvalues[highestI].rv ; 
 */     
         values.push (tvalue) ; 
         volumes.push([i, mvalues[volumeI] && mvalues[volumeI].rv  , tvalue[openI] > tvalue[closeI]  ? 1 : -1 ]) ; 
      // volumes.push([i, mvalues[4].rv  , mvalues[0].rv > mvalues[1].rv  ? 1 : -1 ]) ; 
      }) ;     
     // console.log (values) ;
      vizData.categoryData = categoryData ; 
      vizData.values = values; 
      vizData.volumes = volumes ;  
      vizData.selectors = selectors ; 
      return  vizData; 
    }  , 

    plot() { 

      var me = this ;    
      
      this.addUseAsFilterMenuItem(); 

      var upColor = this.getProperty("upcolor").fillColor // '#00da3c';
      var downColor = this.getProperty("downcolor").fillColor  // '#ec0000';
      var MA1 = this.getProperty("MA1") == "true" ? this.getProperty("MA1V") : 0 ; 
      var MA2 = this.getProperty("MA2") == "true" ? this.getProperty("MA2V") : 0 ; 
      var MA3 = this.getProperty("MA3") == "true" ? this.getProperty("MA3V") : 0 ; 
      var MA4 = this.getProperty("MA4") == "true" ? this.getProperty("MA4V") : 0 ;  
      var xAxisLabel = this.getProperty("xAxisLabel") == "true" ? true : false ;  
      var yAxisLabel = this.getProperty("yAxisLabel") == "true" ? true : false ;  
      var xAxisLabelFont  = getFontStyle( this.getProperty("xAxisLabelFont")) ; 
      var yAxisLabelFont  = getFontStyle( this.getProperty("yAxisLabelFont")) ; 
      var xBorder =  getBorderStyle (this.getProperty("xBorder") );
      var yBorder =  getBorderStyle (this.getProperty("yBorder") ) ;
      var xAxisBorder =  getBorderStyle (this.getProperty("xAxisBorder") );
      var yAxisBorder =  getBorderStyle (this.getProperty("yAxisBorder") ) ;
      var xBandingColor =this.getProperty ("xBandingColor")  ; 
      var yBandingColor =this.getProperty ("yBandingColor")  ; 
      
      var colorAtt = this.zonesModel && this.zonesModel.getColorByAttributes() ;

      var rawData =   this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV,
        { colorByInfo : colorAtt , hasTitleName: true  , hasSelection:true ,         hasThreshold: true, /*additionalAttrIds: this.additionalAttrIds, */ });  
      // Drop Zone Metric 
      var vizData = me.getVizData(rawData) ; 
      var  container = this.domNode ; // 
      var myChart = echarts.init(container,null , {renderer:'canvas'});
       $(container).on("mousemove" , function(e){ 
        e.stopPropagation(); 
      })  ;


      function calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data.values[i - j][1];
            }
            result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
    }
      
      // specify chart configuration item and data
      var option = {
          // title: {text:  },     
          legend: {
            bottom: 10,
            left: 'center',
          },    
          axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
          },
          toolbox: {
            feature: {
                dataZoom: {
                  title : {
                      zoom : mstrmojo.desc("EChartCandle.101" ,"Area zooming").replace(/^\[+|\]+$/g , "") , // "Area zooming" , 
                      back : mstrmojo.desc("EChartCandle.102" ,"Restore area zooming").replace(/^\[+|\]+$/g , "") ,  // "Restore area zooming" 
                    } , 
                    yAxisIndex: false
                },
                brush: {                   
                  title : {
                      lineX :  mstrmojo.desc("EChartCandle.103" ,"Horizontal selection").replace(/^\[+|\]+$/g , "")   , 
                      clear : mstrmojo.desc("EChartCandle.104" ,"Clear Selection").replace(/^\[+|\]+$/g , "")   ,  
                    } , 
                    type: ['lineX', 'clear']
                }
            }
        },         
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          },
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
              color: '#000'
          },
          position: function (pos, params, el, elRect, size) {
              var obj = {top: 10};
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              return obj;
          }
          // extraCssText: 'width: 170px'
      },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          outOfBrush: {
              colorAlpha: 0.1
          }
        },
        visualMap: {
          show: false,
          seriesIndex: 1,
          dimension: 2,
          pieces: [{
              value: 1,
              color: downColor
          }, {
              value: -1,
              color: upColor
          }]
      },
/*           grid: [
            {
                left: '10%',
                right: '8%',
                height: '55%'
            },
            {
                left: '10%',
                right: '8%',
                top: '65%',
                height: '14%'
            }
        ], */
        grid: [
          {
              left: '10%',
              right: '8%',
              height: '50%'
          },
          {
              left: '10%',
              right: '8%',
              top: '63%',
              height: '16%'
          }
      ],
          xAxis: [
             {
                type: 'category',
                data: vizData.categoryData,
                scale: true,
                splitArea: {
                  show: xBandingColor.fillColor !="transparent" ? true : false , 
                  interval : 1 , 
                  areaStyle : {
                    color : [xBandingColor.fillColor , "transparent" ] , 
                    opacity : xBandingColor.fillAlpha /100 
                  }
                } , 
                boundaryGap: false,
                axisLine: {onZero: false , 
                  show : xAxisBorder.width > 0 ? true : false , 
                  lineStyle : {
                    color : xAxisBorder.lineColor , 
                    width : xAxisBorder.width , 
                    type : xAxisBorder.type 
                  }
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                } , 
                axisLabel : {
                  show : xAxisLabel , 
                  color : xAxisLabelFont.color  , 
                  fontWeight : xAxisLabelFont.fontWeight , 
                  fontStyle : xAxisLabelFont.fontStyle  , 
                  fontFamily : xAxisLabelFont.fontFamily , 
                  fontSize :  xAxisLabelFont.fontSize 
                } , 
                splitLine : {
                  show : xBorder.width > 0 ? true : false , 
                  lineStyle : {
                    color : xBorder.lineColor , 
                    width : xBorder.width , 
                    type : xBorder.type 
                  }
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: vizData.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                  show: yBandingColor.fillColor !="transparent" ? true : false , 
                  interval : 1 , 
                  areaStyle : {
                    color : [yBandingColor.fillColor , "transparent" ] , 
                    opacity : yBandingColor.fillAlpha /100 
                  }
                } , 
                axisLine: { 
                  show : yAxisBorder.width > 0 ? true : false , 
                  lineStyle : {
                    color : yAxisBorder.lineColor , 
                    width : yAxisBorder.width , 
                    type : yAxisBorder.type 
                  }
                },
                axisLabel : {
                  show : yAxisLabel , 
                  color : yAxisLabelFont.color  , 
                  fontWeight : yAxisLabelFont.fontWeight , 
                  fontStyle : yAxisLabelFont.fontStyle  , 
                  fontFamily : yAxisLabelFont.fontFamily , 
                  fontSize :  yAxisLabelFont.fontSize 
                } , 
                splitLine : {
                  show : yBorder.width > 0 ? true : false , 
                  lineStyle : {
                    color : yBorder.lineColor , 
                    width : yBorder.width , 
                    type : yBorder.type 
                  }
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 98,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '87%',
                start: 98,
                end: 100
            }
        ],
          series: [{
            name: 'Candle Chart',
            type: 'candlestick',               
            data : vizData.values  ,  
            
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: null,
              borderColor0: null
          }, 
           tooltip: {
            formatter: function (param) {
                param = param[0];
                return [
                    'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                    'Open: ' + param.data[0] + '<br/>',
                    'Close: ' + param.data[1] + '<br/>',
                    'Lowest: ' + param.data[2] + '<br/>',
                    'Highest: ' + param.data[3] + '<br/>'
                ].join('');
              }
            } , 
        }, 
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: vizData.volumes
        }
        ]         
      };       

      var legendData  = [] , arrMA = [MA1, MA2 , MA3 , MA4] ; 
      legendData[0] = this.dataInterface.getRowTitles().getTitle(0).getName() ;  
      option.series[0].name = legendData[0]; 
      
      arrMA.forEach ( function (MA , index) {
        if (MA > 0 )     {
          legendData[index+1]  = "MA" + MA  ;
          option.series.push (  {
            name: legendData[index+1],
            type: 'line',
            data: calculateMA(MA, vizData),
            smooth: true,
            lineStyle: {
                opacity: 0.5
            }
            }) ; 
        }
      }) 
      option.legend.data = legendData ; 
      // use configuration item and data specified to show chart
      myChart.setOption(option ,true );
/*       myChart.dispatchAction({
        type: 'brush',
        areas: [
            {
                brushType: 'lineX',
                coordRange: ['2016-06-02', '2016-06-20'],
                xAxisIndex: 0
            }
        ]
    }); */
      myChart.on("finished",function(){
        me.raiseEvent({
          name: 'renderFinished',
          id: me.k
        });  
      }) ; 

      // Click Event 
      var selectedItem = {} ;    
  
      myChart.on("brush", function (params) { 
        if (params.command == "clear") {
          // clear Selection ; 
          selectorHandling ([]) ;
        }
    }) ;

      myChart.on("brushEnd", function (params, event ) {  
        if (params.areas && params.areas[0] && params.areas[0].coordRange ) { 
          var selIndex  = params.areas[0].coordRange ; 
          var event = window.event ; 
          if ( selectedItem.fromIndex != selIndex[0]  && selectedItem.toIndex != selIndex[selIndex.length-1] ) {
            if (event.which == 1) {
              selectorHandling (selIndex) ;   
            }        
            else {
              handleEChartContext (selIndex , event ) ;
            }      
          }          
        }        
        else {
          return ; 
        }
          
      }) ;

      function selectorHandling (selIndex) { 
        var currItems = [] ; 
        var fromIndex , toIndex ; 
        var isSelected = false ;         
          if (! (selIndex instanceof Array) ){
            selIndex = [selIndex] ;
          }
          fromIndex = selIndex[0] ; toIndex = selIndex[selIndex.length-1] ;
          for (var i = fromIndex; i <=toIndex  ; i++) {
            currItems.push( vizData.selectors[i]) ; 
          }

          if (selectedItem.fromIndex === fromIndex && selectedItem.toIndex  ==toIndex ) {
            isSelected = true ;
          } ; 
          if (isSelected ) // click same item again
          {
              if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) {  
                  var d = {}
                  d.messageType = "deselection";
                  window.webkit.messageHandlers.selectionDataJSONString.postMessage(d);
              } else {
                  me.clearSelections();
                  me.endSelections();
              }
              selectedItem  = {} ;
          }
          else {          
              if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { 
                $ARR.forEach(currItems, function (e){
                    e.messageType = "selection"; 
                }) ;
                window.webkit.messageHandlers.selectionDataJSONString.postMessage(currItem); 
              } else {
                me.applySelection(currItems); //for web
              }          
            selectedItem.fromIndex = fromIndex ; 
            selectedItem.toIndex = toIndex ; 
          }
      } 

      myChart.on('click', function (params) {  
          selectorHandling (params.dataIndex) ;
          params.event.event.stopPropagation();
          params.event.event.preventDefault();
      });

      myChart.on('mousemove',function(params){
        params.event.event.stopPropagation();
        params.event.event.preventDefault();
      }) ;
      
      myChart.on('mouseover',function(params){ 

      });
      
      myChart.on('mouseout',function(params){
        params.event.event.stopPropagation();
        params.event.event.preventDefault();
      }); 

      function getFontStyle (fontStyle) {
        var cssFontStyle = {} ; 
        cssFontStyle.color = fontStyle.fontColor  ; 
        cssFontStyle.fontWeight =  fontStyle.fontWeight ? "bold" : "normal" ; 
        cssFontStyle.fontStyle =  fontStyle.fontItalic ? "italic" : "normal" ; 
        cssFontStyle.fontFamily = fontStyle.fontFamily; 
        cssFontStyle.fontSize = parseInt(fontStyle.fontSize)  ; 
        cssFontStyle["text-decoration-line"] = fontStyle.fontUnderline == "true" ? "underline" : "" ;         
        cssFontStyle["text-decoration-line"] = cssFontStyle["text-decoration-line"]  + " " +  fontStyle.fontLineThrough == "true"  ? "line-through" : "" ; 
        return cssFontStyle ; 
      }
      function getBorderStyle (propStyle) {
        var borderStyle = {} ;
        switch (parseInt(propStyle.lineStyle)) {
          case $LINETYPE.NONE : 				
            borderStyle = {width : 0 ,type  : 'solid'  };  break ;				
          case $LINETYPE.THIN : 
            borderStyle = {width : 1 ,type  : 'solid' };  break ;				
          case $LINETYPE.DASHED : 
            borderStyle = {width : 1 ,type  : 'dashed' };  break ;
          case $LINETYPE.DOTTED : 
            borderStyle = {width : 1 ,type  : 'dotted'  };  break ;				
          case $LINETYPE.THICK : 
            borderStyle = {width : 2 ,dasharray  : 0  };  break ;				
        } 
        borderStyle.lineColor = propStyle.lineColor ; 
        return borderStyle ;
      }

    },
  },
);
