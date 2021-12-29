/**
 *@description: 物料维护详情入口页面
 *@author: 唐加旭
 *@date: 2019-08-19 15:57:26
 *@version: V0.0.1
 *@return:<MaterialDist />
 * */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import moment from 'moment';
import { isUndefined, isEmpty } from 'lodash';
import uuid from 'uuid/v4';

import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  delItemToPagination,
  addItemToPagination,
  getEditTableData,
  getCurrentOrganizationId,
} from 'utils/utils';

import DisplayForm from './DisplayForm';
import ChildTab from './ChildTab';
// import ProduceTab from './ProduceTab';
import AttributeDrawer from './AttributeDrawer';
import QualityModal from './QualityModal';
import QualityTable from './QualityTable';
import EquipmentTable from './EquipmentTable';
import DataItemTable from './DataItemTable';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.process.technology.model.technology';

@connect(({ technology, loading }) => ({
  technology,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['technology/fetchSingleOperation'],
  fetchQualityLoading: loading.effects['technology/fetchQuality'],
  fetchQualityLoadingSave: loading.effects['technology/fetchQualityList'],
  fetchEquipmentListLoading: loading.effects['technology/fetchEquipmentList'],
  deleteEquipmentListLoading: loading.effects['technology/deleteEquipmentList'],
}))
@formatterCollections({ code: 'tarzan.process.technology' })
@Form.create({ fieldNameProp: null })
export default class MaterialDist extends React.Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
    qualityVisible: false,
    selectedModalRowKeys: [],
    selectedModalRows: [],
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const operationId = match.params.id;
    dispatch({
      type: 'technology/fetchEnum',
    });
    // 获取下拉
    this.fetchSelectList('OPERATION_TYPE', 'ROUTER', 'typeList');
    this.fetchSelectList('WORKCELL_TYPE', 'MODELING', 'workCellList');
    this.fetchSiteOption();
    this.fetchStatusOption();
    this.fetchQualityList();

    if (operationId === 'create') {
      this.setState({
        canEdit: true,
      });
      dispatch({
        type: 'technology/fetchAttrCreate',
        payload: {
          kid: null,
          tableName: 'mt_operation_attr',
        },
      });
    } else {
      this.fetchDataItemList(operationId);
      this.basicFetch(operationId);
      this.handleFetchEquipmentList(operationId);
    }

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/clear',
    });
  }

  basicFetch = operationId => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'technology/fetchSingleOperation',
      payload: {
        operationId,
      },
    }).then(res => {
      if (res && res.success) {
        if (isUndefined(res.rows)) {
          history.push(`/hmes/process/technology/list`);
          notification.warning({
            message: intl.get(`${modelPrompt}.private`).d('未分配权限'),
            duration: 5,
          });
        }
      }
    });
    dispatch({
      type: 'technology/fetchAttrCreate',
      payload: {
        kid: operationId,
        tableName: 'mt_operation_attr',
      },
    });
    dispatch({
      type: 'technology/fetchChilStepsList',
      payload: {
        operationId,
      },
    });
  };

  @Bind
  fetchDataItemList(operationId, page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchDataItemList',
      payload: {
        operationId,
        page,
      },
    });
  }

  /**
   *@functionName:   fetchSelectList
   *@params1 {String} type 通用type
   *@params2 {String}  module 所属模块
   *@params3 {String}  stateType 修改得props
   *@description: 获取通用得下拉，包括类型，工作单元
   *@author: 唐加旭
   *@date: 2019-09-09 17:54:02
   *@version: V0.8.6
   * */
  @Bind
  fetchSelectList = (type, module, stateType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchSelectList',
      payload: {
        module,
        typeGroup: type,
        stateType,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          [stateType]: res.rows,
        });
      }
    });
  };

  @Bind()
  fetchSiteOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchSiteOption',
      payload: {
        siteType: 'MANUFACTURING',
      },
    });
  };

  @Bind()
  fetchStatusOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchStatusOption',
      payload: {
        module: 'ROUTER',
        statusGroup: 'OPERATION_STATUS',
      },
    });
  };

  @Bind()
  handleFetchEquipmentList(operationId, page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'technology/fetchEquipmentList',
      payload: {
        operationId,
        page,
      },
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */
  @Bind()
  validateEditTable(dataSource = [], excludeKeys = [], property = {}) {
    const editTableData = dataSource.filter(e => e._status);
    if (editTableData.length === 0) {
      return Promise.resolve([]); // 无新增/修改
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  }

  /**
   * 校验form
   *
   * @param {object} form form表单
   * @returns
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleValidateForm(form) {
    return new Promise((resolve, reject) => {
      if (isUndefined(form)) {
        resolve({});
      } else {
        form.validateFields({ force: true }, (err, value) => {
          if (err) {
            reject(
              notification.error({
                description: intl
                  .get('ssrm.leaseContractCreate.view.message.error')
                  .d('请完整页面上的必填信息'),
              })
            );
          } else {
            resolve(value);
          }
        });
      }
    });
  }

  @Bind()
  handleSave() {
    const {
      technology: {
        equipmentList,
        currentChangeChildSteps = [],
        childStepsList = [],
        technologyItem = {},
        equipmentPagination,
        dataItemList = [],
        dataItemPagination = {},
      },
      match, dispatch, history } = this.props;
    const operationId = match.params.id;
    Promise.all([
      this.handleValidateForm(this.form),
      this.validateEditTable(equipmentList),
      this.validateEditTable(dataItemList),
    ]).then(result => {
      if (result) {
        const [value, newEquipmentList] = result;
        const el = [
          ...currentChangeChildSteps.map(ele => ({
            ...ele,
            operationId,
          })),
        ];
        const eqList = newEquipmentList.map(e => {
          if (e._status === 'create') {
            const { opEqRelId, ...info } = e;
            return {
              ...info,
              operationId,
              enableFlag: info.enableFlag ? 'Y' : 'N',
              attribute1: info.enableFlag ? 'Y' : 'N',
            };
          }
          return {
            ...e,
            enableFlag: e.enableFlag ? 'Y' : 'N',
            attribute1: e.attribute1 ? 'Y' : 'N',
          };
        });
        if (childStepsList.length > 0) {
          childStepsList.map(item => {
            if ((item || {})._status === 'create') {
              item.$form.validateFieldsAndScroll(childError => {
                if (!childError) {
                  el.push({
                    operationId,
                    sequence: item.sequence,
                    ...item.$form.getFieldsValue(),
                  });
                }
              });
            }
            return true;
          });
        }
        dispatch({
          type: 'technology/saveEquipmentList',
          payload: eqList,
        }).then(res => {
          if (res) {
            this.handleFetchEquipmentList(operationId, equipmentPagination);
          }
        });
        dispatch({
          type: 'technology/saveOperationList',
          payload: {
            ...value,
            operationId: technologyItem.operationId,
            dateFrom: value.dateFrom ? moment(value.dateFrom).format('YYYY-MM-DD HH:mm:ss') : null,
            dateTo: value.dateTo ? moment(value.dateTo).format('YYYY-MM-DD HH:mm:ss') : null,
            currentFlag: value.currentFlag ? 'Y' : 'N',
            mtOperationSubstepList: el,
            equipmentList: newEquipmentList,
          },
        }).then(res => {
          if (res && res.success) {
            const params = getEditTableData(dataItemList, ['opTagRelId']);
            const arr = [];
            params.forEach(item => {
              arr.push({
                ...item,
                operationId: res.rows,
              });
            });
            dispatch({
              type: 'technology/saveDataItemList',
              payload: arr,
            }).then(ress => {
              if (ress) {
                this.fetchDataItemList(operationId, dataItemPagination);
                notification.success();
                this.setState({
                  canEdit: false,
                });
                history.push(`/hmes/process/technology/dist/${res.rows}`);
                dispatch({
                  type: 'technology/updateState',
                  payload: {
                    currentChangeChildSteps: [],
                  },
                });
                this.basicFetch(res.rows);
              }
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
   *@functionName:   changeStatus
   *@description 修改编辑状态
   *@author: 唐加旭
   *@date: 2019-08-24 11:09:45
   *@version: V0.8.6
   * */
  @Bind
  changeStatus = () => {
    this.setState({
      canEdit: true,
    });
  };

  showAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false });
  }

  // 查询资质数据-已保存
  @Bind()
  fetchQualityList(fields = {}) {
    const { dispatch, tenantId, match } = this.props;
    dispatch({
      type: 'technology/fetchQualityList',
      payload: {
        tenantId,
        operationId: match.params.id,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 新增资质-按钮
  @Bind()
  fetchQuality(fields = {}) {
    this.setState({ qualityVisible: true });
    const { dispatch, tenantId, match } = this.props;
    dispatch({
      type: 'technology/fetchQuality',
      payload: {
        tenantId,
        operationId: match.params.id,
        ...fields,
      },
    });
  }

  // 关闭抽屉
  @Bind()
  closeQualityModal() {
    this.setState({ qualityVisible: false });
  }

  // 模态框内选中
  @Bind()
  handleSelectQuality(selectedModalRowKeys, selectedModalRows) {
    this.setState({ selectedModalRowKeys, selectedModalRows });
  }

  // 保存资质数据
  @Bind()
  saveQuality() {
    const { dispatch, tenantId, match } = this.props;
    const { selectedModalRows } = this.state;
    if (selectedModalRows.length === 0) {
      notification.warning({ message: '请勾选数据！' });
    } else {
      this.setState({ qualityVisible: false });
      const arr = [];
      selectedModalRows.forEach(item => {
        arr.push({
          ...item,
          operationId: match.params.id,
          tenantId,
          enableFlag: 'Y',
        });
      });
      dispatch({
        type: 'technology/saveQuality',
        payload: {
          arr,
        },
      }).then(res => {
        if (res) {
          this.fetchQualityList();
        }
      });
    }
  }

  // 选中已保存的数据
  @Bind()
  handleSelect(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 删除资质
  @Bind
  delQuality() {
    const { dispatch, tenantId, match } = this.props;
    const { selectedRows } = this.state;
    const arr = [];
    selectedRows.forEach(item => {
      arr.push({
        ...item,
        operationId: match.params.id,
        tenantId,
        enableFlag: 'Y',
      });
    });
    dispatch({
      type: 'technology/delQuality',
      payload: {
        arr,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        notification.success();
        this.fetchQualityList();
      }
    });
  }

  /**
 * 编辑当前行
 *
 * @param {string} dataSource 数据源在model里的名称
 * @param {string} id 数据源的id名称
 * @param {object} current 当前行
 * @param {boolean} flag
 * @memberof ContractBaseInfo
 */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, technology } = this.props;
    const list = technology[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'technology/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleCleanLine(dataSource, paginationName, id, current) {
    const { dispatch, technology } = this.props;
    const list = technology[dataSource];
    const pagination = technology[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'technology/updateState',
      payload: {
        [dataSource]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      },
    });
  }

  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, technology } = this.props;
    const dataSource = technology[listName];
    const pagination = technology[paginationName];
    dispatch({
      type: 'technology/updateState',
      payload: {
        [listName]: [
          {
            [idName]: uuid(),
            _status: 'create',
          },
          ...dataSource,
        ],
        [pagination]: addItemToPagination(dataSource.length, pagination),
      },
    });
  }

  @Bind()
  handleCreateDataItemList() {
    const {
      dispatch,
      technology: { dataItemList = [], dataItemPagination = {} },
    } = this.props;
    dispatch({
      type: 'technology/updateState',
      payload: {
        dataItemList: [
          {
            opTagRelId: new Date().getTime(),
            _status: 'create',
          },
          ...dataItemList,
        ],
        dataItemPagination: addItemToPagination(dataItemList.length, dataItemPagination),
      },
    });
  }

  /**
 * 删除操作
 *
 * @param {array} selectedRows 勾选项
 * @param {string} dataSourceName 数据源模板
 * @param {string} idName 主键id名称
 * @param {string} effects
 * @memberof ContractBaseInfo
 */
  @Bind()
  handleDelete(record) {
    const { dispatch, technology: { equipmentPagination = {} }, match } = this.props;
    const operationId = match.params.id;
    if (!isEmpty(record)) {
      dispatch({
        type: `technology/deleteEquipmentList`,
        payload: [record],
      }).then(() => {
        notification.success();
        this.handleFetchEquipmentList(operationId, equipmentPagination);
      });
    }
  }

  @Bind()
  handleDeleteDataItemList(record) {
    const { dispatch, technology: { dataItemPagination = {} }, match } = this.props;
    const operationId = match.params.id;
    if (!isEmpty(record)) {
      dispatch({
        type: `technology/deleteDataItemList`,
        payload: [record],
      }).then(() => {
        notification.success();
        this.fetchDataItemList(operationId, dataItemPagination);
      });
    }
  }


  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      fetchEquipmentListLoading,
      technology: {
        qualityList = [],
        qualityPagination = {},
        qualityListSave = [],
        qualityPaginationSave = {},
        qualityType = [],
        equipmentCategoryList = [],
        equipmentList = [],
        equipmentPagination = [],
        dataItemList = [],
        dataItemPagination = {},
      },
      fetchQualityLoading,
      fetchQualityLoadingSave,
      tenantId,
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const operationId = match.params.id;
    const { canEdit, attributeDrawerVisible, qualityVisible } = this.state;
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      operationId,
      canEdit,
    };
    const qualityModalProps = {
      visible: qualityVisible,
      onSearch: this.fetchQuality,
      onOk: this.saveQuality,
      onChange: this.handleSelectQuality,
      onCancel: this.closeQualityModal,
      selectedModalRowKeys: this.state.selectedModalRowKeys,
      qualityList,
      qualityPagination,
      fetchQualityLoading,
      qualityType,
    };
    const equipmentTableProps = {
      isEdit: canEdit,
      equipmentCategoryList,
      operationId,
      loading: fetchEquipmentListLoading,
      dataSource: equipmentList,
      pagination: equipmentPagination,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchEquipmentList,
      onCreate: this.handleCreate,
      onDelete: this.handleDelete,
    };
    const dataItemProps = {
      isEdit: canEdit,
      operationId,
      tenantId,
      dataSource: dataItemList,
      pagination: dataItemPagination,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchEquipmentList,
      onCreate: this.handleCreateDataItemList,
      onDelete: this.handleDeleteDataItemList,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.process.technology.title.detail').d('工艺维护')}
          backPath={`${basePath}/list`}
        >
          {canEdit ? (
            <Button type="primary" icon="save" onClick={this.handleSave}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          ) : (
            <Button type="primary" icon="edit" onClick={this.changeStatus}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>
            )}
          <Button
            icon="arrows-alt"
            onClick={this.showAttrDrawer}
            disabled={operationId === 'create'}
          >
            {intl.get(`${modelPrompt}.field`).d('扩展字段')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} operationId={operationId} canEdit={canEdit} />
          <Tabs defaultActiveKey="sites">
            <TabPane tab={intl.get(`${modelPrompt}.setSites`).d('子步骤')} key="sites" forceRender>
              <ChildTab operationId={operationId} canEdit={canEdit} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.quality`).d('资质要求')} key="quality" forceRender>
              <QualityTable
                delQuality={this.delQuality}
                addQuality={this.fetchQuality}
                qualityListSave={qualityListSave}
                qualityPaginationSave={qualityPaginationSave}
                fetchQualityLoadingSave={fetchQualityLoadingSave}
                selectedRowKeys={this.state.selectedRowKeys}
                onChange={this.handleSelect}
                canEdit={canEdit}
                operationId={operationId}
              />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.equipment`).d('设备要求')} key="equipment" forceRender>
              <EquipmentTable
                {...equipmentTableProps}
              />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.dataItem`).d('数据项')} key="dataItem" forceRender>
              <DataItemTable
                {...dataItemProps}
              />
            </TabPane>
          </Tabs>
        </Content>
        {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        {qualityVisible && <QualityModal {...qualityModalProps} />}
      </React.Fragment>
    );
  }
}
