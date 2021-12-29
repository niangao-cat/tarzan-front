import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'hzero-ui';
import G6 from '@antv/g6/src';
import styles from './index.less';
import { getShapeName } from './util/clazz';
import locale from './locales/index';
import Command from './plugins/command';
import Toolbar from './plugins/toolbar';
import AddItemPanel from './plugins/addItemPanel';
import CanvasPanel from './plugins/canvasPanel';
import LangContext from './util/context';
import DetailPanel from './components/DetailPanel';
import ItemPanel from './components/ItemPanel';
import ToolbarPanel from './components/ToolbarPanel';
import registerShape from './shape';
import registerBehavior from './behavior';
import TechniqueDrawer from './components/DetailPanel/TechniqueDrawer';
import StepGroupDrawer from './components/DetailPanel/StepGroupDrawer';
import ProcessDrawer from './components/DetailPanel/ProcessDrawer';
import StrategyModal from './components/DetailPanel/StrategyModal';
import ReturnPropertyModal from './components/DetailPanel/ReturnPropertyModal';

registerShape(G6);
registerBehavior(G6);
let count = 0;
/* eslint-disable */
@connect(({ flow }) => ({
  flow,
}))
class Designer extends Component {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.itemPanelRef = React.createRef();
    this.detailPanelRef = React.createRef();
    this.resizeFunc = () => {};
    this.state = {
      selectedModel: {},
      processModel: {
        id: '',
        name: '',
        clazz: 'process',
        dataObjs: [],
        signalDefs: [],
        messageDefs: [],
      },
      techniqueVisible: false, //类型设置：工艺（抽屉）
      stepGroupVisible: false, //类型设置：步骤组（抽屉）
      processVisible: false, //类型设置：嵌套工艺路线（抽屉）
      strategyVisible: false, //连线（策略设置）
      returnPropertyVisible: false, //返回属性设置
      currentOperationKey: '', //当前操作的key
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      if (this.graph) {
        this.graph.changeData(this.initShape(this.props.data));
        this.graph.setMode(this.props.mode);
        this.graph.emit('canvas:click');
        if (this.cmdPlugin) {
          this.cmdPlugin.initPlugin(this.graph);
        }
        if (this.props.isView) {
          this.graph.fitView(5);
        }
      }
    }
  }

  componentDidMount() {
    const { isView, mode } = this.props;
    const height = this.props.height - 1;
    const width = this.pageRef.current.offsetWidth;
    let plugins = [];
    if (!isView) {
      this.cmdPlugin = new Command();
      const toolbar = new Toolbar({ container: this.toolbarRef.current });
      const addItemPanel = new AddItemPanel({ container: this.itemPanelRef.current });
      const canvasPanel = new CanvasPanel({ container: this.pageRef.current });
      plugins = [this.cmdPlugin, toolbar, addItemPanel, canvasPanel];
    }
    this.graph = new G6.Graph({
      plugins,
      container: this.pageRef.current,
      height,
      width,
      modes: {
        default: [
          'drag-canvas',
          'clickSelected',
          'drag-group',
          'drag-node-with-group',
          'collapse-expand-group',
        ],
        view: [],
        edit: [
          'drag-canvas',
          'hoverNodeActived',
          'hoverAnchorActived',
          // 'dragNode',
          'dragEdge',
          'dragPanelItemAddNode',
          'clickSelected',
          'deleteItem',
          'itemAlign',
          'dragPoint',
          'drag-group',
          'drag-node-with-group',
          'collapse-expand-group',
        ],
      },
      defaultEdge: {
        shape: 'flow-polyline-round',
      },
    });
    if (isView) {
      this.graph.setMode('view');
    } else {
      this.graph.setMode(mode);
    }
    this.graph.data(this.props.data ? this.initShape(this.props.data) : { nodes: [], edges: [] });
    this.graph.render();
    if (isView && this.props.data && this.props.data.nodes) {
      this.graph.fitView(5);
    }
    this.initEvents();
  }

  initShape(data) {
    if (data && data.nodes) {
      return {
        nodes: data.nodes.map(node => {
          return {
            shape: getShapeName(node.clazz),
            ...node,
          };
        }),
        edges: data.edges,
      };
    }
    return data;
  }

  initEvents() {
    this.graph.on('afteritemselected', items => {
      if (items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if (!item) {
          item = this.getNodeInSubProcess(items[0]);
        }
        this.setState({ selectedModel: { ...item.getModel() } });
      } else {
        this.setState({ selectedModel: this.state.processModel });
      }
    });
    const self = this;
    self.graph.on('canvas:click', e => {
      let modelData = self.graph.save();
      if (modelData.groups.length) {
        const groupId = modelData.groups[0].id;
        const groupArr = [];
        modelData.nodes.map(item => {
          if (item.groupId === groupId) {
            groupArr.push(item.id);
          }
        });
        self.graph.removeItem(groupId);
        groupArr.map(id => {
          self.graph.removeItem(id);
        });
      }
    });
    //-单击节点
    this.graph.on('node:click', e => {
      count += 1;
      const item = e.item.getModel();
      console.log(item);
      setTimeout(() => {
        if (count === 1) {
          // todo:点击节点，展示该节点对应的步骤组,(如果有展开的步骤组，则还需要隐藏别的步骤组)
          // 先隐藏展开的步骤组
          let modelData = self.graph.save();
          if (modelData.groups.length) {
            const groupId = modelData.groups[0].id;
            // 若点击当前步骤组的工艺，则不隐藏步骤组下所属工艺
            if (!item.groupId) {
              // 重复点击展开当前工艺路线
              if (groupId !== 'group' + item.id) {
                const groupArr = [];
                modelData.nodes.map(item => {
                  if (item.groupId === groupId) {
                    groupArr.push(item.id);
                  }
                });
                self.graph.removeItem(groupId);
                groupArr.map(id => {
                  self.graph.removeItem(id);
                });
              } else {
                // 此时如果点击节点为步骤组，则仍然需要展开一个步骤组
                console.log('展开一个步骤组');
              }
            }
          }
          // 点击步骤组,展开节点
          if (item.clazz === 'stepGroup') {
            const model1 = {
              id: 'node3',
              shape: 'technique-node',
              label: 'node1-group1',
              clazz: 'technique',
              x: 100,
              y: 535,
            };
            const model2 = {
              id: 'node4',
              shape: 'technique-node',
              label: 'node1-group1',
              clazz: 'technique',
              x: 100,
              y: 465,
            };
            const model3 = {
              groupId: 'group' + item.id,
              nodes: ['node3', 'node4'],
              title: {
                text: '',
              },
            };
            self.graph.addItem('node', model1);
            self.graph.addItem('node', model2);
            self.graph.addItem('group', model3);
          }
        } else if (count === 2) {
          //-双击打开具体节点的维护详情页面
          if (item.clazz === 'technique') {
            this.setState({
              techniqueVisible: true,
            });
          } else if (item.clazz === 'stepGroup') {
            this.setState({
              stepGroupVisible: true,
            });
          } else if (item.clazz === 'process') {
            this.setState({
              processVisible: true,
            });
          }
        }
        count = 0;
      }, 200);
    });
    //-双击连线
    this.graph.on('edge:dblclick', e => {
      const item = e.item.getModel();
      console.log(item);
      this.setState({
        strategyVisible: true,
      });
    });
    const page = this.pageRef.current;
    const graph = this.graph;
    const height = this.props.height - 1;
    this.resizeFunc = () => {
      graph.changeSize(page.offsetWidth, height);
    };
    window.addEventListener('resize', this.resizeFunc);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunc);
    this.graph.getNodes().forEach(node => {
      node.getKeyShape().stopAnimate();
    });
  }

  onItemCfgChange(key, value) {
    const items = this.graph.get('selectedItems');

    if (items && items.length > 0) {
      let item = this.graph.findById(items[0]);
      //item.getModel()可以拿到当前节点的信息
      //1.先打开设置modal TODO:2.如果modal设置成功，再去修改对应的属性
      if (key === 'hideIcon3') {
        this.setState({
          returnPropertyVisible: true,
          currentOperationKey: key,
        });
      } else {
        if (!item) {
          item = this.getNodeInSubProcess(items[0]);
        }
        if (this.graph.executeCommand) {
          this.graph.executeCommand('update', {
            itemId: items[0],
            updateModel: { [key]: value },
          });
        } else {
          this.graph.updateItem(item, { [key]: value });
        }
        this.setState({ selectedModel: { ...item.getModel() } });
      }
    } else {
      const canvasModel = { ...this.state.processModel, [key]: value };
      this.setState({ selectedModel: canvasModel });
      this.setState({ processModel: canvasModel });
    }
  }

  getNodeInSubProcess(itemId) {
    const subProcess = this.graph.find('node', node => {
      if (node.get('model')) {
        const clazz = node.get('model').clazz;
        if (clazz === 'subProcess') {
          const containerGroup = node.getContainer();
          const subGroup = containerGroup.subGroup;
          const item = subGroup.findById(itemId);
          return subGroup.contain(item);
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if (subProcess) {
      const group = subProcess.getContainer();
      return group.getItem(subProcess, itemId);
    }
    return null;
  }

  techniqueOnCancel = () => {
    this.setState({
      techniqueVisible: false,
    });
  };

  stepGroupOnCancel = () => {
    this.setState({
      stepGroupVisible: false,
    });
  };

  processOnCancel = () => {
    this.setState({
      processVisible: false,
    });
  };

  strategyOnCancel = () => {
    this.setState({
      strategyVisible: false,
    });
  };

  returnPropertyOnCancel = () => {
    this.returnPropertyOperation('cancel');
  };

  returnPropertyOnOk = () => {
    this.returnPropertyOperation('ok');
  };

  returnPropertyOperation = result => {
    this.setState({
      returnPropertyVisible: false,
    });
    const { currentOperationKey } = this.state;
    const items = this.graph.get('selectedItems');
    let item = this.graph.findById(items[0]);
    if (!item) {
      item = this.getNodeInSubProcess(items[0]);
    }
    if (this.graph.executeCommand) {
      this.graph.executeCommand('update', {
        itemId: items[0],
        updateModel: { [currentOperationKey]: result !== 'ok' },
      });
    } else {
      this.graph.updateItem(item, { [currentOperationKey]: result !== 'ok' });
    }
    this.setState({
      selectedModel: { ...item.getModel() },
    });
    if (result === 'ok') {
      message.success('已设置该步骤为返回步骤');
    } else {
      message.success('已取消该步骤为返回步骤');
    }
  };

  render() {
    const height = this.props.height;
    const { isView, mode, users, groups, lang } = this.props;
    const {
      selectedModel,
      processModel,
      techniqueVisible,
      stepGroupVisible,
      processVisible,
      strategyVisible,
      returnPropertyVisible,
    } = this.state;
    const { signalDefs, messageDefs } = processModel;
    const i18n = locale[lang.toLowerCase()];
    const readOnly = mode !== 'edit';

    const techniqueProps = {
      visible: techniqueVisible,
      onCancel: this.techniqueOnCancel,
    };

    const stepGroupProps = {
      visible: stepGroupVisible,
      onCancel: this.stepGroupOnCancel,
    };

    const processProps = {
      visible: processVisible,
      onCancel: this.processOnCancel,
    };

    const StrategyProps = {
      visible: strategyVisible,
      onCancel: this.strategyOnCancel,
    };

    const returnPropertyProps = {
      visible: returnPropertyVisible,
      onCancel: this.returnPropertyOnCancel,
      onOk: this.returnPropertyOnOk,
    };

    return (
      <LangContext.Provider value={{ i18n, lang }}>
        <div className={styles.root}>
          {!isView && <ToolbarPanel ref={this.toolbarRef} />}
          <div>
            {!isView && (
              <ItemPanel
                ref={this.itemPanelRef}
                height={height}
                model={selectedModel}
                onChange={(key, val) => {
                  this.onItemCfgChange(key, val);
                }}
              />
            )}
            <div
              ref={this.pageRef}
              className={styles.canvasPanel}
              style={{ height, width: isView ? '100%' : '60%', borderBottom: isView ? 0 : null }}
            />
          </div>
          {!isView && (
            <DetailPanel
              graphData={this.graph}
              ref={this.detailPanelRef}
              height={height}
              model={selectedModel}
              readOnly={readOnly}
              users={users}
              groups={groups}
              signalDefs={signalDefs}
              messageDefs={messageDefs}
              onChange={(key, val) => {
                this.onItemCfgChange(key, val);
              }}
            />
          )}
          {/*工艺的抽屉*/}
          {techniqueVisible && <TechniqueDrawer {...techniqueProps} />}
          {/*步骤组的抽屉*/}
          {stepGroupVisible && <StepGroupDrawer {...stepGroupProps} />}
          {/*嵌套工艺的抽屉*/}
          {processVisible && <ProcessDrawer {...processProps} />}
          {/*连线（策略设置）详情*/}
          {strategyVisible && <StrategyModal {...StrategyProps} />}
          {/*返回属性设置*/}
          {returnPropertyVisible && <ReturnPropertyModal {...returnPropertyProps} />}
        </div>
      </LangContext.Provider>
    );
  }
}

Designer.defaultProps = {
  height: 500,
  isView: false,
  mode: 'edit',
  lang: 'zh',
};

export default Designer;
/* eslint-disable */
