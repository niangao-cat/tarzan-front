/**
 *@description 组件设置
 *@author: 姜睿琦
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm, Badge, Input, Switch, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import uuid from 'uuid/v4';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import AttributeDrawer from '@/components/AttributeDrawer';

const modelPrompt = 'tarzan.process.routes.model.routes';
const TABLENAME = 'mt_router_operation_comp_attr';

@connect(({ routes }) => ({
  routes,
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.routes' })
export default class ComponentSettings extends PureComponent {
  state = {
    visible: false, // 表格扩展字段控制
    currentExtendData: {}, //  记录打开扩展字段行的数据
    tableList: [], // 表格数据
  };

  componentDidMount() {
    this.props.onRef(this);
    const tableList = this.props.componentList.map(item => {
      return {
        ...item,
        uuid: uuid(),
      };
    });
    this.setState({
      tableList,
    });
  }

  componentWillUnmount() {
    this.setState({
      tableList: [],
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
          sequence: null,
          bomComponentId: '',
          bomComponentMaterialCode: '',
          bomComponentMaterialDesc: '',
          qty: null,
          enableFlag: true,
          _status: 'create',
        },
        ...tableList,
      ],
    });
  }

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

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(index) {
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

    //  检查工艺，组件设置下，是否存在两个相同组件
    const existedArray = tableList.filter(
      item => item.uuid !== record.uuid && item.bomComponentId === record.bomComponentId
    );

    if (existedArray.length > 0) {
      notification.error({
        message: '同一步骤不能维护相同的组件',
      });
    } else {
      record.$form.validateFields((err, values) => {
        if (!err) {
          newList[index] = {
            ...tableList[index],
            ...values,
            enableFlag: values.enableFlag ? 'Y' : 'N',
            _status: '',
          };
          this.setState({
            tableList: newList,
          });
        }
      });
    }
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
    const { tableList } = this.state;
    tableList[index].$form.setFieldsValue({
      bomComponentId: value,
      bomComponentMaterialCode: record.bomComponentMaterialCode,
      bomComponentMaterialDesc: record.bomComponentMaterialDesc,
      qty: record.qty ? record.qty : null,
    });

    // 修改对应表格的数据
    tableList[index].bomComponentId = value;
    tableList[index].bomComponentMaterialCode = record.bomComponentMaterialCode;
    tableList[index].bomComponentMaterialDesc = record.bomComponentMaterialDesc;
    tableList[index].qty = record.qty ? record.qty : null;

    // 暂存信息
    this.setState({
      tableList,
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
  extendModalOpen = record => {
    if (!record.routerOperationComponentId) {
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
        kid: record.bomComponentId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          visible: true,
          currentExtendData: record,
        });
      }
    });
  };

  /**
   *@functionName extendModalClose
   *@description 关闭扩展字段模态框
   *@author 唐加旭
   *@date 2019-10-08 20:03:38
   *@version V0.8.6
   * */
  extendModalClose = () => {
    this.setState({
      visible: false,
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
        kid: currentExtendData.bomComponentId,
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

  render() {
    const {
      routes: { routesItem = {}, tabbleAttrList = [] },
      canEdit,
    } = this.props;
    const { tableList, visible } = this.state;
    const tenantId = getCurrentOrganizationId();
    // 扩展字段参数
    const attributeDrawerProps = {
      visible,
      tableName: TABLENAME,
      canEdit,
      attrList: tabbleAttrList,
      onCancel: this.extendModalClose,
      onSave: this.handleOnOk,
    };
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
        render: (val, record) =>
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
        title: intl.get(`${modelPrompt}.componentSequence`).d('顺序'),
        dataIndex: 'sequence',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.componentSequence`).d('顺序'),
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
        title: intl.get(`${modelPrompt}.component`).d('组件'),
        dataIndex: 'bomComponentId',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item>
                {record.$form.getFieldDecorator(`bomComponentId`, {
                  initialValue: record.bomComponentId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.component`).d('组件'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.BOM_COMPONENT"
                    textValue={record.bomComponentMaterialCode}
                    queryParams={{ tenantId, bomId: routesItem.bomId }}
                    onChange={(value, records) => {
                      this.changeCode(value, records, index);
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`bomComponentMaterialCode`, {
                  initialValue: record.bomComponentMaterialCode,
                })(<Input />)}
              </Form.Item>
            </>
          ) : (
            record.bomComponentMaterialCode
          ),
      },
      {
        title: intl.get(`${modelPrompt}.bomVersion`).d('组件版本'),
        dataIndex: 'bomVersion',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`bomVersion`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.componentDescription`).d('组件描述'),
        dataIndex: 'bomComponentMaterialDesc',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`bomComponentMaterialDesc`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.componentQty`).d('数量'),
        dataIndex: 'qty',
        width: 160,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qty`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('扩展字段'),
        dataIndex: 'routerOperationComponentAttrs',
        width: 150,
        align: 'center',
        render: (val, record) => <a onClick={this.extendModalOpen.bind(this, record)}>扩展字段</a>,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record._status === 'create' ? true : record.enableFlag === 'Y',
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
        width: 150,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a disabled={!canEdit} onClick={() => this.handleEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveLine(record, index)}>
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
        <EditTable
          bordered
          rowKey="uuid"
          columns={columns}
          dataSource={tableList}
          pagination={false}
        />
        {visible && <AttributeDrawer {...attributeDrawerProps} />}
      </>
    );
  }
}