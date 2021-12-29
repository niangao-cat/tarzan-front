/* eslint-disable */
import editorStyle from '../util/defaultStyle';
import icon_user from '../../../../../assets/icons/flow/icon_user.svg';
import icon_script from '../../../../../assets/icons/flow/icon_script.svg';
import icon_java from '../../../../../assets/icons/flow/icon_java.svg';

const deepMix = require('@antv/util/lib/deep-mix');

const taskDefaultOptions = {
  icon: null,
  icon1: null,
  icon2: null,
  icon3: null,
  icon4: null,
  iconStyle: {
    width: 24,
    height: 24,
    left: 27,
    top: 10,
  },
  iconStyle1: {
    width: 12,
    height: 12,
    left: 2,
    top: 2,
  },
  iconStyle2: {
    width: 12,
    height: 12,
    left: 65,
    top: 2,
  },
  iconStyle3: {
    width: 12,
    height: 12,
    left: 2,
    top: 29,
  },
  iconStyle4: {
    width: 12,
    height: 12,
    left: 65,
    top: 29,
  },
  style: {
    ...editorStyle.nodeStyle,
    fill: '#E7F7FE',
    stroke: '#1890FF',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#95D6FB',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    },
  },
};

export default function(G6) {
  G6.registerNode(
    'task-node',
    {
      shapeType: 'rect',
      labelPosition: 'bottom',
      options: {
        ...taskDefaultOptions,
      },
      getShapeStyle(cfg) {
        cfg.size = [80, 44];
        const width = cfg.size[0];
        const height = cfg.size[1];
        const style = {
          x: 0 - width / 2,
          y: 0 - height / 2,
          width,
          height,
          ...this.options.style,
        };
        return style;
      },
    },
    'base-node'
  );
  G6.registerNode(
    'technique-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_user,
        icon1: icon_user,
        icon2: icon_script,
        icon3: icon_script,
        icon4: icon_script,
        style: {
          fill: '#E7F7FE',
          stroke: '#1890FF',
        },
        stateStyles: {
          selected: {
            fill: '#95D6FB',
          },
        },
      }),
    },
    'task-node'
  );
  G6.registerNode(
    'process-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_script,
        icon1: icon_script,
        icon2: icon_user,
        icon3: icon_script,
        icon4: icon_script,
        style: {
          fill: '#FFF7E6',
          stroke: '#FFA940',
        },
        stateStyles: {
          selected: {
            fill: '#FFE7BA',
          },
        },
      }),
    },
    'task-node'
  );
  G6.registerNode(
    'stepGroup-node',
    {
      options: deepMix({}, taskDefaultOptions, {
        icon: icon_java,
        icon1: icon_java,
        icon2: icon_user,
        icon3: icon_script,
        icon4: icon_script,
        style: {
          fill: '#FFF1F0',
          stroke: '#FF4D4F',
        },
        stateStyles: {
          selected: {
            fill: '#FFCCC7',
          },
        },
      }),
    },
    'task-node'
  );
}
/* eslint-disable */
