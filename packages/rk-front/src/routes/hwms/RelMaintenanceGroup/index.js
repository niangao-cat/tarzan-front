/**
 * author: ywj
 * des:质检员与物料组关系维护
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Select, notification } from 'hzero-ui';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
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

const { Option } = Select;
const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.relMaintenanceGroup';

@connect(({ relMaintenanceGroup, loading }) => ({
  relMaintenanceGroup,
  fetchListLoading: loading.effects['relMaintenanceGroup/queryList']||loading.effects['relMaintenanceGroup/updateData'],
}))
@Form.create({ fieldNameProp: null })
export default class relMaintenanceGroup extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'relMaintenanceGroup/init',
    });
    dispatch({
      type: 'relMaintenanceGroup/queryList',
    });
  }

  @Bind
  queryData() {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'relMaintenanceGroup/queryList',
          payload: {
            ...values,
          },
        });
      }
    });
  }

  @Bind
  queryDataByPanigation(page = {}) {
    const { dispatch } = this.props;

    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        // 根据页数查询报表信息
        dispatch({
          type: 'relMaintenanceGroup/queryList',
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
      relMaintenanceGroup: { dataList = [], pagination = {} },
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
      type: 'relMaintenanceGroup/updateState',
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
      relMaintenanceGroup: { dataList = [], pagination = {} },
    } = this.props;

    // 取消时
    if (!flag) {
      // 判断是新增还是更新
      if (record._status === 'create') {
        dispatch({
          type: 'relMaintenanceGroup/updateState',
          payload: {
            dataList: dataList.filter(item=>item._status!=='create'),
            pagination: delItemToPagination(pagination.length, pagination),
          },
        });
      } else {
        dataList[index]._status = '';
        dispatch({
          type: 'relMaintenanceGroup/updateState',
          payload: {
            dataList,
          },
        });
      }
    } else {
      dataList[index]._status = 'update';
      dispatch({
        type: 'relMaintenanceGroup/updateState',
        payload: {
          dataList,
        },
      });
    }
  }

  // 保存行信息
  @Bind
  saveData() {
    const {
      dispatch,
      relMaintenanceGroup: { dataList = [] },
    } = this.props;
    const params = getEditTableData(dataList, ['relId']);
    if (params.length === 0) {
      return notification.error({ message: '无保存数据' });
    }

    // 调用保存接口
    dispatch({
      type: 'relMaintenanceGroup/updateData',
      payload: {
        saveData: params,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '保存成功' });
        const { form } = this.props;
        form.validateFields((errs, values) => {
          if (!errs) {
            // 根据页数查询报表信息
            dispatch({
              type: 'relMaintenanceGroup/queryList',
              payload: {
                ...values,
              },
            });
          }
        });
      } else {
        notification.error({ message: res?res.message: '未知错误请联系管理员' });
      }
    });
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/rel-maintenance-group/data-import/HME.INSPECTOR_ITEM_GROUP_REL`,
      title: intl.get('hwms.machineBasic.view.message.import').d('质检员与物料组关系维护数据导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('质检员与物料组关系维护数据导入'),
      }),
    });
  }

  @Bind
  setLineData(index, item){
    const {
      dispatch,
      relMaintenanceGroup: { dataList = [] },
    } = this.props;
    dataList[index].itemGroupCode = item.itemGroupCode;
    dataList[index].itemGroupDescription = item.itemGroupDescription;
    dispatch({
      type: 'relMaintenanceGroup/updateState',
      payload: {
        dataList,
      },
    });
  }


  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      relMaintenanceGroup: { dataList = [], pagination = {}, typeMap = [], flagMap = [] },
    } = this.props;

    // 设置显示数据
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => this.handleCreate()}
          />
        ),
        align: 'center',
      },
      {
        title: '序号',
        dataIndex: 'sequenceNum',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: '用户',
        dataIndex: 'loginName',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`userId`, {
                initialValue: record.userId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '用户',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.USER"
                  queryParams={{ tenantId }}
                  textValue={record.loginName}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      realName: item.realName,
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
        title: '姓名',
        dataIndex: 'realName',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`realName`, {
                initialValue: record.realName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`itemGroupCode`).d('权限类型'),
        dataIndex: 'privilegeType',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`privilegeType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`privilegeType`).d('权限类型'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select style={{ width: '100%' }}>
                  {typeMap.map(ele => (
                    <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (typeMap.filter(ele => ele.value === val)[0] || {}).meaning
          ),
      },
      {
        title: '物料组',
        dataIndex: 'itemGroupCode',
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`itemGroupId`, {
                initialValue: record.itemGroupId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料组',
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.ITEM_GROUP"
                  queryParams={{ tenantId }}
                  textValue={record.itemGroupCode}
                  onChange={(value, item) => {
                    this.setLineData(index, item);
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '物料组描述',
        dataIndex: 'itemGroupDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`itemGroupDescription`, {
                initialValue: record.itemGroupDescription,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`enableFlag`).d('有效性'),
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
                      name: intl.get(`enableFlag`).d('有效性'),
                    }),
                  },
                ],
                initialValue: val,
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
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <a onClick={() => this.handleEditLine(record, index, false)}>取消</a>
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('质检员与物料组关系维护')}>
          <Button type="primary" onClick={this.saveData}>
            {intl.get('hzero.purchase.button.save').d('保存')}
          </Button>
          <Button type="primary" onClick={() => this.exImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('导入')}
          </Button>
        </Header>
        <Content>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="用户">
                  {getFieldDecorator(
                    'loginName',
                    {}
                  )(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="权限类型">
                  {getFieldDecorator(
                    'inspectPowerType',
                    {}
                  )(
                    <Select allowClear>
                      {typeMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
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
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料组">
                  {getFieldDecorator(
                    'itemGroupId',
                    {}
                  )(<Lov
                    code="WMS.ITEM_GROUP"
                    queryParams={{ tenantId }}
                    textField='itemGroup'
                    onChange={(value, item)=>{
                    form.setFieldsValue({itemGroup: item.itemGroupCode});
                  }}
                  />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="有效性">
                  {getFieldDecorator(
                    'enableFlag',
                    {}
                  )(
                    <Select allowClear>
                      {flagMap.map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <EditTable
            bordered
            dataSource={dataList}
            columns={columns}
            pagination={pagination}
            onChange={page => this.queryDataByPanigation(page)}
            loading={fetchListLoading}
          />
        </Content>
      </div>
    );
  }
}
