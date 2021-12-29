/**
 *@description: 物料维护详情入口页面
 *@author: 唐加旭
 *@date: 2019-08-19 15:57:26
 *@version: V0.0.1
 *@return:<MaterialDist />
 * */
import React from 'react';
import { Button, Form, Tabs, Card, Icon, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import AttributeDrawer from '@/components/AttributeDrawer';
import accessOrgBtn from '@/assets/accessOrgBtn.png';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import DisplayForm from './DisplayForm';
import Steps from './Steps';
import CopyDrawer from './copyDrawer';
import SiteDrawer from './SiteDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.process.routes.model.routes';
const TABLENAME = 'mt_router_attr';

@connect(({ routes, loading }) => ({
  routes,
  saveLoading: loading.effects['routes/saveRoutesList'],
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create({ fieldNameProp: null })
export default class MaterialDist extends React.Component {
  state = {
    canEdit: false,
    expandForm: true,
    copyDrawerVisibles: false,
    attributeDrawerVisible: false,
    siteDrawerVisible: false,
  };

  componentDidMount() {
    const { match } = this.props;
    const routerId = match.params.id;
    // 获取下拉
    this.basicFetch();
    // 获取工艺路线明细信息
    // if(routerId !== 'create') {
    this.getRouterDetails(routerId);
    // }
  }

  componentWillUnmount() {
    //  清空model数据
    this.props.dispatch({
      type: 'routes/clear',
    });
  }

  onRef = ref => {
    this.basic = (ref.props || {}).form;
  };

  basicFetch = () => {
    const { dispatch } = this.props;
    // 工艺路线状态
    dispatch({
      type: 'routes/fetchStatusOption',
      payload: {
        statusGroup: 'ROUTER_STATUS',
        module: 'ROUTER',
      },
    });
    // 工艺路线类型
    dispatch({
      type: 'routes/fetchSelectOption',
      payload: {
        typeGroup: 'ROUTER_TYPE',
        module: 'ROUTER',
      },
    });
    // 步骤类型
    dispatch({
      type: 'routes/fetchStepOption',
      payload: {
        typeGroup: 'ROUTER_STEP_TYPE',
        module: 'ROUTER',
      },
    });
    // 步骤组类型
    dispatch({
      type: 'routes/fetchStepGroupOption',
      payload: {
        typeGroup: 'ROUTER_STEP_GROUP_TYPE',
        module: 'ROUTER',
      },
    });
    // 步骤决策
    dispatch({
      type: 'routes/fetchStepDecisionOption',
      payload: {
        typeGroup: 'QUEUE_DECISION_TYPE',
        module: 'ROUTER',
      },
    });
    // 返回步骤下拉
    dispatch({
      type: 'routes/fetchReturnStepsOption',
      payload: {
        typeGroup: 'RETURN_TYPE',
        module: 'ROUTER',
      },
    });
    // 站点类型 用于 code->description
    dispatch({
      type: 'routes/fetchSiteTypeOption',
      payload: {
        typeGroup: 'ORGANIZATION_REL_TYPE',
        module: 'MODELING',
      },
    });
    // 下一步骤设置 选择策略下拉
    dispatch({
      type: 'routes/fetchNextStepDecisionOption',
      payload: {
        typeGroup: 'NEXT_DECISION_TYPE',
        module: 'ROUTER',
      },
    });
  };

  getRouterDetails = routerId => {
    const { dispatch } = this.props;
    // 基础信息
    if (routerId !== 'create') {
      dispatch({
        type: 'routes/fetchRoutesItemDetails',
        payload: {
          routerId,
        },
      }).then(res => {
        if (res && res.success) {
          this.basic.resetFields();
          dispatch({
            type: 'routes/updateState',
            payload: {
              oldBomId: res.rows ? res.rows.bomId : '',
            },
          });
        }
      });
      // 工艺步骤
      dispatch({
        type: 'routes/fetchRoutesItemStep',
        payload: {
          routerId,
        },
      });
      // 站点分配
      dispatch({
        type: 'routes/fetchRoutesItemSite',
        payload: {
          routerId,
        },
      });
    }
    // 是否可编辑
    if (routerId === 'create') {
      this.setState({
        canEdit: true,
      });
    }
  };

  /**
   *@functionName   changeStatus
   *@description 修改状态
   *@author 唐加旭
   *@date 2019-10-08 16:56:59
   *@version V0.8.6
   * */
  changeStatus = () => {
    const { canEdit } = this.state;
    this.setState({
      canEdit: !canEdit,
    });
  };

  // 表单展开/收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  /**
   *@functionName  handleSaveList
   *@description 保存工艺路线
   *@author 唐加旭
   *@date 2019-10-08 16:58:20
   *@version V0.8.6
   * */
  handleSaveList = () => {
    // const { match } = this.props;
    // const routerId = match.params.id;
    this.basic.validateFieldsAndScroll(err => {
      if (!err) {
        this.saveData();
      }
    });
  };

  @Bind
  saveData = () => {
    const {
      dispatch,
      history,
      match,
      routes: { stepsList = [], sitesList = [], routesItem = {}, oldBomId = '' },
    } = this.props;
    const routerId = match.params.id;
    const self = this;
    dispatch({
      type: 'routes/saveRoutesList',
      payload: {
        ...self.basic.getFieldsValue(),
        bomType: routesItem.bomType,
        bomId: self.basic.getFieldValue('bomId') ? self.basic.getFieldValue('bomId') : '',
        oldBomId,
        currentFlag: self.basic.getFieldValue('currentFlag') ? 'Y' : 'N',
        autoRevisionFlag: self.basic.getFieldValue('autoRevisionFlag') ? 'Y' : 'N',
        relaxedFlowFlag: self.basic.getFieldValue('relaxedFlowFlag') ? 'Y' : 'N',
        hasBeenReleasedFlag: self.basic.getFieldValue('hasBeenReleasedFlag') ? 'Y' : 'N',
        dateFrom: self.basic.getFieldValue('dateFrom')
          ? self.basic.getFieldValue('dateFrom').format('YYYY-MM-DD HH:mm:ss')
          : null,
        dateTo: self.basic.getFieldValue('dateTo')
          ? self.basic.getFieldValue('dateTo').format('YYYY-MM-DD HH:mm:ss')
          : null,
        routerId: routerId === 'create' ? '' : routerId,
        mtRouterSiteAssignDTO: sitesList,
        mtRouterStepDTO: stepsList,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        self.setState({
          canEdit: false,
        });
        history.push(`/hhme/ticket-management/routes/detail/${res.rows}`);
        this.getRouterDetails(res.rows);
      } else if (res && !res.success && res.rows && res.rows === 'MT_ROUTER_0073') {
        Modal.confirm({
          title: '提示',
          content: '工艺路线的装配清单已变更，保存后对应的工序组件会随之删除，是否确认保存？',
          onOk() {
            dispatch({
              type: 'routes/confirmRoutesList',
              payload: {
                ...self.basic.getFieldsValue(),
                bomType: routesItem.bomType,
                bomId: self.basic.getFieldValue('bomId') ? self.basic.getFieldValue('bomId') : '',
                oldBomId,
                currentFlag: self.basic.getFieldValue('currentFlag') ? 'Y' : 'N',
                autoRevisionFlag: self.basic.getFieldValue('autoRevisionFlag') ? 'Y' : 'N',
                relaxedFlowFlag: self.basic.getFieldValue('relaxedFlowFlag') ? 'Y' : 'N',
                hasBeenReleasedFlag: self.basic.getFieldValue('hasBeenReleasedFlag') ? 'Y' : 'N',
                dateFrom: self.basic.getFieldValue('dateFrom')
                  ? self.basic.getFieldValue('dateFrom').format('YYYY-MM-DD HH:mm:ss')
                  : null,
                dateTo: self.basic.getFieldValue('dateTo')
                  ? self.basic.getFieldValue('dateTo').format('YYYY-MM-DD HH:mm:ss')
                  : null,
                routerId: routerId === 'create' ? '' : routerId,
                mtRouterSiteAssignDTO: sitesList,
                mtRouterStepDTO: stepsList,
              },
            }).then(ress => {
              if (ress && ress.success) {
                notification.success();
                self.setState({
                  canEdit: false,
                });
                history.push(`/hhme/ticket-management/routes/detail/${routerId}`);
                self.getRouterDetails(routerId);
              } else {
                notification.error({
                  message: ress.message,
                });
              }
            });
          },
          onCancel() {},
        });
      } else if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  copyDrawer = () => {
    this.setState({
      copyDrawerVisibles: true,
    });
  };

  onCancel = () => {
    this.setState({
      copyDrawerVisibles: false,
    });
  };

  copySuccess = record => {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'routes/copyRoutesList',
      payload: {
        ...record,
      },
    }).then(res => {
      if (res && res.success) {
        history.push(`/hhme/ticket-management/routes/detail/${res.rows}`);
        this.onCancel();
        this.basicFetch();
        this.getRouterDetails(res.rows);
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  /**
   * @functionName: openSiteDrawer
   * @description: 设置抽屉打开
   * @author: 许碧婷
   * @date: 2020-1-3
   * @version: V0.0.1
   */
  openSiteDrawer = () => {
    this.setState({
      siteDrawerVisible: true,
    });
  };

  /**
   * @functionName: closeSiteDrawer
   * @description: 设置抽屉关闭
   * @author: 许碧婷
   * @date: 2020-1-3
   * @version: V0.0.1
   */
  closeSiteDrawer = () => {
    this.setState({
      siteDrawerVisible: false,
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
    const routerId = match.params.id;

    dispatch({
      type: 'routes/featchAttrList',
      payload: {
        kid: routerId,
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
    const routerId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'routes/saveAttrList',
        payload: {
          kid: routerId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      saveLoading,
      routes: { tabAttrList = [] },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/routes'));
    const routerId = match.params.id;
    const {
      canEdit,
      expandForm,
      copyDrawerVisibles,
      attributeDrawerVisible,
      siteDrawerVisible,
    } = this.state;
    const copyDrawerProps = {
      visible: copyDrawerVisibles,
      onCancel: this.onCancel,
      copySuccess: this.copySuccess,
      routerId,
    };
    const title = (
      <span>
        {intl.get('tarzan.product.bom.title.detail').d('工艺路线明细')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleForm}>
          {expandForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: routerId,
      canEdit,
      attrList: tabAttrList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    // 站点分配参数
    const siteDrawerProps = {
      visible: siteDrawerVisible,
      onCancel: this.closeSiteDrawer,
      routerId,
      canEdit,
    };

    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.process.routes.title.detail').d('工艺路线维护')}
          backPath={`${basePath}`}
        >
          {canEdit ? (
            <Button type="primary" icon="save" loading={saveLoading} onClick={this.handleSaveList}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          ) : (
            <Button type="primary" icon="edit" onClick={this.changeStatus}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>
          )}
          <Button icon="copy" onClick={this.copyDrawer} disabled={routerId === 'create'}>
            {intl.get('hzero.common.button.copy').d('复制')}
          </Button>
          <Button icon="arrows-alt" onClick={this.openAttrDrawer} disabled={routerId === 'create'}>
            {intl.get(`${modelPrompt}.field`).d('扩展字段')}
          </Button>
          <Button onClick={this.openSiteDrawer} disabled={routerId === 'create'}>
            <img
              src={accessOrgBtn}
              alt=""
              style={{
                height: '14px',
                margin: '-2px 6px 0 0',
                opacity: routerId === 'create' ? 0.4 : 1,
              }}
            />
            {intl.get(`${modelPrompt}.setSites`).d('分配站点')}
          </Button>
        </Header>
        <Content>
          <Card
            key="code-rule-header"
            title={title}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
            size="small"
          />
          <div style={expandForm ? null : { display: 'none' }}>
            <DisplayForm onRef={this.onRef} routerId={routerId} canEdit={canEdit} />
          </div>
          <Tabs defaultActiveKey="steps">
            <TabPane tab={intl.get(`${modelPrompt}.routerStep`).d('工艺步骤')} key="steps">
              <Steps routerId={routerId} canEdit={canEdit} />
            </TabPane>
          </Tabs>
          {copyDrawerVisibles && <CopyDrawer {...copyDrawerProps} />}
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
          {siteDrawerVisible && <SiteDrawer {...siteDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
