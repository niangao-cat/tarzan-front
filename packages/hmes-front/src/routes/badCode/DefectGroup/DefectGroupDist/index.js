/**
 * WorkCellDist - 生产线明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
// import { verifyObjectHasValue } from '@/utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import SecCodeTab from './SecCodeTab';
import ProcessTab from './ProcessTab';
import AttributeDrawer from '@/components/AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.badCode.defectGroup.model.defectGroup';
const TABLENAME = 'mt_nc_group_attr';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} defectGroup - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ defectGroup, loading }) => ({
  defectGroup,
  saveLoading: loading.effects['defectGroup/saveDefectCodeList'],
}))
@formatterCollections({ code: ['tarzan.badCode.defectGroup', 'tarzan.common'] })
@Form.create({ fieldNameProp: null })
export default class WorkCellDist extends React.Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const ncGroupId = match.params.id;
    if (ncGroupId === 'create') {
      this.setState({
        canEdit: true,
      });
    } else {
      dispatch({
        type: 'defectGroup/fetchSingleCode',
        payload: {
          ncGroupId,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'defectGroup/updateState',
      payload: {
        defectCodeItem: [],
        mtNcSecondaryCodeList: [],
        mtNcValidOperList: [],
        productionLine: {},
        proLineItem: {},
        limitSiteId: undefined,
      },
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 基础属性
  @Bind
  onBasicRef(ref = {}) {
    this.basicForm = (ref.props || {}).form;
  }

  // 计划属性
  @Bind
  onPlanRef(ref = {}) {
    this.planForm = (ref.props || {}).form;
  }

  // 生产属性
  @Bind
  onProduceRef(ref = {}) {
    this.produceForm = (ref.props || {}).form;
  }

  // 扩展字段
  @Bind
  onFieldRef(ref = {}) {
    this.fieldForm = (ref.props || {}).form;
  }

  /**
   *@functionName:   handleSaveBomList
   *@description 保存当前数据
   *@author: 唐加旭
   *@date: 2019-08-19 17:16:03
   *@version: V0.0.1
   * */
  handleSaveBomList = () => {
    const {
      history,
      dispatch,
      defectGroup: {
        defectCodeItem = [],
        mtNcSecondaryCodeList = [],
        mtNcValidOperList = [],
        canBePrimaryCode = true,
      },
    } = this.props;
    delete defectCodeItem.ncGroupAttrList;

    const basicFormDatas = this.basicForm.getFieldsValue();
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.basicForm.validateFieldsAndScroll((errs) => {
          if (!errs) {
            dispatch({
              type: 'defectGroup/saveDefectCodeList',
              payload: {
                mtNcGroup: {
                  ...defectCodeItem,
                  ...values,
                  ...basicFormDatas,
                  ncGroupId: defectCodeItem.ncGroupId || '',
                  closureRequired: basicFormDatas.closureRequired ? 'Y' : 'N',
                  autoCloseIncident: basicFormDatas.autoCloseIncident ? 'Y' : 'N',
                  secondaryReqdForClose: basicFormDatas.secondaryReqdForClose ? 'Y' : 'N',
                  canBePrimaryCode: canBePrimaryCode ? 'Y' : 'N',
                  autoClosePrimary: basicFormDatas.autoClosePrimary ? 'Y' : 'N',
                  validAtAllOperations: basicFormDatas.validAtAllOperations ? 'Y' : 'N',
                  allowNoDisposition: basicFormDatas.allowNoDisposition ? 'Y' : 'N',
                  componentRequired: basicFormDatas.componentRequired ? 'Y' : 'N',
                  confirmRequired: basicFormDatas.confirmRequired ? 'Y' : 'N',
                },

                mtNcSecondaryCodeList: mtNcSecondaryCodeList
                  .filter((ele) => ele._status !== 'create' && ele._status !== 'update')
                  .filter((ele) => ele.flag),

                mtNcValidOperList: mtNcValidOperList
                  .filter((ele) => ele._status !== 'create' && ele._status !== 'update')
                  .filter((ele) => ele.flag),
              },
            }).then((res) => {
              if (res && res.success) {
                notification.success();
                this.setState({
                  canEdit: false,
                });
                dispatch({
                  type: 'defectGroup/fetchSingleCode',
                  payload: {
                    ncGroupId: res.rows,
                  },
                });
                history.push(`/hmes/badcode/defect-group/dist/${res.rows}`);
              } else if (res) {
                notification.error({
                  message: res.message,
                });
              }
            });
          }
        });
      }
    });
  };

  /**
   *@functionName:   changEditStatus
   *@description: 修改编辑状态
   *@author: 唐加旭
   *@date: 2019-08-24 10:43:00
   *@version: V0.0.1
   * */
  changEditStatus = () => {
    this.setState({
      canEdit: true,
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
    const ncGroupId = match.params.id;

    dispatch({
      type: 'defectGroup/fetchAttributeList',
      payload: {
        kid: ncGroupId,
        tableName: TABLENAME,
      },
    }).then((res) => {
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
  handleSave = (dataSource) => {
    const { dispatch, match } = this.props;
    const ncGroupId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'defectGroup/saveAttrList',
        payload: {
          kid: ncGroupId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then((res) => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  headerOnBack = (basePath) => {
    const { history } = this.props;
    // const { state: locationState = {} } = location;
    history.push({
      pathname: `${basePath}/list`,
      // state: verifyObjectHasValue(locationState) ? { ...locationState } : {},
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      saveLoading,
      defectGroup: { tabAttributeList = [] },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const ncGroupId = match.params.id;
    const { canEdit, attributeDrawerVisible } = this.state;

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: ncGroupId,
      canEdit,
      attrList: tabAttributeList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.badCode.defectGroup.title.defectGroup').d('不良代码组维护')}
          backPath={`${basePath}/list`}
          onBack={this.headerOnBack.bind(this, basePath)}
        >
          {!canEdit ? (
            <Button type="primary" icon="edit" onClick={this.changEditStatus}>
              {intl.get('tarzan.common.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button
              type="primary"
              icon="save"
              loading={saveLoading}
              onClick={this.handleSaveBomList}
            >
              {intl.get('tarzan.common.button.save').d('保存')}
            </Button>
          )}
          <Button icon="arrows-alt" onClick={this.openAttrDrawer} disabled={ncGroupId === 'create'}>
            {intl.get('tarzan.common.button.extendedField').d('扩展属性')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} ncGroupId={ncGroupId} canEdit={canEdit} />
          <Tabs defaultActiveKey="basic">
            <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
              <BasicTab onRef={this.onBasicRef} canEdit={canEdit} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.ncCode`).d('不良代码')} key="ncCode">
              <SecCodeTab onRef={this.onPlanRef} canEdit={canEdit} ncGroupId={ncGroupId} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.technology`).d('工艺分配')} key="technology">
              <ProcessTab onRef={this.onProduceRef} ncGroupId={ncGroupId} canEdit={canEdit} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
