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
import { Modal, Form, Button, Spin, Popconfirm } from 'hzero-ui';
import notification from 'utils/notification';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.org.proline.model.proline';

@connect(({ proline }) => ({
  proline,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.proline',
})
export default class DispatchDrawer extends PureComponent {
  //  表格翻页等
  @Bind()
  handleTableChange = (pagination = {}) => {
    const { dispatch, prodLineId } = this.props;
    dispatch({
      type: 'proline/featchDispatchList',
      payload: {
        page: pagination,
        prodLineId,
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
      proline: { proDispatchList = [], proDispatchPagination = {} },
    } = this.props;
    if (
      proDispatchList.length === 0 ||
      (proDispatchList.length > 0 && proDispatchList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'proline/updateState',
        payload: {
          proDispatchList: [
            {
              dispatchOperationId: undefined,
              operationId: '',
              _status: 'create',
            },
            ...proDispatchList,
          ],
          proDispatchPagination: addItemToPagination(proDispatchList.length, proDispatchPagination),
        },
      });
    }
  }

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      proline: { proDispatchList },
    } = this.props;
    const newList = proDispatchList.map(item => {
      if (record.operationId === item.operationId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'proline/updateState',
      payload: { proDispatchList: newList },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      proline: { proDispatchList, proDispatchPagination = {} },
    } = this.props;
    const newList = proDispatchList.filter(item => item.operationId !== record.operationId);
    dispatch({
      type: 'proline/updateState',
      payload: {
        proDispatchList: newList,
        proDispatchPagination: delItemToPagination(10, proDispatchPagination),
      },
    });
  }

  // 保存对象属性
  @Bind()
  handleSave(record, index) {
    const {
      dispatch,
      proline: { proDispatchList = [] },
      prodLineId,
    } = this.props;
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'proline/saveDispatchMethods',
          payload: {
            operationId: values.operationId,
            dispatchOperationId: record.dispatchOperationId,
            prodLineId,
          },
        }).then(res => {
          if (res && res.success) {
            proDispatchList[index] = {
              ...proDispatchList[index],
              ...values,
              ...res.rows,
              _status: '',
            };
            dispatch({
              type: 'proline/updateState',
              payload: {
                proDispatchList,
              },
            });
            notification.success();
          } else if (res) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  // // 批量保存
  // @Bind()
  // makeSureChange = () => {
  //   const {
  //     proline: { proDispatchList = [] },
  //     onCancel,
  //     dispatch,
  //     prodLineId,
  //   } = this.props;
  //   const middle = proDispatchList.filter(
  //     ele => ele._status === 'update' || ele._status === 'create'
  //   );
  //   let flag = true;
  //   middle.map(ele => {
  //     ele.$form.validateFields(err => {
  //       if (err) {
  //         flag = false;
  //         // return false;
  //       }
  //     });
  //     return ele;
  //   });
  //   // for (const value of middle) {
  //   //   value.
  //   // }
  //   if (!flag) {
  //     dispatch({
  //       type: 'proline/saveDispatchMethods',
  //       payload: middle.map(ele => ({
  //         operationId: ele.operationId,
  //         dispatchOperationId: ele.dispatchOperationId,
  //         prodLineId,
  //       })),
  //     }).then(res => {
  //       if (res && res.success) {
  //         onCancel();
  //       } else if (res) {
  //         notification.error({
  //           message: res.message,
  //         });
  //       }
  //     });
  //   }
  // };

  @Bind()
  changeCode = (value, record, records, index) => {
    const {
      proline: { proDispatchList = [] },
      dispatch,
    } = this.props;
    if (!proDispatchList[index].$form.getFieldValue('operationName')) {
      proDispatchList[index].$form.getFieldDecorator(`operationName`);
    }
    proDispatchList[index].$form.setFieldsValue({
      operationId: record.operationId,
      description: record.description,
      revision: record.revision,
      operationName: record.operationName,
    });
    dispatch({
      type: 'proline/updateState',
      payload: {
        proDispatchList,
      },
    });
  };

  @Bind()
  deleteData = (val, record) => {
    const { dispatch } = this.props;
    if (val && val !== '') {
      dispatch({
        type: 'proline/deleteDispatchMethods',
        payload: [val],
      }).then(res => {
        if (res && res.success) {
          this.handleCleanLine(record);
        }
        notification.success();
      });
    } else {
      this.handleCleanLine(record);
    }
  };

  render() {
    const {
      visible,
      onCancel,
      proline: { proDispatchList = [], proDispatchPagination = {}, productionLine = {} },
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        dataIndex: 'dispatchOperationId',
        width: 60,
        render: (val, record) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={this.deleteData.bind(this, val, record)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码'),
        dataIndex: 'prodLineCode',
        width: 100,
        render: () => productionLine.prodLineCode,
      },
      {
        title: intl.get(`${modelPrompt}.operationCode`).d('工艺编码'),
        dataIndex: 'operationId',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationId`, {
                initialValue: record.operationId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.operationName`).d('工艺编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.OPERATION"
                  textValue={record.operationName}
                  onChange={(value, records) => this.changeCode(value, records, record, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            record.operationName
          ),
      },
      {
        title: intl.get(`${modelPrompt}.operationDesc`).d('工艺描述'),
        dataIndex: 'description',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: val,
              })(<>{record.$form.getFieldValue('description')}</>)}
            </Form.Item>
          ) : (
            val
          ),
      },
      // {
      //   title: intl.get(`${modelPrompt}.sites`).d('站点'),
      //   dataIndex: 'sites',
      //   width: 100,
      // },
      {
        title: intl.get(`${modelPrompt}.revision`).d('工艺版本'),
        dataIndex: 'revision',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`revision`, {
                initialValue: val,
              })(<>{record.$form.getFieldValue('revision')}</>)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.org.proline.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true)}>
                {intl.get('tarzan.org.proline.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.org.proline.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.org.proline.title.setDispatchOperation').d('指定调度工艺')}
        visible={visible}
        onCancel={onCancel}
        // onOk={this.makeSureChange}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '100%' }}>
            <EditTable
              bordered
              rowKey="dispatchOperationId"
              columns={columns}
              dataSource={proDispatchList}
              pagination={proDispatchPagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
