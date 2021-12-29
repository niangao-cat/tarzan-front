/**
 *@description 子步骤设置Tab页子表格
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm, Input, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import {
  getCurrentOrganizationId,
  // tableScrollWidth,
} from 'utils/utils';
import Lov from 'components/Lov';
import uuid from 'uuid/v4';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import AttributeDrawer from '@/components/AttributeDrawer';
// import NestingDrawer from './NestingDrawer';

const modelPrompt = 'tarzan.process.routes.model.routes';
const TABLENAME = 'mt_router_substep_comp_attr';

@connect(({ routes }) => ({
  routes,
  // loading: loading.effects['routes/stepsList'],
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.routes' })
export default class SubStepSubTable extends PureComponent {
  state = {
    visible: false, // 表格扩展字段控制
    currentExtendData: {}, //  记录打开扩展字段行的数据
    // tableList: [], // 表格数据
  };

  // 返回修改后的tableList
  returnTableList = subList => {
    const { tableList, currentExtendData } = this.props;
    const newTableList = [];
    for (let index = 0; index < tableList.length; index++) {
      if (tableList[index].routerSubstepId === currentExtendData.routerSubstepId) {
        newTableList.push({
          ...currentExtendData,
          mtRouterSubstepComponentDTO: subList,
        });
      } else {
        newTableList.push(tableList[index]);
      }
    }
    return newTableList;
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const { setParentState, subTableList } = this.props;
    const newSubTableList = [
      {
        uuid: uuid(),
        routerSubstepComponentId: '',
        bomComponentId: '',
        bomComponentMaterialCode: '',
        bomComponentMaterialDesc: '',
        qty: null,
        sequence: null,
        _status: 'create',
      },
      ...subTableList,
    ];
    setParentState({
      tableList: this.returnTableList(newSubTableList),
      subTableList: newSubTableList,
    });
  }

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const { setParentState, subTableList } = this.props;
    const newSubTableList = subTableList.map(item => {
      if (record.uuid === item.uuid) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    setParentState({
      tableList: this.returnTableList(newSubTableList),
      subTableList: newSubTableList,
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(index) {
    const { setParentState, subTableList } = this.props;
    // const newSubTableList = subTableList.filter(
    //   item => item.routerSubstepComponentId !== record.routerSubstepComponentId
    // );
    subTableList.splice(index, 1);
    setParentState({
      tableList: this.returnTableList(subTableList),
      subTableList,
    });

    // const { tableList } = this.state;
    // tableList.splice(index, 1);
    // this.setState({
    //   tableList: [...tableList],
    // });
  }

  // 保存编辑行
  @Bind()
  handleSaveLine(record, index) {
    const { setParentState, subTableList } = this.props;
    const newSubTableList = subTableList;
    record.$form.validateFields((err, values) => {
      if (!err) {
        newSubTableList[index] = {
          ...subTableList[index],
          ...values,
          _status: '',
        };
        setParentState({
          tableList: this.returnTableList(newSubTableList),
          subTableList: newSubTableList,
        });
      }
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
    const { setParentState, subTableList } = this.props;
    const newSubTableList = subTableList.filter(item => item.uuid !== record.uuid);
    setParentState({
      tableList: this.returnTableList(newSubTableList),
      subTableList: newSubTableList,
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
    const { setParentState, subTableList } = this.props;
    const newSubTableList = subTableList;
    newSubTableList[index].$form.setFieldsValue({
      bomComponentId: value,
      bomComponentMaterialCode: record.bomComponentMaterialCode,
      bomComponentMaterialDesc: record.bomComponentMaterialDesc,
      qty: record.qty ? record.qty : null,
    });
    setParentState({
      tableList: this.returnTableList(newSubTableList),
      subTableList: newSubTableList,
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
    if (!record.routerSubstepComponentId) {
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
        kid: record.routerSubstepComponentId,
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
        kid: currentExtendData.routerSubstepComponentId,
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
      canEdit,
      subTableList,
      currentExtendData,
      routes: { routesItem = {}, tabbleAttrList = [] },
    } = this.props;
    const { visible } = this.state;
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
        width: 90,
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
        width: 140,
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
        width: 80,
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
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
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
    // 扩展字段参数
    const attributeDrawerProps = {
      visible,
      tableName: TABLENAME,
      canEdit,
      attrList: tabbleAttrList,
      onCancel: this.extendModalClose,
      onSave: this.handleOnOk,
    };
    return (
      <>
        {currentExtendData.routerSubstepId && (
          <EditTable
            bordered
            rowKey="uuid"
            columns={columns}
            dataSource={subTableList}
            pagination={false}
          />
        )}
        {visible && <AttributeDrawer {...attributeDrawerProps} />}
      </>
    );
  }
}
