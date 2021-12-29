/**
 * 物流器具
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button, Card } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import notification from 'utils/notification';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import NewCreateDrawer from './NewCreateDrawer';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import PrintModel from './PrintModel';

/**
 * 将models中的state绑定到组件的props中,connect 方法传入的第一个参数是 mapStateToProps 函数，
 * mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系
 */
@connect(({ applianceCreation, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  applianceCreation,
  loading: {
    fetchHeadLoading: loading.effects['applianceCreation/queryHeaderList'],
    fetchLineLoading: loading.effects['applianceCreation/queryLineList'],
    saveLoading: loading.effects['applianceCreation/createData'],
    printLoading: loading.effects['applianceCreation/print'],
  },
}))
@formatterCollections({ code: 'hwms.applianceCreation' })
class ApplianceCreate extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showNewCreateDrawer: false,
      selectedRowKeys: [],
      selectedRows: [], // 选中的头数据
      selectedLineRowKeys: [],
      selectedLineRows: [], // 选中的行数据
      parentItem: {}, // 保存当前选中的头
      choseFlag: '', // 判断当前选中的是头还是行
      printVisible: false, // 是否显示打印
    };
  }

  async componentDidMount() {
    window.localStorage.removeItem('selectedApplianceRows');
    window.localStorage.removeItem('choseFlag');
    const {
      location: { state: { _back } = {} },
      applianceCreation: { headPagination },
      dispatch,
    } = this.props;
    // 查询独立值集
    await dispatch({
      type: 'applianceCreation/init',
    });
    await dispatch({
      type: 'applianceCreation/getSiteList',
    });
    await dispatch({
      type: 'applianceCreation/fetchSiteList',
    });
    // 校验是否从历史页返回
    const page = _back === -1 ? headPagination : {};
    await this.handleHeadSearch(page);
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'applianceCreation/queryHeaderList',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 是否为分页查询
          this.setState(
            {
              selectedLineRowKeys: [],
              selectedLineRows: [],
              selectedRowKeys: [],
              selectedRows: [],
            },
            () => {
              dispatch({
                type: 'applianceCreation/updateState',
                payload: {
                  lineList: [],
                  linePagination: {},
                },
              });
            }
          );
        }
      }
    });
  }

  /**
   *  查询行列表
   * @param {object} 查询参数
   */
  @Bind()
  handleLineSearch(fields = {}) {
    const {
      parentItem: { containerCode },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'applianceCreation/queryLineList',
      payload: {
        containerCode,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  抽屉
   *  是否显示物流器具新建modal
   */
  @Bind()
  handleModalVisible(flag) {
    this.setState({ showNewCreateDrawer: flag });
  }

  /**
   *  新建
   */
  @Bind()
  handleApplianceCreation() {
    const { dispatch } = this.props;
    dispatch({
      type: 'applianceCreation/updateState', // 访问model中的updateState方法
      payload: { detail: {} }, // 参数
    });
    this.handleModalVisible(true);
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 头数据选择操作
   */
  @Bind()
  handleSelectHeadRow(selectedRowKeys, selectedRows) {
    if (this.state.selectedLineRows.length > 0) {
      this.setState({ selectedLineRowKeys: [], selectedLineRows: [] });
    }
    this.setState({ selectedRowKeys, selectedRows, choseFlag: 'head' });
  }

  /**
   * 行数据选择操作
   */
  @Bind()
  handleSelectLineRow(selectedLineRowKeys, selectedLineRows) {
    if (this.state.selectedRows.length > 0) {
      this.setState({ selectedRowKeys: [], selectedRows: [] });
    }
    this.setState({ selectedLineRowKeys, selectedLineRows, choseFlag: 'line' });
  }

  /**
   * 点击头，查询对应的行
   * @param {object} fields - 查询参数
   */
  @Bind()
  handleHead(record = {}) {
    this.setState({ parentItem: record }, () => {
      this.handleLineSearch();
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'applianceCreation/createData',
      payload: {
        tenantId,
        ...params,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
        this.handleHeadSearch();
      }
    });
  }

  @Bind()
  handleImport() {
    openTab({
      key: `/hwms/appliance/data-import/AMTC.SR`,
      title: intl.get('hwms.applianceCreation.model.applianceCreation.import').d('物流器具导入'),
      search: queryString.stringify({
        action: intl.get('hwms.applianceCreation.model.applianceCreation.import').d('物流器具导入'),
      }),
    });
  }

  /**
   *  跳转到物流器具历史页
   */
  @Bind()
  handleHistory() {
    const { selectedRows, selectedLineRows, choseFlag } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'applianceCreation/updateState',
      payload: {
        headHisList: [],
        headHisPagination: {},
        lineHisList: [],
        lineHisPagination: {},
      },
    });
    window.localStorage.setItem(
      'selectedApplianceRows',
      JSON.stringify(choseFlag === 'head' ? selectedRows : selectedLineRows)
    );
    window.localStorage.setItem('choseFlag', choseFlag);
    dispatch(
      routerRedux.push({
        pathname: `/hwms/appliance/history-list`,
      })
    );
  }

    // 打印操作
    @Bind
    doPrint(){
      this.setState({ printVisible: true});
    }

    // 关闭打印
    @Bind
    closePrint(){
      this.setState({ printVisible: false});
    }

    // 打印
    @Bind
    print(printType){
      const {selectedRows} = this.state;
      // 设置传输 参数
      const param = {
        type: printType,
        materialLotCodeList: selectedRows.map(item=>item.containerCode),
      };
      const {
        dispatch,
      } = this.props;
      dispatch({
        type: 'applianceCreation/print',
        payload: param,
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
              this.setState({ printVisible: false});
            } else {
              notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
            }
          }
        }
      });

    }

  render() {
    const { showNewCreateDrawer, selectedRowKeys, selectedLineRowKeys, printVisible } = this.state;
    const {
      applianceCreation: {
        detail = {},
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        statusMap = [],
        ownerTypeMap = [],
        isEmptyMap = [],
        defaultSite={},
        siteList = [],
      },
      loading: { fetchHeadLoading, fetchLineLoading, saveLoading, printLoading },
      tenantId,
    } = this.props;
    const newCreateProps = {
      // newCreateProps传给子组件（NewCreateDrawer.js）参数
      detail,
      tenantId,
      ownerTypeMap,
      showNewCreateDrawer,
      saveLoading,
      defaultSite,
      onCancel: this.handleModalVisible, // 左边对应子组件的方法名，后面对应本组件（父组件）对应的方法
      onOk: this.saveData,
    };
    // filter框
    const filterProps = {
      tenantId,
      statusMap,
      isEmptyMap,
      siteList,
      defaultSite,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };
    const listHeadProps = {
      selectedRowKeys,
      pagination: headPagination,
      loading: fetchHeadLoading,
      dataSource: headList,
      onSearch: this.handleHeadSearch,
      onSelectRow: this.handleSelectHeadRow,
      onSearchLine: this.handleHead,
    };
    const listRowProps = {
      selectedRowKeys: selectedLineRowKeys,
      pagination: linePagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onSelectRow: this.handleSelectLineRow,
    };
    const printProps = {
      visible: printVisible,
      closeModal: this.closePrint,
      print: this.print,
      selectedBarcodeList: selectedRowKeys,
      loading: printLoading,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.applianceCreation.view.message.title').d('物流器具')}>
          <Button type="primary" icon="plus" onClick={this.handleApplianceCreation}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="to-top" onClick={this.handleImport}>
            {intl.get('hzero.common.view.button.import').d('导入')}
          </Button>
          <Button
            icon="file"
            onClick={this.handleHistory}
            disabled={isEmpty(selectedRowKeys) && isEmpty(selectedLineRowKeys)}
          >
            {intl.get('hwms.applianceCreation.view.message.history').d('历史')}
          </Button>
          <Button onClick={()=>this.doPrint()} disabled={selectedRowKeys.length === 0}>
            {intl.get('tarzan.workshop.execute.button.print').d('打印')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTableHead {...listHeadProps} />
          <Card
            key="code-rule-liner"
            title={intl.get('hwms.applianceCreation.view.message.containerLine').d('物流器具行')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <ListTableRow {...listRowProps} />
          {showNewCreateDrawer && <NewCreateDrawer {...newCreateProps} />}
          {printVisible&&<PrintModel {...printProps} />}
        </Content>
        <ModalContainer ref={registerContainer} />
      </React.Fragment>
    );
  }
}

export default ApplianceCreate;
