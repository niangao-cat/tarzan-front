/*
 *@description:采购退货平台首页
 *@author: wangxinyu
 *@date: 2020-07-29 13:37:08
 *@version: V0.0.1
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, notification, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import 'moment/locale/zh-cn';
import { get as chainGet } from 'lodash';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import FilterForm from './FilterForm';
import styles from './index.less';
import LineTable from './LineTable';
import HeadTable from './HeadTable';
import LineDetail from './Details/LineDetail';
// const modelPrompt = 'hcms.model.purchaseReturnPlatform';

/**
 * 配送单查询
 * @extends {Component} - React.Component
 * @reactProps {Object} function - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ purchaseReturnPlatform, loading }) => ({
  purchaseReturnPlatform,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['purchaseReturnPlatform/fetchHeadList'],
  fetchLineLoading: loading.effects['purchaseReturnPlatform/fetchLineList'],
  fetchCloseLoading: loading.effects['purchaseReturnPlatform/close'],
  fetchCancelLoading: loading.effects['purchaseReturnPlatform/cancel'],
  fetchPrintLoading: loading.effects['purchaseReturnPlatform/print'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.purchaseReturnPlatform',
})
export default class PurchaseReturnPlatform extends React.Component {
  state = {
    selectedHeadRows: [], // 删除头主键
    selectedLineRows: [], // 删除行主键
    headPagination: {}, // 头分页
    linePagination: {}, // 行分页
    search: {}, // 查询条件
    headDatas: '', // 点击头的某一行获取这行数据
    lineDetailDrawer: false,
    detailDatas: {},
    // visible: false,
    // confirmLoading: false,
  };

  componentDidMount() {
    this.headRefresh();
    this.queryLovs();
  }

  // 获取值集
  queryLovs = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'purchaseReturnPlatform/querySelect',
      payload: {
        instructionDocStatus: 'MT.INSTRUCTION_DOC_TYPE',
        distributionLineStatus: 'WMS.DISTRIBUTION_LINE_STATUS',
      },
    });
  };

  // 获取状态下拉
  @Bind()
  getStatueSelectOption = (type, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseReturnPlatform/fetchStatueSelectList',
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
      type: 'purchaseReturnPlatform/fetchTypeSelectList',
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
    dispatch({
      type: 'purchaseReturnPlatform/fetchHeadList',
      payload: {
        ...search,
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
      type: 'purchaseReturnPlatform/fetchLineList',
      payload: {
        sourceDocId: headDatas.instructionDocId,
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
      type: 'purchaseReturnPlatform/fetchLineDetailList',
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
      type: 'purchaseReturnPlatform/fetchLineDetailList',
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
      type: 'purchaseReturnPlatform/updateState',
      payload: {
        lineList: [],
        linePagination: {},
      },
    });
  }

  // 选中头事件
  @Bind
  onHeadChange(selectedHeadRows) {
    this.setState({
      selectedHeadRows,
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
    this.showModal();
  }

  // 打印
  @Bind
  print(){
    const {selectedHeadRows} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'purchaseReturnPlatform/print',
      payload: selectedHeadRows,
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
    const {selectedHeadRows} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'purchaseReturnPlatform/cancel',
      payload: selectedHeadRows,
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

  // // 展开弹窗
  // @Bind
  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // }

  // 弹窗确认
  @Bind
  handleOk = () => {
    // this.setState({
    //   confirmLoading: true,
    // });
    const {selectedHeadRows} = this.state;
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'purchaseReturnPlatform/close',
      payload: selectedHeadRows,
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
    // this.setState({
    //   visible: false,
    //   confirmLoading: false,
    // });
  }

  // // 弹窗取消
  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // }

  // 渲染方法
  render() {
    const {
      purchaseReturnPlatform: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        lineDetailList = [],
        lineDetailPagination = {},
        instructionDocStatusList = [],
        distributionLineStatusList = [],
      },
      fetchHeadLoading,
      fetchLineLoading,
      fetchCloseLoading,
      fetchCancelLoading,
      fetchPrintLoading,
    } = this.props;
    const {
      selectedHeadRows,
      selectedLineRows,
      headDatas,
      lineDetailDrawer,
      // visible,
      // confirmLoading,
    } = this.state;
    const filterProps = {
      onSearch: this.onSearch,
      onResetSearch: this.onResetSearch,
      instructionDocStatusList,
    };

    // 头页面需要的数据和方法
    const headTableProps = {
      headList,
      headPagination,
      headDatas,
      selectedHeadRows,
      fetchHeadLoading,
      rowHeadClick: this.rowHeadClick,
      handleTableHeadChange: this.handleTableHeadChange,
      onHeadChange: this.onHeadChange,
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

    return (
      <React.Fragment>
        <Header title={intl.get('hawk.menus.title.list').d('采购退货平台')}>
          <Button
            icon="save"
            disabled={selectedHeadRows.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.print()}
          >
            {intl.get('hzero.common.button.print').d('打印')}
          </Button>
          {/* <Button
            icon="save"
            disabled={selectedHeadRows.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.cancel()}
          >
            {intl.get('hzero.common.button.cancel').d('取消')}
          </Button>
          <Button
            icon="save"
            disabled={selectedHeadRows.length === 0}
            loading={fetchHeadLoading}
            onClick={() => this.manuallyShutDown()}
          >
            {intl.get('hzero.common.button.manuallyShutDown').d('手工关闭')}
          </Button> */}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <Spin spinning={fetchCloseLoading || fetchCancelLoading || fetchPrintLoading ||false}>
            <HeadTable {...headTableProps} />
            <Header title={intl.get('hawk.menus.title.list').d('采购退货单行')} />
            <LineTable {...lineTableProps} />
          </Spin>
          {lineDetailDrawer && <LineDetail {...lineDetailProps} />}
        </Content>
        {/* <Modal
          title="手工关闭"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
        >
          <p>{intl.get('hzero.common.modal.text').d('一旦手工关闭，单据无法继续执行，也无法退回，请确认！')}</p>
        </Modal> */}
      </React.Fragment>
    );
  }
}
