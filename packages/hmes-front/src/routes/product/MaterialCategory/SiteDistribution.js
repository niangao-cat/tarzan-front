/**
 * @date 2019-8-23
 * @author dong.li <dong.li04@hand-china.com>
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Spin, Badge, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { addItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import uuid from 'uuid/v4';
import intl from 'utils/intl';
import notification from 'utils/notification';
import ExtendDrawer from './ExtendDrawer';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.product.materialCategory.model.materialCategory';

/**
 * 修改历史展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ materialCategory, loading }) => ({
  materialCategory,
  fetchLoading:
    loading.effects['materialCategory/addOrUpdateSite'] ||
    loading.effects['materialCategory/deleteSite'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryDrawer extends PureComponent {
  state = {
    extendDrawerVisible: false,
    extendListData: {},
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      materialCategory: { siteList = [], sitePagination = {} },
    } = this.props;
    if (siteList.length === 0 || (siteList.length > 0 && siteList[0]._status !== 'create')) {
      dispatch({
        type: 'materialCategory/updateState',
        payload: {
          siteList: [
            {
              siteId: uuid(),
              _status: 'create',
              siteName: '',
              siteType: '',
              siteTypeDesc: '',
              siteCode: '',
              materialCategorySiteId: '',
              enableFlag: 'Y',
            },
            ...siteList,
          ],
          sitePagination: addItemToPagination(siteList.length, sitePagination),
        },
      });
    }
  }

  /**
   * 编辑与取消
   */
  @Bind()
  handleEdit(record, flag, index) {
    const {
      dispatch,
      materialCategory: { siteList },
    } = this.props;
    if (flag) {
      // 开启编辑操作
      siteList[index]._status = 'update';
      dispatch({
        type: 'materialCategory/updateState',
        payload: {
          siteList,
        },
      });
    } else if (siteList[index]._status === 'update') {
      // 新增时取消
      siteList[index]._status = undefined;
    } else {
      // 编辑时取消
      siteList.splice(index, 1);
    }
    dispatch({
      type: 'materialCategory/updateState',
      payload: {
        siteList,
      },
    });
  }

  // 保存
  @Bind()
  handleSave(record, index) {
    const {
      dispatch,
      materialCategory: { siteList },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'materialCategory/addOrUpdateSite',
          payload: {
            siteId: record.siteId,
            materialCategoryId: this.props.record.materialCategoryId,
            materialCategorySiteId: record.materialCategorySiteId,
          },
        }).then(res => {
          if (res.success) {
            notification.success();
            siteList[index]._status = undefined;
            siteList[index].materialCategorySiteId = res.rows;
            dispatch({
              type: 'materialCategory/updateState',
              payload: {
                siteList,
              },
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

  /**
   *@functionName:   changeCode
   *@params1 {Any} value Lov选中的值
   *@params2 {Object} record 当前Lov选中的详情
   *@params3 {Number} index table表下标
   *@description 设置table表的值
   *@author: 李栋
   * */
  @Bind()
  changeCode = (value, record, index) => {
    const {
      materialCategory: { siteList = [] },
      dispatch,
    } = this.props;
    siteList[index].siteCode = record.siteCode;
    siteList[index].siteId = record.siteId;
    siteList[index].siteName = record.siteName;
    siteList[index].siteTypeDesc = record.siteTypeDesc;
    siteList[index].siteType = record.siteType;
    siteList[index].enableFlag = record.enableFlag;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        siteList,
      },
    });
  };

  /**
   *@functionName:   deleteData
   *@params1 {Object} record 当前数据
   *@params2 {Number} index 当前数据下标
   *@description 删除数据并本地做好缓存
   *@author: 李栋
   * */
  @Bind()
  deleteData = (record, index) => {
    const {
      dispatch,
      materialCategory: { siteList = [] },
    } = this.props;
    if (record.materialCategorySiteId !== '') {
      dispatch({
        type: 'materialCategory/deleteSite',
        payload: Number(record.materialCategorySiteId),
      }).then(res => {
        if (res && res.success) {
          notification.success();
          siteList.splice(index, 1);
          dispatch({
            type: 'materialCategory/updateState',
            payload: {
              siteList,
            },
          });
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      siteList.splice(index, 1);
      dispatch({
        type: 'materialCategory/updateState',
        payload: {
          siteList,
        },
      });
    }
  };

  @Bind()
  refresh = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'materialCategory/querySiteDistribution',
      payload: {
        materialCategoryId: record.materialCategoryId,
        organizationId: tenantId,
      },
    });
  };

  @Bind()
  handleExtendDrawerCancel() {
    this.setState({ extendDrawerVisible: false });
  }

  @Bind()
  changeExtendAttr = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialCategory/fetchAttributeList',
      payload: {
        kid: record.materialCategorySiteId,
        tableName: 'mt_material_category_site_attr',
        organizationId: tenantId,
      },
    });
    this.setState({
      extendDrawerVisible: true,
      extendListData: record,
    });
  };

  render() {
    const {
      visible,
      onCancel,
      materialCategory: { siteList = [], sitePagination = {} },
      fetchLoading,
    } = this.props;
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
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`${modelPrompt}.isDelete`).d('是否确认删除?')}
            onConfirm={this.deleteData.bind(this, record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 130,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
                    }),
                  },
                ],
                initialValue: record.siteCode,
              })(
                <Lov
                  code="MT.MATERIAL_CATEGORY_SITE"
                  textValue={record.siteCode}
                  onChange={(value, records) => this.changeCode(value, records, index)}
                  queryParams={{
                    tenantId,
                    materialCategoryId: this.props.record.materialCategoryId,
                  }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteTypeDesc`).d('站点类型'),
        dataIndex: 'siteTypeDesc',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点名称'),
        dataIndex: 'siteName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.extendField`).d('扩展字段'),
        dataIndex: 'relationTable',
        width: 108,
        align: 'center',
        render: (val, record) => (
          <span>
            {!(record._status === 'create') && (
              <a onClick={() => this.changeExtendAttr(record)} className="action-link">
                {intl.get(`${modelPrompt}.extendField`).d('扩展字段')}
              </a>
            )}
            {record._status === 'create' && intl.get(`${modelPrompt}.extendField`).d('扩展字段')}
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.action`).d('操作'),
        dataIndex: 'operator',
        width: 110,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get(`${modelPrompt}.save`).d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true, index)}>
                {intl.get(`${modelPrompt}.edit`).d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get(`${modelPrompt}.save`).d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    const extendDrawerProps = {
      visible: this.state.extendDrawerVisible,
      onCancel: this.handleExtendDrawerCancel,
      onOk: this.handleExtendDrawerCancel,
      initData: this.state.extendListData,
    };
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get('tarzan.product.materialCategory.title.siteDistribution').d('分配站点')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '100%' }}>
            <EditTable
              loading={fetchLoading}
              bordered
              rowKey="eventId"
              columns={columns}
              dataSource={siteList}
              pagination={sitePagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Spin>
        <ExtendDrawer {...extendDrawerProps} />
      </Modal>
    );
  }
}
