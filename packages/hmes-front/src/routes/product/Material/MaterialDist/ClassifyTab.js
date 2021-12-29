/**
 *@description 调度工艺模态框
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Popconfirm, notification } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';

@connect(({ materialManager, loading }) => ({
  materialManager,
  loading: loading.effects['materialManager/fetchSitesDispatch'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'tarzan.product.materialManager' })
export default class ClassifyTab extends PureComponent {
  // componentDidMount() {
  //   const { materialId } = this.props;
  //   if (materialId !== 'create') {
  //     // this.refresh();
  //   }
  // }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch, materialId } = this.props;
    dispatch({
      type: 'materialManager/fetchSitesDispatch',
      payload: {
        page: pagination,
        materialId,
      },
    });
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      materialManager: { materialSitesDispatchList = [], materialSitesDispatchPagination = {} },
    } = this.props;
    if (
      materialSitesDispatchList.length === 0 ||
      (materialSitesDispatchList.length > 0 && materialSitesDispatchList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'materialManager/updateState',
        payload: {
          materialSitesDispatchList: [
            {
              enableFlag: 'Y',
              // objectColumnCode: '',
              // objectColumnId: '',
              // objectColumnName: '',
              // objectId: '',
              materialCategoryAssignId: '',
              _status: 'create',
            },
            ...materialSitesDispatchList,
          ],
          materialSitesDispatchPagination: addItemToPagination(
            materialSitesDispatchList.length,
            materialSitesDispatchPagination
          ),
        },
      });
    }
  }

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
      materialManager: { materialSitesDispatchList = [], materialSitesDispatchPagination = {} },
    } = this.props;
    if (record.materialCategoryAssignId !== '') {
      dispatch({
        type: 'materialManager/deleteSitesDispatch',
        payload: [record.materialCategoryAssignId],
      }).then(res => {
        if (res && res.success) {
          this.refresh();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      materialSitesDispatchList.splice(index, 1);
      dispatch({
        type: 'materialManager/updateState',
        payload: {
          materialSitesDispatchList,
          materialSitesDispatchPagination: delItemToPagination(1, materialSitesDispatchPagination),
        },
      });
    }
  };

  @Bind()
  changeCode = (value, record, index) => {
    const {
      materialManager: { materialSitesDispatchList = [] },
      dispatch,
    } = this.props;
    materialSitesDispatchList[index].siteCode = record.siteCode;
    materialSitesDispatchList[index].siteId = record.siteId;
    materialSitesDispatchList[index].siteName = record.siteName;
    materialSitesDispatchList[index].typeDesc = record.typeDesc;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesDispatchList,
      },
    });
  };

  @Bind()
  changeDesc = (value, record, index) => {
    const {
      materialManager: { materialSitesDispatchList = [] },
      dispatch,
    } = this.props;
    materialSitesDispatchList[index].categorySetDesc = record.description;
    materialSitesDispatchList[index].categorySetCode = record.categorySetCode;
    materialSitesDispatchList[index].materialCategorySetId = record.materialCategorySetId;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesDispatchList,
      },
    });
  };

  @Bind()
  changMaterialCategory = (value, record, index) => {
    const {
      materialManager: { materialSitesDispatchList = [] },
      dispatch,
    } = this.props;
    materialSitesDispatchList[index].categoryDesc = record.description;
    materialSitesDispatchList[index].categoryCode = record.categoryCode;
    materialSitesDispatchList[index].materialCategoryId = record.materialCategoryId;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesDispatchList,
      },
    });
  };

  render() {
    const {
      // visible,
      canEdit,
      materialManager: { materialSitesDispatchList = [], materialSitesDispatchPagination = {} },
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
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, record, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 100,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteCode`, {
                initialValue: record.siteCode,
              })(
                <Lov
                  code="MT.SITE"
                  disabled={!canEdit}
                  // textValue={typeGroup}
                  onChange={(value, records) => this.changeCode(value, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.typeDesc`).d('站点类型'),
        dataIndex: 'typeDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.categorySetCode`).d('所属类别集编码'),
        dataIndex: 'categorySetCode',
        width: 100,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`categorySetCode`, {
                initialValue: record.categorySetCode,
                rules: [
                  {
                    required: record.$form.getFieldValue('siteCode'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.categorySetCode`).d('所属类别集编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.MATERIAL_CATEGORY_SET"
                  // textValue={typeGroup}
                  disabled={!canEdit}
                  onChange={(value, records) => this.changeDesc(value, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.categorySetDesc`).d('所属类别集描述'),
        dataIndex: 'categorySetDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
        dataIndex: 'categoryCode',
        width: 100,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`categoryCode`, {
                initialValue: record.categoryCode,
                rules: [
                  {
                    required: record.$form.getFieldValue('siteCode'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.categoryCode`).d('物料类别'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.MATERIAL_CATEGORY_BY_SET"
                  disabled={!canEdit}
                  // textValue={typeGroup}
                  onChange={(value, records) => this.changMaterialCategory(value, records, index)}
                  queryParams={{ tenantId, materialCategorySetId: record.materialCategorySetId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.categoryDesc`).d('物料类别描述'),
        dataIndex: 'categoryDesc',
        width: 100,
      },
      // {
      //   title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
      //   dataIndex: 'enableFlag',
      //   width: 100,
      //   render: (val, record) =>
      //     ['create', 'update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`enableFlag`, {
      //           initialValue: record.enableFlag !== 'N',
      //         })(<Switch />)}
      //       </Form.Item>
      //     ) : (
      //       <Badge
      //         status={record.enableFlag !== 'N' ? 'success' : 'error'}
      //         text={
      //           record.enableFlag !== 'N'
      //             ? intl.get(`${modelPrompt}.enable`).d('启用')
      //             : intl.get(`${modelPrompt}.unable`).d('禁用')
      //         }
      //       />
      //     ),
      // },
    ];
    return (
      <div style={{ width: '100%' }}>
        <EditTable
          bordered
          rowKey="materialCategoryAssignId"
          columns={columns}
          dataSource={materialSitesDispatchList}
          pagination={materialSitesDispatchPagination}
          onChange={this.refresh}
        />
      </div>
    );
  }
}
