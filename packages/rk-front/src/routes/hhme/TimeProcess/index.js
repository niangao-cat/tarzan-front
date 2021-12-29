/**
 * 时效工艺时长维护 - TimeProcess
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Icon, Dropdown, Menu } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  // addItemToPagination,
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
  // delItemToPagination,
} from 'utils/utils';

import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
import RelatedItemList from './RelatedItemList';
import RelatedObjectList from './RelatedObjectList';
import Drawer from './Drawer';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.timeProcess';
const dateTimeFormat = getDateTimeFormat();

@connect(({ timeProcess, loading }) => ({
  timeProcess,
  tenantId: getCurrentOrganizationId(),
  fetchHeadListLoading: loading.effects['timeProcess/fetchHeadList'],
  fetchItemListLoading: loading.effects['timeProcess/fetchItemList'],
  fetchObjectListLoading: loading.effects['timeProcess/fetchObjectList'],
  fetchProcessHistoryListLoading: loading.effects['timeProcess/fetchProcessHistoryList'],
  fetchItemHistoryListLoading: loading.effects['timeProcess/fetchItemHistoryList'],
  fetchObjectHistoryListLoading: loading.effects['timeProcess/fetchObjectHistoryList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.TimeProcess',
})
export default class TimeProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseKeys: ['abnormalResponse'],
      headSelectRows: [],
      visible: false,
      type: '', // 侧滑弹框类型  时效工艺历史‘PROCESS’ / 关联物料历史'ITEM' / 关联其它对象历史 'history'
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeProcess/updateState',
      payload: {
        headList: [],
        pagination: {},
        itemList: [],
        itemPagination: {},
        exceptionTypeList: [],
        objectList: [],
        objectPagination: {},
        processHistoryList: [],
        processHistoryPagination: {},
        itemHistoryList: [],
        itemHistoryPagination: {},
        objectHistoryList: [],
        objectHistoryPagination: {},
        objectTypeList: [],
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeProcess/init',
    });
    this.handleFetchHeadList();
  }

  @Bind()
  handleFetchHeadList(page = {}) {
    const { dispatch } = this.props;
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'timeProcess/fetchHeadList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleFetchItemList(page = {}, fields = {}) {
    const { dispatch } = this.props;
    const { headSelectRows } = this.state;
    dispatch({
      type: 'timeProcess/fetchItemList',
      payload: {
        operationTimeId: headSelectRows[0].operationTimeId,
        page,
        ...fields,
      },
    });
  }

  @Bind()
  handleFetchObjectList(page = {}, fields = {}) {
    const { dispatch } = this.props;
    const { headSelectRows } = this.state;
    dispatch({
      type: 'timeProcess/fetchObjectList',
      payload: {
        operationTimeId: headSelectRows[0].operationTimeId,
        page,
        ...fields,
      },
    });
  }

  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, timeProcess } = this.props;
    const dataSource = timeProcess[listName];
    // const pagination = timeProcess[paginationName];
    dispatch({
      type: 'timeProcess/updateState',
      payload: {
        [listName]: [
          {
            [idName]: uuid(),
            _status: 'create',
          },
          ...dataSource,
        ],
        // [pagination]: addItemToPagination(dataSource.length, pagination),
      },
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
    const { dispatch, timeProcess } = this.props;
    const list = timeProcess[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'timeProcess/updateState',
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
    const { dispatch, timeProcess } = this.props;
    const list = timeProcess[dataSource];
    // const pagination = timeProcess[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'timeProcess/updateState',
      payload: {
        [dataSource]: newList,
        // [paginationName]: delItemToPagination(newList.length, pagination),
      },
    });
  }

  @Bind()
  handleSaveList(record, type) {
    const { dispatch, timeProcess: { pagination, siteInfo, itemPagination, objectPagination } } = this.props;
    const { headSelectRows } = this.state;
    let effects = '';
    let id = '';
    let payload = {};
    switch(type) {
      case 'PROCESS':
        effects = 'saveHeadList';
        id = 'operationTimeId';
        break;
      case 'ITEM':
        effects = 'saveItemList';
        id = 'operationTimeMaterialId';
        payload = { operationTimeId: headSelectRows[0].operationTimeId, siteId: siteInfo.siteId };
        break;
      case 'OBJECT':
        effects = 'saveObjectList';
        id = 'operationTimeObjectId';
        payload = { operationTimeId: headSelectRows[0].operationTimeId, siteId: siteInfo.siteId};
        break;
      default:
    }
    const { $form, [id]: recordId, _status, ...info } = record;
    record.$form.validateFields((err, value) => {
      if (!err) {
        payload = _status === 'create' ? [{
          ...info,
          ...payload,
          ...value,
          enableFlag: value.enableFlag ? 'Y' : 'N',
        }] : [{
          ...info,
          ...payload,
          ...value,
          enableFlag: value.enableFlag ? 'Y' : 'N',
          [id]: recordId,
        }];
        dispatch({
          type: `timeProcess/${effects}`,
          payload,
        }).then(res => {
          if (res) {
            notification.success();
            switch(type) {
              case 'PROCESS':
                this.handleFetchHeadList(pagination);
                break;
              case 'ITEM':
                this.handleFetchItemList(itemPagination);
                break;
              case 'OBJECT':
                this.handleFetchObjectList(objectPagination);
                break;
              default:
            }
          }
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
      const { exceptionId, exceptionRouterId } = record;
      dispatch({
        type: `timeProcess/deleteLineList`,
        payload: {
          data: {
            exceptionId,
            exceptionRouterId,
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
  handleFetchHistoryList(page = {}) {
    const { dispatch } = this.props;
    const { headSelectRows, type } = this.state;
    let value = this.drawerForm ? this.drawerForm.getFieldsValue() : {};
    const { dateFrom, dateTo} = value;
    value = {
      ...value,
      dateFrom: isEmpty(dateFrom)
        ? null
        : dateFrom.startOf('day').format(dateTimeFormat),
      dateTo: isEmpty(dateTo) ? null : dateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.drawerForm) ? {} : filterNullValueObject(value);
    let effects = '';
    switch(type) {
      case 'PROCESS':
        effects = 'fetchProcessHistoryList';
        break;
      case 'ITEM':
        effects = 'fetchItemHistoryList';
        break;
      case 'OBJECT':
        effects = 'fetchObjectHistoryList';
        break;
      default:
    }
    dispatch({
      type: `timeProcess/${effects}`,
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
        operationTimeId: headSelectRows[0].operationTimeId,
      },
    });
  }


  @Bind()
  handleChangeKey(key) {
    this.setState({ collapseKeys: key });
  }

  @Bind()
  handleOpenDrawer(type) {
    this.setState(
      { visible: true, type },
      () => {
        this.handleFetchHistoryList();
      }
    );
  }

  @Bind()
  handleCloseDrawer() {
    this.setState({ visible: false, type: null });
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({
      headSelectRows: selectedRows,
    },
    () => {
      this.handleFetchItemList();
      this.handleFetchObjectList();
    });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchHeadListLoading,
      fetchItemListLoading,
      fetchObjectListLoading,
      fetchProcessHistoryListLoading,
      fetchItemHistoryListLoading,
      fetchObjectHistoryListLoading,
      tenantId,
      timeProcess: {
        headList = [],
        pagination = {},
        itemList = [],
        itemPagination = {},
        objectList = [],
        objectPagination = {},
        processHistoryList = [],
        processHistoryPagination = {},
        itemHistoryList = [],
        itemHistoryPagination = {},
        objectHistoryList = [],
        objectHistoryPagination = {},
        objectTypeList = [],
        siteInfo = {},
      },
    } = this.props;
    const { collapseKeys = [], visible, type, headSelectRows } = this.state;
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchHeadList,
    };
    const headListProps = {
      tenantId,
      siteInfo,
      loading: fetchHeadListLoading,
      pagination,
      dataSource: headList,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchHeadList,
      onCreate: this.handleCreate,
      onSave: this.handleSaveList,
      onFetchLineList: this.handleFetchLineList,
      rowSelection: {
        selectedRowKeys: headSelectRows.map(e => e.operationTimeId),
        type: 'radio', // 单选
        onChange: (selectedRowKeys, selectedRows) => this.handleChangeSelectRows(selectedRowKeys, selectedRows),
      },
    };
    const relatedItemListProps = {
      tenantId,
      siteInfo,
      headSelectRows,
      dataSource: itemList,
      pagination: itemPagination,
      loading: fetchItemListLoading,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchItemList,
      onDelete: this.handleDelete,
      onSave: this.handleSaveList,
    };
    const relatedObjectListProps = {
      tenantId,
      siteInfo,
      objectTypeList,
      headSelectRows,
      dataSource: objectList,
      pagination: objectPagination,
      loading: fetchObjectListLoading,
      onCreate: this.handleCreate,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchObjectList,
      onDelete: this.handleDelete,
      onSave: this.handleSaveList,
    };

    const drawerFilterFormProps = {
      type,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
      onSearch: this.handleFetchHistoryList,
    };

    const drawerProps = {
      type,
      visible,
      loading: fetchProcessHistoryListLoading || fetchItemHistoryListLoading || fetchObjectHistoryListLoading,
      processHistoryList,
      processHistoryPagination,
      itemHistoryList,
      itemHistoryPagination,
      objectHistoryList,
      objectHistoryPagination,
      onSearch: this.handleFetchHistoryList,
      drawerFilterFormProps,
      onCancel: this.handleCloseDrawer,
    };
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.handleOpenDrawer('PROCESS')}>时效工艺历史</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handleOpenDrawer('ITEM')}>关联物料历史</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handleOpenDrawer('OBJECT')}>关联其它对象历史</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('时效工艺时长维护')}>
          <Dropdown disabled={headSelectRows.length === 0} overlay={menu} placement="bottomCenter">
            <Button icon="edit">
              {intl.get('tarzan.acquisition.dataItem.button.copy').d('修改历史')}
            </Button>
          </Dropdown>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <HeadTable {...headListProps} />
          </div>
          <div className="ued-detail-wrapper">
            <Collapse
              className="form-collapse"
              defaultActiveKey={['relatedItemList', 'relatedObjectList']}
              onChange={this.handleChangeKey}
            >
              <Collapse.Panel
                showArrow={false}
                key="relatedItemList"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.relatedItemList`).d('关联物料')}</h3>
                    <a>
                      {collapseKeys.includes('relatedItemList')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('relatedItemList') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <div className={styles['head-table']}>
                  <RelatedItemList {...relatedItemListProps} />
                </div>
              </Collapse.Panel>
              <Collapse.Panel
                showArrow={false}
                key="relatedObjectList"
                header={
                  <Fragment>
                    <h3>{intl.get(`${modelPrompt}.relatedObjectList`).d('关联其他对象')}</h3>
                    <a>
                      {collapseKeys.includes('relatedObjectList')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('relatedObjectList') ? 'up' : 'down'} />
                  </Fragment>
                }
              >
                <div className={styles['head-table']}>
                  <RelatedObjectList {...relatedObjectListProps} />
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
          <Drawer {...drawerProps} />
        </Content>
      </div>
    );
  }
}
