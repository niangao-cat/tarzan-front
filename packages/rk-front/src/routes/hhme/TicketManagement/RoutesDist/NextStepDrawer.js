/**
 * routeLinkDetails 类型设置: 步骤组
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm, Select, Modal, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import uuid from 'uuid/v4';
import notification from 'utils/notification';
import AttributeDrawer from '@/components/AttributeDrawer';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { Option } = Select;
const TABLENAME = 'mt_router_next_step_attr';

@connect(({ routes }) => ({
  routes,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class NextStepDrawer extends React.PureComponent {
  state = {
    tableList: [], // 表格数据
    nextStepNameList: [], // 表格步骤识别码下拉数据
    attrVisible: false, // 表格扩展字段控制
    currentExtendData: {}, //  记录打开扩展字段行的数据
  };

  componentDidMount() {
    const {
      dataSource = [],
      routes: { stepsList = [] },
    } = this.props;
    const nextStepNameList = [];
    stepsList.map(item => {
      if (item.routerStepId) {
        nextStepNameList.push({
          stepName: item.stepName,
          description: item.description,
          routerStepId: item.routerStepId,
        });
      }
      return item.stepName;
    });
    const tableList = dataSource.map(item => {
      return {
        ...item,
        uuid: uuid(),
      };
    });
    this.setState({
      tableList,
      nextStepNameList,
    });
  }

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const { tableList } = this.state;
    this.setState({
      tableList: [
        {
          uuid: uuid(),
          routerNextStepId: '',
          nextStepId: '',
          nextStepName: '',
          nextStepDesc: '',
          sequence: tableList.length + 1,
          nextDecisionType: 'MAIN',
          nextDecisionValue: '',
          _status: 'create',
        },
        ...tableList,
      ],
    });
  }

  /**
   *@functionName deleteData
   *@params {Object} record 删除的数据详情
   *@params {Number} index 删除的数据下标
   *@description 删除工艺步骤
   *@author 唐加旭
   *@date 2019-10-08 19:21:14
   *@version V0.8.6
   * */
  deleteData = record => {
    const newTableList = this.state.tableList.filter(item => item.uuid !== record.uuid);
    this.setState({
      tableList: newTableList,
    });
  };

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const { tableList } = this.state;
    const newList = tableList.map(item => {
      if (record.uuid === item.uuid) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    this.setState({
      tableList: newList,
    });
  }

  // 取消编辑新建对象属性
  @Bind()
  handleCleanLine(record, index) {
    const { tableList } = this.state;
    tableList.splice(index, 1);
    this.setState({
      tableList: [...tableList],
    });
  }

  // 保存编辑行
  @Bind()
  handleSaveLine(record, index) {
    const { tableList } = this.state;
    const newList = JSON.parse(JSON.stringify(tableList));
    record.$form.validateFields((err, values) => {
      if (!err) {
        newList[index] = {
          ...tableList[index],
          ...values,
          _status: '',
        };
        this.setState({
          tableList: newList,
        });
      }
    });
  }

  /**
   *@functionName   quietNest
   *@description 退出模态框
   *@author 唐加旭
   *@date 2019-10-09 10:41:33
   *@version V0.8.6
   * */
  quietNest = visibleProps => {
    this.setState({
      [visibleProps]: false,
    });
  };

  /**
   *@functionName extendModalOpen
   *@params {Object} record 编辑扩展字段的数据详情
   *@description 开打扩展字段详情
   *@author 唐加旭
   *@date 2019-10-08 20:00:13
   *@version V0.8.6
   * */
  /* eslint-disable */
  extendModalOpen = record => {
    if (!record.routerNextStepId) {
      Modal.warning({
        title: intl
          .get('tarzan.process.routesManager.message.saveFirst')
          .d('请先保存已维护的工艺路线数据'),
      });
      return null;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'routes/featchTableAttrList',
      payload: {
        kid: record.routerNextStepId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attrVisible: true,
          currentExtendData: record,
        });
      }
    });
  };
  /* eslint-disable */

  /**
   *@functionName extendModalClose
   *@description 关闭扩展字段模态框
   *@author 唐加旭
   *@date 2019-10-08 20:03:38
   *@version V0.8.6
   * */
  extendModalClose = () => {
    this.setState({
      attrVisible: false,
      currentExtendData: {},
    });
  };

  /**
   *@functionName handleOnOk
   *@description 确定编辑扩展字段
   *@author 唐加旭
   *@date 2019-10-08 20:04:49
   *@version V0.8.6
   * */
  handleOnOk = dataSource => {
    const { dispatch } = this.props;
    const { currentExtendData } = this.state;
    dispatch({
      type: 'routes/saveTableAttrList',
      payload: {
        kid: currentExtendData.routerNextStepId,
        attrs: dataSource,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.extendModalClose();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  @Bind()
  handleOK = () => {
    const { tableList } = this.state;
    const { routeLinkHandle, dataSourceId } = this.props;
    const notSaveArr = [];
    tableList.map(item => {
      if (item._status === 'update' || item._status === 'create') {
        notSaveArr.push(item);
      }
    });
    if (notSaveArr.length > 0) {
      Modal.warning({
        // title: {intl.get(`${modelPrompt}.info`).d('提示')},
        // content: {intl.get(`${modelPrompt}.notSaveInfo`).d('有内容未保存！')},
        title: '提示',
        content: '有内容未保存！',
      });
    } else {
      routeLinkHandle(tableList, dataSourceId, 'mtRouterNextStepDTO', 'nextStepVisible');
    }
  };

  @Bind()
  onCancel = () => {
    this.props.onCancel('nextStepVisible');
  };

  // 选择步骤识别码，更改步骤描述
  @Bind()
  changeStepDescription = (index, value, ele) => {
    const { tableList } = this.state;

    tableList[index].$form.setFieldsValue({
      nextStepDesc: ele.props.description,
      nextStepId: ele.props.routerStepId,
    });
    this.setState({
      tableList,
    });
  };

  // 选择策略，清空决策值
  @Bind()
  cleanNextDecisionValue = index => {
    const { tableList } = this.state;
    if (tableList[index].$form.getFieldValue('nextDecisionValue')) {
      tableList[index].$form.setFieldsValue({
        nextDecisionValue: '',
      });
    }
    this.setState({
      tableList,
    });
  };

  render() {
    const {
      visible,
      canEdit,
      routes: { routesItem = {}, nextStepDecisionList = [], tabbleAttrList = [] },
    } = this.props;
    const { tableList, attrVisible, nextStepNameList } = this.state;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: record =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" disabled />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, record)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.nextStepName`).d('步骤识别码'),
        dataIndex: 'nextStepName',
        width: 100,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item>
                {record.$form.getFieldDecorator(`nextStepName`, {
                  initialValue: record.nextStepName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.nextStepName`).d('步骤识别码'),
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    onChange={this.changeStepDescription.bind(this, index)}
                  >
                    {nextStepNameList.map(ele => (
                      <Option
                        value={ele.stepName}
                        description={ele.description}
                        routerStepId={ele.routerStepId}
                      >
                        {ele.stepName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`nextStepId`, {
                  initialValue: record.nextStepId,
                })(<Input />)}
              </Form.Item>
            </>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.nextStepDesc`).d('步骤描述'),
        dataIndex: 'nextStepDesc',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`nextStepDesc`, {
                initialValue: record.nextStepDesc,
              })(<>{record.$form.getFieldValue('nextStepDesc')}</>)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        dataIndex: 'sequence',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: record.sequence,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
                    }),
                  },
                ],
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.nextDecisionType`).d('选择策略'),
        dataIndex: 'nextDecisionType',
        width: 170,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`nextDecisionType`, {
                initialValue: record.nextDecisionType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.nextDecisionType`).d('选择策略'),
                    }),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  onChange={this.cleanNextDecisionValue.bind(this, index)}
                >
                  {nextStepDecisionList.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (nextStepDecisionList.filter(ele => ele.typeCode === val)[0] || {}).description
          ),
      },
      {
        title: intl.get(`${modelPrompt}.nextDecisionValue`).d('决策值'),
        dataIndex: 'nextDecisionValue',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              {/* 联产品 */}
              {record.$form.getFieldValue('nextDecisionType') === 'COPRODUCT' && (
                <Form.Item>
                  {record.$form.getFieldDecorator(`nextDecisionValue`, {
                    initialValue: record.nextDecisionValue,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.bom`).d('组件'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="MT.BOM_COMPONENT"
                      // textValue={record.bomComponentMaterialCode}
                      queryParams={{ tenantId, bomId: routesItem.bomId }}
                    />
                  )}
                </Form.Item>
              )}
              {/* 不良代码 */}
              {record.$form.getFieldValue('nextDecisionType') === 'NC' && (
                <Form.Item>
                  {record.$form.getFieldDecorator(`nextDecisionValue`, {
                    initialValue: record.nextDecisionValue,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.router`).d('工艺路线'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="MT.NC_CODE"
                      // textValue={val}
                      queryParams={{ tenantId, ROUTER_TYPE: 'NC' }}
                    />
                  )}
                </Form.Item>
              )}
            </>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('扩展字段'),
        dataIndex: 'nextStep',
        align: 'center',
        width: 100,
        render: (val, record) => (
          <span className="action-link">
            <a onClick={this.extendModalOpen.bind(this, record)}>扩展字段</a>
          </span>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 140,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a disabled={!canEdit} onClick={() => this.handleEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'update' && (
              <>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </>
            )}
            {record._status === 'create' && (
              <>
                <a onClick={() => this.handleCleanLine(record, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </>
            )}
          </span>
        ),
      },
    ];
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attrVisible,
      tableName: TABLENAME,
      canEdit,
      attrList: tabbleAttrList,
      onCancel: this.extendModalClose,
      onSave: this.handleOnOk,
    };
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.process.routes.title.nextStepSetting').d('下一步骤设置')}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          rowKey="uuid"
          columns={columns}
          dataSource={tableList}
          pagination={false}
        />
        {attrVisible && <AttributeDrawer {...attributeDrawerProps} />}
      </Modal>
    );
  }
}
