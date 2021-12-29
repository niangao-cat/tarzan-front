import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Select, Switch, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { getEditRecord } from '@/utils/utils';


const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.userRights.type.model.type';
/**
 * 单据授权表展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ userRights, loading }) => ({
  userRights,
  saveloading: loading.effects['userRights/saveDocPrivilege'],
  dataloading: loading.effects['userRights/fetchDocPrivilegeList'],
}))
@Form.create({ fieldNameProp: null })
export default class RightsAssignmenDrawer extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      initData,
      userRights: { docPrivilegeList = [], docPrivilegePagination = {} },
    } = this.props;
    const { userOrganizationId } = initData;
    if (
      docPrivilegeList.length === 0 ||
      (docPrivilegeList.length > 0 && docPrivilegeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'userRights/updateState',
        payload: {
          docPrivilegeList: [
            {
              userOrganizationId,
              relId: '',
              _status: 'create',
            },
            ...docPrivilegeList,
          ],
          docPrivilegePagination: addItemToPagination(docPrivilegeList.length, docPrivilegePagination),
        },
      });
    }
  }

  /**
   * 编辑单据授权
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      userRights: { docPrivilegeList },
    } = this.props;
    const newList = docPrivilegeList.map(item => {
      if (record.privilegeId === item.privilegeId) {
        return { ...item, _status: flag ? 'update' : '', originDocPrivilegeCode: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'userRights/updateState',
      payload: { docPrivilegeList: newList },
    });
  }

  // 取消编辑单据授权
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      userRights: { docPrivilegeList, docPrivilegePagination },
    } = this.props;
    const newList = docPrivilegeList.filter(item => item.relId !== record.relId);
    dispatch({
      type: 'userRights/updateState',
      payload: {
        docPrivilegeList: newList,
        docPrivilegePagination: delItemToPagination(docPrivilegeList.length, docPrivilegePagination),
      },
    });
  }

  // 保存单据授权
  @Bind()
  handleSave(record) {
    const {
      dispatch,
      initData,
      userRights: { docPrivilegeList = [] },
    } = this.props;
    const { userOrganizationId } = initData;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields((err) => {
      if (!err) {
        const params = getEditRecord(record, docPrivilegeList, 'privilegeId', needChangeFlags);
        dispatch({
          type: 'userRights/saveDocPrivilege',
          payload: {
            ...params,
            userOrganizationId,
            privilegeId: record.privilegeId,
            tenantId,
          },
        }).then(res => {
          if (res) {
            notification.success();

            // 重新查询
            dispatch({
              type: 'userRights/fetchDocPrivilegeList',
              payload: {
                userOrganizationId,
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
      type: 'userRights/updateState',
      payload: {
        docPrivilegeList: [],
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
      type: 'userRights/fetchDocPrivilegeList',
      payload: {
        userOrganizationId: initData.userOrganizationId,
        page: pagination,
      },
    });
  }

  @Bind()
  changeDocType(index) {
    const {
      dispatch,
      userRights: { docPrivilegeList },
    } = this.props;
    docPrivilegeList[index].locationType = null;
    docPrivilegeList[index].locationTypeMeaning = '';
    dispatch({
      type: 'userRights/updateState',
      payload: { docPrivilegeList },
    });
  }

  @Bind()
  changeLocatorType(value, index) {
    const {
      dispatch,
      userRights: { docPrivilegeList },
    } = this.props;
    docPrivilegeList[index].locationType = value;
    dispatch({
      type: 'userRights/updateState',
      payload: { docPrivilegeList },
    });
  }


  render() {
    const {
      visible,
      saveloading,
      dataloading,
      // initData,
      userRights: { docPrivilegeList = [], docPrivilegePagination = {}, docTypeMap = [], locationTypeMap = [], operationTypeMap = [] },
    } = this.props;
    // const { userOrganizationId } = initData;
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
        title: intl.get(`${modelPrompt}.docTypeMeaning`).d('单据类型'),
        dataIndex: 'docTypeMeaning',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`docType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.docTypeMeaning`).d('单据状态'),
                    }),
                  },
                ],
                initialValue: record.docType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  onChange={() => {
                    record.$form.setFieldsValue({
                      locationType: null,
                      locationTypeMeaning: '',
                    });
                    this.changeDocType(index);
                  }}
                >
                  {docTypeMap.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.locationType`).d('仓库类型'),
        dataIndex: 'locationTypeMeaning',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`locationType`, {
                rules: [
                  {
                    required: !(record.$form.getFieldValue('docType')===undefined||record.$form.getFieldValue('docType')===""||record.$form.getFieldValue('docType')===null||docTypeMap.filter(item=>item.value===record.$form.getFieldValue('docType'))[0].tag!=='Y'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locationTypeMeaning`).d('仓库类型'),
                    }),
                  },
                ],
                initialValue: record.locationType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={record.$form.getFieldValue('docType')===undefined||record.$form.getFieldValue('docType')===""||record.$form.getFieldValue('docType')===null||docTypeMap.filter(item=>item.value===record.$form.getFieldValue('docType'))[0].tag!=='Y'}
                  onChange={value=>this.changeLocatorType(value, index)}
                >
                  {locationTypeMap.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.operationType`).d('操作类型'),
        dataIndex: 'operationTypeMeaning',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.operationTypeMeaning`).d('操作类型'),
                    }),
                  },
                ],
                initialValue: record.operationType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  onChange={this.onOrganizationTypeChange}
                >
                  {operationTypeMap.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag !== 'N',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
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
        title={intl.get('tarzan.event.type.title.object').d('权限分配')}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          loading={saveloading||dataloading}
          rowKey="privilegeId"
          columns={columns}
          dataSource={docPrivilegeList}
          pagination={docPrivilegePagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}
