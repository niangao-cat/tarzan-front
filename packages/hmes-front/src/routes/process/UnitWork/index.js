/**
 * @description: 工艺与工作单元维护
 * @author: lidong
 * @date: 2019-12-12
 * @version: V0.0.1
 * */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, InputNumber, Popconfirm, Input } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.process.unitWork.model.unitWork';

@connect(({ unitWork, loading }) => ({
  unitWork,
  tabLoading: loading.effects['unitWork/fetchTableList'],
  saveLoading: loading.effects['unitWork/savLocatorGroupList'],
  deleteLoading: loading.effects['unitWork/deleteItem'],
}))
@formatterCollections({
  code: 'tarzan.process.unitWork',
})
export default class LocatorGroup extends React.Component {
  state = {
    search: {},
    selectedRows: [],
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    this.setState({
      selectedRows: [],
    });
    dispatch({
      type: 'unitWork/fetchTableList',
      payload: {
        ...search,
        page: pagination,
      },
    }).then(res => {
      if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.indexOf(null) !== -1) {
      selectedRows.splice(selectedRows.indexOf(null), 1);
    }
    if (selectedRows.length >= 1) {
      dispatch({
        type: 'unitWork/deleteItem',
        payload: {
          selectedRows,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.refresh();
        }
      });
    } else {
      this.refresh();
    }
  };

  onResetSearch = () => {
    this.setState({
      search: {},
    });
  };

  handleCreateEventRequestType = () => {
    const {
      dispatch,
      unitWork: { tableList = [], tablePagination = {} },
    } = this.props;
    if (tableList.length === 0 || (tableList.length > 0 && tableList[0]._status !== 'create')) {
      dispatch({
        type: 'unitWork/updateState',
        payload: {
          tableList: [
            {
              operationWkcDispatchRelId: null,
              _status: 'create',
            },
            ...tableList,
          ],
          tablePagination: addItemToPagination(tableList.length, tablePagination),
        },
      });
    }
  };

  handleEditMessage = (record, bool) => {
    const {
      unitWork: { tableList = [] },
      dispatch,
    } = this.props;
    const newList = tableList.map(item => {
      if (record.operationWkcDispatchRelId === item.operationWkcDispatchRelId) {
        return { ...item, _status: bool ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'unitWork/updateState',
      payload: {
        tableList: newList,
      },
    });
  };

  handleCleanLine = () => {
    const {
      dispatch,
      unitWork: { tableList = [], tablePagination = {} },
    } = this.props;
    tableList.splice(0, 1);
    dispatch({
      type: 'unitWork/updateState',
      payload: {
        tableList,
        tablePagination: delItemToPagination(tablePagination.pageSize, tablePagination),
      },
    });
  };

  updateOperation = (value, record, index) => {
    const {
      dispatch,
      unitWork: { tableList = [] },
    } = this.props;
    tableList[index].operationId = record.operationId;
    tableList[index].description = record.description;
    dispatch({
      type: 'unitWork/updateState',
      payload: {
        tableList,
      },
    });
  };

  updateWorkCell = (value, record, index) => {
    const {
      dispatch,
      unitWork: { tableList = [] },
    } = this.props;
    tableList[index].workcellId = record.workcellId;
    tableList[index].workcellName = record.workcellName;
    dispatch({
      type: 'unitWork/updateState',
      payload: {
        tableList,
      },
    });
  };

  handleSave = record => {
    const { dispatch } = this.props;
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'unitWork/saveList',
          payload: {
            ...values,
            operationWkcDispatchRelId: record.operationWkcDispatchRelId,
          },
        }).then(res => {
          if (res && res.success) {
            this.refresh();
          } else if (res) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  onChange = selectedRows => {
    this.setState({
      selectedRows,
    });
  };

  render() {
    const {
      tabLoading,
      deleteLoading,
      unitWork: { tableList = [], tablePagination = {} },
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    const { selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.operationName`).d('工艺名称'),
        dataIndex: 'operationName',
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.operationName`).d('工艺名称'),
                    }),
                  },
                ],
                initialValue: record.operationId,
              })(
                <Lov
                  code="MT.OPERATION"
                  textValue={val}
                  queryParams={{ tenantId }}
                  onChange={(vals, records) => this.updateOperation(vals, records, index)}
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
      },
      {
        title: intl.get(`${modelPrompt}.workCellCode`).d('工作单元编码'),
        dataIndex: 'workcellCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.workCellCode`).d('工作单元编码'),
                    }),
                  },
                ],
                initialValue: record.workcellId,
              })(
                <Lov
                  code="MT.WORKCELL"
                  textValue={val}
                  queryParams={{ tenantId }}
                  onChange={(vals, records) => this.updateWorkCell(vals, records, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('WKC描述'),
        dataIndex: 'workcellName',
      },
      {
        title: intl.get(`${modelPrompt}.priority`).d('优先级'),
        dataIndex: 'priority',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`priority`, {
                initialValue: record.priority,
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('工艺别名'),
        dataIndex: 'stepName',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`stepName`, {
                initialValue: record.stepName,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditMessage(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditMessage(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <>
        <Header title={intl.get(`${modelPrompt}.unitWork`).d('工艺与工作单元维护')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateEventRequestType}>
            {intl.get(`${modelPrompt}.create`).d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
              {intl.get(`${modelPrompt}.delete`).d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.delete}
            >
              <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
                {intl.get(`${modelPrompt}.delete`).d('删除')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <EditTable
            loading={tabLoading}
            rowKey="operationWkcDispatchRelId"
            rowSelection={rowSelection}
            dataSource={tableList}
            columns={columns}
            pagination={tablePagination || {}}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </>
    );
  }
}
