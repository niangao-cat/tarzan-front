/**
 * author: ywj
 * des:不良代码指定工艺路线维护
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty } from 'lodash';
import { Button, Card, Popconfirm, Modal } from 'hzero-ui';
import moment from 'moment';

import ExcelExport from 'components/ExcelExport';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import {
  DETAIL_CARD_TABLE_CLASSNAME,
  DEFAULT_DATETIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import HeadList from './HeadList';
import LineList from './LineList';

const commonModelPrompt = 'tarzan.hwms.equipmentInventoryPlatform';

@connect(({ equipmentInventoryPlatform, loading }) => ({
  equipmentInventoryPlatform,
  fetchListLoading:
    loading.effects['equipmentInventoryPlatform/queryList'] ||
    loading.effects['equipmentInventoryPlatform/updateData'],
  fetchLineListLoading:
    loading.effects['equipmentInventoryPlatform/queryLineList'] ||
    loading.effects['equipmentInventoryPlatform/updateLineData'],
  completeLoading:
    loading.effects['equipmentInventoryPlatform/setComplete'] ||
    loading.effects['equipmentInventoryPlatform/checkComplete'],
  cancelLoading: loading.effects['equipmentInventoryPlatform/setCancel'],
  comcatLoading: loading.effects['equipmentInventoryPlatform/setComcat'],
  tenantId: getCurrentOrganizationId(),
}))
export default class equipmentInventoryPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentInventoryPlatform/updateState',
      payload: {
        dataList: [],
        pagination: {},
        statusMap: [],
        typeMap: [],
        dataLineList: [],
        linePagination: {},
        ledgerType: [],
      },
    });
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'equipmentInventoryPlatform/init',
    });
    this.handleSearch();
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    dispatch({
      type: 'equipmentInventoryPlatform/queryList',
      payload: {
        ...value,
        page,
      },
    });
    this.setState({ selectedRows: [] });
  }

  @Bind()
  handleGetFormValue() {
    const { selectedRows } = this.state;
    let value = {};
    if (this.formDom) {
      value = this.formDom.getFieldsValue();
      const { stocktakeStatus, postingDateFrom, postingDateTo, creationDateFrom, creationDateTo } = value;
      value = filterNullValueObject({
        ...value,
        stocktakeId: !isEmpty(selectedRows) && isArray(selectedRows) ? selectedRows[0].stocktakeId : null,
        stocktakeStatus: isArray(stocktakeStatus) ? stocktakeStatus.join(',') : '',
        postingDateFrom: isEmpty(postingDateFrom) ? null : `${moment(postingDateFrom).format(DEFAULT_DATE_FORMAT)} 00:00:00`,
        postingDateTo: isEmpty(postingDateTo) ? null : `${moment(postingDateTo).format(DEFAULT_DATE_FORMAT)} 00:00:00`,
        creationDateFrom: isEmpty(creationDateFrom) ? null : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isEmpty(creationDateTo) ? null : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
      });
    }
    return value;
  }

  @Bind()
  handleEdit(dataSourceName, idName, record, flag) {
    const { dispatch, equipmentInventoryPlatform: { [dataSourceName]: dataSource } } = this.props;
    const newList = dataSource.map(e => e[idName] === record[idName] ? { ...e, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'equipmentInventoryPlatform/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  }

  // 保存行信息
  @Bind
  handleSave(record) {
    const { dispatch, equipmentInventoryPlatform: { pagination } } = this.props;
    const dataRecord = {
      ...record,
      remark: record.$form.getFieldValue('remark'),
    };
    delete dataRecord._status;
    delete dataRecord.$form;
    dispatch({
      type: 'equipmentInventoryPlatform/updateData',
      payload: {
        saveData: dataRecord,
      },
    }).then(res => {
      if (res) {
        this.handleSearch(pagination);
      }
    });
  }

  // 数据完成
  @Bind
  complete() {
    const { dispatch, equipmentInventoryPlatform: { pagination } } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'equipmentInventoryPlatform/checkComplete',
      payload: {
        stocktakeId: selectedRows[0].stocktakeId,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: 'equipmentInventoryPlatform/setComplete',
          payload: {
            saveData: { stocktakeId: selectedRows[0].stocktakeId, action: 'COMPLETE' },
          },
        }).then(resCom => {
          if (resCom) {
            this.handleSearch(pagination);
          }
        });
      } else {
        Modal.confirm({
          title: intl.get(`tarzan.badCode.defectCode.title.remind`).d('提醒'),
          content: '还有未盘点设备，是否完成?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'equipmentInventoryPlatform/setComplete',
              payload: {
                saveData: { stocktakeId: selectedRows[0].stocktakeId, action: 'COMPLETE' },
              },
            }).then(resCom => {
              // 成功时重新返回
              if (resCom) {
                this.handleSearch(pagination);
              }
            });
          },
        });
      }
    });
  }

  @Bind
  cancel() {
    const { dispatch, equipmentInventoryPlatform: { pagination } } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'equipmentInventoryPlatform/setCancel',
      payload: {
        saveData: { stocktakeId: selectedRows[0].stocktakeId, action: 'CANCEL' },
      },
    }).then(res => {
      if (res) {
        this.handleSearch(pagination);
      }
    });
  }

  @Bind
  comcat() {
    const { dispatch, equipmentInventoryPlatform: { pagination } } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'equipmentInventoryPlatform/setComcat',
      payload: {
        saveData: selectedRows[0].stocktakeId,
      },
    }).then(res => {
      if (res) {
        this.handleSearch(pagination);
      }
    });
  }

  // 保存行信息
  @Bind
  handleSaveLine(record) {
    const { dispatch, equipmentInventoryPlatform: { linePagination } } = this.props;
    const dataRecord = {
      ...record,
      remark: record.$form.getFieldValue('remark'),
    };
    delete dataRecord._status;
    delete dataRecord.$form;
    dispatch({
      type: 'equipmentInventoryPlatform/updateLineData',
      payload: {
        saveData: dataRecord,
      },
    }).then(res => {
      if (res) {
        this.handleSaveLine(linePagination);
      } else {
        notification.error({ message: res ? res.message : '未知错误请联系管理员' });
      }
    });
  }

  @Bind()
  handleSearchLineList(page = {}) {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'equipmentInventoryPlatform/queryLineList',
      payload: {
        stocktakeId: selectedRows[0].stocktakeId,
        page,
      },
    });
  }

  // 更改选中状态
  @Bind
  onChangeSelected(selectedRowKeys, selectedRows) {
    this.setState(
      {
        selectedRows,
      },
      () => {
        this.handleSearchLineList();
      }
    );
  }

  render() {
    const {
      fetchListLoading,
      fetchLineListLoading,
      completeLoading,
      cancelLoading,
      tenantId,
      equipmentInventoryPlatform: {
        dataList = [],
        pagination = {},
        statusMap = [],
        typeMap = [],
        dataLineList = [],
        linePagination = {},
        ledgerType = [],
      },
    } = this.props;
    const { selectedRows } = this.state;
    const rowsSelection = {
      selectedRowKeys: selectedRows.map(e => e.stocktakeId),
      columnWidth: 50,
      type: 'radio',
      onChange: this.onChangeSelected,
      getCheckboxProps: record => ({
        disabled: !record.stocktakeId,
      }),
    };

    const filterProps = {
      statusMap,
      typeMap,
      ledgerType,
      tenantId,
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
    };

    const headListProps = {
      pagination,
      rowsSelection,
      dataSource: dataList,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
      onEdit: this.handleEdit,
      onSave: this.handleSave,
    };

    const lineListProps = {
      dataSource: dataLineList,
      pagination: linePagination,
      loading: fetchLineListLoading,
      onSearch: this.handleSearchLineList,
      onEdit: this.handleEdit,
      onSave: this.handleSaveLine,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('设备盘点平台')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/hme-equipment-stocktake-docs/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
          />
          <Button
            icon="edit"
            onClick={this.complete}
            loading={completeLoading}
            disabled={this.state.selectedRows.length !== 1}
          >
            {intl.get(`history`).d('盘点完成')}
          </Button>
          {this.state.selectedRows.length !== 1 ? (
            <Button
              icon="cancel"
              loading={cancelLoading}
              disabled={this.state.selectedRows.length !== 1}
            >
              {intl.get('tarzan.acquisition.transformation.button.cancel').d('取消')}
            </Button>
          ) : (
            <Popconfirm title="是否确认取消?" onConfirm={this.cancel}>
              <Button
                icon="cancel"
                disabled={this.state.selectedRows.length !== 1}
                loading={cancelLoading}
              >
                {intl.get('hzero.common.button.cancel').d('取消')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <HeadList {...headListProps} />
          <Card
            key="code-rule-liner"
            title={intl.get('hwms.purchaseReturn.view.message.line').d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <LineList {...lineListProps} />
        </Content>
      </div>
    );
  }
}
