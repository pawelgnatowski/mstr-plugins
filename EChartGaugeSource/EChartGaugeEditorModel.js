mstrmojo.requiresCls('mstrmojo.vi.models.editors.CustomVisEditorModel');

const { WIDGET_TYPE: $WT } = mstrmojo.vi.models.editors.CustomVisEditorModel;
const $LINETYPE = {NONE: 99, THIN: 1, THICK: 2, DASHED: 3, DOTTED: 4} ;  
const $POINTER = {DEFAULT : '', CIRCLE : "circle" ,RECT : 'rect', ROUNDRECT : 'roundRect', TRIANGLE : 'triangle', DIAMOND : 'diamond', PIN : 'pin', ARROW : 'arrow'  ,  }
const $GAUGE_TYPE = {Basic : 'Basic Gauge', Half : 'Half Gauge' , Circle : "Circle" , Left : "Left Half", Right : "Right Half" }
const desci18n = function (number,text){  
  return mstrmojo.desc("EChartGauge." + String(number) ,text).replace(/^\[+|\]+$/g , "")  
} 
mstrmojo.plugins.EChartGauge.EChartGaugeEditorModel = mstrmojo.declare(
  mstrmojo.vi.models.editors.CustomVisEditorModel,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartGauge.EChartGaugeEditorModel',
    cssClass: 'echartgauge-editor-model',
    getCustomProperty() { 
      var host = this.getHost()
      /* 
      function checkThresholdVal(propertyName , newValue) {
          if ( newValue  - host.getProperty(propertyName)>0)
          { 
          //  host.setProperty(propertyName,newValue,{suppressData : true }) 
          }
      }  */

      return [
        {
          name: desci18n (1,'Gauge Basic') , //설정 
          value: [
             {  // Gauge Style Config. 
              style: $WT.EDITORGROUP,
              items: [  
                {
                  style: $WT.TWOCOLUMN,
                  items: [
                    {
                      style: $WT.LABEL,
                      name: "text",                 
                      labelText: desci18n (29,'Gauge Style'), //"Predefinded Type" , 
                    },
                    {
                      style: $WT.PULLDOWN,
                      width: "65%",
                      propertyName: "gaugetype",                      
                      items: [
                        {name :  desci18n (31,'Basic') ,value: "Basic"  } ,
                        {name :  desci18n (32,'Half Circle') ,value:"Half"} , 
                        {name :  desci18n (33,'Circle'),value: "Circle" } ,
                        {name :  desci18n (34,'Left Gauge'),value: "Left" } ,
                        {name :  desci18n (35,'Right Gauge'),value: "Right" } 
                      ] , 
                      config : {
                       suppressData: true , 
                       callback: function () 
                       {
                           host.setGaugeType() ;
                           host.refresh();
                       }
                     } 
                    }, 
                  ]
                } 
              ]
            },   
            {
              style: $WT.EDITORGROUP,
              items: [  
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'isroundcap', 
                  labelText: desci18n (9,'Round Edge') , // "선둥굴게" , 
                 },
                 {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'isprogress', 
                  labelText: desci18n (30,'Show Progress') , // "진행바" , 
                 },
                 {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'ispointer', 
                  labelText: desci18n (10,'Show Pointer') , //"포인터표시" , 
                 } ,     
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'islabelfont',
                  labelText: desci18n (14,'Show Metric Value') , //"데이터값" , 
                } , 
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'istitlefont',
                  labelText: desci18n (17,'Show Metric Name') , //"메트릭이름" , 
                },    
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'isaxisfont',
                  labelText: desci18n (20,'Show Axis Text') ,// "축텍스트" , 
                },    
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'isshadow',
                  labelText: desci18n (28,'Show Shadow') ,// 
                }, 
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'isanimation',
                  labelText: desci18n (36,'Animation') ,// 
                }, 
              ]
            }, 
            {
              style: $WT.EDITORGROUP,
              items: [  
                {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text", 
                  width: "40%",
                  labelText: desci18n (2,'Color') , //"색상"  
                }, {
                  style: $WT.FILLGROUP,
                  width: "60%",
                  propertyName: "linecolor",
                  items: [{                  
                    childName: "fillAlpha",
                    disabled: true
                  }],                 
                }]
              },
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text", 
                  width: "40%",
                  labelText: desci18n (3,'Gauge Color') , //"게이지색"  
                }, {
                  style: $WT.FILLGROUP,
                  width: "60%",
                  propertyName: "progcolor",
                  items: [{                  
                    childName: "fillAlpha",
                    disabled: true
                  }],                 
                }]
              },  
              {
                style: $WT.TWOCOLUMN,
                items: [                
                  {
                  style: $WT.LABEL,
                  width : "60%" , 
                  labelText: desci18n (4,'Gauge Width') , //"게이지두께", 
                  }
                , {
                  style: $WT.STEPPER,
                  propertyName: 'lineWidth',
                  width: "40%",
                  min : 10 , max : 200 
                }]
              }, 
              {
                style: $WT.TWOCOLUMN,
                items: [                
                  {
                  style: $WT.LABEL,
                  width : "60%" , 
                  labelText: desci18n (5,'Start Angle˚') // "시작각", 
                  }
                , {
                  style: $WT.STEPPER,
                  propertyName: 'startAngle',
                  width: "40%",
                  min : -360 , max :360 
                }]
              },
              {
                style: $WT.TWOCOLUMN,
                items: [                
                  {
                  style: $WT.LABEL,
                  width : "60%" , 
                  labelText: desci18n (6,'End Angle˚') // "종료각", 
                  }
                , {
                  style: $WT.STEPPER,
                  propertyName: 'endAngle',
                  width: "40%",
                  min : -360 , max : 360 
                }]
              }
              , // Angle  
               
              {
              style: $WT.TWOCOLUMN,
              items: [                
                {
                style: $WT.LABEL,
                width : "60%" , 
                labelText: desci18n (7,'Gauge Minimum') // "최소", 
                }
              ,
              {
                style: $WT.TEXTBOX,                
                width : "40%" , 
                propertyName: "gaugemin"
              }]
            },
              {
              style: $WT.TWOCOLUMN,
              items: [                
                {
                style: $WT.LABEL,
                width : "60%" , 
                labelText: desci18n (8,'Gauge Maximum') , // "최대", 
                }
              ,
              {
                style: $WT.TEXTBOX,
                width : "40%" , 
                propertyName: "gaugemax"
              }]
            }, 
            {
              style: $WT.TWOCOLUMN,
              items: [                
                {
                style: $WT.LABEL,
                width : "60%" , 
                labelText: desci18n (11,'Left Margin%') , //"여백왼쪽%",                   
                }
              ,
              {
                style: $WT.STEPPER,
                width : "40%" , 
                min : -100 ,  
                max : 100 ,   
                propertyName: "centerleft"
              }]
            },
            {
              style: $WT.TWOCOLUMN,
              items: [                
                {
                style: $WT.LABEL,
                width : "60%" , 
                labelText: desci18n (12,'Top Margin%') , //"여백상단%",  
                }
              ,
              {
                style: $WT.STEPPER,
                width : "40%" , 
                min : -100 ,  
                max : 100 , 
                propertyName: "centertop"
              }]
            }, 
            {
              style: $WT.TWOCOLUMN,
              items: [                
                {
                style: $WT.LABEL,
                width : "60%" , 
                labelText:desci18n (13,'Gauge Size%') , // "게이지사이즈%",                   
                }
              ,
              {
                style: $WT.STEPPER,
                width : "40%" , 
                min : 0 ,  
                max : 200 ,  
                propertyName: "radius"
              }]
            }               
            ]
            },  
            
            {
              style: $WT.EDITORGROUP,
              items: [
                  {
                    style: $WT.LABEL,
                    name: "text",
                    width: "100%",
                    labelText: desci18n (21,'Split Line & Tick'), // "나눔선 및 틱 포맷:"
                }, 
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'issplit',                        
                  labelText:  desci18n (22,'Show Split Line'), // "나눔선 표시" , 
                
                }, 
                {
                  style: $WT.TWOCOLUMN,                  
                  items: [                
                    {
                    style: $WT.LABEL,
                    width : "60%" , 
                    labelText: desci18n (23,'Split Number'), // "갯수",
                    disabled: host.getProperty('issplit') === 'false',        
                    }
                  ,
                  {
                    style: $WT.STEPPER,
                    width : "40%" , 
                    min : 1 ,  
                    max : 100 ,   
                    propertyName: "splitnumber" , 
                    disabled: host.getProperty('issplit') === 'false', 
                  }]
                },
                {
                  style: $WT.TWOCOLUMN,
                  items: [{
                    style: $WT.LABEL,
                    name: "text",
                    width: "20%",
                    labelText: desci18n (24,'Format'), // "포맷"
                  }, 
                  {
                    style: $WT.TWOCOLUMN,
                    width: "80%",                    
                    items: [{
                      style: $WT.STEPPER, disabled: host.getProperty('issplit') === 'false',
                      width: "30%",
                      min : 0 , max : 10 , 
                      propertyName: "splitlength"
                    }, 
                    {
                      style: $WT.LINEGROUP, disabled: host.getProperty('issplit') === 'false',
                      width: "70%",
                      propertyName: "splitborder"
                    }]
                  } ]
                } ,
                {
                  style: $WT.CHECKBOXANDLABEL,
                  propertyName: 'istick',                        
                  labelText: desci18n (25,'Show Tick'), // "틱표시" , 
                },
                {
                  style: $WT.TWOCOLUMN,                  
                  items: [                
                    {
                    style: $WT.LABEL,
                    width : "60%" , 
                    labelText: desci18n (26,'Tick Number'), //  "갯수",                   
                    }
                  ,
                  {
                    style: $WT.STEPPER,
                    width : "40%" , 
                    disabled: host.getProperty('istick') === 'false',
                    min : 0 ,  
                    max : 20 ,   
                    propertyName: "ticknumber"
                  }]
                }  
                ,
                {
                  style: $WT.TWOCOLUMN,
                  items: [{
                    style: $WT.LABEL,
                    name: "text",
                    width: "20%",
                    labelText: desci18n (27,'Format'), // "포맷" 
                  }, 
                  {
                    style: $WT.TWOCOLUMN,
                    width: "80%",
                    items: [ 
                       {
                      style: $WT.STEPPER,  disabled: host.getProperty('istick') === 'false',
                      width: "30%",
                      min : 0 , max : 10 , 
                      propertyName: "ticklength"
                    },
                    {
                      style: $WT.LINEGROUP,  disabled: host.getProperty('istick') === 'false',
                      width: "70%",
                      propertyName: "tickborder"
                    }]
                  } 
                ]
                } ,               
                ]
            },
            ]
          },          
        {
          name: desci18n (100,'Gauge Detail'), // '게이지상세',
          value: [            
           
            {
              style: $WT.EDITORGROUP,
              items: [
                {
                  style: $WT.TWOCOLUMN,
                  items: [
                    {
                      style: $WT.LABEL,
                      name: "text",                 
                      labelText: desci18n (101,'Pointer Shape'), //"포인터포맷" , 
                    },
                    {
                      style: $WT.PULLDOWN,
                      width: "65%",
                      propertyName: "pointericon",
                      disabled: host.getProperty('ispointer') === 'false',
                      items: [
                        {name : 'Default' ,value: $POINTER.DEFAULT  } ,
                        {name : $POINTER.ROUNDRECT ,value: $POINTER.ROUNDRECT  } ,
                        {name : $POINTER.CIRCLE ,value: $POINTER.CIRCLE  } ,
                        {name : $POINTER.TRIANGLE ,value: $POINTER.TRIANGLE  } ,
                        {name : $POINTER.RECT ,value: $POINTER.RECT  } ,
                      ]  
                    }, 
                  ]
                } , 
                {
                  style: $WT.TWOCOLUMN,
                  items: [
                    {
                      style: $WT.TWOCOLUMN,
                      width : '50%' ,
                      items: [{
                        style: $WT.LABEL,
                        name: "text",
                        width: "40%",
                        labelText: desci18n (102,'Length%'), //"길이%"
                      }, {
                        style: $WT.STEPPER ,  
                        width: "60%",
                        min : 0 , max : 100 , 
                        disabled: host.getProperty('ispointer') === 'false',
                        propertyName: "pointerlength" 
                      }]
                    } ,
                      {
                      style: $WT.TWOCOLUMN,
                      width : '50%' ,
                      items: [{
                        style: $WT.LABEL,
                        name: "text",
                        width: "40%",
                        disabled: host.getProperty('ispointer') === 'false',
                        labelText:  desci18n (103,'Width'), //"폭"
                      }, {
                        style: $WT.STEPPER,  
                        width: "60%",
                        min : 0 , max : 100 , 
                        disabled: host.getProperty('ispointer') === 'false',
                        propertyName: "pointerwidth"
                      }]
                    } ]
                },
                {
                  style: $WT.TWOCOLUMN,
                  width : '50%' ,
                  items: [{
                    style: $WT.LABEL,
                    name: "text",
                    width: "40%",
                    labelText:  desci18n (104,'Position%'), //"위치%"
                  }, {
                    style: $WT.STEPPER ,  
                    width: "60%",
                    min : 0 , max : 100 , 
                    disabled: host.getProperty('ispointer') === 'false',
                    propertyName: "pointeroffset"
                  }]
                } ,
              ]
            },
            {
              style: $WT.EDITORGROUP,
              items: [
                {
                  style: $WT.LABEL,
                  name: "text",                 
                  labelText:  desci18n (105,'Target Format'), //"목표 표시" , 
                },                   
                {
                  style: $WT.TWOCOLUMN,
                  items: [
                    {
                      style: $WT.TWOCOLUMN,
                      width : '50%' ,
                      items: [{
                        style: $WT.LABEL,
                        name: "text",
                        width: "40%",
                        labelText:  desci18n (106,'Length%'), //"길이%"
                      }, {
                        style: $WT.STEPPER ,  
                        width: "60%",
                        min : 0 , max : 100 , 
                        propertyName: "targetlength"
                      }]
                    } ,
                      {
                      style: $WT.TWOCOLUMN,
                      width : '50%' ,
                      items: [{
                        style: $WT.LABEL,
                        name: "text",
                        width: "40%",
                        labelText:  desci18n (107,'Width'), //"폭"
                      }, {
                        style: $WT.STEPPER,  
                        width: "60%",
                        min : 0 , max : 100 , 
                        propertyName: "targetwidth"
                      }]
                    } ]
                },
                {
                  style: $WT.TWOCOLUMN,
                  disabled: host.getProperty('istarget') === 'false',
                  items: [{
                      style: $WT.LABEL,
                      name: "text",
                      width: "25%",
                      labelText:  desci18n (108,'Color'), //"색상:"
                  }, {
                      style: $WT.FILLGROUP,
                      width: "70%",
                      propertyName: "targetcolor",
                      items: [{
                          childName: "fillAlpha",
                          disabled: true
                      }]
                      ,disabled: host.getProperty('istarget') === 'false',
                  }]
              }, 
                
                ]
            },
 
              {
                  style: $WT.EDITORGROUP,
                  items: [
                    {
                      style: $WT.LABEL,
                      name: "text",
                      width: "100%",
                      labelText:  desci18n (120,'Gauge Threshold'), //"게이지포맷:"
                  },
                    
                    {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 't1Enable',
                    labelText:  desci18n (121,'Threshold A') , // '색상 범위 A'
                   },  
                   {//group1
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t1Enable') === 'false',
                      items: [{
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText: desci18n (122,'Start %') , // "시작 %"
                          }, {
                              style: $WT.STEPPER,
                              width: "50%",
                              min : 0 , max : host.getProperty('h1') ,
                              propertyName: "l1" , 
                              disabled: host.getProperty('t1Enable') === 'false',
                                
                          }]
                      }, {
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText:  desci18n (123,'End %') , //"끝 %"
                          }, {
                              style:  $WT.STEPPER,
                              width: "50%",
                              min :  host.getProperty('l1')   , max :  host.getProperty('l2') ,
                              propertyName: "h1" , 
                              disabled: host.getProperty('t1Enable') === 'false',
                                                            
                          }]
                      }]
                  }, 

                {
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t1Enable') === 'false',
                      items: [{
                          style: $WT.LABEL,
                          name: "text",
                          width: "25%",
                          labelText:   desci18n (108,'Color'), //""
                      }, {
                          style: $WT.FILLGROUP,
                          width: "70%",
                          propertyName: "fillColor1",
                          items: [{
                              childName: "fillAlpha",
                              disabled: true
                          }]
                          ,disabled: host.getProperty('t1Enable') === 'false',
                      }]
                  }, 
                  {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 't2Enable',
                    labelText: desci18n (125,'Threshold B') , // '색상 범위 B'
                  },
                   {//group2
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t2Enable') === 'false',
                      items: [{
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText: desci18n (122,'Start %') , // "시작 %"
                          }, {
                            style: $WT.STEPPER,
                            width: "50%",
                            min : host.getProperty('h1')  , max :  host.getProperty('h2') ,
                              propertyName: "l2" , 
                              disabled: host.getProperty('t2Enable') === 'false',
                           
                          } 
                        ]
                      }, {
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText: desci18n (123,'End %') , //"끝 %"
                          }, {
                              style: $WT.STEPPER,
                              width: "50%",
                              min : host.getProperty('l2')  , max :  host.getProperty('l3') ,
                              propertyName: "h2" , 
                              disabled: host.getProperty('t2Enable') === 'false',
                         
                          }]
                      }]
                  }, {
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t2Enable') === 'false',
                      items: [{
                          style: $WT.LABEL,
                          name: "text",
                          width: "25%",
                          labelText: desci18n (108,'Color'), //"색상:",
                      }, {
                          style: $WT.FILLGROUP,
                          width: "70%",
                          propertyName: "fillColor2",
                          items: [{
                              childName: "fillAlpha",
                              disabled: true
                          }]
                          ,disabled: host.getProperty('t2Enable') === 'false',
                      }]
                  }, 
                  {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 't3Enable',
                    labelText: desci18n (126,'Threshold C') , // '색상 범위 C'
                  }
                  , {
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t3Enable') === 'false',
                      items: [{
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText: desci18n (122,'Start %') , // "시작 %"
                          }, {
                              style: $WT.STEPPER,
                              width: "50%",
                              min :  host.getProperty('h2') , max :  host.getProperty('h3') ,
                              propertyName: "l3" , 
                              disabled: host.getProperty('t3Enable') === 'false',
                            
                          }]
                      }, {
                          style: $WT.TWOCOLUMN,
                          width: "50%",
                          items: [{
                              style: $WT.LABEL,
                              width: "50%",
                              name: "text",
                              labelText: desci18n (123,'End %') , //"끝 %"
                          }, {
                              style: $WT.STEPPER,
                              width: "50%",
                              min :  host.getProperty('l3') , max : 100 ,
                              propertyName: "h3"
                          }]
                      }]
                  }, {//group 3
                      style: $WT.TWOCOLUMN,
                      disabled: host.getProperty('t3Enable') === 'false',
                      items: [{
                          style: $WT.LABEL,
                          name: "text",
                          width: "25%",
                          labelText: desci18n (108,'Color'), //"색상:"
                      }, {
                          style: $WT.FILLGROUP,
                          width: "70%",
                          propertyName: "fillColor3",
                          disabled: host.getProperty('t3Enable') === 'false',
                             items: [{
                              childName: "fillAlpha",
                              disabled: true
                          }]
                      }]
                  },]
              }]
      },
      {
        name: desci18n (200,'Gauge Font & Position') , //폰트
        value : [
             {
            style: $WT.EDITORGROUP,
            items: [  
              {
                style: $WT.LABEL,              
                labelText:  desci18n (201,'Metric Value Format & Position') ,
                }, 
                {
                    style: $WT.TWOCOLUMN,
                    items: [                
                      {
                      style: $WT.LABEL,
                      width : "50%" , 
                      labelText:  desci18n (202,'Left Margin%') , //"여백왼쪽%",                   
                      }
                    ,
                    {
                      style: $WT.STEPPER,
                      width : "50%" , 
                      min : -100 ,  
                      max : 100 ,   
                      propertyName: "labelcenterleft"
                    }]
                  },
                  {
                    style: $WT.TWOCOLUMN,
                    items: [                
                      {
                      style: $WT.LABEL,
                      width : "50%" , 
                      labelText: desci18n (203,'Top Margin%') , // "여백상단%",  
                      }
                    ,
                    {
                      style: $WT.STEPPER,
                      width : "50%" , 
                      min : -100 ,  
                      max : 100 , 
                      propertyName: "labelcentertop"
                    }]
                  },
                  {
                  style: $WT.CHARACTERGROUP,
                  propertyName: 'labelFont',
                  showFontStyle: true,
                  showFontSizeAndColor: true,
                  isFontSizeStepper: true ,  
                  disabled : this.getHost().getProperty("islabelfont") === "false" 
                  }
                ]
                }
                  , 
              {
                style: $WT.EDITORGROUP,
                items: [  
                  {
                    style: $WT.LABEL,                    
                    labelText:  desci18n (204,'Metric Name Format & Position') ,
                    }, 
                  {
                    style: $WT.TWOCOLUMN,
                    items: [                
                      {
                      style: $WT.LABEL,
                      width : "50%" , 
                      labelText: desci18n (205,'Left Margin%') , //"여백왼쪽%",                   
                      }
                    ,
                      {
                        style: $WT.STEPPER,
                        width : "50%" , 
                        min : -100 ,  
                        max : 100 ,   
                        propertyName: "titlecenterleft"
                      }]
                    },
                    {
                      style: $WT.TWOCOLUMN,
                      items: [                
                        {
                        style: $WT.LABEL,
                        width : "50%" , 
                        labelText: desci18n (206,'Top Margin%') ,// "여백상단%",  
                        }
                      ,
                      {
                        style: $WT.STEPPER,
                        width : "50%" , 
                        min : -100 ,  
                        max : 100 , 
                        propertyName: "titlecentertop"
                      }]
                    }, 
                    {
                      style: $WT.CHARACTERGROUP,
                      propertyName: 'titleFont',
                      showFontStyle: true,
                      showFontSizeAndColor: true,
                      isFontSizeStepper: true , 
                      disabled : this.getHost().getProperty("istitlefont") === "false" 
                      },  
                  ]
                } ,
                {
                  style: $WT.EDITORGROUP,
                  items: [  
                    {
                      style: $WT.LABEL,                    
                      labelText:  desci18n (207,'Axis Format') ,
                      },                                     
                    {
                    style: $WT.CHARACTERGROUP,
                    propertyName: 'axisFont',
                    showFontStyle: true,
                    showFontSizeAndColor: true,
                    isFontSizeStepper: true , 
                    disabled : this.getHost().getProperty("isaxisfont") === "false" 
                    } 
                  ]
                }  
            ],
          }        
      ];
    },
  },
);
