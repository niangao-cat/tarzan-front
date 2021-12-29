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
// import { verifyObjectHasValue } from '@/utils/utils';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import SecCodeTab from './SecCodeTab';
import ProcessTab from './ProcessTab';
import AttributeDrawer from '@/components/AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.badCode.defectCode.model.defectCode';
const TABLENAME = 'mt_nc_code_attr';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} defectCode - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ defectCode, loading }) => ({
  defectCode,
  saveLoading: loading.effects['defectCode/saveDefectCodeList'],
}))
@formatterCollections({ code: ['tarzan.badCode.defectCode', 'tarzan.common'] })
@Form.create({ fieldNameProp: null })
export default class WorkCellDist extends React.Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const ncCodeId = match.params.id;
    this.fetchCommonOption('NC', 'NC_CODE', 'ncTypeList');
    if (ncCodeId === 'create') {
      this.setState({
        canEdit: true,
      });
    } else {
      dispatch({
        type: 'defectCode/fetchSingleCode',
        payload: {
          ncCodeId,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'defectCode/updateState',
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

  @Bind()
  fetchCommonOption = (typeGroup, module, stateType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'defectCode/fetchCommonOption',
      payload: {
        stateType,
        module,
        typeGroup,
      },
    });
  };

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

  /**
   *@functionName:   handleSaveBomList
   *@description 保存当前数据
   *@author: 唐加旭
   *@date: 2019-08-19 17:16:03
   *@version: V0.0.1
   * */
  handleSaveBomList = () => {
    const {
      dispatch,
      match,
      defectCode: {
        defectCodeItem = [],
        mtNcSecondaryCodeList = [],
        mtNcValidOperList = [],
        canBePrimaryCode = true,
      },
      history,
    } = this.props;

    delete defectCodeItem.ncCodeAttrList;

    const basicFormDatas = this.basicForm.getFieldsValue();
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.basicForm.validateFieldsAndScroll((errs) => {
          if (!errs) {
            const arr = mtNcSecondaryCodeList
              .filter((ele) => ele.flag)
              .filter((ele) => ele.ncCodeId === match.params.id);
            if (arr.length !== 0) {
              notification.error({
                message: intl
                  .get(`tarzan.badCode.defectCode.message.cannotModifySelf`)
                  .d('次级不良代码不能维护为本身'),
              });
              return;
            }
            dispatch({
              type: 'defectCode/saveDefectCodeList',
              payload: {
                mtNcCode: {
                  ...defectCodeItem,
                  ...values,
                  enableFlag: values.enableFlag ? 'Y' : 'N',
                  ...basicFormDatas,
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
                  type: 'defectCode/fetchSingleCode',
                  payload: {
                    ncCodeId: res.rows,
                  },
                });

                history.push(`/hmes/badcode/defect-code/dist/${res.rows}`);
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
    const ncCodeId = match.params.id;

    dispatch({
      type: 'defectCode/fetchAttributeList',
      payload: {
        kid: ncCodeId,
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
    const ncCodeId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'defectCode/saveAttribute',
        payload: {
          kid: ncCodeId,
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
      defectCode: { tabAttributeList = [] },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const ncCodeId = match.params.id;
    const { canEdit, attributeDrawerVisible } = this.state;

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

    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.badCode.defectCode.title.defectCode').d('不良代码维护')}
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
          <Button icon="arrows-alt" onClick={this.openAttrDrawer} disabled={ncCodeId === 'create'}>
            {intl.get('tarzan.common.button.extendedField').d('扩展属性')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} ncCodeId={ncCodeId} canEdit={canEdit} />
          <Tabs defaultActiveKey="basic">
            <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
              <BasicTab onRef={this.onBasicRef} canEdit={canEdit} />
            </TabPane>
            <TabPane
              tab={intl.get(`${modelPrompt}.secondaryNcCode`).d('次级不良代码')}
              key="secondaryNcCode"
            >
              <SecCodeTab onRef={this.onPlanRef} canEdit={canEdit} ncCodeId={ncCodeId} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.technology`).d('工艺分配')} key="technology">
              <ProcessTab onRef={this.onProduceRef} ncCodeId={ncCodeId} canEdit={canEdit} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
