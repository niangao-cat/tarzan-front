/**
 *@description 调度工艺模态框
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} attributeDrawerVisible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Badge, Popconfirm, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import AttributeDrawer from '@/components/AttributeDrawer';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';
const TABLENAME = 'mt_material_site_attr';

@connect(({ materialManager, loading }) => ({
  materialManager,
  loading: loading.effects['materialManager/materialSitesList'],
}))
@Form.create()
@formatterCollections({ code: 'tarzan.product.materialManager' })
export default class SitesTab extends PureComponent {
  state = {
    attributeDrawerVisible: false,
    materialSiteId: '',
  };

  /**
   *@functionName:   refresh
   *@params {object} pagination 分页查询
   *@description:
   *@author: 唐加旭
   *@date: 2019-08-20 14:32:40
   *@version: V0.0.1
   * */
  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch, materialId } = this.props;
    dispatch({
      type: 'materialManager/materialSitesList',
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
      materialManager: { materialSitesList = [], materialSitesPagination = {} },
    } = this.props;

    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesList: [
          {
            enableFlag: 'Y',
            materialSiteId: `create${Math.random() * 10000}`,
            _status: 'create',
          },
          ...materialSitesList,
        ],
        materialSitesPagination: addItemToPagination(
          materialSitesList.length,
          materialSitesPagination
        ),
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
  changeCode = (value, record, index) => {
    const {
      materialManager: { materialSitesList = [] },
      dispatch,
    } = this.props;
    materialSitesList[index].siteCode = record.siteCode;
    materialSitesList[index].siteId = record.siteId;
    materialSitesList[index].siteName = record.siteName;
    materialSitesList[index].typeDesc = record.typeDesc;
    materialSitesList[index].siteType = record.typeDesc;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesList,
      },
    });
  };

  /**
   *@functionName:   changeFlag
   *@params1 {Any} value 启用停用状态
   *@params2 {Number} index table表下标
   *@description 设置table表的值
   *@author: 姜睿琦
   *@date: 2019-10-22 12:56:18
   *@version: V0.8.6
   * */
  @Bind()
  changeFlag = (checked, index) => {
    const {
      materialManager: { materialSitesList = [] },
      dispatch,
    } = this.props;
    materialSitesList[index].enableFlag = checked ? 'Y' : 'N';
    materialSitesList[index]._edited = true;
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesList,
      },
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
      materialManager: {
        materialSitesList = [],
        materialSitesPagination = {},
        materialSitesDispatchList = [],
      },
    } = this.props;

    if (!/^create/.test(record.materialSiteId)) {
      dispatch({
        type: 'materialManager/materialSitesDelete',
        payload: [record.materialSiteId],
      }).then((res) => {
        if (res && res.success) {
          this.refresh();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      materialSitesList.splice(index, 1);
      dispatch({
        type: 'materialManager/updateState',
        payload: {
          materialSitesList,
          materialSitesPagination: delItemToPagination(1, materialSitesPagination),
        },
      });
    }

    // 过滤掉当前站点已经分配的物料类别数据
    const curMaterialSitesDispatchList = materialSitesDispatchList.filter(
      (ele) => ele.siteId !== record.siteId
    );
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        materialSitesDispatchList: curMaterialSitesDispatchList,
      },
    });
  };

  openAttrDrawer = (record) => {
    const { dispatch } = this.props;
    const kid = record.materialSiteId;
    dispatch({
      type: 'materialManager/fetchAttrCreate',
      payload: {
        kid,
        tableName: TABLENAME,
      },
    }).then((res) => {
      if (res && res.success) {
        this.setState({
          attributeDrawerVisible: true,
          materialSiteId: kid,
        });
      }
    });
  };

  closeAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
      materialSiteId: '',
    });
  };

  handleSave = (dataSource) => {
    const { dispatch } = this.props;
    const { materialSiteId } = this.state;

    if (dataSource.length > 0) {
      dispatch({
        type: 'materialManager/saveAttr',
        payload: {
          kid: materialSiteId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then((res) => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  /**
   * 判断当前行的站点是否被类别分配tab使用
   *
   * @param {object} record
   * @returns boolean
   */
  alreadUsedSiteDispatch = (record) => {
    const {
      materialManager: { materialSitesDispatchList = [] },
    } = this.props;

    return materialSitesDispatchList.filter((ele) => ele.siteId === record.siteId).length;
  };

  render() {
    const {
      loading,
      canEdit,
      materialManager: {
        materialSitesList = [],
        materialSitesPagination = {},
        attributeTabList = [],
      },
    } = this.props;
    const { attributeDrawerVisible, materialSiteId } = this.state;
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
        dataIndex: 'first',
        render: (val, record, index) => {
          if (!canEdit) {
            return <Button disabled icon="minus" shape="circle" size="small" />;
          }
          return (
            <Popconfirm
              title={
                this.alreadUsedSiteDispatch(record)
                  ? intl
                      .get(`${modelPrompt}.confirm.delete`)
                      .d('所选站点已被类别分配占用，是否确认删除?')
                  : intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')
              }
              onConfirm={this.deleteData.bind(
                this,
                record,
                index,
                this.alreadUsedSiteDispatch(record)
              )}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 150,
        render: (val, record, index) =>
          ['create'].includes(record._status) ? (
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
        title: intl.get(`${modelPrompt}.siteName`).d('站点名称'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.typeDesc`).d('站点类型'),
        dataIndex: 'siteType',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        render: (val, record, index) => {
          if (['create'].includes(record._status)) {
            return (
              <Form.Item>
                {record.$form.getFieldDecorator(`enableFlag`, {
                  initialValue: record.enableFlag !== 'N',
                })(<Switch />)}
              </Form.Item>
            );
          } else if (!canEdit || record._status === 'create') {
            return (
              <Badge
                status={record.enableFlag !== 'N' ? 'success' : 'error'}
                text={
                  record.enableFlag !== 'N'
                    ? intl.get(`${modelPrompt}.enable`).d('启用')
                    : intl.get(`${modelPrompt}.unable`).d('禁用')
                }
              />
            );
          }
          return (
            <Switch
              defaultChecked={val === 'Y'}
              onChange={(checked) => this.changeFlag(checked, index)}
            />
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.extendAttrs`).d('扩展属性'),
        dataIndex: 'extendAttrs',
        width: 120,
        render: (val, record) => (
          <a
            disabled={record._status === 'create'}
            onClick={this.openAttrDrawer.bind(this, record)}
          >
            {intl.get(`${modelPrompt}.extendAttrs`).d('扩展属性')}
          </a>
        ),
      },
    ];
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      codeId: materialSiteId,
      canEdit,
      tableName: TABLENAME,
      attrList: attributeTabList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };
    return (
      <div style={{ width: '100%' }}>
        <EditTable
          bordered
          loading={loading}
          rowKey="materialSiteId"
          columns={columns}
          dataSource={materialSitesList}
          pagination={materialSitesPagination}
          onChange={this.refresh}
        />
        {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
      </div>
    );
  }
}
