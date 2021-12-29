/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isString } from 'lodash';
import moment from 'moment';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import notification from 'utils/notification';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';

const modelPrompt = 'tarzan.hmes.purchaseAcceptancePosting';
const dateTimeFormat = getDateTimeFormat();

@connect(({ purchaseAcceptancePosting, loading }) => ({
  purchaseAcceptancePosting,
  fetchListLoading: loading.effects['purchaseAcceptancePosting/fetchList'],
  tenantId: getCurrentOrganizationId(),
  fetchDetailLoading: loading.effects['purchaseAcceptancePosting/fetchDetail'],
  fetchPoInfoLoading: loading.effects['purchaseAcceptancePosting/fetchPoInfo'],
  posting: loading.effects['purchaseAcceptancePosting/handlePost'],
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseAcceptancePosting',
})
export default class PurchaseAcceptancePosting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      visible: false,
      record: {},
      type: null,
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAcceptancePosting/updateState',
      payload: {
        selectedRecord: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAcceptancePosting/init',
    });
    dispatch({
      type: 'purchaseAcceptancePosting/fetchList',
      payload: {
        actualReceivedDateFrom: moment().startOf('day').format(dateTimeFormat),
        actualReceivedDateTo: moment().endOf('day').format(dateTimeFormat),
      },
    });
  }

  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    this.setState({ selectedRows: [] });
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { actualReceivedDateFrom, actualReceivedDateTo, inspectionFinishDateFrom, inspectionFinishDateTo, materialId } = value;
    value = {
      ...value,
      actualReceivedDateFrom: isEmpty(actualReceivedDateFrom)
        ? null
        : actualReceivedDateFrom.startOf('day').format(dateTimeFormat),
        actualReceivedDateTo: isEmpty(actualReceivedDateTo) ? null : actualReceivedDateTo.endOf('day').format(dateTimeFormat),
        inspectionFinishDateFrom: isEmpty(inspectionFinishDateFrom)
        ? null
        : inspectionFinishDateFrom.startOf('day').format(dateTimeFormat),
      inspectionFinishDateTo: isEmpty(inspectionFinishDateTo) ? null : inspectionFinishDateTo.endOf('day').format(dateTimeFormat),
      materialCode: isString(materialId) ? materialId.split(',') : null,
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'purchaseAcceptancePosting/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleFetchDetail(page = {}, info={}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAcceptancePosting/fetchDetail',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...info,
      },
    });
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handlePost() {
    const {
      dispatch,
      purchaseAcceptancePosting: {
      list = [],
    },
  } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'purchaseAcceptancePosting/handlePost',
      payload: selectedRows,
    }).then(res => {
      if(res) {
        for(let i = 0; i<list.length; i++){
          for(let j = 0; j< res.length; j++){
            if(list[i].instructionId === res[j].instructionId){
              list[i].instructionDocStatusMeaning = res[j].instructionDocStatusMeaning;
              list[i].instructionStatusMeaning = res[j].instructionStatusMeaning;
            }
          }
        }
        dispatch({
          type: 'purchaseAcceptancePosting/updateState',
          payload: {
            list,
          },
        });
        notification.success();
      }
    });
  }

  @Bind()
  handleOpenModal(record, type) {
    this.setState({
      visible: true,
      record,
      type,
    });
    if(type === 'INSTRUCTION') {
      const { instructionId, transOverInstructionStatus } = record;
      this.handleFetchDetail({}, {
        instructionId,
        transOverInstructionStatus,
      });
    } else if(type === 'PO') {
      const { instructionId } = record;
      this.handleFetchPoList({}, {
        deliveryId: instructionId,
      });
    }
  }

  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    this.setState({ visible: false, record: {} });
    dispatch({
      type: 'purchaseAcceptancePosting/updateState',
      payload: {
        detailList: [],
        detailListPagination: {},
        poList: [],
        poPagination: {},
      },
    });
  }

  @Bind()
  handleFetchPoList(page = {}, info={}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAcceptancePosting/fetchPoInfo',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...info,
      },
    });
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      fetchDetailLoading,
      fetchPoInfoLoading,
      posting,
      purchaseAcceptancePosting: {
        list = [],
        pagination = {},
        deliveryNoteStatusList = [], // 送货单状态
        versionList = [], // 版本
        factoryList = [], // 工厂
        inspectionOrderTypeList = [], // 检验单类型
        inspectionOrderStatusList = [], // 检验单状态
        siteInfo,
        detailList,
        detailListPagination,
        poList,
        poPagination,
      },
    } = this.props;
    const { selectedRows, visible, record, type } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.instructionId),
      onChange: this.handleChangeSelectRows,
    };
    const filterProps = {
      tenantId,
      deliveryNoteStatusList,
      versionList,
      factoryList,
      siteInfo,
      inspectionOrderTypeList,
      inspectionOrderStatusList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };
    const listProps = {
      loading: fetchListLoading,
      pagination,
      rowSelection,
      dataSource: list,
      onOpenModal: this.handleOpenModal,
      onSearch: this.handleFetchList,
    };
    const modalProps = {
      visible,
      record,
      type,
      loading: fetchDetailLoading || fetchPoInfoLoading,
      dataSource: type === 'INSTRUCTION' ? detailList : poList,
      pagination: type === 'INSTRUCTION' ? detailListPagination : poPagination,
      onCancel: this.handleCloseModal,
      onFetchDetail: this.handleFetchDetail,
      onFetchPoList: this.handleFetchPoList,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('过账平台')}>
          <Button
            type="default"
            onClick={() => this.handlePost()}
            loading={posting}
          >
            过账
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
        <Drawer {...modalProps} />
        <ModalContainer ref={registerContainer} />
      </React.Fragment>
    );
  }
}
