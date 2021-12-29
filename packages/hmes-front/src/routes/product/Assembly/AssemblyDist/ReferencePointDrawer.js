import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Spin, InputNumber, Badge, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.product.bom.model.bom';
/**
 * 参考点抽屉表格展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  tenantId: getCurrentOrganizationId(),
  loading: {
    query: loading.effects['assemblyList/fetchKafkaTableData'],
    save: loading.effects['assemblyList/saveKafkaTable'],
    delete: loading.effects['assemblyList/deleteKafkaTable'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class ReferencePointDrawer extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      assemblyList: { referencePointList = [] },
      bomId,
    } = this.props;
    if (
      referencePointList.length === 0 ||
      (referencePointList.length > 0 && referencePointList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'assemblyList/updateState',
        payload: {
          referencePointList: [
            {
              bomReferencePointId: '',
              bomComponentId: bomId,
              lineNumber: '',
              referencePoint: '',
              enableFlag: 'Y',
              qty: '',
              _status: 'create',
            },
            ...referencePointList,
          ],
        },
      });
    }
  }

  /**
   * 编辑参考点
   */
  @Bind()
  handleEdit(record, flag, index) {
    const {
      dispatch,
      assemblyList: { referencePointList = [] },
    } = this.props;
    if (flag) {
      // 开启编辑操作
      referencePointList[index]._status = 'update';
      referencePointList[index].sourceData = { ...referencePointList[index] };
    } else if (referencePointList[index]._status === 'update') {
      // 编辑时取消
      referencePointList[index] = { ...referencePointList[index].sourceData };
      referencePointList[index]._status = undefined;
    } else {
      // 新增时取消
      referencePointList.splice(index, 1);
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        referencePointList,
      },
    });
  }

  @Bind
  onKeyMaterialFlagChange(_, record, index) {
    // 改变开关的状态
    const {
      assemblyList: { referencePointList = [] },
      dispatch,
    } = this.props;
    if (referencePointList[index].enableFlag === 'Y') {
      referencePointList[index].enableFlag = 'N';
    } else {
      referencePointList[index].enableFlag = 'Y';
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        referencePointList,
      },
    });
  }

  @Bind()
  onChangeLineNumber(value, record, index) {
    const {
      assemblyList: { referencePointList = [] },
      dispatch,
    } = this.props;
    referencePointList[index].lineNumber = value;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        referencePointList,
      },
    });
  }

  @Bind()
  onChangeReferencePoint(value, record, index) {
    const {
      assemblyList: { referencePointList = [] },
      dispatch,
    } = this.props;
    referencePointList[index].referencePoint = value.target.value;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        referencePointList,
      },
    });
  }

  @Bind()
  onChangePrimaryQty(value, record, index) {
    const {
      assemblyList: { referencePointList = [] },
      dispatch,
    } = this.props;
    referencePointList[index].qty = value;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        referencePointList,
      },
    });
  }

  // 保存参考点
  @Bind()
  handleSave(record, index) {
    const {
      dispatch,
      assemblyList: { referencePointList = [] },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'assemblyList/saveReferencePoint',
          payload: { ...record },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            referencePointList[index]._status = undefined;
            referencePointList[index].bomReferencePointId = res.rows;
            dispatch({
              type: 'assemblyList/updateState',
              payload: {
                referencePointList,
              },
            });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  render() {
    const {
      visible,
      onCancel,
      canEdit,
      assemblyList: { referencePointList = [] },
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={
              canEdit
                ? { backgroundColor: '#548FFC', color: '#fff' }
                : { backgroundColor: '#DCDCDC', color: '#fff' }
            }
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('排序号'),
        dataIndex: 'lineNumber',
        width: 100,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`lineNumber`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.lineNumber`).d('排序号'),
                    }),
                  },
                ],
                initialValue: record.lineNumber,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  onChange={value => this.onChangeLineNumber(value, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.referencePoint`).d('参考点'),
        dataIndex: 'referencePoint',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`referencePoint`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.referencePoint`).d('参考点'),
                    }),
                  },
                ],
                initialValue: record.referencePoint,
              })(<Input onChange={value => this.onChangeReferencePoint(value, record, index)} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.primaryQty`).d('数量'),
        dataIndex: 'qty',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qty`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.primaryQty`).d('数量'),
                    }),
                  },
                ],
                initialValue: record.qty,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  onChange={value => this.onChangePrimaryQty(value, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        // title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        title: '启用状态',
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag === 'Y',
              })(
                <Switch
                  checked={record.enableFlag === 'Y'}
                  onChange={value => this.onKeyMaterialFlagChange(value, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`${modelPrompt}.yes`).d('启用')
                  : intl.get(`${modelPrompt}.no`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 200,
        align: 'center',
        render: (val, record, index) =>
          canEdit ? (
            <span className="action-link">
              {record._status === 'update' && (
                <Fragment>
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSave(record, index)}>
                    {intl.get('hzero.common.button.save').d('保存')}
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
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSave(record, index)}>
                    {intl.get('hzero.common.button.save').d('保存')}
                  </a>
                </Fragment>
              )}
            </span>
          ) : (
            ''
          ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl
          .get('tarzan.product.bom.title.componentAndReference')
          .d('装配清单行与参考点关系')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '100%' }}>
            <EditTable
              bordered
              rowKey="operationId"
              columns={columns}
              dataSource={referencePointList}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
