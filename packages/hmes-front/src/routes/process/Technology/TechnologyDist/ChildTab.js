/**
 *@description 调度工艺模态框
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ExtendModal from './ExtendModal';

const modelPrompt = 'tarzan.process.technology.model.technology';

@connect(({ technology, loading }) => ({
  technology,
  loading: loading.effects['technology/childStepsList'],
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.technology' })
export default class ChildTab extends PureComponent {
  state = {
    visible: false,
    currentData: {},
  };

  // componentDidMount() {
  //   const { operationId } = this.props;
  //   if (operationId !== 'create') {
  //     // this.refresh();
  //   }
  // }

  /**
   *@functionName:   refresh
   *@params {object} pagination 分页查询
   *@description:
   *@author: 唐加旭
   *@date: 2019-08-20 14:32:40
   *@version: V0.0.1
   * */
  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch, operationId } = this.props;
    dispatch({
      type: 'technology/fetchChilStepsList',
      payload: {
        page: pagination,
        operationId,
      },
    });
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      technology: { childStepsList = [], childStepsPagination = {} },
    } = this.props;
    dispatch({
      type: 'technology/updateState',
      payload: {
        childStepsList: [
          {
            operationSubstepId: '',
            _status: 'create',
          },
          ...childStepsList,
        ],
        childStepsPagination: addItemToPagination(childStepsList.length, childStepsPagination),
      },
    });
  }

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      technology: { childStepsList, currentChangeChildSteps },
    } = this.props;
    const newList = childStepsList.map(item => {
      if (record.operationSubstepId === item.operationSubstepId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    const changeData = currentChangeChildSteps.some(
      ele => ele.operationSubstepId === record.operationSubstepId
    )
      ? currentChangeChildSteps.filter(ele => ele.operationSubstepId !== record.operationSubstepId)
      : [
          ...currentChangeChildSteps,
          {
            ...record,
            _status: 'update',
          },
        ];
    dispatch({
      type: 'technology/updateState',
      payload: { childStepsList: newList, currentChangeChildSteps: changeData },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record, index) {
    const {
      dispatch,
      technology: { childStepsList, childStepsPagination = {} },
    } = this.props;
    childStepsList.splice(index, 1);
    dispatch({
      type: 'technology/updateState',
      payload: {
        childStepsList,
        childStepsPagination: delItemToPagination(10, childStepsPagination),
      },
    });
  }

  /**
   *@functionName:   changeCode
   *@params1 {Any} value Lov选中的值
   *@params2 {Object} record 当前Lov选中的详情
   *@params3 {Number} index table表下标
   *@description 设置table表的值
   *@author: 唐加旭
   *@date: 2019-08-20 19:58:38
   *@version: V0.8.6
   * */
  @Bind()
  changeCode = (value, record, index) => {
    const {
      technology: { childStepsList = [], currentChangeChildSteps = [] },
      dispatch,
    } = this.props;
    childStepsList[index].sequence = childStepsList[index].$form.getFieldValue('sequence');
    childStepsList[index].substepName = record.substepName;
    childStepsList[index].operationSubstepId = record.substepId;
    childStepsList[index].substepId = record.substepId;
    childStepsList[index].substepDescription = record.description;
    childStepsList[index].$form.setFieldsValue({
      substepDescription: record.description,
    });
    const newList = currentChangeChildSteps.map(ele => {
      if (ele.operationSubstepId === childStepsList[index].operationSubstepId) {
        return {
          ...ele,
          substepId: value,
        };
      }
      return ele;
    });
    dispatch({
      type: 'technology/updateState',
      payload: {
        childStepsList,
        currentChangeChildSteps: newList,
      },
    });
  };

  /**
   *@functionName:   changeExtendAttr
   *@params1 {Boolean} bool 修改扩展属性值
   *@params2 {Object} record 当前站点
   *@description: 修改扩展属性值
   *@author: 唐加旭
   *@date: 2019-08-20 20:52:07
   *@version: V0.0.1
   * */
  @Bind()
  changeExtendAttr = (bool, record = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchAttributeList',
      payload: {
        kid: record.operationSubstepId,
        tableName: 'mt_operation_substep_attr',
      },
    });
    this.setState({
      visible: bool,
      currentData: record,
    });
  };

  /**
   *@functionName:   deleteData
   *@params1 {Object} record 当前数据
   *@params2 {Number} index 当前数据下标
   *@description 删除数据并本地做好缓存
   *@author: 唐加旭
   *@date: 2019-08-20 19:56:57
   *@version: V0.0.1
   * */
  @Bind()
  deleteData = (record, index) => {
    const {
      dispatch,
      technology: { childStepsList = [], currentChangeChildSteps = [], childStepsPagination = {} },
    } = this.props;
    if (record.operationSubstepId !== '') {
      const currentChangeChildStep = currentChangeChildSteps.filter(
        ele => ele.operationSubstepId !== record.operationSubstepId
      );
      dispatch({
        type: 'technology/deleteChildStepsList',
        payload: parseFloat(record.operationSubstepId),
      }).then(res => {
        if (res && res.success) {
          dispatch({
            type: 'technology/updateState',
            payload: {
              currentChangeChildSteps: currentChangeChildStep,
            },
          });
          this.refresh();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      childStepsList.splice(index, 1);
      dispatch({
        type: 'technology/updateState',
        payload: {
          childStepsList,
          childStepsPagination: delItemToPagination(1, childStepsPagination),
        },
      });
    }
  };

  /**
   *@functionName:   handleOnOk
   *@description 保存分配站点扩展属性
   *@author: 唐加旭
   *@date: 2019-08-20 22:08:30
   *@version: V0.8.6
   * */
  @Bind()
  handleOnOk = () => {
    const {
      dispatch,
      technology: { attrList = [] },
    } = this.props;
    const { currentData } = this.state;
    dispatch({
      type: 'technology/saveAttrList',
      payload: {
        kid: currentData.operationSubstepId,
        attrs: attrList,
        tableName: 'mt_operation_substep_attr',
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.changeExtendAttr(false);
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  changeSequence = (record, value) => {
    const {
      dispatch,
      technology: { currentChangeChildSteps = [] },
    } = this.props;
    const newList = currentChangeChildSteps.map(ele => {
      if (ele.operationSubstepId === record.operationSubstepId) {
        return {
          ...ele,
          sequence: value,
        };
      }
      return ele;
    });
    dispatch({
      type: 'technology/updateState',
      payload: {
        currentChangeChildSteps: newList,
      },
    });
  };

  render() {
    const {
      loading,
      canEdit,
      operationId,
      technology: { childStepsList = [], childStepsPagination = {} },
    } = this.props;
    const { visible } = this.state;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit || operationId === 'create'}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, record, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('顺序'),
        dataIndex: 'sequence',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: val,
              })(
                <InputNumber
                  precision={0}
                  style={{ width: '100%' }}
                  onChange={this.changeSequence.bind(this, record)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.substepName`).d('子步骤编码'),
        dataIndex: 'substepName',
        width: 150,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`substepId`, {
                initialValue: record.substepId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.substepName`).d('子步骤编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.SUBSTEP"
                  disabled={!canEdit}
                  textValue={val}
                  onChange={(value, records) => this.changeCode(value, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('子步骤描述'),
        dataIndex: 'substepDescription',
        // width: 150
      },
      {
        title: intl.get(`${modelPrompt}.extendAttrs`).d('扩展字段'),
        dataIndex: 'extendAttrs',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <a
            disabled={!canEdit || record._status === 'create'}
            onClick={this.changeExtendAttr.bind(this, true, record)}
          >
            {intl.get(`${modelPrompt}.extendAttrs`).d('扩展字段')}
          </a>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true)} disabled={!canEdit}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <div style={{ width: '100%' }}>
        <EditTable
          bordered
          loading={loading}
          rowKey="operationSubstepId"
          columns={columns}
          dataSource={childStepsList}
          pagination={childStepsPagination}
          onChange={this.refresh}
        />
        {visible && (
          <ExtendModal
            visible={visible}
            onCancel={this.changeExtendAttr.bind(this, false)}
            handleOnOk={this.handleOnOk}
          />
        )}
      </div>
    );
  }
}
