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
import { Form, Button, InputNumber, Popconfirm, Badge, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.badCode.defectGroup.model.defectGroup';

@connect(({ defectGroup }) => ({
  defectGroup,
}))
@Form.create()
@formatterCollections({ code: 'tarzan.badCode.defectGroup' })
export default class SecCodeTab extends PureComponent {

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      defectGroup: { mtNcSecondaryCodeList = [], childStepsPagination = {} },
    } = this.props;
    dispatch({
      type: 'defectGroup/updateState',
      payload: {
        mtNcSecondaryCodeList: [
          {
            ncSecondaryCodeId: '',
            requiredFlag: 'Y',
            _status: 'create',
          },
          ...mtNcSecondaryCodeList,
        ],
        childStepsPagination: addItemToPagination(
          mtNcSecondaryCodeList.length,
          childStepsPagination
        ),
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
      defectGroup: { mtNcSecondaryCodeList },
    } = this.props;
    const newList = mtNcSecondaryCodeList.map(item => {
      if (record.ncSecondaryCodeId === item.ncSecondaryCodeId) {
        return {
          ...item,
          _status: flag ? 'update' : '',
        };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'defectGroup/updateState',
      payload: { mtNcSecondaryCodeList: newList },
    });
  }

  // 取消编辑对象属性
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      defectGroup: { mtNcSecondaryCodeList },
    } = this.props;
    const newList = mtNcSecondaryCodeList.filter(
      item => item.ncSecondaryCodeId !== record.ncSecondaryCodeId
    );
    dispatch({
      type: 'defectGroup/updateState',
      payload: {
        mtNcSecondaryCodeList: newList,
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
  changeCode = (data, record) => {
    record.$form.setFieldsValue({
      secondaryNcDesc: data.description,
      secondaryNcCode: data.ncCode,
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
      defectGroup: { mtNcSecondaryCodeList = [] },
    } = this.props;
    if (record.ncSecondaryCodeId !== '') {
      dispatch({
        type: 'defectGroup/deleteSecCode',
        payload: [record.ncSecondaryCodeId],
      }).then(res => {
        mtNcSecondaryCodeList.splice(index, 1);
        if (res && res.success) {
          dispatch({
            type: 'defectGroup/updateState',
            payload: {
              mtNcSecondaryCodeList,
            },
          });
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      mtNcSecondaryCodeList.splice(index, 1);
      dispatch({
        type: 'defectGroup/updateState',
        payload: {
          mtNcSecondaryCodeList,
        },
      });
    }
  };

  // 行保存
  handleSaveLine = (record, index) => {
    const {
      dispatch,
      defectGroup: { mtNcSecondaryCodeList },
    } = this.props;
    record.$form.validateFields((err, value) => {
      if (!err) {
        const code = value.secondaryNcCode;
        const Samenum = mtNcSecondaryCodeList
          .map((item, itemIndex) => item.secondaryNcCode === code && itemIndex !== index)
          .filter(item => item).length;
        if (Samenum) {
          notification.error({
            message: intl.get('tarzan.badCode.defectGroup.message.cannotSame').d('不允许多条相同的不良代码'),
          });
          return;
        }
        mtNcSecondaryCodeList[index] = {
          ...record,
          ...value,
          _status: '',
          flag: true,
          requiredFlag: value.requiredFlag ? 'Y' : 'N',
        };
        dispatch({
          type: 'defectGroup/updateState',
          payload: {
            mtNcSecondaryCodeList,
          },
        });
      }
    });
  };

  render() {
    const {
      canEdit,
      defectGroup: { mtNcSecondaryCodeList = [], canBePrimaryCode, limitSiteId },
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
            disabled={!canEdit || !canBePrimaryCode || !limitSiteId}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit || !canBePrimaryCode ? (
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
        title: intl.get(`${modelPrompt}.sequence`).d('顺序'),
        dataIndex: 'sequence',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.sequence`).d('顺序'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  precision={0}
                  min={0}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'secondaryNcCode',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator(`ncCodeId`, {
                  initialValue: record.ncCodeId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncCode`).d('不良代码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.NC_CODE"
                    disabled={!canEdit}
                    textValue={val}
                    onChange={(value, data) => this.changeCode(data, record)}
                    queryParams={{ tenantId, siteId: limitSiteId }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`secondaryNcDesc`, {
                  initialValue: record.secondaryNcDesc,
                })(<span />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`secondaryNcCode`, {
                  initialValue: record.secondaryNcCode,
                })(<span />)}
              </Form.Item>
            </Fragment>

          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.secondaryNcDesc`).d('不良代码描述'),
        dataIndex: 'secondaryNcDesc',
        // width: 150
      },
      {
        title: intl.get(`${modelPrompt}.requiredFlag`).d('必须关闭'),
        dataIndex: 'requiredFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`requiredFlag`, {
                initialValue: record.requiredFlag === 'Y',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.requiredFlag === 'Y' ? 'success' : 'error'}
              text={
                record.requiredFlag === 'Y'
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
                <a onClick={() => this.handleCleanLine(record)}>
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
          columns={columns}
          dataSource={mtNcSecondaryCodeList}
          pagination={false}
        />
      </div>
    );
  }
}
