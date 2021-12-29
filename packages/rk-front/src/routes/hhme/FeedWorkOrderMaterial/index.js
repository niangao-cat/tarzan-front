/**
 * 工单投料 - FeedWorkOrderMaterial
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Button, Collapse, Icon, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import {
  getEditTableData,
  // addItemToPagination,
  delItemToPagination,
  getCurrentOrganizationId,
} from 'utils/utils';

import BaseInfo from './BaseInfo';
import PackingList from './PackingList';
import FeedMaterialModal from './FeedMaterialModal';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.feedWorkOrderMaterial';

@connect(({ feedWorkOrderMaterial, loading }) => ({
  feedWorkOrderMaterial,
  fetchWorkOrderInfoLoading: loading.effects['feedWorkOrderMaterial/fetchWorkOrderInfo'],
  fetchLineListLoading: loading.effects['feedWorkOrderMaterial/fetchLineList'],
  fetchFeedingMaterialRecordLoading: loading.effects['feedWorkOrderMaterial/fetchFeedingMaterialRecord'],
  scanBarcodeLoading: loading.effects['feedWorkOrderMaterial/scanBarcode'],
  saveLoading: loading.effects['feedWorkOrderMaterial/save'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.purchaseOrder',
})
export default class FeedWorkOrderMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseKeys: ['packingList'],
      visible: false,
      record: {},
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedWorkOrderMaterial/updateState',
      payload: {
        baseInfo: {},
        packingList: [],
        packingPagination: {},
        feedingMaterialList: [],
        feedingMaterialPagination: {},
        selectedRows: [],
      },
    });
    this.setState({ record: {} });
  }

  @Bind()
  handleFetchWorkOrderInfo(data) {
    const { dispatch } = this.props;
    if(isEmpty(data)) {
      this.initData();
    } else {
      dispatch({
        type: 'feedWorkOrderMaterial/fetchWorkOrderInfo',
        payload: data.workOrderNum,
      });
    }
  }

  @Bind()
  handleFetchFeedingMaterialRecord(record, page) {
    const { dispatch, feedWorkOrderMaterial: { baseInfo } } = this.props;
    dispatch({
      type: 'feedWorkOrderMaterial/fetchFeedingMaterialRecord',
      payload: {
        workOrderId: baseInfo.workOrderId,
        materialId: record.materialId,
        page,
      },
    });
  }


  @Bind()
  handleCreate() {
    const { dispatch, feedWorkOrderMaterial: { packingList = [], baseInfo } } = this.props;
    const createList = packingList.filter(e => e._status === 'create');
    const { workOrderId, routerStepId } = baseInfo;
    if(createList.length <= 0) {
      dispatch({
        type: 'feedWorkOrderMaterial/updateState',
        payload: {
          packingList: [
            {
              materialId: uuid(),
              workOrderId,
              routerStepId,
              planFlag: 'OUTER',
              _status: 'create',
            },
            ...packingList,
          ],
        },
      });
    } else {
      notification.warning({
        description: '当前组件列表有未保存数据，请保存以后再新增！',
      });
    }
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
  handleCleanLine(record) {
    const { dispatch, feedWorkOrderMaterial: { packingList, packingPagination } } = this.props;
    const newList = packingList.filter(item => item.materialId !== record.materialId);
    dispatch({
      type: 'feedWorkOrderMaterial/updateState',
      payload: {
        packingList: newList,
        packingPagination: delItemToPagination(packingList.length, packingPagination),
      },
    });
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
      return Promise.resolve(dataSource);
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

  @Bind()
  handleSave() {
    const {
      dispatch,
      feedWorkOrderMaterial: { packingList = [], baseInfo },
    } = this.props;
    Promise.all([this.validateEditTable(packingList)]).then(res => {
      const [newLineList] = res;
      if(newLineList.length > 0) {
        dispatch({
          type: 'feedWorkOrderMaterial/save',
          payload: newLineList[0],
        }).then(result => {
          if (result) {
            notification.success();
            this.handleFetchWorkOrderInfo(baseInfo);
          }
        });
      }
    });
  }

  @Bind()
  handleChangeKey(key) {
    this.setState({ collapseKeys: key });
  }

  @Bind()
  handleOpenModal(record) {
    if(record._status === 'create') {
      this.setState({ record: {...record, ...record.$form.getFieldsValue()}, visible: true });
    } else {
      this.setState({ visible: true, record });
      this.handleFetchFeedingMaterialRecord(record);
    }
  }

  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    this.setState({ visible: false, record: {} });
    dispatch({
      type: 'feedWorkOrderMaterial/updateState',
      payload: {
        feedingMaterialList: [],
      },
    });
  }

  @Bind()
  handleFetchScanBarcode(materialLotCode) {
    const { dispatch, feedWorkOrderMaterial: { feedingMaterialList, baseInfo, selectedRows } } = this.props;
    const { record: {materialId, materialCode, routerStepId, materialVersion, specialInvFlag, soNum, soLineNum } } = this.state;
    return dispatch({
      type: 'feedWorkOrderMaterial/scanBarcode',
      payload: {
        materialCode,
        routerStepId,
        materialId,
        materialLotCode,
        feedingMaterialList,
        materialVersion,
        specialInvFlag,
        soNum,
        soLineNum,
        workOrderId: baseInfo.workOrderId,
        selectedRows,
      },
    }).then(res => {
      if(res) {
        notification.success({ description: '扫描成功！' });
      }
      return res;
    });
  }


  /**
   * 退料 / 投料
   * flag = true 投料
   * flag = false 退料
   * @param {*} list
   * @param {*} flag
   * @memberof FeedWorkOrderMaterial
   */
  @Bind()
  handleFeedOrReturnMaterial(list, flag) {
    const { dispatch, tenantId, feedWorkOrderMaterial: { baseInfo } } = this.props;
    const { record } = this.state;
    const { bomComponentId, planFlag, routerStepId, materialId } = record;
    const { workOrderId } = baseInfo;
    const dtoList = list.map(e => ({
      ...e,
      workOrderId,
      routerStepId,
    }));
    const effects = flag ? 'save' : 'returnMaterial';
    const payload = {
      bomComponentId,
      planFlag,
      workOrderId,
      materialId,
      tenantId,
      dtoList,
      routerStepId,
    };
    return dispatch({
      type: `feedWorkOrderMaterial/${effects}`,
      payload: flag ? payload : {
        ...payload,
        outQty: dtoList[0].outQty,
      },
    }).then(res => {
      if(res) {
        notification.success();
        this.handleFetchWorkOrderInfo(baseInfo);
        this.handleFetchFeedingMaterialRecord(record);
      }
      return res;
    });
  }

  @Bind()
  handleChangeSelectRows(selectedRows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedWorkOrderMaterial/updateState',
      payload: {
        selectedRows,
      },
    });
  }


  // 渲染 界面布局
  render() {
    const {
      fetchWorkOrderInfoLoading,
      fetchFeedingMaterialRecordLoading,
      scanBarcodeLoading,
      tenantId,
      saveLoading,
      feedWorkOrderMaterial: {
        baseInfo = {},
        packingList = [],
        feedingMaterialList = [],
        feedingMaterialPagination = {},
        selectedRows = [],
      },
    } = this.props;
    const { collapseKeys = [], visible, record } = this.state;
    const baseInfoProps = {
      tenantId,
      baseInfo,
      onFetchWorkOrderInfo: this.handleFetchWorkOrderInfo,
    };
    const packingListProps = {
      tenantId,
      dataSource: packingList,
      onSearch: this.handleSearchPackingList,
      onCleanLine: this.handleCleanLine,
      onOpenModal: this.handleOpenModal,
    };
    const feedMaterialModalProps = {
      visible,
      record,
      baseInfo,
      saveLoading,
      selectedRows,
      loading: fetchFeedingMaterialRecordLoading || scanBarcodeLoading,
      dataSource: feedingMaterialList,
      pagination: feedingMaterialPagination,
      onSearch: this.handleFetchFeedingMaterialRecord,
      onCloseModal: this.handleCloseModal,
      onFetchScanBarcode: this.handleFetchScanBarcode,
      onFeedOrReturnMaterial: this.handleFeedOrReturnMaterial,
      onChangeSelectRows: this.handleChangeSelectRows,
    };
    return (
      <div>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('工单投料')}>
          {/* <Button
            type="default"
            style={{ marginRight: '12px', marginBottom: '12px' }}
            disabled={isEmpty(baseInfo)}
            onClick={() => this.handleSave()}
          >
            提交
          </Button> */}
        </Header>
        <Content>
          <Spin spinning={fetchWorkOrderInfoLoading || false}>
            <BaseInfo {...baseInfoProps} />
            <div className="ued-detail-wrapper">
              <Collapse
                className="form-collapse"
                defaultActiveKey={['packingList']}
                onChange={this.handleChangeKey}
              >
                <Collapse.Panel
                  showArrow={false}
                  key="packingList"
                  header={
                    <Fragment>
                      <h3>{intl.get(`${modelPrompt}.abnormalResponse`).d('装配清单')}</h3>
                      <a>
                        {collapseKeys.includes('packingList')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                      </a>
                      <Icon type={collapseKeys.includes('packingList') ? 'up' : 'down'} />
                    </Fragment>
                }
                >
                  {!isEmpty(baseInfo) && (
                    <Button
                      type="default"
                      style={{ marginRight: '12px', marginBottom: '12px' }}
                      onClick={() => this.handleCreate()}
                    >
                      新增计划外投料
                    </Button>
                  )}

                  <div className={styles['head-table']}>
                    <PackingList {...packingListProps} />
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Spin>
          <FeedMaterialModal {...feedMaterialModalProps} />
        </Content>
      </div>
    );
  }
}
