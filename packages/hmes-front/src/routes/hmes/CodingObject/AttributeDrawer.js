import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, Switch, Badge, notification, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import ObjectFilterForm from './ObjectFilterForm';

const modelPrompt = 'tarzan.hmes.codingObject.model.codingObject';
const { Option } = Select;
/**
 * 对象属性展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ codingObject, loading }) => ({
  codingObject,
  loading: loading.effects['codingObject/fetchAttributeList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.codingObject',
})
export default class AttributeDrawer extends PureComponent {
  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.child.fetchQueryList(pagination);
  }

  onRef = ref => {
    this.child = ref;
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      codingObject: { attributeList = [], attributePagination = {} },
    } = this.props;
    if (
      attributeList.length === 0 ||
      (attributeList.length > 0 && attributeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'codingObject/updateState',
        payload: {
          attributeList: [
            {
              enableFlag: 'Y',
              objectColumnCode: '',
              objectColumnId: null,
              objectColumnName: '',
              objectId: null,
              _status: 'create',
            },
            ...attributeList,
          ],
          attributePagination: addItemToPagination(attributeList.length, attributePagination),
        },
      });
    }
  }

  /**
   * 编辑对象属性
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      codingObject: { attributeList },
    } = this.props;
    const newList = attributeList.map(item => {
      if (record.objectColumnId === item.objectColumnId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    if (flag) {
      dispatch({
        type: 'codingObject/fetchComBoxList',
        payload: {
          typeGroup: record.typeGroup,
        },
      }).then(() => {
        dispatch({
          type: 'codingObject/updateState',
          payload: { attributeList: newList },
        });
      });
    } else {
      dispatch({
        type: 'codingObject/updateState',
        payload: { attributeList: newList },
      });
    }
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      codingObject: { attributeList, attributePagination = {} },
    } = this.props;
    const newList = attributeList.filter(item => item.objectColumnId !== record.objectColumnId);
    dispatch({
      type: 'codingObject/updateState',
      payload: {
        attributeList: newList,
        attributePagination: delItemToPagination(attributePagination.pageSize, attributePagination),
      },
    });
  }

  // 保存对象属性
  @Bind()
  handleSave(record, index) {
    const {
      dispatch,
      codingObject: { attributeList = [] },
      initData: { objectId },
    } = this.props;
    // const displayObject = this.typeGroupWritedFlag();
    // if (
    //   record.typeGroup &&
    //   displayObject.flag &&
    //   displayObject.objectColumnId !== record.objectColumnId
    // ) {
    //   Modal.warning({
    //     title: intl
    //       .get('tarzan.hmes.codingObject.message.onlyOne')
    //       .d('只允许对其中一行对象属性，进行类型组维护'),
    //   });
    //   return null;
    // }
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'codingObject/saveAttribute',
          payload: {
            ...values,
            enableFlag: values.enableFlag ? 'Y' : 'N',
            objectId,
            objectColumnId: record.objectColumnId,
          },
        }).then(res => {
          if (res && res.success) {
            attributeList[index]._status = '';
            attributeList[index].objectColumnCode = values.objectColumnCode;
            attributeList[index].enableFlag = values.enableFlag ? 'Y' : 'N';
            attributeList[index].objectColumnName = values.objectColumnName;
            attributeList[index].typeGroup = values.typeGroup;
            attributeList[index].module = values.module;
            attributeList[index].moduleDesc = values.moduleDesc;
            attributeList[index].objectColumnId = res.rows;
            dispatch({
              type: 'codingObject/updateState',
              payload: {
                attributeList,
              },
            });
            dispatch({
              type: 'codingObject/fetchNumrangeObjectColumn',
              payload: parseFloat(objectId),
            });
          } else if (res) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  // 批量保存
  @Bind()
  makeSureChange = () => {
    const {
      codingObject: { attributeList = [] },
      onCancel,
      dispatch,
      initData: { objectId },
    } = this.props;
    const middle = attributeList.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    if (middle.length === 0) {
      onCancel();
      return;
    }
    for (const value of middle) {
      value.$form.validateFields(err => {
        if (err) {
          return false;
        }
      });
    }
    const displayObject = this.typeGroupWritedFlag();
    const objectColumns = middle.filter(ele => ele.$form.getFieldValue('typeGroup'));
    if (objectColumns.length > 1) {
      Modal.warning({
        title: intl
          .get('tarzan.hmes.codingObject.message.onlyOne')
          .d('只允许对其中一行对象属性，进行类型组维护'),
      });
      return null;
    } else if (objectColumns.length === 1) {
      if (displayObject.flag && displayObject.objectColumnId !== objectColumns[0].objectColumnId) {
        Modal.warning({
          title: intl
            .get('tarzan.hmes.codingObject.message.onlyOne')
            .d('只允许对其中一行对象属性，进行类型组维护'),
        });
        return null;
      }
    }
    dispatch({
      type: 'codingObject/saveAttributeBatch',
      payload: middle.map(ele => ({
        enableFlag: ele.$form.getFieldValue('enableFlag') ? 'Y' : 'N',
        objectColumnCode: ele.$form.getFieldValue('objectColumnCode'),
        objectColumnId: ele.objectColumnId,
        objectColumnName: ele.$form.getFieldValue('objectColumnName'),
        objectId,
      })),
    }).then(res => {
      if (res && res.success) {
        onCancel();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  @Bind()
  changeTypeGroup = (val, records, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'codingObject/fetchComBoxList',
      payload: {
        typeGroup: val ? records.typeGroup : '',
      },
    }).then(() => {
      record.$form.setFieldsValue({
        module: records.module,
        moduleDesc: records.description,
      });
    });
  };

  @Bind()
  changeModule = (value, record) => {
    if (!value) {
      record.$form.setFieldsValue({
        typeGroup: null,
        moduleDesc: '',
      });
    }
  };

  // 判断是否已经选择了类型组   true 选择了   /   false 未选择
  typeGroupWritedFlag = () => {
    const {
      codingObject: { attributeList = [] },
    } = this.props;
    let objectColumnId1 = '';
    let flag = false;
    attributeList.map(item => {
      if (item.typeGroup) {
        objectColumnId1 = item.objectColumnId;
        flag = true;
      }
      return item.objectColumnId;
    });
    return { objectColumnId: objectColumnId1, flag };
  };

  render() {
    const {
      visible,
      onCancel,
      initData,
      loading,
      codingObject: {
        attributeList = [],
        attributePagination = {},
        comboxList = [],
        groupComboxId = '',
      },
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    // const displayObject = this.typeGroupWritedFlag();
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
        title: intl.get(`${modelPrompt}.objectColumnCode`).d('属性参数编码'),
        dataIndex: 'objectColumnCode',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`objectColumnCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get(`${modelPrompt}.objectColumnCode`).d('属性参数编码'),
                  },
                ],
                initialValue: record.objectColumnCode,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.objectColumnName`).d('属性参数含义'),
        dataIndex: 'objectColumnName',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`objectColumnName`, {
                initialValue: record.objectColumnName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.objectColumnName`).d('属性参数含义')}
                  field="objectColumnName"
                  dto="io.tarzan.common.domain.entity.MtNumrangeObjectColumn"
                  pkValue={{ objectColumnId: record.objectColumnId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.typeGroup`).d('类型组'),
        dataIndex: 'typeGroup',
        width: 100,
        render: (val, record) => {
          if (
            // !displayObject.flag ||
            // (displayObject.flag && displayObject.objectColumnId === record.objectColumnId)
            !groupComboxId ||
            groupComboxId === record.objectColumnId
          ) {
            return ['create', 'update'].includes(record._status) ? (
              <Form.Item>
                {record.$form.getFieldDecorator(`typeGroup`, {
                  initialValue: record.typeGroup,
                })(
                  <Lov
                    code="MT.GEN_TYPE_GROUP"
                    textValue={record.typeGroup}
                    onChange={(value, records) => this.changeTypeGroup(value, records, record)}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            ) : (
              val
            );
          } else {
            return null;
          }
        },
      },
      {
        title: intl.get(`${modelPrompt}.module`).d('所属服务包'),
        dataIndex: 'module',
        width: 100,
        render: (val, record) => {
          if (
            // !displayObject.flag ||
            // (displayObject.flag && displayObject.objectColumnId === record.objectColumnId)
            !groupComboxId ||
            groupComboxId === record.objectColumnId
          ) {
            return ['create', 'update'].includes(record._status) ? (
              <>
                <Form.Item>
                  {record.$form.getFieldDecorator(`module`, {
                    initialValue: val,
                  })(
                    <Select
                      disabled={!record.$form.getFieldValue('typeGroup')}
                      style={{ width: '100%' }}
                      allowClear
                      onChange={value => {
                        this.changeModule(value, record);
                      }}
                    >
                      {comboxList.map(ele => (
                        <Option key={ele.module}>{ele.description}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {record.$form.getFieldDecorator(`moduleDesc`, {
                    initialValue: val,
                  })(<Input />)}
                </Form.Item>
              </>
            ) : (
              record.moduleDesc
            );
          } else {
            return null;
          }
        },
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 80,
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
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.hmes.codingObject.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true)}>
                {intl.get('tarzan.hmes.codingObject.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.hmes.codingObject.button.save').d('保存')}
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
        width={1080}
        title={intl.get('tarzan.hmes.codingObject.title.attribute').d('对象属性维护')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.makeSureChange}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <ObjectFilterForm initData={initData} onRef={this.onRef} />
        <EditTable
          bordered
          rowKey="objectColumnId"
          columns={columns}
          loading={loading}
          dataSource={attributeList}
          pagination={attributePagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}
