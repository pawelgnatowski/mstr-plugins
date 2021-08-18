mstrmojo.requiresCls('mstrmojo.vi.models.CustomVisDropZones');

/**
 * @enum {number} ENUM_ALLOW_DROP_TYPE - { ATTRIBUTE, METRIC, ATTRIBUTE_AND_METRIC, ATTRIBUTE_OR_METRIC }
 */
const { ENUM_ALLOW_DROP_TYPE } = mstrmojo.vi.models.CustomVisDropZones;
const desci18n = function (number,text){  
  return mstrmojo.desc("EChartGauge." + String(number) ,text).replace(/^\[+|\]+$/g , "")  
} 


// dropzone name list
const ATTRIBUTE = desci18n(800,'Attribute');
const METRIC = desci18n(801,'Value');
const METRIC_TARGET = desci18n(802,'Target');
const METRIC_MIN = desci18n(803,'Minimum Value');
const METRIC_MAX = desci18n(804,'Maximum Value');
const TOOLTIP = desci18n(805,'Tooltip'); 'Tooltip';
mstrmojo.plugins.EChartGauge.EChartGaugeDropZones = mstrmojo.declare(
  mstrmojo.vi.models.CustomVisDropZones,
  null,
  {
    scriptClass: 'mstrmojo.plugins.EChartGauge.EChartGaugeDropZones',
    cssClass: 'echartgauge-dropzones',
    getCustomDropZones() {
      return [
        /* {
          name: ATTRIBUTE,
          title: 'Drag attributes here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.ATTRIBUTE,
        }, */
        {
          name: METRIC,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name: METRIC_TARGET,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },
        {
          name: METRIC_MIN,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },   
        {
          name: METRIC_MAX,
          title: 'Drag metrics here',
          maxCapacity: 1,
          allowObjectType: ENUM_ALLOW_DROP_TYPE.METRIC,
        },        
      ];
    },
  },
);
