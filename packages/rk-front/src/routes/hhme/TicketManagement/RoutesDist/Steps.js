/**
 *@description 工艺步骤
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Checkbox } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import AttributeDrawer from '@/components/AttributeDrawer';
import RouteLinkDetailsDrawer from './RouteLinkDetailsDrawer'; // 类型设置: 嵌套工艺路线
import OperationDetailDrawer from './OperationDetailDrawer'; // 类型设置: 工艺
import RouteStepGroupDrawer from './RouteStepGroupDrawer'; // 类型设置: 步骤组
import NextStepDrawer from './NextStepDrawer'; // 下步骤设置
import StepDrawer from './StepDrawer'; //  工艺步骤新增/编辑抽屉

const modelPrompt = 'tarzan.process.routes.model.routes';
const TABLENAME = 'mt_router_step_attr';

@connect(({ routes }) => ({
  routes,
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.routes' })
export default class Steps extends PureComponent {
  state = {
    attrVisible: false, // 表格扩展字段控制
    routeLinkDetailsVisible: false, // 嵌套工艺路线抽屉显示
    operationDetailsVisible: false, // 工艺信息抽屉显示
    routeStepGroupVisible: false, // 步骤组抽屉显示
    nextStepVisible: false, // 下步骤抽屉显示
    typeDetailsInfo: {}, // 类型详细设置抽屉初始数据
    typeDetailsId: '', // 提供数据的工艺步骤Id
    stepDrawerVisible: false, // 工艺步骤
    editRowDetail: {}, //  编辑的工艺步骤行数据
  };

  //  打开新增/编辑工艺步骤抽屉
  openStepDrawer = (record = {}) => {
    this.setState({
      editRowDetail: record,
      stepDrawerVisible: true,
    });
  };

  //  关闭新增/编辑工艺步骤抽屉
  closeStepDrawer = () => {
    this.setState({
      editRowDetail: {},
      stepDrawerVisible: false,
    });
  };

  /**
   *@functionName deleteData
   *@params {Object} record 删除的数据详情
   *@params {Number} index 删除的数据下标
   *@description 删除工艺步骤
   *@author 唐加旭
   *@date 2019-10-08 19:21:14
   *@version V0.8.6
   * */
  deleteData = record => {
    const {
      dispatch,
      routes: { stepsList = [] },
    } = this.props;
    const newTableList = stepsList.filter(item => item.uuid !== record.uuid);
    dispatch({
      type: 'routes/updateState',
      payload: {
        stepsList: newTableList,
      },
    });
  };

  /**
   *@functionName setDetail
   *@params {Object} record 详细设置的数据
   *@description 打开详细设置抽屉
   *@author 唐加旭
   *@date 2019-10-08 19:35:43
   *@version V0.8.6
   * */
  /* eslint-disable */
  setDetail = record => {
    const routerStepType = record.routerStepType;
    if (routerStepType === 'ROUTER') {
      // 嵌套工艺路线信息
      this.setState({
        routeLinkDetailsVisible: true,
        typeDetailsInfo: record.mtRouterLinkDTO,
        typeDetailsId: record.uuid,
      });
    } else if (routerStepType === 'OPERATION') {
      // 工艺信息
      this.setState({
        operationDetailsVisible: true,
        typeDetailsInfo: record.mtRouterOperationDTO,
        typeDetailsId: record.uuid,
      });
    } else if (routerStepType === 'GROUP') {
      // 步骤组信息
      this.setState({
        routeStepGroupVisible: true,
        typeDetailsInfo: record.mtRouterStepGroupDTO,
        typeDetailsId: record.uuid,
      });
    }
  };
  /* eslint-disable */

  // 下一步骤 设置
  nextStep = record => {
    this.setState({
      nextStepVisible: true,
      typeDetailsInfo: record.mtRouterNextStepDTO || [],
      typeDetailsId: record.uuid,
    });
  };

  /**
   *@functionName extendModalOpen
   *@params {Object} record 编辑扩展字段的数据详情
   *@description 开打扩展字段详情
   *@author 唐加旭
   *@date 2019-10-08 20:00:13
   *@version V0.8.6
   * */
  extendModalOpen = record => {
    if (!record.routerStepId) {
      Modal.warning({
        title: intl
          .get('tarzan.process.routesManager.message.saveFirst')
          .d('请先保存已维护的工艺路线数据'),
      });
      return null;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'routes/featchTableAttrList',
      payload: {
        kid: record.routerStepId,
        tableName: TABLENAME,
      },
    });
    this.setState({
      attrVisible: true,
      editRowDetail: record,
    });
  };

  /**
   *@functionName extendModalClose
   *@description 关闭扩展字段模态框
   *@author 唐加旭
   *@date 2019-10-08 20:03:38
   *@version V0.8.6
   * */
  extendModalClose = () => {
    this.setState({
      attrVisible: false,
      editRowDetail: {},
    });
  };

  /**
   *@functionName handleOnOk
   *@description 确定编辑扩展字段
   *@author 唐加旭
   *@date 2019-10-08 20:04:49
   *@version V0.8.6
   * */
  handleOnOk = dataSource => {
    const { dispatch } = this.props;
    const { editRowDetail } = this.state;
    // TODO 缺少表名，kid
    dispatch({
      type: 'routes/saveTableAttrList',
      payload: {
        kid: editRowDetail.routerStepId,
        attrs: dataSource,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.extendModalClose();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  /**
   *@functionName   quietNest
   *@description 退出模态框
   *@author 唐加旭
   *@date 2019-10-09 10:41:33
   *@version V0.8.6
   * */
  quietNest = visibleProps => {
    this.setState({
      [visibleProps]: false,
    });
  };

  /**
   *@functionName  routeLinkHandle
   *@params {Object} record 选择的参数
   *@description 设置好对应的类型详情
   *@author 唐加旭
   *@date 2019-10-09 10:43:14
   *@version V0.8.6
   * */
  routeLinkHandle = (values, recordUuId, type, visible) => {
    const {
      dispatch,
      routes: { stepsList = [] },
    } = this.props;
    /**
     * 步骤识别码唯一性校验
     * stepName为步骤识别码
     * 当行中routerStepType===GROUP的时候mtRouterStepGroupDTO下的mtRouterStepGroupStepDTO的每一行也有stepName
     */
    if (type === 'mtRouterStepGroupDTO' && this.repeatedStepName(values)) {
      notification.error({
        message: intl
          .get(`${modelPrompt}.repeatedStepName`)
          .d('步骤识别码存在重复，请修改后再保存'),
      });
      return;
    }
    const newStepsList = stepsList.map(item => {
      if (item.uuid === recordUuId) {
        return {
          ...item,
          [type]: type === 'mtRouterNextStepDTO' ? values : { ...values },
        };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'routes/updateState',
      payload: {
        stepsList: newStepsList,
      },
    });
    this.setState({
      [visible]: false,
    });
  };

  /* eslint-disable */
  //  判断是否有重复的stepName
  repeatedStepName = values => {
    const {
      routes: { stepsList = [] },
    } = this.props;
    const stepNameArray = [
      ...values.mtRouterStepGroupStepDTO.map(item => {
        return item.stepName;
      }),
      ...stepsList.map(item => {
        return item.stepName;
      }),
    ];
    const hash = {};
    for (const i in stepNameArray) {
      if (hash[stepNameArray[i]]) {
        return true;
      }
      hash[stepNameArray[i]] = true;
    }
    return false;
  };
  /* eslint-disable */

  render() {
    const {
      routerId,
      loading,
      canEdit,
      routes: {
        stepsList = [],
        stepTypeList = [],
        stepDecisionList = [],
        returnTypeList = [],
        tabbleAttrList = [],
      },
    } = this.props;
    const {
      attrVisible,
      routeLinkDetailsVisible,
      operationDetailsVisible,
      routeStepGroupVisible,
      nextStepVisible,
      typeDetailsInfo,
      typeDetailsId,
      stepDrawerVisible,
      editRowDetail,
    } = this.state;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit && routerId !== 'create'}
            onClick={this.openStepDrawer}
          />
        ),
        align: 'center',
        width: 60,
        render: () =>
          (
            <Button icon="minus" shape="circle" size="small" disabled />
          ),
        // render: record =>
        //   !canEdit ? (
        //     <Button icon="minus" shape="circle" size="small" disabled />
        //   ) : (
        //     <Popconfirm
        //       title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
        //       onConfirm={this.deleteData.bind(this, record)}
        //     >
        //       <Button icon="minus" shape="circle" size="small" />
        //     </Popconfirm>
        //   ),
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('步骤识别码'),
        dataIndex: 'stepName',
        width: 120,
        render: (val, record) => (
          <span className="action-link">
            <a
              disabled={!canEdit}
              onClick={() => {
                this.openStepDrawer(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('步骤描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.routerStepType`).d('步骤类型'),
        dataIndex: 'routerStepType',
        width: 160,
        render: val => {
          return (stepTypeList.filter(ele => ele.typeCode === val)[0] || {}).description;
        },
      },
      {
        title: intl.get(`${modelPrompt}.entryStepFlag`).d('入口步骤'),
        dataIndex: 'entryStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox disabled checked={val === 'Y'} />,
      },
      {
        title: intl.get(`${modelPrompt}.queueDecisionType`).d('路径选择策略'),
        dataIndex: 'queueDecisionType',
        width: 180,
        render: val => (stepDecisionList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.routerDoneStepFlag`).d('完成步骤'),
        dataIndex: 'routerDoneStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox disabled checked={val === 'Y'} />,
      },
      {
        title: intl.get(`${modelPrompt}.keyStepFlag`).d('关键步骤'),
        dataIndex: 'keyStepFlag',
        width: 100,
        align: 'center',
        render: val => <Checkbox disabled checked={val === 'Y'} />,
      },
      {
        title: intl.get(`${modelPrompt}.mtRouterReturnStepDTO`).d('返回步骤策略'),
        dataIndex: 'mtRouterReturnStepDTO',
        width: 160,
        render: val =>
          val && val.returnType
            ? (returnTypeList.filter(ele => ele.typeCode === val.returnType)[0] || {}).description
            : null,
      },
      {
        title: intl.get(`${modelPrompt}.returnOperationId`).d('返回步骤指定工艺'),
        dataIndex: 'returnOperationId',
        width: 150,
        render: (val, record) =>
          record.mtRouterReturnStepDTO ? record.mtRouterReturnStepDTO.operationName : null,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 300,
        fixed: 'right',
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => this.nextStep(record)}>
              {intl.get(`${modelPrompt}.siteCode`).d('下一步骤')}
            </a>
            <a onClick={() => this.setDetail(record)}>类型详细设置</a>
            <a onClick={() => this.extendModalOpen(record)}>扩展字段</a>
          </span>
        ),
      },
    ];
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attrVisible,
      tableName: TABLENAME,
      canEdit,
      attrList: tabbleAttrList,
      onCancel: this.extendModalClose,
      onSave: this.handleOnOk,
    };
    const routeLinkDetailsProps = {
      visible: routeLinkDetailsVisible,
      onCancel: this.quietNest,
      routeLinkHandle: this.routeLinkHandle,
      dataSource: typeDetailsInfo || {},
      dataSourceId: typeDetailsId,
      canEdit,
    };
    const operationDetailsProps = {
      visible: operationDetailsVisible,
      onCancel: this.quietNest,
      routeLinkHandle: this.routeLinkHandle,
      dataSource: typeDetailsInfo || {},
      dataSourceId: typeDetailsId,
      canEdit,
    };
    const routeStepGroupProps = {
      visible: routeStepGroupVisible,
      onCancel: this.quietNest,
      routeLinkHandle: this.routeLinkHandle,
      dataSource: typeDetailsInfo || {},
      dataSourceId: typeDetailsId,
      canEdit,
    };
    const routeNextStepProps = {
      visible: nextStepVisible,
      onCancel: this.quietNest,
      routeLinkHandle: this.routeLinkHandle,
      dataSource: typeDetailsInfo || {},
      dataSourceId: typeDetailsId,
      canEdit,
    };

    // 工艺步骤抽屉
    const stepDrawerProps = {
      visible: stepDrawerVisible,
      onCancel: this.closeStepDrawer,
      dataSource: editRowDetail,
    };

    return (
      <div style={{ width: '100%' }}>
        <EditTable
          bordered
          loading={loading}
          rowKey="uuid"
          columns={columns}
          dataSource={stepsList}
          scroll={{ x: tableScrollWidth(columns) }}
          pagination={false}
        />
        {attrVisible && <AttributeDrawer {...attributeDrawerProps} />}
        {routeLinkDetailsVisible && <RouteLinkDetailsDrawer {...routeLinkDetailsProps} />}
        {operationDetailsVisible && <OperationDetailDrawer {...operationDetailsProps} />}
        {routeStepGroupVisible && <RouteStepGroupDrawer {...routeStepGroupProps} />}
        {nextStepVisible && <NextStepDrawer {...routeNextStepProps} />}
        {stepDrawerVisible && <StepDrawer {...stepDrawerProps} />}
      </div>
    );
  }
}
