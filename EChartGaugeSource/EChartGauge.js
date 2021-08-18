import * as echarts from 'echarts/core'; 

import {
  GaugeChart
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent
} from 'echarts/components';
import {
    CanvasRenderer
} from 'echarts/renderers';

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, GaugeChart, CanvasRenderer]
);

import numeral from 'numeral' ; 

const desci18n = function (number,text){
  return mstrmojo.desc("EChartGauge" + String(number) ,text).replace(/^\[+|\]+$/g , "")  
} 
const calcRelativeSize = function calcRelativeSize(sizeMin,sizeMax, sizeCont ) {
  let relSize = sizeMax; 
  const maxCont = 600 , minCont = 50 ; 
  if (sizeCont < maxCont ) {              
      relSize = sizeCont< minCont ? sizeMin : Math.round (sizeMin + (sizeCont / maxCont) * (sizeMax -sizeMin)) ;
  }
  return relSize ; 
} ;

// mojo module
mstrmojo.requiresCls('mstrmojo.CustomVisBase');
const { GraphicModel } = mstrmojo.customviz;
const { ENUM_RAW_DATA_FORMAT } = mstrmojo.models.template.DataInterface;
const $LINETYPE = {NONE: 99, THIN: 1, THICK: 2, DASHED: 3, DOTTED: 4} ; 
const $POINTER = {DEFAULT : '', CIRCLE : "circle" ,RECT : 'rect', ROUNDRECT : 'roundRect', TRIANGLE : 'triangle', DIAMOND : 'diamond', PIN : 'pin', ARROW : 'arrow'    } 
const $GAUGE_TYPE = {Basic : 'Basic Gauge', Half : 'Half Gauge' , Circle : 'Circle' , Left : 'Left Half', Right : 'Right Half' }
var $GAGUE_TYPE_PROP = {
  Basic : { startAngle : 225 , endAngle : -45 ,centerleft  : 50 ,centertop:50 ,radius:100 ,labelcenterleft :0 ,labelcentertop : 20,titlecenterleft :0 , titlecentertop : 0 }, 
  Half : { startAngle : 180 , endAngle : 0 ,centerleft  : 50 ,centertop:75 ,radius:120,labelcenterleft :0 ,labelcentertop : 0,titlecenterleft :0 , titlecentertop : -20}, 
  Circle : { startAngle : 90 , endAngle : -270 ,centerleft  : 50 ,centertop:50 ,radius:100,labelcenterleft :0 ,labelcentertop : 20,titlecenterleft :0 , titlecentertop : 0}, 
  Left : { startAngle : 270 , endAngle : 90 ,centerleft  : 50 ,centertop:50 ,radius:100,labelcenterleft :0 ,labelcentertop : 20,titlecenterleft :0 , titlecentertop : 0},  
  Right : { startAngle : 90 , endAngle : -90 ,centerleft  : 50 ,centertop:50 ,radius:100,labelcenterleft :0 ,labelcentertop : 20,titlecenterleft :0 , titlecentertop : 0} 
} ;

mstrmojo.plugins.EChartGauge.EChartGauge = mstrmojo.declare(
  mstrmojo.CustomVisBase,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartGauge.EChartGauge',
    cssClass: 'echartgauge',
    errorMessage: desci18n (901 , 'This requires at least 1 value metric.') ,
    errorDetails: desci18n (900 , 'You can set min, max, target metric.') ,
    useRichTooltip: false,
    reuseDOMNode: true ,
    draggable: false,
    supportNEE: true,
    init(props) {
      this._super(props);
    }, 
      getVizData : function getVizData() { 
        var me = this ; 
        var DI = this.dataInterface ; 
        var vizData  = {}; 
        
        function getObjectZone (zoneIndex) {
          let zoneObjectIndex , zoneObject , zoneObjectName ; 
          zoneObject = me.zonesModel &&  me.zonesModel.getDropZoneObjectsByIndex(zoneIndex)[0] ; 
          zoneObjectIndex = zoneObject &&  me.zonesModel && me.dataInterface.getUnitById(zoneObject.id) && me.dataInterface.getUnitById(zoneObject.id).depth -1 ;
          zoneObjectName = zoneObject &&  me.zonesModel && me.dataInterface.getUnitById(zoneObject.id) && me.dataInterface.getUnitById(zoneObject.id).unit.n  ;
          return { "zoneObject" : zoneObject , "zoneIndex" : zoneObjectIndex , "zoneName" : zoneObjectName } ; 
        }

        var ValueM,   TargetM ,    MinM ,   MaxM   ; 
        ValueM =  getObjectZone (0); 
        TargetM =   getObjectZone (1);  
        MinM =   getObjectZone (2); 
        MaxM =   getObjectZone (3); 
 
        var value = {} ;
        function getMValue (M) { 
          return {name : M.zoneName , value :DI.getMetricValue ( 0 , M.zoneIndex ).value }
        }
        value.Value = getMValue (ValueM); 
        value.Target =  getMValue (TargetM);
        value.Min =  getMValue (MinM);
        value.Max =  getMValue (MaxM); 

        vizData.values = [] ;
        vizData.values.push (value) ;
        return  vizData; 
      }  ,  
      vizData : {} , 
      myChart : {} ,  
      isEmpty : function (){
        return false  ; 
      },
      setGaugeType : function () {
        const gaugeType = this.getProperty('gaugetype') ; 
        var me = this ; 
        var gaugeProp = $GAGUE_TYPE_PROP.hasOwnProperty(gaugeType) ? $GAGUE_TYPE_PROP[gaugeType] : undefined ; 
        if (!gaugeProp) { return } ; 
        Object.keys(gaugeProp).forEach (function (prop) {           
          me.setProperty(prop ,gaugeProp[prop] ,  {suppressData:true}); 
        })
        
      } ,
      plot() {  
        // const graphicModels = this.getGraphicModels();
        var me =this ;  var container = this.domNode ; //  
        const contSizeProp =   this.domNode.clientWidth > this.domNode.clientHeight ? this.domNode.clientHeight : this.domNode.clientWidth ;   
          this.setDefaultPropertyValues({
            gaugetype : $GAUGE_TYPE.BASIC , 
            linecolor :  {fillColor:  "#E6EBF8"  , fillAlpha : 100} ,  
            progcolor :  {fillColor:  "#1C8DD4"  , fillAlpha : 100} ,   
            fillColor1 :  {fillColor:  "#67e0e3"  , fillAlpha : 100} ,   
            fillColor2 :  {fillColor:  "#37a2da"  , fillAlpha : 100} ,   
            fillColor3 :  {fillColor:  "#fd666d"  , fillAlpha : 100} ,   
            islabelfont : "true", 
            isprogress : "true", 
            istitlefont:  "false", 
            isaxisfont:  "false", 
            isroundcap : "true" , 
            ispointer : "false" , 
            issplit : "false" , 
            isshadow : "true" , 
            isanimation : "true" , 
            splitnumber :  10, 
            splitborder  : {lineColor: "#63677A" , lineStyle : $LINETYPE.THIN } , 
            splitlength : 10 , 
            labelFont :{ fontSize: calcRelativeSize(9,30, contSizeProp) + 'pt', fontFamily: 'Open Sans',  fontWeight : false ,  fontColor: '#4a4a4a' }  , 
            labelcenterleft :0 , 
            labelcentertop : 20, 
            titlecenterleft :0 , 
            titlecentertop : 0, 
            titleFont :{ fontSize:  calcRelativeSize(9,20, contSizeProp) + 'pt',  fontFamily: 'Open Sans',  fontWeight : false ,  fontColor: '#4a4a4a' }  , 
            axisFont :{ fontSize: '14pt', fontFamily: 'Open Sans',  fontWeight : false ,  fontColor: '#999' }  ,
            istick : "false" , 
            ticknumber : 5 , 
            tickborder  :  {lineColor: "#63677A" , lineStyle : $LINETYPE.THIN } , 
            ticklength : 6  ,     
            targetlength : 10, 
            targetwidth : 3 , 
            targetcolor :  {fillColor:  "#c8e6b9"  , fillAlpha : 100} ,                
            lineWidth :  calcRelativeSize(14,24, contSizeProp) ,
            startAngle : 225 , 
            endAngle : -45   , 
            gaugemin : 0 , 
            gaugemax : 100 , 
            centerleft  : 50 , 
            centertop  : 50 , 
            radius : 100 ,     
            pointericon : $POINTER.DEFAULT , 
            pointerlength : 60, 
            pointerwidth :  calcRelativeSize(4,6, contSizeProp)  , 
            pointeroffset :30 ,    
            // Threshold 
            t1Enable : "false" ,  l1 : 0 , h1 : 33 ,  
            t2Enable : "false" ,  l2 : 33 , h2 : 66 , 
            t3Enable : "false" ,  l3 : 66 , h3 : 100 , 
            });
   
       function isTrue (prop) { return prop == "true" ?  true : false ;} 

       var propGaugeType = this.getProperty("gaugetype"); 
       var propLineColor = this.getProperty("linecolor").fillColor ; 
       var propProgressColor = this.getProperty("progcolor").fillColor ;           
       var propLineWidth = parseFloat(this.getProperty("lineWidth"));
       var propStartAngle =  parseFloat(this.getProperty("startAngle"));
       var propEndAngle =  parseFloat(this.getProperty("endAngle")  );
       var propCenterleft=  parseFloat(this.getProperty("centerleft"));
       var propCentertop =  parseFloat(this.getProperty("centertop"));       
       var propisLabelFont  =isTrue( this.getProperty("islabelfont")) 
       var propisProgress  =isTrue( this.getProperty("isprogress")) 
       var propisTitleFont  = isTrue(this.getProperty("istitlefont"))
       var propisAxisFont  =isTrue( this.getProperty("isaxisfont")) 
       var propisRoundCap  =isTrue( this.getProperty("isroundcap"))  
       var propisPointer  =isTrue( this.getProperty("ispointer"))   
       var propisSplit  =isTrue( this.getProperty("issplit"))  
       var propisShadow  =isTrue( this.getProperty("isshadow"))  
       var propisAnimation  =isTrue( this.getProperty("isanimation"))  
       var propSplitBorder   = getBorderStyle (this.getProperty("splitborder") ); 
       var propSplitLength = parseInt ( this.getProperty("splitlength")) ;  
       var propSplitNumber = parseInt( this.getProperty("splitnumber")) ;  
       var propisTick  =isTrue( this.getProperty("istick"))  
       var propTickBorder   = getBorderStyle (this.getProperty("tickborder") ); 
       var propTickLength = parseInt ( this.getProperty("ticklength")) ; 
       var propTickNumber = parseInt( this.getProperty("ticknumber")) ;       
       var propTargetLength =  this.getProperty("targetlength")  ; 
       var propTargetWidth = parseInt( this.getProperty("targetwidth")) ;  
       var propTargetColor =  this.getProperty("targetcolor").fillColor // "#c8e6b9" ; 
       var propTitleFont  = getFontStyle(this.getProperty("titleFont")) ; 
       var proplabelFont =  getFontStyle( this.getProperty("labelFont")) ; 
       var propaxisFont =  getFontStyle( this.getProperty("axisFont")) ;        
       var propLabelCenterLeft  = parseInt ( this.getProperty("labelcenterleft"))    ; 
       var propLabelCenterTop  = parseInt ( this.getProperty("labelcentertop"))    ; 
       var propTitleCenterLeft  = parseInt ( this.getProperty("titlecenterleft"))    ; 
       var propTitleCenterTop  = parseInt ( this.getProperty("titlecentertop"))    ; 
       var propGaugeMin  = parseFloat ( this.getProperty("gaugemin"))  
       var propGaugeMax  = parseFloat (  this.getProperty("gaugemax")) 
       var propRadius = parseFloat (  this.getProperty("radius"))  
       var propPointerIcon = this.getProperty("pointericon") ;
       var propPointerLength =  this.getProperty("pointerlength")  ; 
       var propPointerWidth  = parseInt( this.getProperty("pointerwidth")) ;  
       var propPointerOffset = parseInt( this.getProperty("pointeroffset")) ;  
 
       // Threshold Format 
      var propT1 = isTrue( this.getProperty("t1Enable")) ;  
      var propT1L1 = this.getProperty("l1") ; 
      var propT1H1 = this.getProperty("h1") ;  
      var propT1Color = this.getProperty("fillColor1").fillColor ;  
      var propT2 = isTrue( this.getProperty("t2Enable")) ;  
      var propT2L1 = this.getProperty("l2") ; 
      var propT2H1 = this.getProperty("h2") ;  
      var propT2Color = this.getProperty("fillColor2").fillColor ;  
      var propT3 =isTrue(  this.getProperty("t3Enable")) ;  
      var propT3L1 = this.getProperty("l3") ; 
      var propT3H1 = this.getProperty("h3") ;  
      var propT3Color = this.getProperty("fillColor3").fillColor ;   

      var myChart ; 
      myChart =echarts.getInstanceByDom(container) ? echarts.getInstanceByDom(container)  :  echarts.init(container,null , {renderer:'canvas'});   
      myChart.resize() ; 
       // myChart = echarts.init(container,null , {renderer:'canvas'});   
         var option =  {
           tooltip : {
            formatter: function ( params ) {
                return   params.name + ' : ' + params.data.formatvalue ;
            }
           }, 
           animation : propisAnimation ,  
           series: [{
              type: 'gauge',
              center : [ '50%' , '50%'] ,
              radius : '100%' , // String(propRadius) + '%' ,  
              itemStyle: {
                   color: '#58D9F9',
                   shadowColor: 'rgba(0,138,255,0.45)',
                   shadowBlur: 10,
                   shadowOffsetX: 2,
                   shadowOffsetY: 2
               },
               progress: {
                   show: true,
                   roundCap: true  ,
                   width: 36
               },           
               axisLine: {
                   roundCap: true ,
                   lineStyle: {},   
                   shadowBlur: 10,
                   shadowOffsetX: 2,
                   shadowOffsetY: 2
               },
               pointer : {                 
               }, 
               axisTick: {
                 show : false ,     
                 lineStyle : {}              
               },
               splitLine: {     
                  distance : 0    , 
                  lineStyle: {
                    width: 2,
                    color: '#999'
                }
               },
               axisLabel: {},
               title: {},
               detail: {                   
                   valueAnimation: true,                                
               }, 
               data: [{
                   value: 50 , 
                   name : "Sample Data"
               }]
           }]
       };  
       
 

       function setFontEchart(soption, fontFormat) {
        soption.color = fontFormat.color    
        soption.fontWeight = fontFormat.fontWeight   
        soption.fontStyle = fontFormat.fontStyle   
        soption.fontFamily = fontFormat.fontFamily   
        soption.fontSize =  fontFormat.fontSize      
      } 
      function setBorderEchart(lineStyle, border) {
        lineStyle.color = border.lineColor ; 
        lineStyle.width = border.width ; 
        lineStyle.type = border.type 
        }

      var series = option.series[0] ; 
       // metric format 
      var  mPattern  = me.dataInterface.data.nf.length  > 0 ?  me.dataInterface.data.nf[0].nfs.split(";")[0] : "";   
           mPattern = mPattern.replace(/\"/g,"") ;
      var labelPattern  = mPattern; 
        if (/\[.+\]/.test (mPattern))  // M , K shrink
        {          
          labelPattern =mPattern.replace(/(\[.+\])([#,0.]+)(.+)/g,"$2a") ;
        }
       // Detail Format 
       series.detail.show = propisLabelFont  
       setFontEchart (series.detail, proplabelFont)   
      series.detail.offsetCenter = [propLabelCenterLeft +"%" , propLabelCenterTop + "%"  ]
              
       // Title Format      
       series.title.show =  propisTitleFont ; 
       setFontEchart (series.title, propTitleFont)  ;
       // series.title.offsetCenter = [0, '-10%' ] ;
       series.title.offsetCenter =  [propTitleCenterLeft +"%" , propTitleCenterTop + "%"  ]  
 
       
       // Axis Format 
       series.axisLabel.show =  propisAxisFont ; 
       series.axisLabel.distance =  propLineWidth  + (propisSplit ? 10 :0) ; 
       setFontEchart (series.axisLabel,  propaxisFont) ;
       series.axisLabel.formatter =   function (value) {        
         // Hide min axis for circle type 
        return (Math.abs (propEndAngle - propStartAngle) >= 360 && value == series.min) ? "" :  numeral ( value ).format(labelPattern) ;
      }   

            
            

      // Split Line 
      series.splitLine.show = propisSplit    
      series.splitNumber = propSplitNumber
      setBorderEchart(series.splitLine.lineStyle , propSplitBorder ) ;
      series.splitLine.length = propSplitLength ;  

      // Tick LIne 
      series.axisTick.show  = propisTick ; 
      series.axisTick.splitNumber = propTickNumber ;
      setBorderEchart(series.axisTick.lineStyle , propTickBorder ) ;
      series.axisTick.length  = propTickLength ;  
      
      // Pointer 
      series.pointer.show = propisPointer  , 
      series.pointer.offsetCenter = [0, '-'+propPointerOffset +'%']  
      series.pointer.length =   propPointerLength+'%'  
      series.pointer.icon = propPointerIcon ;  
      series.pointer.width = propPointerWidth  
      
       
       // Guage Format 
       series.startAngle = propStartAngle ;
       series.endAngle = propEndAngle ;   
       series.progress.width =  propLineWidth ;
       series.progress.show =  propisProgress ;
       series.progress.roundCap =  propisRoundCap ;
       series.axisLine.lineStyle.width = propLineWidth ; 
       series.axisLine.roundCap = propisRoundCap ; 
       series.center = [ String(propCenterleft) + '%' , String(propCentertop) + '%'] ,
       series.radius = String(propRadius) + '%' ,  
       series.axisLine.lineStyle.shadowColor  =  hexToRGB(propLineColor, propisShadow ? 45 :0 ) ; 
       series.itemStyle.color = propProgressColor ;  
       series.itemStyle.shadowColor =  hexToRGB (propProgressColor, propisShadow ? 45 :0 ) ;  

       // Threshold Color Create 
       var colorArray = [] ; 


       function getColor(l1,h1,color, curr) { 
         var colorA = [] ; 
        if ( curr.findIndex ( e=> e[0] == l1)<0) {
          colorA.push([l1/100,propLineColor])  
        } 
        // colorA.push([l1/100,color])  
        colorA.push([h1/100,color]) 
        return colorA ;  
      }
      if (propT1){         
         colorArray = colorArray.concat (getColor(propT1L1,propT1H1, propT1Color , colorArray )  ) ; 
       }
       if (propT2){
         colorArray = colorArray.concat (getColor(propT2L1,propT2H1, propT2Color, colorArray ) ) ; 
       }
       if (propT3){
         colorArray =  colorArray.concat (getColor(propT3L1,propT3H1, propT3Color, colorArray ) ) ; 
       }
      if ( colorArray.findIndex(e=>e[0]==0) <0 ) {
        colorArray.push ([0,propLineColor])
      }
      if ( colorArray.findIndex(e=>e[0]==1) <0 ) {
        colorArray.push ([1,propLineColor])
      }           
       colorArray.sort(function(a,b) {
         return a[0]-  b[0] ; 
       })
       /* colorArray = colorArray.reduce(function (acc, e,i,curr) {
           if (i==0 ) {
            acc.push (e) ; 
           }
           else {
            if (acc.findIndex (t=>t[0] == e[0])>= 0 && e[1]==propLineColor )   {
              return acc ; 
            }  
            else {
              acc.push(e) ; 
            }
          }
          return acc ; 
       } , [])     */  

       if (!propT1 && !propT2 && !propT3) {
              series.axisLine.lineStyle.color  = [[1, propLineColor]] ; 
       } 
       else {
         if (colorArray[0][0] > 0 ) 
         {
           colorArray.unshift ([0,propLineColor]);
         }
         if (colorArray[colorArray.length-1][0] < 1 ) 
         {
           colorArray.push ([1,propLineColor]);
         }   
         series.axisLine.lineStyle.color= colorArray ; 
       }

       
       if ( me.dataInterface.getTotalCols()  == 0 ) {  
        series.itemStyle.opacity = 0.2 ; 
        series.axisLine.lineStyle.opacity = 0.2 ; 
        series.detail.formatter = "Sample Data" ;        
        myChart.setOption(option ,true );        
        throw 'ERROR' 
        return 
      } 

      // Call Data 
      me.vizData = me.getVizData () 
      var vizData = me.vizData ; 
       // Set Data
       series.detail.formatter =  vizData.values[0].Value.value.v
       series.data[0].value = vizData.values[0].Value.value.rv 
       series.data[0].formatvalue  = vizData.values[0].Value.value.v
       series.data[0].name = vizData.values[0].Value.name   
       // Set Min Max data  
       series.min = vizData.values[0].Min.value ? vizData.values[0].Min.value.rv : propGaugeMin ; 
       series.max = vizData.values[0].Max.value ? vizData.values[0].Max.value.rv  : propGaugeMax ; 



      // Target Series 
      var tSeries = {
        type : 'gauge',
        id : 'target' , 
        z : 100 , 
        axisLine : {show :false } ,
        animation : false , 
        progress : {show :false } ,
        splitLine : {show :false } ,
        axisTick : {show :false } ,
        axisLabel : {show :false } ,
        title : {show :false } , 
        detail : {show :false } , 
        pointer : {
          icon : 'rect', 
          offsetCenter : [0,'-100%' ] , 
          itemStyle : {}
        } , 
        data: [{}]
      } 
      if ( vizData.values[0].Target.value !== undefined ) {
        tSeries.min = series.min 
        tSeries.max = series.max 
        tSeries.radius = series.radius    
        tSeries.center = series.center    
        tSeries.startAngle = series.startAngle    
        tSeries.endAngle = series.endAngle     ; 
        // Set Data
        tSeries.data[0].value = vizData.values[0].Target.value  ? vizData.values[0].Target.value.rv : "" ; 
        tSeries.data[0].formatvalue  = vizData.values[0].Target.value  ?  vizData.values[0].Target.value.v : "" ; 
        tSeries.data[0].name = vizData.values[0].Target.value  ? vizData.values[0].Target.name : ""
        // Target Point Format  
        
        tSeries.pointer.itemStyle.color = propTargetColor ;
        tSeries.pointer.width = propTargetWidth ;
        tSeries.pointer.length = '-' +  propTargetLength + '%' ;
        if ( vizData.values[0].Target.value ) {
          option.series[1] =  tSeries ;
        }       
      }

      me.myChart = myChart ;       
      myChart.setOption(option ,true );
     
      myChart.on("finished",function(){
        me.raiseEvent({
          name: 'renderFinished',
          id: me.k
        });  
      }) ; 
 
      myChart.on('click', function (params) {       
        params.event.event.stopPropagation();
        params.event.event.preventDefault();
      }); 
     
     myChart.on('mouseover',function(params){ 
     params.event.event.stopPropagation();
     params.event.event.preventDefault();
    });  
      myChart.on('mousemove',function(params){
        params.event.event.stopPropagation();
        params.event.event.preventDefault(); 
      }) ;

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
   
         function hexToRGB (hex, alpha) { 
           if (!hex) {
               return "transparent" ; 
           }
           if (hex == "transparent") {
               return "transparent" ; 
           }
           var r = parseInt(hex.slice(1, 3), 16);
           var g = parseInt(hex.slice(3, 5), 16);
           var b = parseInt(hex.slice(5, 7), 16);              
           if (alpha >= 0) {
             return "rgba( "+r+","+g+","+b+"," + parseInt(alpha) /100 +")";
           } else {
             return "rgba( "+r+","+g+","+b +" )";
           }
         }  
       },
  },
);
