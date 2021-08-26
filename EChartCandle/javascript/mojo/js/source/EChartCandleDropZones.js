mstrmojo.requiresCls('mstrmojo.vi.models.CustomVisDropZones');

/**
 * @enum {number} ENUM_ALLOW_DROP_TYPE - { ATTRIBUTE, METRIC, ATTRIBUTE_AND_METRIC, ATTRIBUTE_OR_METRIC }
 */
const { ENUM_ALLOW_DROP_TYPE } = mstrmojo.vi.models.CustomVisDropZones;

// dropzone name list
const ATTRIBUTE = 'Attribute';
const METRIC = 'Metric';
const TOOLTIP = 'Tooltip';

mstrmojo.plugins.EChartCandle.EChartCandleDropZones = mstrmojo.declare(
  mstrmojo.vi.models.CustomVisDropZones,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartCandle.EChartCandleDropZones',
    cssClass: 'echartcandle-dropzones',
    getCustomDropZones() {
      return [
        {
          name: mstrmojo.desc('518', 'Attribute') ,
          title: mstrmojo.desc('13828','Drag attributes here')  ,
          // maxCapacity: 1,
          isColorBy: true , 
          allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
        },
        {
          name: mstrmojo.desc("EChartCandle.201" ,"Open").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name: mstrmojo.desc("EChartCandle.202" ,"Close").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name: mstrmojo.desc("EChartCandle.203" ,"Lowest").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name:mstrmojo.desc("EChartCandle.204" ,"Highest").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name:mstrmojo.desc("EChartCandle.205" ,"Volume").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        } , 
        {
          name:mstrmojo.desc("EChartCandle.206" ,"Amount").replace(/^\[+|\]+$/g , "")  ,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        }
      ];
    },
  },
);
