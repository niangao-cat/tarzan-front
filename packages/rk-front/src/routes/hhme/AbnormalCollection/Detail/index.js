/**
 * 异常收集组维护 - AbnormalCollection
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Tabs, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { isEmpty, isArray } from 'lodash';

import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  addItemToPagination,
  delItemToPagination,
  getCurrentOrganizationId,
  getEditTableData,
} from 'utils/utils';

import BaseInfo from './BaseInfo';
import ProcessList from './ProcessList';
import LineList from './LineList';
import HeadList from './HeadList';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.abnormalCollection';

@connect(({ abnormalCollection, loading }) => ({
  abnormalCollection,
  loading,
  tenantId: getCurrentOrganizationId(),
  saveLoading: loading.effects['abnormalCollection/save'],
  fetchDetailLoading: loading.effects['abnormalCollection/fetchDetail'],
  fetchLineListLoading: loading.effects['abnormalCollection/fetchLineList'],
  fetchOldLineListLoading: loading.effects['abnormalCollection/fetchOldLineList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isLineEdit: false,
      selectedRows: [],
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalCollection/updateState',
      payload: {
        headList: [],
        lineList: [],
        linePagination: {},
        processList: [],
        baseInfo: {},
        selectedRecord: {},
      },
    });
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (id !== 'create') {
      this.handleFetchHeadList(id);
    }
    this.handleFetchSelectList();
  }

  @Bind()
  handleFetchHeadList(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalCollection/fetchDetail',
      payload: {
        exceptionGroupId: id,
      },
    });
  }

  @Bind()
  handleFetchLineList(page = {}, record = {}) {
    const {
      dispatch,
      abnormalCollection: { selectedRecord = {} },
    } = this.props;
    const newRecord = isEmpty(record) ? selectedRecord : record;
    dispatch({
      type: 'abnormalCollection/fetchLineList',
      payload: {
        selectedRecord: newRecord,
        page,
      },
    });
  }

  @Bind()
  handleFetchOldLineList(page = {}, record = {}) {
    const { dispatch } = this.props;
    const { exceptionId } = record;
    dispatch({
      type: 'abnormalCollection/fetchOldLineList',
      payload: {
        exceptionId,
        page,
      },
    });
  }

  @Bind()
  handleFetchSelectList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'abnormalCollection/fetchExceptionCodeList',
      payload: {
        module: 'HME',
        typeGroup: 'EXCEPTION_GROUP_TYPE',
      },
    });
  }

  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, abnormalCollection } = this.props;
    const dataSource = abnormalCollection[listName];
    const pagination = abnormalCollection[paginationName];
    const payload = {};
    payload[listName] = [
      {
        [idName]: uuid(),
        _status: 'create',
      },
      ...dataSource,
    ];
    if (pagination) {
      payload[pagination] = addItemToPagination(dataSource.length, pagination);
    }
    if (listName === 'headList') {
      const firstObj = payload[listName][0];
      this.setState({ selectedRows: [firstObj] });
    }
    dispatch({
      type: 'abnormalCollection/updateState',
      payload,
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
    const { dispatch, abnormalCollection } = this.props;
    const list = abnormalCollection[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'abnormalCollection/updateState',
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
    const { dispatch, abnormalCollection } = this.props;
    const list = abnormalCollection[dataSource];
    const pagination = abnormalCollection[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    let payload = {};
    if (pagination) {
      payload = {
        [dataSource]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      };
    } else {
      payload = {
        [dataSource]: newList,
      };
    }
    dispatch({
      type: 'abnormalCollection/updateState',
      payload,
    });
  }

  @Bind()
  handleCanEdit() {
    const {
      dispatch,
      abnormalCollection: { headList, processList, lineList },
    } = this.props;
    const { isEdit } = this.state;
    if (isEdit) {
      const newList = (list = []) =>
        list
          .filter(e => e._status !== 'create')
          .map(e => (e._status === 'update' ? { ...e, _status: '' } : e));
      dispatch({
        type: 'abnormalCollection/updateState',
        payload: {
          headList: newList(headList),
          processList: newList(processList),
          lineList: newList(lineList),
        },
      });
    }
    this.setState({ isEdit: !isEdit });
  }

  @Bind()
  handleCanLineEdit() {
    const { isLineEdit } = this.state;
    this.setState({ isLineEdit: !isLineEdit });
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
      return Promise.resolve([]);
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
    });
  }

  @Bind()
  handleSave() {
    const {
      dispatch,
      history,
      match: {
        params: { id },
      },
      abnormalCollection: {
        processList = [],
        lineList = [],
        headList = [],
        selectedRecord = {},
        baseInfo = {},
      },
    } = this.props;
    const noUpdateLineList = lineList.filter(e => !['create', 'update'].includes(e._status));
    Promise.all([
      this.handleValidateForm(this.baseInfoForm),
      this.validateEditTable(headList),
      this.validateEditTable(lineList, ['exceptionGroupRouterId']),
      this.validateEditTable(processList, ['excGroupWkcAssignId']),
    ]).then(res => {
      const [newBaseInfo, newHeadList, newLineList, newProcessList] = res;
      let hmeExcGroupAssignList = isEmpty(selectedRecord) ? newHeadList : newHeadList.concat([selectedRecord]);
      const newList = isArray(newLineList) ? newLineList.map(e => ({
        ...e,
        exceptionGroupAssignId: selectedRecord.exceptionGroupAssignId,
        isTop: e.isTop ? 'Y' : 'N',
      })) : [];
      const topList = newList.concat(noUpdateLineList).filter(e => e.isTop === 'Y');
      if (isEmpty(newList) || topList.length > 0) {
        hmeExcGroupAssignList = isArray(hmeExcGroupAssignList) ? hmeExcGroupAssignList.map(e => {
          const obj = e;
          obj.enableFlag = !obj.enableFlag ? 'N' : 'Y';
          if (obj._status === 'create') {
            obj.exceptionGroupId = baseInfo.exceptionGroupId;
          }
          if (obj.headId === selectedRecord.headId) {
            obj.hmeExcGroupRouterList = newList;
          }
          return obj;
        }) : [];
        hmeExcGroupAssignList.forEach(e => {
          delete e.headId;
        });
        const hmeExcGroupWkcAssignList = isArray(newProcessList) ? newProcessList.map(e => {
          const { headId, ...processInfo } = e;
          return e._status === 'create'
            ? {
                ...processInfo,
                enableFlag: !e.enableFlag ? 'N' : 'Y',
                exceptionGroupId: baseInfo.exceptionGroupId,
              }
            : {
                ...processInfo,
                enableFlag: !e.enableFlag ? 'N' : 'Y',
              };
        }) : [];
        dispatch({
          type: 'abnormalCollection/save',
          payload: {
            data: {
              ...baseInfo,
              ...newBaseInfo,
              enableFlag: !newBaseInfo.enableFlag ? 'N' : 'Y',
              hmeExcGroupAssignList,
              hmeExcGroupWkcAssignList,
            },
          },
        }).then(result => {
          if (result) {
            notification.success();
            this.handleFetchLineList();
            if (id === 'create') {
              this.handleFetchHeadList(result.exceptionGroupId);
              history.push(`/hmes/abnormal-collection/detail/${result.exceptionGroupId}`);
            } else {
              this.handleFetchHeadList(id);
            }
          }
        });
      } else {
        notification.warning({
          description: '保存时必须存在一行勾选【是否最高级异常】',
        });
      }
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
    const { dispatch } = this.props;
    if (!isEmpty(record)) {
      const { exceptionId, exceptionGroupRouterId } = record;
      dispatch({
        type: `abnormalCollection/deleteLineList`,
        payload: {
          data: {
            exceptionId,
            exceptionGroupRouterId,
          },
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleFetchLineList();
        }
      });
    }
  }

  @Bind()
  handleChangeSelectedRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
    const record = selectedRows[0];
    if (record._status !== 'create') {
      this.handleFetchLineList({}, record);
    }
  }

  @Bind()
  handleDeleteProcess(record) {
    const { dispatch, match: { params: { id } } } = this.props;
    if (!isEmpty(record)) {
      dispatch({
        type: `abnormalCollection/deleteProcess`,
        payload: record,
      }).then(res => {
        if (res) {
          notification.success();
          this.handleFetchHeadList(id);
        }
      });
    }
  }

  render() {
    const {
      match,
      tenantId,
      saveLoading,
      fetchDetailLoading,
      fetchLineListLoading,
      abnormalCollection: {
        baseInfo = {},
        processList = [],
        headList = [],
        lineList = [],
        linePagination = {},
        selectedRecord = {},
        exceptionCodeList = [],
      },
    } = this.props;
    const { isEdit, isLineEdit, selectedRows } = this.state;
    const editable = match.params.id === 'create' ? true : isEdit;
    const baseInfoProps = {
      baseInfo,
      tenantId,
      exceptionCodeList,
      isEdit: editable,
      onRef: node => {
        this.baseInfoForm = node.props.form;
      },
    };
    const processListProps = {
      loading: fetchDetailLoading,
      tenantId,
      isEdit: editable,
      dataSource: processList,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onDelete: this.handleDeleteProcess,
    };
    const headListProps = {
      selectedRows,
      loading: fetchDetailLoading,
      tenantId,
      isEdit: editable,
      dataSource: headList,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onFetchLineList: this.handleFetchLineList,
      onFetchOldLineList: this.handleFetchOldLineList,
      onChangeSelectedRows: this.handleChangeSelectedRows,
    };
    const lineListProps = {
      loading: fetchLineListLoading,
      isEdit: isLineEdit,
      dataSource: lineList,
      pagination: linePagination,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onDeleteLine: this.handleDelete,
    };
    return (
      <Fragment>
        <Header
          title={intl.get(`${modelPrompt}.view.title`).d('异常收集组维护明细')}
          backPath="/hmes/abnormal-collection/list"
        >
          {match.params.id !== 'create' && (
            <Button icon="edit" type="default" onClick={() => this.handleCanEdit()}>
              {isEdit
                ? intl.get(`${modelPrompt}.button.cancelEdit`).d('取消编辑')
                : intl.get('hzero.common.button.edit').d('编辑')}
            </Button>
          )}
          {(editable || isLineEdit) && (
            <Button
              loading={saveLoading}
              type="primary"
              icon="save"
              onClick={() => this.handleSave()}
            >
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          )}
        </Header>
        <Content>
          <Spin spinning={fetchDetailLoading || false}>
            <BaseInfo {...baseInfoProps} />
          </Spin>
          <Tabs defaultActiveKey="abnormalResponse" animated={false}>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.businessTerms`).d('异常信息响应')}
              key="abnormalResponse"
              forceRender
            >
              <div className={styles['head-table']}>
                <HeadList {...headListProps} />
              </div>
              <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                <Button
                  type="default"
                  style={{ marginRight: '12px', marginBottom: '12px' }}
                  onClick={() => this.handleCanLineEdit()}
                  disabled={!selectedRecord.exceptionId}
                >
                  {isLineEdit
                    ? intl.get(`${modelPrompt}.button.maintain`).d('取消维护响应岗位')
                    : intl.get(`${modelPrompt}.button.maintain`).d('维护响应岗位')}
                </Button>
              </div>
              <div className={styles['head-table']}>
                <LineList {...lineListProps} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.financeTerms`).d('关联工序')}
              key="processList"
              forceRender
            >
              <ProcessList {...processListProps} />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Fragment>
    );
  }
}
