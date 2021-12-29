/**
 * containerType - 容器类型维护
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Tabs, Card, Icon, Dropdown, Menu } from 'hzero-ui';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import intl from 'utils/intl';
import { connect } from 'dva';
import moment from 'moment';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import BasicForm from './BasicForm';
import RequirmentForm from './RequirmentForm';
import ProductionAttrForm from './ProductionAttrForm';
import AchievementAttrForm from './AchievementAttrForm';

import ProcessRouteTab from './Tabs/ProcessRouteTab';
import AssemblyTab from './Tabs/AssemblyTab';
import EoTab from './Tabs/EoTab';
import ProductionOrderRelTab from './Tabs/ProductionOrderRelTab';

import WoSplitFormDrawer from './Drawers/WoSplitFormDrawer';
import EoCreateFormDrawer from './Drawers/EoCreateFormDrawer';
import WoMergeFormDrawer from './Drawers/WoMergeFormDrawer';
import AttributeDrawer from '@/components/AttributeDrawer';
import styles from './index.less';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';
const TABLENAME = 'mt_work_order_attr';

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/saveProductionDetailForm'],
}))
@formatterCollections({ code: 'tarzan.workshop.productionOrderMgt' })
export default class ProductionOrderMgtDetail extends Component {
  state = {
    canEdit: false,
    detailPage: true,
    basicForm: true,
    reqAttrForm: true,
    proAttrForm: true,
    achvAttrForm: true,
    woSplitFormDrawerVisible: false, // wo拆分
    eoCreateFormDrawerVisible: false, // eo生成
    woMergeFormDrawerVisible: false, // wo合并
    attributeDrawerVisible: false, // 扩展字段
  };

  componentDidMount = () => {
    const { match, dispatch } = this.props;
    const workOrderId = match.params.id;

    this.fetchDefaultOptions();

    // 重置子表
    dispatch({
      type: 'productionOrderMgt/updateState',
      payload: {
        expandedRowKeysArray: [],
      },
    });

    if (workOrderId === 'create') {
      this.setState({
        canEdit: true,
      });
    } else {
      dispatch({
        type: 'productionOrderMgt/fetchProductionDetail',
        payload: {
          workOrderId,
        },
      }).then(res => {
        if (res && res.success && res.rows.routerId) {
          dispatch({
            type: 'productionOrderMgt/fetchProcessRouteList',
            payload: {
              workOrderId,
              routerId: res.rows.routerId,
              page: { pageSize: 10000},
            },
          });
        }
      });
    }
  };

  //  获取基础下拉信息
  fetchDefaultOptions = () => {
    const { dispatch } = this.props;
    // wo状态
    dispatch({
      type: 'productionOrderMgt/fetchStatusSelectList',
      payload: {
        module: 'ORDER',
        statusGroup: 'WO_STATUS',
        type: 'workOrderStatusOptions',
      },
    });

    // WO类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_TYPE',
        type: 'workOrderTypeOptions',
      },
    });

    // 步骤类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ROUTER',
        typeGroup: 'ROUTER_STEP_TYPE',
        type: 'StepTypeOptions',
      },
    });

    // 完工限制类型
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'CONTROL_TYPE',
        type: 'controlTypeOptions',
      },
    });
  };

  componentWillUnmount = () => {
    // 重置全部数据
    const { dispatch } = this.props;
    dispatch({
      type: 'productionOrderMgt/clear',
    });
  };

  // 刷新页面
  refresh = workOrderId => {
    //  TODO  需要将tab页筛选条件拆出来，放在state里，刷新时需要清空筛选条件重新查询tab
    const { dispatch, history } = this.props;

    // 重置子表
    dispatch({
      type: 'productionOrderMgt/updateState',
      payload: {
        expandedRowKeysArray: [],
      },
    });

    if (this.prodOrderRelForm) {
      this.prodOrderRelForm.clearFilterSort();
    }

    if (this.eoRefForm) {
      this.eoRefForm.clearFilterSort();
    }

    if (this.assemblyRefForm) {
      this.assemblyRefForm.clearFilterSort();
    }

    history.push(`/hmes/workshop/production-order-mgt/detail/${workOrderId}`);

    this.refreshAllTable();
  };

  onEdit = () => {
    // console.log(this.eoTab);
    this.setState({
      canEdit: true,
    });
  };

  // 刷新全部表格
  refreshAllTable = () => {
    const {
      dispatch,
      match,
      productionOrderMgt: { workOrderDetail = {} },
    } = this.props;
    /* eslint-disable */
    const { routerId } = workOrderDetail;
    const workOrderId = match.params.id;
    dispatch({
      type: 'productionOrderMgt/fetchProductionDetail',
      payload: {
        workOrderId,
      },
    }).then(res => {
      if (res && res.success && res.rows.routerId) {
        dispatch({
          type: 'productionOrderMgt/update',
          payload: {
            assemblyList: [],
            assemblyPagination: {},
            eoList: [],
            eoPagination: {},
            prodRelPagination: {},
            productionRelList: [],
          },
        });
        dispatch({
          type: 'productionOrderMgt/fetchProcessRouteList',
          payload: {
            workOrderId,
            routerId: res.rows.routerId,
            page: { pageSize: 1000},
          },
        });
      } else if (res && res.success && !res.rows.routerId) {
        dispatch({
          type: 'productionOrderMgt/update',
          payload: {
            processRouteList: [],
            processRoutePagination: {},
            expandedRowList: [],
          },
        });
      }
    });

    // 装配清单
    dispatch({
      type: 'productionOrderMgt/fetchAssemblyList',
      payload: {
        workOrderId,
        page: { pageSize: 10000},
      },
    });

    // eo
    dispatch({
      type: 'productionOrderMgt/fetchEoList',
      payload: {
        workOrderId,
        page: { pageSize: 10000},
      },
    });

    // rel
    dispatch({
      type: 'productionOrderMgt/fetchProductionRelList',
      payload: {
        workOrderId,
        page: { pageSize: 1000},
      },
    });
  };

  onSave = () => {
    const { dispatch, history, match } = this.props;
    const workOrderId = match.params.id;

    let flagBasic = true;
    let params = {};

    if (workOrderId !== 'create') {
      params = {
        ...params,
        workOrderId,
      };
    }

    if (this.basicRefForm) {
      this.basicRefForm.validateFields((err, values) => {
        if (!err) {
          params = { ...params, ...values };
        } else {
          flagBasic = false;
        }
      });
    }

    if (this.requirementRefForm) {
      this.requirementRefForm.validateFields((err, values) => {
        if (!err) {
          params = { ...params, ...values };
        } else {
          flagBasic = false;
        }
      });
    }

    if (this.productionAttrRefForm) {
      this.productionAttrRefForm.validateFields((err, values) => {
        if (!err) {
          params = {
            ...params,
            ...values,
            planEndTime: values.planEndTime
              ? moment(values.planEndTime).format('YYYY-MM-DD HH:mm:ss')
              : null,
            planStartTime: values.planStartTime
              ? moment(values.planStartTime).format('YYYY-MM-DD HH:mm:ss')
              : null,
          };
        } else {
          flagBasic = false;
        }
      });
    }

    if (!flagBasic) {
      this.setState({
        canEdit: true,
      });
      return;
    }

    // 保存
    dispatch({
      type: 'productionOrderMgt/saveProductionDetailForm',
      payload: { ...params },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({
          canEdit: false,
        });
        // 刷新全部表格
        this.refreshAllTable();
        dispatch({
          type: 'productionOrderMgt/fetchProductionDetail',
          payload: {
            workOrderId: res.rows,
          },
        });
        history.push(`/hhme/ticket-management/production-order-mgt/detail/${res.rows}`);
      } else if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  toggleBasic = () => {
    const { basicForm } = this.state;
    this.setState({
      basicForm: !basicForm,
    });
  };

  toggleRequirement = () => {
    const { reqAttrForm } = this.state;
    this.setState({
      reqAttrForm: !reqAttrForm,
    });
  };

  toggleProduction = () => {
    const { proAttrForm } = this.state;
    this.setState({
      proAttrForm: !proAttrForm,
    });
  };

  toggleAchievement = () => {
    const { achvAttrForm } = this.state;
    this.setState({
      achvAttrForm: !achvAttrForm,
    });
  };

  clickMenu = ({ key }) => {
    const { dispatch, match } = this.props;
    const workOrderId = match.params.id;

    const form = this.basicRefForm;

    dispatch({
      type: 'productionOrderMgt/postProductionStatus',
      payload: {
        workOrderId,
        operationType: key,
      },
    }).then(res => {
      // 重新查询当前页面
      if (res && res.success) {
        if (form) {
          form.resetFields(['status']);
        }
        notification.success();
        dispatch({
          type: 'productionOrderMgt/fetchProductionDetail',
          payload: {
            workOrderId,
          },
        });
      } else if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  closeFormDrawer = type => {
    this.setState({
      [type]: false,
    });
  };

  clickSplitMenu = ({ key }) => {
    const { dispatch, match } = this.props;
    const workOrderId = match.params.id;
    // wo拆分
    if (key === 'WOSPLIT') {
      this.setState({
        woSplitFormDrawerVisible: true,
      });
    }

    // wo合并
    if (key === 'WOMERGE') {
      this.setState({
        woMergeFormDrawerVisible: true,
      });
    }

    // bom分解
    if (key === 'BOMSPLIT') {
      dispatch({
        type: 'productionOrderMgt/fetchBomSplit',
        payload: parseFloat(workOrderId),
      }).then(res => {
        // notification
        if (res && res.success) {
          notification.success();
        } else if (res && !res.success) {
          notification.error({ message: res.message });
        }
      });
    }
  };

  eoMenu = () => {
    const {
      productionOrderMgt: { workOrderDetail = {} },
    } = this.props;
    const { status } = workOrderDetail;

    return (
      <Menu
        style={{ textAlign: 'left' }}
        onClick={this.clickMenu}
        className={styles.splitMenuStyle}
      >
        <Menu.Item key="RELEASE">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.release`).d('下达')}
          </a>
        </Menu.Item>
        {status === 'HOLD' ? (
          <Menu.Item key="HOLD_CANCEL">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.hold_cancel`).d('取消保留')}
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="HOLD">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.hold`).d('保留')}
            </a>
          </Menu.Item>
        )}
        {status === 'COMPLETED' ? (
          <Menu.Item key="COMPLETE_CANCEL">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.complete_cancel`).d('取消完成')}
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="COMPLETE">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.complete`).d('完成')}
            </a>
          </Menu.Item>
        )}
        {status === 'CLOSED' ? (
          <Menu.Item key="CLOSE_CANCEL">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.close_cancel`).d('取消关闭')}
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="CLOSE">
            <a target="_blank" rel="noopener noreferrer">
              {intl.get(`${modelPrompt}.close`).d('关闭')}
            </a>
          </Menu.Item>
        )}
        <Menu.Item key="ABANDON">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.abandon`).d('废弃')}
          </a>
        </Menu.Item>
        {status === 'RELEASED' && (
          <Menu.Item key="EORELEASED">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.eoReleased`).d('下达作业')}
          </a>
        </Menu.Item>)}
      </Menu>
    );
  };

  spliteMergeMenu = () => {
    return (
      <Menu
        style={{ textAlign: 'left' }}
        onClick={this.clickSplitMenu}
        className={styles.splitMenuStyle}
      >
        <Menu.Item key="WOSPLIT">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.splitWo`).d('WO拆分')}
          </a>
        </Menu.Item>
        <Menu.Item key="WOMERGE">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.mergeWo`).d('WO合并')}
          </a>
        </Menu.Item>
        <Menu.Item key="BOMSPLIT">
          <a target="_blank" rel="noopener noreferrer">
            {intl.get(`${modelPrompt}.splitBom`).d('BOM分解')}
          </a>
        </Menu.Item>
        {/* <Menu.Item key="PROCESSSPLIT">
          <a target="_blank" rel="noopener noreferrer" style={{ color: '#29bece' }}>
            {intl.get(`${modelPrompt}.splitProcess`).d('工艺路线分解')}
          </a>
        </Menu.Item> */}
      </Menu>
    );
  };

  // eo
  openEoDrawer = () => {
    this.setState({
      eoCreateFormDrawerVisible: true,
    });
  };

  /**
   * @functionName: openAttrDrawer
   * @description: 设置抽屉打开
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  openAttrDrawer = () => {
    const { dispatch, match } = this.props;
    const ncCodeId = match.params.id;

    dispatch({
      type: 'productionOrderMgt/fetchAttributeList',
      payload: {
        kid: ncCodeId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attributeDrawerVisible: true,
        });
      }
    });
  };

  /**
   * @functionName: closeAttrDrawer
   * @description: 设置抽屉关闭
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  closeAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  /**
   * @functionName: handleSave
   * @description 保存扩展字段
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  handleSave = dataSource => {
    const { dispatch, match } = this.props;
    const ncCodeId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'productionOrderMgt/saveAttribute',
        payload: {
          kid: ncCodeId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          this.setState({
            canEdit: false,
          });
          notification.success();
        } else if (res && !res.success) {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  basicRef = (ref = {}) => {
    this.basicRefForm = (ref.props || {}).form;
  };

  requirementRef = (ref = {}) => {
    this.requirementRefForm = (ref.props || {}).form;
  };

  productionAttrRef = (ref = {}) => {
    this.productionAttrRefForm = (ref.props || {}).form;
  };

  achievementAttrRef = (ref = {}) => {
    this.achievementAttrRefForm = (ref.props || {}).form;
  };

  // 生产指令
  prodOrderRel = (ref = {}) => {
    this.prodOrderRelForm = ref;
  };

  // EO 清单
  eoRef = (ref = {}) => {
    this.eoRefForm = ref;
  };

  // 装配清单
  assemblyRef = (ref = {}) => {
    this.assemblyRefForm = ref;
  };

  jumpPage=(record)=>{
    const { history, match } = this.props;
    const workOrderId = match.params.id;
    history.push(`/hhme/ticket-management/production-order-mgt/execute-detail/${record.eoId}/${workOrderId}`);
  }

  render() {
    const {
      match,
      productionOrderMgt: { workOrderDetail = {}, tabAttributeList = [] },
      loading,
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/detail'));
    const {
      canEdit,
      basicForm,
      reqAttrForm,
      proAttrForm,
      achvAttrForm,
      detailPage,
      woSplitFormDrawerVisible,
      eoCreateFormDrawerVisible,
      woMergeFormDrawerVisible,
      attributeDrawerVisible, // 扩展字段
    } = this.state;
    const workOrderId = match.params.id;
    const { routerId, status } = workOrderDetail;
    const ncCodeId = match.params.id;

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: ncCodeId,
      canEdit,
      attrList: tabAttributeList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    const basicTitle = (
      <span>
        {intl.get(`${modelPrompt}.basicAttributes`).d('基本属性')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={() => this.toggleBasic()}>
          {basicForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={basicForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    const reqTitle = (
      <span>
        {intl.get(`${modelPrompt}.requirementAttr`).d('需求属性')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleRequirement}>
          {reqAttrForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={reqAttrForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    const productionTitle = (
      <span>
        {intl.get(`${modelPrompt}.productionAttr`).d('生产属性')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={() => this.toggleProduction()}>
          {proAttrForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={proAttrForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    const achievementTitle = (
      <span>
        {intl.get(`${modelPrompt}.achieveAttr`).d('实绩属性')}
        <a
          style={{ marginLeft: '16px', fontSize: '12px' }}
          onClick={() => this.toggleAchievement()}
        >
          {achvAttrForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={achvAttrForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    const attributeLists = [
      {
        title: basicTitle,
        formType: basicForm,
        component: (
          <BasicForm
            onRef={this.basicRef}
            canEdit={canEdit}
            workOrderId={workOrderId}
            detailPage={detailPage}
          />
        ),
      },
      {
        title: reqTitle,
        formType: reqAttrForm,
        component: (
          <RequirmentForm
            onRef={this.requirementRef}
            canEdit={canEdit}
            workOrderId={workOrderId}
            detailPage={detailPage}
          />
        ),
      },
      {
        title: productionTitle,
        formType: proAttrForm,
        component: (
          <ProductionAttrForm
            onRef={this.productionAttrRef}
            canEdit={canEdit}
            workOrderId={workOrderId}
            detailPage={detailPage}
          />
        ),
      },
      {
        title: achievementTitle,
        formType: achvAttrForm,
        component: (
          <AchievementAttrForm
            onRef={this.achievementAttrRef}
            canEdit={canEdit}
            workOrderId={workOrderId}
            detailPage={detailPage}
          />
        ),
      },
    ];

    // wo 拆分
    const woSplitFormProps = {
      workOrderId,
      type: 'woSplitFormDrawerVisible',
      visible: woSplitFormDrawerVisible,
      onCancel: this.closeFormDrawer,
      onRefresh: this.refresh,
    };

    // eo
    const eoCreateFormProps = {
      type: 'eoCreateFormDrawerVisible',
      workOrderId,
      visible: eoCreateFormDrawerVisible,
      onCancel: this.closeFormDrawer,
      onRefresh: this.refresh,
    };

    // wo合并
    const woMergeFormProps = {
      workOrderId,
      type: 'woMergeFormDrawerVisible',
      visible: woMergeFormDrawerVisible,
      onCancel: this.closeFormDrawer,
      onRefresh: this.refresh,
    };

    return (
      <Fragment>
        <Header
          title={intl.get(`${modelPrompt}.productionOrderMgt`).d('生产指令管理')}
          backPath={`/hhme/ticket-management`}
        >
          {canEdit ? (
            <Button type="primary" icon="save" onClick={() => this.onSave()}>
              {intl.get(`${modelPrompt}.save`).d('保存')}
            </Button>
          ) : (
            <Button type="primary" icon="edit" onClick={() => this.onEdit()}>
              {intl.get(`${modelPrompt}.edit`).d('编辑')}
            </Button>
          )}
          <Button
            icon="file"
            onClick={() => this.openEoDrawer()}
            disabled={
              workOrderId === 'create' ||
              canEdit === false ||
              !['EORELEASED', 'RELEASED'].includes(status)
            }
          >
            {intl.get(`${modelPrompt}.eoCreate`).d('EO创建')}
          </Button>
          <Dropdown
            overlay={this.eoMenu()}
            trigger={['click']}
            disabled={workOrderId === 'create' || canEdit}
          >
            <Button icon="retweet" disabled={workOrderId === 'create' || canEdit}>
              <>{intl.get(`${modelPrompt}.statusChange`).d('状态变更')}</>
            </Button>
          </Dropdown>
          <Dropdown
            overlay={this.spliteMergeMenu()}
            trigger={['click']}
            disabled={workOrderId === 'create' || canEdit}
          >
            <Button icon="verticle-left" disabled={workOrderId === 'create' || canEdit}>
              <>{intl.get(`${modelPrompt}.splitMerge`).d('拆分合并')}</>
            </Button>
          </Dropdown>
          <Button
            icon="arrows-alt"
            disabled={workOrderId === 'create'}
            onClick={() => this.openAttrDrawer()}
          >
            {intl.get(`${modelPrompt}.extendField`).d('扩展字段')}
          </Button>
        </Header>
        <Content>
          {attributeLists.map(attr => (
            <Fragment>
              <Card
                key="code-rule-header"
                title={attr.title}
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
                size="small"
              />
              <div style={{ display: attr.formType ? 'block' : 'none' }}>{attr.component}</div>
            </Fragment>
          ))}
          <Tabs
            defaultActiveKey="processRoute"
            style={{
              overflow: 'visible',
            }}
          >
            <TabPane key="processRoute" tab={intl.get(`${modelPrompt}.processRoute`).d('工艺路线')}>
              <ProcessRouteTab canEdit={canEdit} workOrderId={workOrderId} routerId={routerId} />
            </TabPane>
            <TabPane key="assemblyList" tab={intl.get(`${modelPrompt}.assemblyList`).d('装配清单')}>
              <AssemblyTab canEdit={canEdit} workOrderId={workOrderId} onRef={this.assemblyRef} />
            </TabPane>
            <TabPane key="eoList" tab={intl.get(`${modelPrompt}.eoList`).d('EO 清单')}>
              <EoTab canEdit={canEdit} workOrderId={workOrderId} onRef={this.eoRef} jumpPage={this.jumpPage} />
            </TabPane>
            <TabPane
              key="productionOrderRel"
              tab={intl.get(`${modelPrompt}.productionOrderRel`).d('生产指令关系')}
            >
              <ProductionOrderRelTab
                canEdit={canEdit}
                workOrderId={workOrderId}
                routerId={routerId}
                onRef={this.prodOrderRel}
              />
            </TabPane>
          </Tabs>
        </Content>
        {woSplitFormDrawerVisible && <WoSplitFormDrawer {...woSplitFormProps} />}
        {eoCreateFormDrawerVisible && <EoCreateFormDrawer {...eoCreateFormProps} />}
        {woMergeFormDrawerVisible && <WoMergeFormDrawer {...woMergeFormProps} />}
        {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
      </Fragment>
    );
  }
}
/* eslint-disable */
