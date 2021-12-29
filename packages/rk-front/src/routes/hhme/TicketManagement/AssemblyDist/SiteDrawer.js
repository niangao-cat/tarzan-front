import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Badge, Switch, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';

const tenantId = getCurrentOrganizationId();

const modelPrompt = 'tarzan.product.bom.model.bom';
/**
 * 站点分配抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['assemblyList/saveSite'],
  loading: {
    query: loading.effects['assemblyList/fetchKafkaTableData'],
  },
}))
@Form.create()
export default class SiteDrawer extends PureComponent {
  state = {
    siteName: undefined,
  };

  /**
   * 新建替代组行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      assemblyList: { siteList = [] },
    } = this.props;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        siteList: [
          {
            uuid: uuid(),
            substituteGroup: '',
            enableFlag: 'Y',
            siteId: '',
            siteType: '',
            siteName: '',
            siteCode: '',
            siteTypeDesc: '',
            _status: 'create',
          },
          ...siteList,
        ],
      },
    });
  }

  /**
   * 编辑替代组行
   */
  @Bind()
  handleEdit(record, flag, index) {
    const {
      dispatch,
      assemblyList: { siteList = [] },
    } = this.props;
    if (flag) {
      // 开启编辑操作
      siteList[index]._status = 'update';
      siteList[index].sourceData = { ...siteList[index] };
    } else if (siteList[index]._status === 'update') {
      // 编辑的数据取消
      siteList[index] = { ...siteList[index].sourceData };
      siteList[index]._status = undefined;
    } else {
      // 新增的数据取消
      siteList.splice(index, 1);
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        siteList,
      },
    });
  }

  // 选择站点LOV
  @Bind
  setSiteName(_, record, index) {
    if (record) {
      const {
        assemblyList: { siteList = [] },
        dispatch,
      } = this.props;
      siteList[index].siteId = record.siteId;
      siteList[index].siteName = record.siteName;
      siteList[index].siteType = record.typeDesc;
      siteList[index].siteCode = record.siteCode;
      siteList[index].siteTypeDesc = record.typeDesc;
      dispatch({
        type: 'assemblyList/updateState',
        payload: {
          siteList,
        },
      });
    }
  }

  @Bind
  onKeyMaterialFlagChange(_, record, index) {
    // 改变开关的状态
    const {
      assemblyList: { siteList = [] },
      dispatch,
    } = this.props;
    if (siteList[index].enableFlag === 'Y') {
      siteList[index].enableFlag = 'N';
    } else {
      siteList[index].enableFlag = 'Y';
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        siteList,
      },
    });
  }

  // 保存编辑行
  @Bind
  handleSaveSite(record = {}, index) {
    const {
      dispatch,
      bomId,
      assemblyList: { siteList = [] },
    } = this.props;
    const { assignId, siteId, enableFlag } = record;
    record.$form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'assemblyList/saveSite',
          payload: {
            bomId,
            assignId,
            siteId,
            enableFlag: enableFlag === 'Y' ? 'Y' : 'N',
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            // 请求成功后把数据塞进列表
            siteList[index]._status = undefined;
            siteList[index].assignId = res.rows;
            dispatch({
              type: 'assemblyList/updateState',
              payload: {
                siteList,
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
      assemblyList: { siteList = [] },
      fetchLoading,
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
            onClick={this.handleCreate}
            disabled={!canEdit}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.siteId`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteId`).d('站点编码'),
                    }),
                  },
                ],
                initialValue: record.siteCode,
              })(
                <Lov
                  textValue={record.siteCode}
                  code="MT.SITE"
                  onChange={(value, records) => this.setSiteName(value, records, index)}
                  queryParams={{ tenantId, userFlag: 'Y' }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteType`).d('站点类型'),
        dataIndex: 'siteTypeDesc',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteType`, {
                initialValue: record.siteTypeDesc,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteDescription`).d('站点描述'),
        dataIndex: 'siteName',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteName`, {
                initialValue: record.siteName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.openStatus`).d('启用状态'),
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
                  onChange={() => this.onKeyMaterialFlagChange(val, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`${modelPrompt}.open`).d('启用')
                  : intl.get(`${modelPrompt}.forbidden`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) =>
          canEdit ? (
            <span className="action-link">
              {record._status === 'update' && (
                <Fragment>
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSaveSite(record, index)}>
                    {intl.get(`${modelPrompt}.save`).d('保存')}
                  </a>
                </Fragment>
              )}
              {!(record._status === 'create') && !(record._status === 'update') && (
                <a onClick={() => this.handleEdit(record, true, index)}>
                  {intl.get(`${modelPrompt}.edit`).d('编辑')}
                </a>
              )}

              {record._status === 'create' && (
                <Fragment>
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSaveSite(record, index)}>
                    {intl.get(`${modelPrompt}.save`).d('保存')}
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
        title={intl.get('tarzan.product.bom.title.siteDistribution').d('分配站点')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          loading={fetchLoading}
          bordered
          rowKey="uuid"
          columns={columns}
          dataSource={siteList}
        />
      </Modal>
    );
  }
}
