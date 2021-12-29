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
import { Form, Button, Popconfirm, Badge, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.badCode.defectCode.model.defectCode';

@connect(({ defectCode, loading }) => ({
  defectCode,
  loading: loading.effects['defectCode/mtNcValidOperList'],
}))
@Form.create()
@formatterCollections({ code: 'tarzan.badCode.defectCode' })
export default class ProcessTab extends PureComponent {

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      defectCode: { mtNcValidOperList = [] },
    } = this.props;
    dispatch({
      type: 'defectCode/updateState',
      payload: {
        mtNcValidOperList: [
          {
            ncValidOperId: '',
            uuid: new Date().getTime().toString(),
            _status: 'create',
          },
          ...mtNcValidOperList,
        ],
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
      defectCode: { mtNcValidOperList },
    } = this.props;
    const newList = mtNcValidOperList.map(item => {
      if (record.ncValidOperId === item.ncValidOperId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'defectCode/updateState',
      payload: { mtNcValidOperList: newList },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record, index) {
    const {
      dispatch,
      defectCode: { mtNcValidOperList },
    } = this.props;
    mtNcValidOperList.splice(index, 1);
    dispatch({
      type: 'defectCode/updateState',
      payload: {
        mtNcValidOperList,
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
      defectCode: { mtNcValidOperList = [] },
      dispatch,
    } = this.props;
    mtNcValidOperList[index].dispositionGroup = record.dispositionGroup;
    dispatch({
      type: 'defectCode/updateState',
      payload: {
        mtNcValidOperList,
      },
    });
  };

  @Bind()
  changeDescCode = (value, record, index) => {
    const {
      defectCode: { mtNcValidOperList = [] },
      dispatch,
    } = this.props;
    mtNcValidOperList[index].operationName = record.operationName;
    dispatch({
      type: 'defectCode/updateState',
      payload: {
        mtNcValidOperList,
      },
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
      defectCode: { mtNcValidOperList = [] },
    } = this.props;
    if (record.ncValidOperId !== '') {
      dispatch({
        type: 'defectCode/deleteProcessDispatch',
        payload: [record.ncValidOperId],
      }).then(res => {
        if (res && res.success) {
          mtNcValidOperList.splice(index, 1);
          dispatch({
            type: 'defectCode/updateState',
            payload: {
              mtNcValidOperList,
            },
          });
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      mtNcValidOperList.splice(index, 1);
      dispatch({
        type: 'defectCode/updateState',
        payload: {
          mtNcValidOperList,
        },
      });
    }
  };

  // 行保存
  handleSaveLine = (record, index) => {
    const {
      dispatch,
      defectCode: { mtNcValidOperList = [] },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        mtNcValidOperList[index] = {
          ...record.$form.getFieldsValue(),
        };
        mtNcValidOperList[index]._status = '';
        mtNcValidOperList[index].flag = true;
        mtNcValidOperList[index].ncValidOperId = record.ncValidOperId;
        mtNcValidOperList[index].uuid = record.uuid;
        mtNcValidOperList[index].operationName = record.operationName;
        mtNcValidOperList[index].dispositionGroup = record.dispositionGroup;
        mtNcValidOperList[index].enableFlag = record.$form.getFieldValue('enableFlag') ? 'Y' : 'N';
        dispatch({
          type: 'defectCode/updateState',
          payload: {
            mtNcValidOperList,
          },
        });
      }
    });
  };

  render() {
    const {
      loading,
      canEdit,
      defectCode: { mtNcValidOperList = [], limitSiteId },
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
            disabled={!canEdit || !limitSiteId}
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
              title={intl.get(`tarzan.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, record, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: intl.get(`${modelPrompt}.operationDesc`).d('工艺编码'),
        dataIndex: 'operationName',
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
                      name: intl.get(`${modelPrompt}.operationDesc`).d('工艺编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.OPERATION"
                  disabled={!canEdit}
                  textValue={val}
                  onChange={(value, records) => this.changeDescCode(value, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.dispositionGroup`).d('处置组'),
        dataIndex: 'dispositionGroup',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`dispositionGroupId`, {
                initialValue: record.dispositionGroupId,
              })(
                <Lov
                  code="MT.DISPOSITION_GROUP"
                  disabled={!canEdit}
                  textValue={val}
                  onChange={(value, records) => this.changeCode(value, records, index)}
                  queryParams={{ tenantId, siteId: limitSiteId }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('tarzan.common.label.enableFlag').d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag === 'Y',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                  record.enableFlag === 'Y'
                    ? intl.get('tarzan.common.label.enable').d('启用')
                    : intl.get('tarzan.common.label.disable').d('禁用')
                }
            />
            ),
      },
      {
        title: intl.get('tarzan.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('tarzan.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('tarzan.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true)} disabled={!canEdit}>
                {intl.get('tarzan.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record, index)}>
                  {intl.get('tarzan.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('tarzan.common.button.save').d('保存')}
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
          rowKey="uuid"
          columns={columns}
          dataSource={mtNcValidOperList}
          pagination={false}
        />
      </div>
    );
  }
}
