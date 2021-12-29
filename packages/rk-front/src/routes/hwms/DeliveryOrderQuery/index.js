/*
 *@description:配送单查询首页
 *@author: wangxinyu
 *@date: 2020-07-29 13:37:08
 *@version: V0.0.1
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import 'moment/locale/zh-cn';
import { get as chainGet, isEmpty, cloneDeep } from 'lodash';
import {
  getCurrentOrganizationId,
  getCurrentUserId,
  getDateTimeFormat,
  // getEditTableData,
  filterNullValueObject,
} from 'utils/utils';
import notification from 'utils/notification';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import styles from './index.less';
import LineTable from './LineTable';
import HeadTable from './HeadTable';
import LineDetail from './Details/LineDetail';
import Drawer from './Drawer';

// const modelPrompt = 'hcms.model.deliveryOrderQuery';

const dateTimeFormat = getDateTimeFormat();

/**
 * 配送单查询
 * @extends {Component} - React.Component
 * @reactProps {Object} function - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ deliveryOrderQuery, loading }) => ({
  deliveryOrderQuery,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['deliveryOrderQuery/fetchHeadList'],
  fetchLineLoading: loading.effects['deliveryOrderQuery/fetchLineList'],
  fetchCloseLoading: loading.effects['deliveryOrderQuery/close'],
  fetchCancelLoading: loading.effects['deliveryOrderQuery/cancel'],
  fetchPrintLoading: loading.effects['deliveryOrderQuery/print'],
  fetchReplenishmentLineListLoading: loading.effects['deliveryOrderQuery/fetchReplenishmentLineList'],
  saveReplenishmentListLoading: loading.effects['deliveryOrderQuery/saveReplenishmentList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.deliveryOrderQuery',
})
export default class DeliveryOrderQuery extends React.Component {
  state = {
    selectedHeadRows: [], // 头信息勾选行
    selectedHeadRowKeys: [], // 删除头主键
    selectedLineRows: [], // 删除行主键
    headPagination: {}, // 头分页
    linePagination: {}, // 行分页
    search: {}, // 查询条件
    headDatas: '', // 点击头的某一行获取这行数据
    lineDetailDrawer: false,
    detailDatas: {},
    visible: false, // 生成补料单弹框是否可见
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.headRefresh();
    this.queryLovs();
    // this.getStatueSelectOption('INSTRUCTION_DOC_STATUS', 'instructionDocStatusList');
    // this.getTypeSelectOption('INSTRUCTION_DOC_STATUS', 'instructionDocStatusList');
    // this.onSearch();
    dispatch({
      type: `deliveryOrderQuery/fetchDefaultSite`,
    });
  }

  // 获取值集
  queryLovs = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'deliveryOrderQuery/querySelect',
      payload: {
        instructionDocStatus: 'WMS.DISTRIBUTION_DOC_STATUS',
        distributionLineStatus: 'WMS.DISTRIBUTION_LINE_STATUS',
      },
    });
  };

  // 获取状态下拉
  @Bind()
  getStatueSelectOption = (type, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryOrderQuery/fetchStatueSelectList',
      payload: {
        module: 'INSTRUCTION',
        statusGroup: type,
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          [option]: chainGet(res, 'rows', []),
        });
      }
    });
  };

  // 获取类型下拉
  @Bind()
  getTypeSelectOption = (type, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryOrderQuery/fetchTypeSelectList',
      payload: {
        module: 'INSTRUCTION',
        typeGroup: type,
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          [option]: chainGet(res, 'rows', []),
        });
      }
    });
  };

  // 头刷新
  @Bind()
  headRefresh = () => {
    const { dispatch } = this.props;
    const { search, headPagination } = this.state;
    const { demandTimeFrom, demandTimeTo, instructionDocStatus } = search;
    const value = {
      ...search,
      userId: getCurrentUserId(),
      demandTimeFrom: isEmpty(demandTimeFrom)
        ? null
        : demandTimeFrom.format(dateTimeFormat),
      demandTimeTo: isEmpty(demandTimeTo) ? null : demandTimeTo.format(dateTimeFormat),
      instructionDocStatus: isEmpty(instructionDocStatus) ? undefined : instructionDocStatus.join(','),
    };
    dispatch({
      type: 'deliveryOrderQuery/fetchHeadList',
      payload: {
        ...value,
        page: headPagination,
      },
    });
  };

  // 行刷新
  @Bind()
  lineRefresh = () => {
    const { dispatch } = this.props;
    const { linePagination, headDatas } = this.state;
    dispatch({
      type: 'deliveryOrderQuery/fetchLineList',
      payload: {
        instructionDocId: headDatas.instructionDocId,
        page: linePagination,
      },
    });
  };

  // 头查询
  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
        headPagination: {},
        linePagination: {},
        selectedHeadRows: [],
        selectedHeadRowKeys: [],
        selectedLineRows: [],
        headDatas: '',
      },
      () => {
        this.headRefresh();
        this.cleanLine();
      }
    );
  };

  // 行查询
  @Bind()
  onLineSearch = () => {
    this.setState(
      {
        linePagination: {},
        selectedLineRows: [],
      },
      () => {
        this.lineRefresh();
      }
    );
  };

  // 明细查询
  @Bind()
  detailClick(record) {
    this.setState({detailDatas: record, lineDetailDrawer: !this.state.lineDetailDrawer});
    const { dispatch } = this.props;
    // 查询产量
    dispatch({
      type: 'deliveryOrderQuery/fetchLineDetailList',
      payload: {
        instructionId: record.instructionId,
      },
    });
  }

  // 重置查询
  @Bind()
  onResetSearch = () => {
    this.setState({
      selectedHeadRows: [],
      selectedHeadRowKeys: [],
      headPagination: {},
      search: {},
    });
  };

  // 头分页变化后触发方法
  @Bind()
  handleTableHeadChange(headPagination = {}) {
    this.setState(
      {
        headPagination,
        headDatas: '',
      },
      () => {
        this.headRefresh();
        this.cleanLine();
      }
    );
  }

  // 行分页变化后触发方法
  @Bind()
  handleTableLineChange(linePagination = {}) {
    this.setState(
      {
        linePagination,
      },
      () => {
        this.lineRefresh();
      }
    );
  }

  // 明细分页变化后触发方法
  @Bind
  handleTableLineDetailChange(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'deliveryOrderQuery/fetchLineDetailList',
      payload: {
        instructionId: this.state.detailDatas.instructionId,
        page,
      },
    });
  }

  // 清空行
  @Bind()
  cleanLine() {
    const { dispatch } = this.props;
    this.setState({
      selectedLineRows: [],
    });
    dispatch({
      type: 'deliveryOrderQuery/updateState',
      payload: {
        lineList: [],
        linePagination: {},
      },
    });
  }

  // 选中头事件
  @Bind
  onHeadChange(selectedRowKeys) {
    console.log('selectedRowKeys==', selectedRowKeys);
    this.setState({
      selectedHeadRowKeys: selectedRowKeys,
    });
  }

  // 选中行事件
  @Bind
  onLineChange(selectedLineRows) {
    this.setState({
      selectedLineRows,
    });
  }

  // 点击头的某一行触发
  @Bind()
  rowHeadClick(record) {
    this.setState({
      headDatas: record,
    });
    if (record.instructionDocId === '') {
      this.cleanLine();
    } else {
      this.onLineSearch();
    }
  }

  // 改变头的点击行背景颜色
  @Bind()
  handleClickRow(record) {
    const { headDatas } = this.state;
    if (headDatas !== '' && headDatas.instructionDocId === record.instructionDocId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  // 明细关闭页面
  @Bind
  onLineDetailCancel(){
    this.setState({ lineDetailDrawer: !this.state.lineDetailDrawer});
  }

  // 手工关闭
  @Bind
  manuallyShutDown(){
    Modal.confirm({
      title: '一旦手工关闭，单据无法继续执行，也无法退回，请确认！',
      onOk: () => {
        this.handleOk();
      },
    });
  }

  // 打印
  @Bind
  print(){
    const {selectedHeadRowKeys} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'deliveryOrderQuery/print',
      payload: selectedHeadRowKeys,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          const file = new Blob(
            [res],
            { type: 'application/pdf' }
          );
          const fileURL = URL.createObjectURL(file);
          const newwindow = window.open(fileURL, 'newwindow');
          if (newwindow) {
            newwindow.print();
          } else {
            notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          }
          // const newwindow = window.open(res.rows.url, 'newwindow');
          // if (newwindow) {
          //   // newwindow.print();
          // } else {
          //   notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
          // }
        }
      }
    });

  }

  // 取消
  @Bind
  cancel(){
    const {selectedHeadRowKeys} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'deliveryOrderQuery/cancel',
      payload: selectedHeadRowKeys,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          notification.success({ message: '取消成功' });
          this.onSearch();
        }
      }
    });
  }

  // 弹窗确认
  @Bind
  handleOk = () => {
    const {selectedHeadRowKeys} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'deliveryOrderQuery/close',
      payload: selectedHeadRowKeys,
    }).then(res => {
      if (res) {
        if (res.failed) {
          notification.error({ message: res.exception });
        } else {
          notification.success({ message: '关闭成功' });
          this.onSearch();
        }
      }
    });
  }


  @Bind()
  handleCreateReplenishmentList() {
    const { selectedHeadRows } = this.state;
    const { dispatch } = this.props;
    const firstWorkCell = selectedHeadRows[0];
    const { productionLine, productionLineName, workCell, workCellName, remark, toLocatorId } = firstWorkCell;
    const suiteFlagList = selectedHeadRows.filter(e => e.suiteFlag === 'N');
    if(!selectedHeadRows.every(e => ['SIGN_EXECUTE', 'SIGN_COMPLETE', 'CLOSED'].includes(e.instructionDocStatus))) {
      notification.warning({
        description: '配送单还未进行签收，无需生成补料单 !',
      });
    } else if(suiteFlagList.length !== selectedHeadRows.length) {
      notification.warning({
        description: '存在已配送齐全的配送单，请重新勾选 !',
      });
    } else if(selectedHeadRows.filter(e => e.workCell === workCell).length !== selectedHeadRows.length) {
      notification.warning({
        description: '配送单需要相同工段才能生成补料单，请勾选相同工段的配送单 !',
      });
    } else {
      dispatch({
        type: 'deliveryOrderQuery/fetchReplenishmentLineList',
        payload: {
          idList: selectedHeadRows.map(e => e.instructionDocId).join(','),
          replenishmentInfo: {
            productionLine,
            productionLineName,
            workCell,
            workCellName,
            remark,
            toLocatorId,
          },
        },
      }).then(res => {
        if(res) {
          this.setState({ visible: true });
        }
      });
    }
  }

  @Bind()
  handleSelectHeadList(record, selected) {
    const { selectedHeadRows } = this.state;
    if(selected) {
      this.setState({ selectedHeadRows: [...selectedHeadRows, record ]});
    } else {
      this.setState({ selectedHeadRows: selectedHeadRows.filter(e => e.instructionDocId !== record.instructionDocId)});
    }
  }

  @Bind()
  handleAllSelectHeadList(selected, selectedRows) {
    const { selectedHeadRows } = this.state;
    if(selected) {
      this.setState({ selectedHeadRows: [...selectedRows, ...selectedHeadRows ]});
    } else {
      const selectedRowIds = selectedHeadRows.map(e => e.instructionDocId);
      this.setState({ selectedHeadRows: selectedHeadRows.filter(e => !selectedRowIds.includes(e.instructionDocId))});
    }
  }

  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    this.setState({ visible: false, selectedHeadRowKeys: [], selectedHeadRows: [] });
    dispatch({
      type: 'deliveryOrderQuery/updateState',
      payload: {
        replenishmentInfo: {},
        replenishmentLineList: [],
      },
    });
  }

  @Bind()
  handleSaveReplenishmentList() {
    const { dispatch, deliveryOrderQuery: { siteInfo, replenishmentInfo, replenishmentLineList } } = this.props;
    const { selectedHeadRowKeys } = this.state;
    const { productionLine, workCell, toLocatorId, remark } = replenishmentInfo;
    if(replenishmentLineList.every(e => !['create', 'update'].includes(e._status))) {
      const lineList = replenishmentLineList.map(e => e.parentMaterialId ? { ...e, keyId: undefined } : e);
      dispatch({
        type: 'deliveryOrderQuery/saveReplenishmentList',
        payload: {
          siteId: siteInfo.siteId,
          demandTime: this.drawerForm.getFieldValue('demandTime').format(getDateTimeFormat()),
          instructionDocIdList: selectedHeadRowKeys,
          prodLineCode: productionLine,
          workcellCode: workCell,
          toLocatorId,
          remark,
          lineList,
        },
      }).then(res => {
        if(!(!isEmpty(res) && res.failed)) {
          this.handleCloseModal();
          this.headRefresh();
        }
      });
    } else {
      notification.warning({
        description: '当前补料单有数据没有保存，请先保存再生成补料单！',
      });
    }

  }

  @Bind()
  handleEditLine(current, flag) {
    const { dispatch, deliveryOrderQuery: { replenishmentLineList } } = this.props;
    const editList = replenishmentLineList.filter(e => ['create', 'update'].includes(e._status));
    if(editList.length === 0 || (editList.length === 1 && !flag)) {
      const newList = replenishmentLineList.map(item =>
        item.keyId === current.keyId ? { ...item, _status: flag ? 'update' : '' } : item.keyId === current.keyId && !current.isReplace ? { ...item, _status: flag ? 'create' : '' } : item
      );
      dispatch({
        type: `deliveryOrderQuery/updateState`,
        payload: {
          replenishmentLineList: newList,
        },
      });
    } else {
      notification.warning({
        description: '当前补料单有数据没有保存，请先保存再编辑！',
      });
    }

  }

  @Bind()
  handleClearLine(record) {
    const { dispatch, deliveryOrderQuery: { replenishmentLineList } } = this.props;
    const newList = replenishmentLineList.filter(item => item.keyId !== record.keyId);
    dispatch({
      type: `deliveryOrderQuery/updateState`,
      payload: {
        replenishmentLineList: newList,
      },
    });

  }

  @Bind()
  handleReplaceMaintain(record, index) {
    const { deliveryOrderQuery: { replenishmentLineList }, dispatch } = this.props;
    if(replenishmentLineList.filter(e => ['create', 'update'].includes(e._status)).length === 0) {
      const newReplenishmentLineList = cloneDeep(replenishmentLineList);
      newReplenishmentLineList.splice(index+1, 0, {
        ...record,
        keyId: uuid(),
        parentKeyId: record.keyId, // 扣减
        parentMaterialId: record.materialId,
        _status: 'create',
        substituteAllowedFlag: false,
      });
      dispatch({
        type: `deliveryOrderQuery/updateState`,
        payload: {
          replenishmentLineList: newReplenishmentLineList,
        },
      });
    } else {
      notification.warning({
        description: '当前补料单有数据没有保存，请先保存再编辑！',
      });
    }
  }

  @Bind()
  handleSaveCurrentRecord(record) {
    const { deliveryOrderQuery: { replenishmentLineList }, dispatch } = this.props;
    record.$form.validateFields((err, value) => {
      if(!err) {
        if(record.parentMaterialId === value.materialId && !record.substituteAllowedFlag) {
          notification.warning({
            description: '当前替代料物料号和原物料物料号相同，请重新选择！',
          });
        } else {
          let newReplenishmentLineList = [];
          const sameMaterial = replenishmentLineList.filter(e => e.keyId !== record.keyId && e.materialId === value.materialId && value.materialVersion === e.materialVersion && e.soNum === record.soNum && e.soLineNum === record.soLineNum);
          if(sameMaterial.length === 0) { // 无相同的数据
            newReplenishmentLineList = replenishmentLineList.map(e => {
              if(e.keyId === record.keyId) {
                return {
                  ...e,
                  ...value,
                  parentKeyId: undefined, // 保存之后与之前被替代料解绑
                  _status: '',
                };
              } else if(e.keyId === record.parentKeyId) {
                return {
                  ...e,
                  replenishQty: (e.replenishQty * 1000000 - value.replenishQty * 1000000) / 1000000,
                };
              } else {
                return e;
              }
            });
          } else if(sameMaterial.length === 1) {
            newReplenishmentLineList = replenishmentLineList.filter(e => e.keyId !== record.keyId).map(e => {
              if(e.materialId === value.materialId && e.materialVersion === value.materialVersion) {
                return {
                  ...e,
                  remark: isEmpty(value.remark) && isEmpty(e.remark) ? undefined : isEmpty(value.remark) && !isEmpty(e.remark) ? e.remark : !isEmpty(value.remark) && isEmpty(e.remark) ? value.remark : `${value.remark}#${e.remark}`,
                  replenishQty: e.replenishQty + value.replenishQty,
                };
              } else if(e.keyId === record.parentKeyId) {
                return {
                  ...e,
                  replenishQty: (e.replenishQty * 1000000 - value.replenishQty * 1000000) / 1000000,
                };
              }
              return e;
            });
          }
          dispatch({
            type: 'deliveryOrderQuery/updateState',
            payload: {
              replenishmentLineList: newReplenishmentLineList,
            },
          });
        }
      }
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const { selectedHeadRowKeys } = this.state;
    const instructionDocId = selectedHeadRowKeys && selectedHeadRowKeys.toString();
    return filterNullValueObject({ instructionDocId });
  }

  // 渲染方法
  render() {
    const {
      deliveryOrderQuery: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        lineDetailList = [],
        lineDetailPagination = {},
        instructionDocStatusList = [],
        distributionLineStatusList = [],
        replenishmentInfo = {},
        replenishmentLineList = [],
        siteInfo = {},
      },
      tenantId,
      fetchHeadLoading,
      fetchLineLoading,
      fetchCloseLoading,
      fetchCancelLoading,
      fetchPrintLoading,
      fetchReplenishmentLineListLoading,
      saveReplenishmentListLoading,
    } = this.props;
    const {
      selectedHeadRowKeys,
      selectedLineRows,
      headDatas,
      lineDetailDrawer,
      visible,
    } = this.state;
    const filterProps = {
      onSearch: this.onSearch,
      onResetSearch: this.onResetSearch,
      instructionDocStatusList,
    };

    const headRowSelection = {
      selectedRowKeys: selectedHeadRowKeys,
      onChange: this.onHeadChange,
      onSelect: this.handleSelectHeadList,
      onSelectAll: this.handleAllSelectHeadList,
      getCheckboxProps: record => ({
        disabled: !record.instructionDocId,
      }),
    };

    // 头页面需要的数据和方法
    const headTableProps = {
      headList,
      headPagination,
      headDatas,
      rowSelection: headRowSelection,
      loading: fetchHeadLoading || fetchReplenishmentLineListLoading,
      rowHeadClick: this.rowHeadClick,
      handleTableHeadChange: this.handleTableHeadChange,
    };

    // 行页面需要的数据和方法
    const lineTableProps = {
      lineList,
      linePagination,
      headDatas,
      selectedLineRows,
      fetchLineLoading,
      distributionLineStatusList,
      detailClick: this.detailClick,
      handleTableLineChange: this.handleTableLineChange,
      onLineChange: this.onLineChange,
    };

    const lineDetailProps = {
      lineDetailDrawer,
      dataSource: lineDetailList,
      pagination: lineDetailPagination,
      handleTableLineDetailChange: this.handleTableLineDetailChange,
      onLineDetailCancel: this.onLineDetailCancel,
    };

    const drawerProps = {
      visible,
      tenantId,
      siteInfo,
      replenishmentInfo,
      loading: saveReplenishmentListLoading,
      dataSource: replenishmentLineList,
      onCancel: this.handleCloseModal,
      onSaveReplenishmentList: this.handleSaveReplenishmentList,
      onEditLine: this.handleEditLine,
      onReplaceMaintain: this.handleReplaceMaintain,
      onSave: this.handleSaveCurrentRecord,
      onClearLine: this.handleClearLine,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
    };

    const otherButtonProps = {
      type: 'primary',
      disabled: selectedHeadRowKeys.length === 0,
    };

    return (
      <React.Fragment>
        <Header title={intl.get('hawk.menus.title.list').d('配送单查询')}>
          <Button
            icon="save"
            disabled={selectedHeadRowKeys.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.print()}
          >
            {intl.get('hzero.common.button.print').d('打印')}
          </Button>
          <Button
            icon="save"
            disabled={selectedHeadRowKeys.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.cancel()}
          >
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
          <Button
            icon="save"
            disabled={selectedHeadRowKeys.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.manuallyShutDown()}
          >
            {intl.get('hzero.common.button.manuallyShutDown').d('手工关闭')}
          </Button>
          <Button
            type="default"
            disabled={selectedHeadRowKeys.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.handleCreateReplenishmentList()}
          >
            {intl.get('hzero.common.button.manuallyShutDown').d('生成补料单')}
          </Button>
          <ExcelExport
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-distribution-list-query/instruction-doc-export`} // 路径
            otherButtonProps={otherButtonProps}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Spin spinning={fetchCloseLoading || fetchCancelLoading || fetchPrintLoading ||false}>
            <HeadTable {...headTableProps} />
            <Header title={intl.get('hawk.menus.title.list').d('配送单行')} />
            <LineTable {...lineTableProps} />
          </Spin>
          {lineDetailDrawer && <LineDetail {...lineDetailProps} />}
        </Content>
        <Drawer {...drawerProps} />
      </React.Fragment>
    );
  }
}
