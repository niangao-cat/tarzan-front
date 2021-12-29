/**
 *@description 站点分配
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Switch, Popconfirm, Badge, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import uuid from 'uuid/v4';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ routes }) => ({
  routes,
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.routes' })
export default class Sites extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      routes: { sitesList = [] },
    } = this.props;
    dispatch({
      type: 'routes/updateState',
      payload: {
        sitesList: [
          {
            uuid: uuid(),
            enableFlag: 'Y',
            objectColumnCode: '',
            routerSiteAssignId: null,
            objectColumnName: '',
            objectId: null,
            _status: 'create',
          },
          ...sitesList,
        ],
      },
    });
  }

  // 取消新建对象属性
  @Bind()
  handleCleanLine(record, index) {
    const {
      dispatch,
      routes: { sitesList = [] },
    } = this.props;
    sitesList.splice(index, 1);
    dispatch({
      type: 'routes/updateState',
      payload: {
        sitesList: [...sitesList],
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
      routes: { sitesList = [] },
    } = this.props;
    const newList = sitesList.map(item => {
      if (record.uuid === item.uuid) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'routes/updateState',
      payload: { sitesList: newList },
    });
  }

  // 保存编辑行
  @Bind()
  handleSaveLine(record, index) {
    const {
      dispatch,
      routes: { sitesList = [] },
    } = this.props;
    const newList = JSON.parse(JSON.stringify(sitesList));
    record.$form.validateFields((err, values) => {
      if (!err) {
        newList[index] = {
          ...sitesList[index],
          ...values,
          enableFlag: values.enableFlag ? 'Y' : 'N',
          _status: '',
        };
        dispatch({
          type: 'routes/updateState',
          payload: { sitesList: newList },
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
    const {
      dispatch,
      routes: { sitesList = [] },
    } = this.props;
    const newTableList = sitesList.filter(item => item.uuid !== record.uuid);
    dispatch({
      type: 'routes/updateState',
      payload: {
        sitesList: newTableList,
      },
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
    const {
      dispatch,
      routes: { sitesList = [] },
    } = this.props;
    sitesList[index].$form.setFieldsValue({
      siteId: record.siteId,
      siteCode: record.siteCode,
      siteType: record.siteType,
      siteName: record.siteName,
    });
    dispatch({
      type: 'routes/updateState',
      payload: {
        sitesList,
      },
    });
  };

  render() {
    const {
      routerId,
      loading,
      canEdit,
      routes: { sitesList = [], siteTypeList = [], routesItem = {} },
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
            disabled={!canEdit && routerId !== 'create'}
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
        title: intl.get(`${modelPrompt}.routerName`).d('工艺路线'),
        dataIndex: 'routerName',
        width: 150,
        render: () => routesItem.routerName,
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item>
                {record.$form.getFieldDecorator(`siteId`, {
                  initialValue: record.siteId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.SITE"
                    textValue={record.siteCode}
                    queryParams={{
                      tenantId,
                      userFlag: 'Y',
                      enableFlag: 'Y',
                      siteType: 'MANUFACTURING',
                    }}
                    onChange={(value, records) => {
                      this.changeCode(value, records, index);
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`siteCode`, {
                  initialValue: record.siteCode,
                })(<Input />)}
              </Form.Item>
            </>
          ) : (
            record.siteCode
          ),
      },
      {
        title: intl.get(`${modelPrompt}.typeCode`).d('站点类型'),
        dataIndex: 'siteType',
        align: 'center',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteType`, {
                initialValue: val,
              })(
                <>
                  {record.$form.getFieldValue('siteType')
                    ? (
                        siteTypeList.filter(
                          ele => ele.typeCode === record.$form.getFieldValue('siteType')
                        )[0] || {}
                      ).description
                    : (siteTypeList.filter(ele => ele.typeCode === record.siteType)[0] || {})
                        .description}
                </>
              )}
            </Form.Item>
          ) : (
            (siteTypeList.filter(ele => ele.typeCode === val)[0] || {}).description
          ),
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
        title: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
        dataIndex: 'siteName',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteName`, {
                initialValue: val,
              })(<>{record.$form.getFieldValue('siteName')}</>)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a
                onClick={() => this.handleEdit(record, true)}
                disabled={!canEdit && routerId !== 'create'}
              >
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
                <a onClick={() => this.handleCleanLine(record, index)}>
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
      // <div style={{ width: '100%' }}>
      <EditTable
        bordered
        loading={loading}
        rowKey="uuid"
        columns={columns}
        dataSource={sitesList}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={false}
      />
      // </div>
    );
  }
}
