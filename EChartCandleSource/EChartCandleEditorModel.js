mstrmojo.requiresCls('mstrmojo.vi.models.editors.CustomVisEditorModel');

const { WIDGET_TYPE: $WT } = mstrmojo.vi.models.editors.CustomVisEditorModel;

mstrmojo.plugins.EChartCandle.EChartCandleEditorModel = mstrmojo.declare(
  mstrmojo.vi.models.editors.CustomVisEditorModel,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartCandle.EChartCandleEditorModel',
    cssClass: 'echartcandle-editor-model',
    getCustomProperty() {
      return [
        {
          name:  mstrmojo.desc("EChartCandle.1" ,"Candle Configuration").replace(/^\[+|\]+$/g , "")   ,
          value: [
            {
              style: $WT.EDITORGROUP,
              items: [
                {
                  style: $WT.TWOCOLUMN,
                  items: [{
                    style: $WT.LABEL,
                    name: "text", 
                    width: "45%",
                    labelText: mstrmojo.desc("EChartCandle.2" ,"Up Color").replace(/^\[+|\]+$/g , "")
                  }, {
                    style: $WT.FILLGROUP,
                    width: "55%",
                    propertyName: "upcolor",
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
                    width: "45%",
                    labelText: mstrmojo.desc("EChartCandle.3" ,"Down Color").replace(/^\[+|\]+$/g , "")
                  }, {
                    style: $WT.FILLGROUP,
                    width: "55%",
                    propertyName: "downcolor",
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
                    width : "65%" , 
                    labelText:  mstrmojo.desc("EChartCandle.21" ,"Candle Height(%)").replace(/^\[+|\]+$/g , ""), 
                    }
                  , {
                    style: $WT.STEPPER,
                    propertyName: 'candleheight',
                    width: "35%",
                    min : 1 , max : 100 
                  }]
                },
               /*  {
                  style: $WT.TWOCOLUMN,
                  items: [{
                    style: $WT.LABEL,
                    name: "text", 
                    width: "45%",
                    labelText: mstrmojo.desc("EChartCandle.20" ,"Border").replace(/^\[+|\]+$/g , "")
                  }, {
                    style: $WT.FILLGROUP,
                    width: "55%",
                    propertyName: "bordercolor",
                    items: [{
                      childName: "fillAlpha",
                      disabled: true
                    }],                 
                  }]
                } ,  */
                {
                  style: $WT.LABEL,
                  name: "MovAverageText" , 
                  width: "100%",
                  labelText: mstrmojo.desc("EChartCandle.19" ,"Moving Average Name").replace(/^\[+|\]+$/g , "") 
                } ,
                {
                  style: $WT.TEXTBOX,
                  width: "100%",
                  propertyName: "matext",                  
                } ,  
                // Moving Average 1
                {
                  style: $WT.TWOCOLUMN,
                  items: [                
                    {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 'MA1',
                    width : "65%" , 
                    labelText: mstrmojo.desc("EChartCandle.4" ,"Moving Average1" ).replace(/^\[+|\]+$/g , "") , 
                    }
                  , {
                    style: $WT.STEPPER,
                    propertyName: 'MA1V',
                    width: "35%",
                    min : 1 , max : 360 , 
                    disabled : this.getHost().getProperty('MA1') === "false" 
                  }]
                }, 
                // Moving Average 2
                
                {
                  style: $WT.TWOCOLUMN,
                  items: [ {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 'MA2',  width : "65%" ,  
                    labelText: mstrmojo.desc("EChartCandle.6" ,"Moving Average2" ).replace(/^\[+|\]+$/g , "")
                  }  ,  {
                    style: $WT.STEPPER,
                    propertyName: 'MA2V',
                    width: "35%",
                    min : 1 , max : 360 , 
                    disabled : this.getHost().getProperty('MA2') === "false" 
                  }]
                }, 
                // Moving Average 3
                
                {
                  style: $WT.TWOCOLUMN,
                  items: [ {
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 'MA3',width : "65%" , 
                    labelText: mstrmojo.desc("EChartCandle.7" ,"Moving Average3" ).replace(/^\[+|\]+$/g , "")
                  }  , {
                    style: $WT.STEPPER,
                    propertyName: 'MA3V',
                    width: "35%",
                    min : 1 , max : 360 , 
                    disabled : this.getHost().getProperty('MA3') === "false" 
                  }]
                }, 
                // Moving Average 4                
                {
                  style: $WT.TWOCOLUMN,
                  items: [{
                    style: $WT.CHECKBOXANDLABEL,
                    propertyName: 'MA4', width : "65%" , 
                    labelText: mstrmojo.desc("EChartCandle.8" ,"Moving Average4" ).replace(/^\[+|\]+$/g , "")
                  }  ,   {
                    style: $WT.STEPPER,
                    propertyName: 'MA4V',
                    width: "35%",
                    min : 1 , max : 360 , 
                    disabled : this.getHost().getProperty('MA4') === "false" 
                  }]
                },                                 
              ],
            },             
            {   // Format  
              style: $WT.EDITORGROUP,
              items: [{
                style: $WT.LABEL,
                name: "text",
                width: "100%",
                labelText: mstrmojo.desc("EChartCandle.11" ,"X Axis Format").replace(/^\[+|\]+$/g , "")
              }, 
              {
                style: $WT.CHECKBOXANDLABEL,
                propertyName: 'xAxisLabel',
                labelText: mstrmojo.desc("EChartCandle.12" ,"Show X Axis Label" ).replace(/^\[+|\]+$/g , "") , 
              }, 
              {
                style: $WT.CHARACTERGROUP,
                propertyName: 'xAxisLabelFont',
                showFontStyle: true,
                showFontSizeAndColor: true,
                isFontSizeStepper: true, 
                disabled : this.getHost().getProperty("xAxisLabel") === "false" 
              } , 
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.17" ,"Axis Border").replace(/^\[+|\]+$/g , "") 
                }, {
                  style: $WT.LINEGROUP,
                  width: "75%",
                  propertyName: "xAxisBorder"
                }]
              } , 
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.13" ,"Grid Border").replace(/^\[+|\]+$/g , "") 
                }, {
                  style: $WT.LINEGROUP,
                  width: "75%",
                  propertyName: "xBorder"
                }]
              } , 
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.14" ,"Banding").replace(/^\[+|\]+$/g , "")  
                }, {
                  style: $WT.FILLGROUP,
                  width: "65%",
                  propertyName: "xBandingColor",
                  items: [{
                    childName: "fillAlpha",
                    disabled: false 
                  }],
                }]
              } , 
              ]
            } , 
            {   // Format  
              style: $WT.EDITORGROUP,
              items: [{
                style: $WT.LABEL,
                name: "text",
                width: "100%",
                labelText: mstrmojo.desc("EChartCandle.15" ,"Y Axis Format").replace(/^\[+|\]+$/g , "")
              }, 
              {
                style: $WT.CHECKBOXANDLABEL,
                propertyName: 'yAxisLabel',
                labelText: mstrmojo.desc("EChartCandle.16" ,"Show Y Axis Label" ).replace(/^\[+|\]+$/g , "") , 
              }, 
              
              {
                style: $WT.CHARACTERGROUP,
                propertyName: 'yAxisLabelFont',
                showFontStyle: true,
                showFontSizeAndColor: true,
                isFontSizeStepper: true,
                disabled : this.getHost().getProperty("xAxisLabel") === "false" 
              } ,
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.17" ,"Axis Border").replace(/^\[+|\]+$/g , "") 
                }, {
                  style: $WT.LINEGROUP,
                  width: "75%",
                  propertyName: "yAxisBorder"
                }]
              } , 
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.13" ,"Grid Border").replace(/^\[+|\]+$/g , "") 
                }, {
                  style: $WT.LINEGROUP,
                  width: "75%",
                  propertyName: "yBorder"
                }]
              } , 
              
              {
                style: $WT.TWOCOLUMN,
                items: [{
                  style: $WT.LABEL,
                  name: "text",
                  width: "25%",
                  labelText:  mstrmojo.desc("EChartCandle.14" ,"Banding").replace(/^\[+|\]+$/g , "")  
                }, {
                  style: $WT.FILLGROUP,
                  width: "65%",
                  propertyName: "yBandingColor",
                  items: [{
                    childName: "fillAlpha",
                    disabled: false 
                  }],
                }]
              } , 
              ]
            } 
          ],
        },
      ];
    },
  },
);
