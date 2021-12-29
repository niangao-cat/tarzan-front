import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { getEditRecord } from '@/utils/utils';
import Lov from 'components/Lov';


const tenantId = getCurrentOrganizationId();
const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
/**
 * 工艺实验代码表展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ barcodeQuery, loading }) => ({
  barcodeQuery,
  saveloading: loading.effects['barcodeQuery/saveOperationLabCode'],
  dataloading: loading.effects['barcodeQuery/fetchOperationLabCodeList'],
}))
@Form.create({ fieldNameProp: null })
export default class OperationLabCode extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      initData,
      barcodeQuery: { operationLabCodeList = [], operationLabCodePagination = {} },
    } = this.props;
    const { materialLotId } = initData;
    if (
      operationLabCodeList.length === 0 ||
      (operationLabCodeList.length > 0 && operationLabCodeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'barcodeQuery/updateState',
        payload: {
          operationLabCodeList: [
            {
              materialLotId,
              relId: '',
              _status: 'create',
            },
            ...operationLabCodeList,
          ],
          operationLabCodePagination: addItemToPagination(operationLabCodeList.length, operationLabCodePagination),
        },
      });
    }
  }

  /**
   * 编辑工艺实验代码
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      barcodeQuery: { operationLabCodeList },
    } = this.props;
    const newList = operationLabCodeList.map(item => {
      if (record.kid === item.kid) {
        return { ...item, _status: flag ? 'update' : '', originDocPrivilegeCode: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: { operationLabCodeList: newList },
    });
  }

  // 取消编辑工艺实验代码
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      barcodeQuery: { operationLabCodeList, operationLabCodePagination },
    } = this.props;
    const newList = operationLabCodeList.filter(item => item.relId !== record.relId);
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        operationLabCodeList: newList,
        operationLabCodePagination: delItemToPagination(operationLabCodeList.length, operationLabCodePagination),
      },
    });
  }

  // 保存工艺实验代码
  @Bind()
  handleSave(record) {
    const {
      dispatch,
      initData,
      barcodeQuery: { operationLabCodeList = [] },
    } = this.props;
    const { materialLotId } = initData;
    record.$form.validateFields((err) => {
      if (!err) {
        const params = getEditRecord(record, operationLabCodeList, 'kid');
        dispatch({
          type: 'barcodeQuery/saveOperationLabCode',
          payload: {
            ...params,
            materialLotId,
            kid: record.kid,
            tenantId,
          },
        }).then(res => {
          if (res) {
            notification.success();

            // 重新查询
            dispatch({
              type: 'barcodeQuery/fetchOperationLabCodeList',
              payload: {
                materialLotId,
              },
            });
          }
        });
      }
    });
  }


  @Bind
  handleCancel() {
    const { onCancel, dispatch } = this.props;
    dispatch({
      type: 'barcodeQuery/updateState',
      payload: {
        operationLabCodeList: [],
      },
    });
    onCancel();
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    const { dispatch, initData } = this.props;
    dispatch({
      type: 'barcodeQuery/fetchOperationLabCodeList',
      payload: {
        materialLotId: initData.materialLotId,
        page: pagination,
      },
    });
  }

  render() {
    const {
      visible,
      saveloading,
      dataloading,
      // initData,
      barcodeQuery: { operationLabCodeList = [], operationLabCodePagination = {}, enabledMap = [] },
    } = this.props;
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
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.operationName`).d('工艺'),
        dataIndex: 'operationName',
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`operationId`, {
              initialValue: record.operationId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.operationName`).d('工艺'),
                  }),
                },
              ],
            })(
              <Lov
                code="MT.OPERATION"
                textValue={val}
                queryParams={{ tenantId }}
                onChange={(value, item) => {
                  record.$form.setFieldsValue({
                    description: item.description,
                  });
                }}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('工艺描述'),
        dataIndex: 'description',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('description', {
                initialValue: record.description,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('labCode', {
                initialValue: record.labCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
                    }),
                  },
                ],
              })(<Input trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('实验备注'),
        dataIndex: 'remark',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: record.remark,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enabledFlag`).d('有效性'),
        dataIndex: 'enabledFlagMeaning',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enabledFlag', {
                initialValue: !record.enabledFlag ? 'Y' : record.enabledFlag,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.enabledFlag`).d('有效性'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {enabledMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.type.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true, index)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.type.button.save').d('保存')}
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
        width={1200}
        title={intl.get('tarzan.event.type.title.object').d('工艺实验代码')}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          loading={saveloading||dataloading}
          rowKey="kid"
          columns={columns}
          dataSource={operationLabCodeList}
          pagination={operationLabCodePagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}
