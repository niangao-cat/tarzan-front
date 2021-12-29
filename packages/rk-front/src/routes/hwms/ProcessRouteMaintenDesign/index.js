/**
 * author: ywj
 * des:不良代码指定工艺路线维护
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Select, notification } from 'hzero-ui';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import {
  getCurrentOrganizationId,
  addItemToPagination,
  delItemToPagination,
  getEditTableData,
} from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import MultipleLov from '@/components/MultipleLov';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import HistoryDrawer from './HistoryDrawer';

const { Option } = Select;
const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.processRouteMaintenDesign';

@connect(({ processRouteMaintenDesign, loading }) => ({
  processRouteMaintenDesign,
  fetchListLoading:
    loading.effects['processRouteMaintenDesign/queryList'] ||
    loading.effects['processRouteMaintenDesign/updateData'],
  fetchHistoryLoading: loading.effects['processRouteMaintenDesign/queryHistoryList'],
}))
@Form.create({ fieldNameProp: null })
export default class processRouteMaintenDesign extends Component {
  state = {
    selectedRows: [],
    historyModel: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processRouteMaintenDesign/init',
    });
    dispatch({
      type: 'processRouteMaintenDesign/queryList',
    });
  }

  @Bind
  queryData(page = {}) {
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'processRouteMaintenDesign/queryList',
          payload: {
            ...values,
            page,
          },
        });
      }
    });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 新增数据
  @Bind
  handleCreate() {
    const {
      dispatch,
      processRouteMaintenDesign: { dataList = [], pagination = {} },
    } = this.props;
    // 判断新增之前的数据是否有未填写的， 有着报错
    if (
      dataList.filter(item => item._status === 'update' || item._status === 'create').length > 0
    ) {
      if (getEditTableData(dataList).length === 0) {
        return notification.error({ message: '请先填写必输项' });
      }
    }

    // 进行新增数据
    dispatch({
      type: 'processRouteMaintenDesign/updateState',
      payload: {
        dataList: [
          {
            _status: 'create',
          },
          ...dataList,
        ],
        pagination: addItemToPagination(pagination.length, pagination),
      },
    });
  }

  @Bind()
  handleEditLine(record = {}, index, flag) {
    const {
      dispatch,
      processRouteMaintenDesign: { dataList = [], pagination = {} },
    } = this.props;

    // 取消时
    if (!flag) {
      // 判断是新增还是更新
      if (record._status === 'create') {
        dispatch({
          type: 'processRouteMaintenDesign/updateState',
          payload: {
            dataList: dataList.filter(item => item._status !== 'create'),
            pagination: delItemToPagination(pagination.length, pagination),
          },
        });
      } else {
        dataList[index]._status = '';
        dispatch({
          type: 'processRouteMaintenDesign/updateState',
          payload: {
            dataList,
          },
        });
      }
    } else {
      dataList[index]._status = 'update';
      dispatch({
        type: 'processRouteMaintenDesign/updateState',
        payload: {
          dataList,
        },
      });
    }
  }

  // 保存行信息
  @Bind
  handleSaveLine(record, index) {
    const {
      dispatch,
      processRouteMaintenDesign: { dataList = [], pagination = {} },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        // 进行数据更新
        const dataRecord = {
          ...dataList[index],
          ...record.$form.getFieldsValue(),
        };
        // 调用保存接口
        dispatch({
          type: 'processRouteMaintenDesign/updateData',
          payload: {
            saveData: dataRecord,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.queryData(pagination);
          }
        });
      }
    });
  }

  // 设置显示值
  @Bind
  setCode(index, name, data) {
    const {
      dispatch,
      processRouteMaintenDesign: { dataList = [] },
    } = this.props;
    dataList[index][name] = data;
    dispatch({
      type: 'processRouteMaintenDesign/updateState',
      payload: {
        dataList,
      },
    });
  }

  // 更改选中状态
  @Bind
  onChangeSelected(selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  /**
   * 打开/查询历史数据
   */
  @Bind
  showHistory() {
    const { dispatch } = this.props;
    this.setState({ historyModel: true }, () => {
      dispatch({
        type: 'processRouteMaintenDesign/queryHistoryList',
        payload: {
          ncCodeRouterRelId: this.state.selectedRows[0],
        },
      });
    });
  }

  /**
   * 查询历史数据
   */
  @Bind
  searchHistory(page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'processRouteMaintenDesign/queryHistoryList',
      payload: {
        id: this.state.selectedRows[0],
        page,
      },
    });
  }

  /**
   * 关闭历史数据
   */
  @Bind
  hideHistory() {
    const { dispatch } = this.props;
    this.setState({ historyModel: false }, () => {
      dispatch({
        type: 'processRouteMaintenDesign/updateState',
        payload: {
          dataHistoryList: [],
          histotyPagination: {},
        },
      });
    });
  }

  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      fetchHistoryLoading,
      processRouteMaintenDesign: {
        dataList = [],
        pagination = {},
        flagMap = [],
        dataHistoryList = [],
        histotyPagination = {},
      },
      history,
    } = this.props;

    // 设计选中事件
    const rowsSelection = {
      selectedRowKeys: this.state.selectedRows,
      type: 'radio', // 单选
      columnWidth: 50,
      onChange: this.onChangeSelected,
      getCheckboxProps: record => ({
        disabled: !record.ncCodeRouterRelId,
      }),
    };

    // 历史数据
    const historyTableProps = {
      loading: fetchHistoryLoading,
      visible: this.state.historyModel,
      flagMap,
      dataSource: dataHistoryList,
      pagination: histotyPagination,
      onSearch: this.searchHistory,
      hideHistory: this.hideHistory,
    };

    // 设置显示数据
    const columns = [
      {
        title: '不良代码组编码',
        dataIndex: 'ncGroupCode',
        align: 'center',
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncGroupId`, {
                initialValue: record.ncGroupId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '不良代码组编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.NC_GROUP"
                  queryParams={{ tenantId }}
                  textValue={record.ncGroupCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      ncGroupDescription: item.description,
                      ncCodeId: null,
                      ncCode: null,
                      ncCodeDescription: null,
                    });
                    this.setCode(index, 'ncGroupCode', item.ncGroupCode);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '不良代码组描述',
        dataIndex: 'ncGroupDescription',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncGroupDescription`, {
                initialValue: record.ncGroupDescription,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '不良代码编码',
        dataIndex: 'ncCode',
        align: 'center',
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncCodeId`, {
                initialValue: record.ncCodeId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '不良代码编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.NC_RECORD_LOV"
                  queryParams={{ tenantId, ncObjectId: record.$form.getFieldValue('ncGroupId') }}
                  textValue={record.ncCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      ncCodeDescription: item.description,
                    });
                    this.setCode(index, 'ncCode', item.ncCode);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '不良代码描述',
        dataIndex: 'ncCodeDescription',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncCodeDescription`, {
                initialValue: record.ncCodeDescription,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '产线编码',
        dataIndex: 'prodLineCode',
        align: 'center',
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineId`, {
                initialValue: record.prodLineId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '产线编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.PRODLINE"
                  queryParams={{ tenantId }}
                  textValue={record.prodLineCode}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      prodLineDescription: item.description,
                    });
                    this.setCode(index, 'prodLineCode', item.prodLineCode);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '产线描述',
        dataIndex: 'prodLineDescription',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineDescription`, {
                initialValue: record.prodLineDescription,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '器件类型',
        dataIndex: 'deviceType',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`deviceType`, {
                initialValue: record.deviceType,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '芯片类型',
        dataIndex: 'chipType',
        align: 'center',
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`chipType`, {
                initialValue: record.chipType,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '工艺路线编码',
        dataIndex: 'routerName',
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`routerId`, {
                initialValue: record.routerId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工艺路线编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.ROUTER"
                  queryParams={{ tenantId }}
                  textValue={record.routerName}
                  onChange={(value, item) => {
                    this.setCode(index, 'routerName', item.routerName);
                    record.$form.setFieldsValue({ routerVersion: item.revision, routerDesc: item.routerDesc });
                  }}
                />
              )}
            </Form.Item>
          ) : (
            <a
              onClick={() => {
                history.push(`/hmes/process/routes/dist/${record.routerId}`);
              }}
            >
              {record.routerName}
            </a>
          ),
      },
      {
        title: '工艺路线版本',
        dataIndex: 'routerVersion',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`routerVersion`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '工艺路线描述',
        dataIndex: 'routerDesc',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`routerDesc`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '最后正常工艺',
        dataIndex: 'operationDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`attribute1`, {
                initialValue: record.operationId,
              })(
                <Lov
                  code="MT.OPERATION"
                  queryParams={{ tenantId }}
                  textValue={record.operationDescription}
                />
              )}
            </Form.Item>
          ) : val,
      },
      {
        title: intl.get(`enableFlag`).d('是否启用'),
        dataIndex: 'enableFlag',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`enableFlag`).d('是否启用'),
                    }),
                  },
                ],
                initialValue: val || 'Y',
              })(
                <Select style={{ width: '100%' }}>
                  {flagMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (flagMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        fixed: 'right',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => this.handleEditLine(record, index, false)}>清除</a>&nbsp;&nbsp;
              <a onClick={() => this.handleSaveLine(record, index)}>保存</a>
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => this.handleEditLine(record, index, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => this.handleSaveLine(record, index)}>保存</a>
            </span>
          ) : (
            <a onClick={() => this.handleEditLine(record, index, true)}>编辑</a>
          ),
      },
    ];

    // 获取整个表单
    const { form } = this.props;
    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    //  返回默认界面数据
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('不良代码指定工艺路线维护')}>
          <Button icon="plus" type="primary" onClick={this.handleCreate}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('新建')}
          </Button>
          <Button
            icon="edit"
            onClick={this.showHistory}
            disabled={this.state.selectedRows.length === 0}
          >
            {intl.get(`history`).d('历史')}
          </Button>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="不良代码组">
                  {getFieldDecorator('ncGroupId')(<Lov
                    code="MT.NC_GROUP"
                    queryParams={{ tenantId }}
                    onChange={() => {
                    form.setFieldsValue({ncCodeId: null});
                  }}
                  />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="不良代码">
                  {getFieldDecorator('ncCodeId')(<Lov code="HME.NC_RECORD_LOV" queryParams={{ tenantId, ncObjectId: form.getFieldValue('ncGroupId') }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产线">
                  {getFieldDecorator('prodLineId')(<Lov code="MT.PRODLINE" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                <Form.Item>
                  <Button data-code="reset" onClick={() => this.resetSearch()}>
                    {intl.get('hzero.common.button.reset').d('重置')}
                  </Button>
                  <Button onClick={() => this.queryData()} type="primary" htmlType="submit">
                    {intl.get('hzero.common.button.search').d('查询')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="器件类型">
                  {getFieldDecorator('deviceType')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="芯片类型">
                  {getFieldDecorator('chipType')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="是否启用">
                  {getFieldDecorator('enableFlag')(
                    <Select allowClear>
                      {flagMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工艺路线">
                  {getFieldDecorator('routerId')(<Lov code="MT.ROUTER" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="最后正常工艺">
                  {getFieldDecorator('operationId')(<MultipleLov code="MT.OPERATION" queryParams={{ tenantId }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <EditTable
            bordered
            dataSource={dataList}
            rowKey="ncCodeRouterRelId"
            columns={columns}
            rowSelection={rowsSelection}
            pagination={pagination}
            onChange={page => this.queryData(page)}
            loading={fetchListLoading}
          />
          {this.state.historyModel && <HistoryDrawer {...historyTableProps} />}
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
