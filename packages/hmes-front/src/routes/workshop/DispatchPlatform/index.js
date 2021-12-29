/**
 * DispatchPlatform - 调度平台
 * @date: 2019-12-3
 * @author: JRQ <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Tabs, Popconfirm } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { isUndefined } from 'lodash';

import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import Cookies from 'universal-cookie';
import formatterCollections from 'utils/intl/formatterCollections';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DispatchingScope from './DispatchingScope';
import ChartTable from './ChartTable';
import ListTable from './ListTable';
import SortSubTable from './SortSubTable';
import FilterForm from './FilterForm';
import DispatchDrawer from './DispatchDrawer';
import styles from './index.less';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.workshop.dispatchPlatform.model.dispatchPlatform';
const cookies = new Cookies();

@DragDropContext(HTML5Backend)
@connect(({ dispatchPlatform, loading }) => ({
  dispatchPlatform,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['dispatchPlatform/fetchMaterialList'],
}))
@formatterCollections({ code: 'tarzan.workshop.dispatchPlatform' })
export default class DispatchPlatform extends React.Component {
  filterForm;

  chartTable;

  state = {
    dispatchDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (cookies.get('defaultSiteId') === 'undefined' || isUndefined(cookies.get('defaultSiteId'))) {
      dispatch({
        type: 'dispatchPlatform/fetchDefaultSite',
      }).then(res => {
        if (!res) {
          Modal.warning({
            title: intl
              .get('tarzan.workshop.dispatchPlatform.message.siteInNeed')
              .d('请在配置默认站点后再进行操作'),
          });
        }
      });
    } else {
      const defaultSiteId = cookies.get('defaultSiteId');
      dispatch({
        type: 'dispatchPlatform/updateState',
        payload: {
          defaultSiteId,
        },
      });
    }
    // 获取用户有权限的生产线
    dispatch({
      type: 'dispatchPlatform/fetchUsersProLineOptions',
    });
  }

  changeTabsActiveKey = key => {
    this.props.dispatch({
      type: 'dispatchPlatform/updateState',
      payload: {
        tabsActiveKey: key,
      },
    });
  };

  /**
   * 表格ref对象
   * @param {object} ref - FilterForm子组件对象
   */
  handleBindQueryRef = (ref = {}) => {
    this.filterForm = ref;
  };

  // 查询表格数据
  fetchTableList = (pagination = {}) => {
    this.filterForm.fetchTableList(pagination);
  };

  // 已调度执行作业的头部
  renderChartCardTitle = () => {
    return (
      <div className={styles.chartCardTitle}>
        <div className={styles.title}>
          {intl.get('tarzan.workshop.dispatchPlatform.title.scheduledJobs').d('已调度执行作业')}
        </div>
        <ul className={styles.legend}>
          <li>
            <div className={styles.colorBlock} />
            {intl.get(`${modelPrompt}.unpublished`).d('调度未发布')}
          </li>
          <li>
            <div className={styles.colorBlock} />
            {intl.get(`${modelPrompt}.published`).d('调度已发布')}
          </li>
          <li>
            <div className={styles.colorBlock} />
            {intl.get(`${modelPrompt}.WKCCapacity`).d('WKC产能')}
          </li>
        </ul>
      </div>
    );
  };

  //  撤销
  workshopRevoke = () => {
    const {
      dispatch,
      dispatchPlatform: {
        revokeRow,
        defaultSiteId,
        selectedProLineId,
        selectedOperationId,
        tablePagination,
        selectedChartDetail: { capacityQty = '' },
      },
    } = this.props;
    dispatch({
      type: 'dispatchPlatform/revoke',
      payload: {
        ...revokeRow,
      },
    }).then(res => {
      if (res && res.success) {
        dispatch({
          type: 'dispatchPlatform/fetchScheduledSubTableList',
          payload: {
            shiftCode: res.rows.shiftCode,
            shiftDate: res.rows.shiftDate,
            workcellId: res.rows.workcellId,
          },
        });
        this.filterForm.fetchTableList(tablePagination);
        dispatch({
          type: 'dispatchPlatform/fetchOneChartInfo',
          payload: {
            defaultSiteId,
            operationId: selectedOperationId,
            prodLineId: selectedProLineId,
            shiftCode: res.rows.shiftCode,
            shiftDate: res.rows.shiftDate,
            workcellId: res.rows.workcellId,
            capacityQty,
          },
        });
        dispatch({
          type: 'dispatchPlatform/updateState',
          payload: {
            revokeRow: {},
            selectedRowKeys: [],
          },
        });
      }
    });
  };

  //  发布提示的日期
  getReleaseDate = () => {
    const {
      getDateCNNoYear,
      state: { addNumber },
    } = this.chartTable;
    return `${getDateCNNoYear(addNumber)}-${getDateCNNoYear(addNumber + 1)}`;
  };

  //  发布
  workshopRelease = () => {
    const {
      dispatch,
      dispatchPlatform: { selectedProLineId, WKCRangeList, tablePagination },
    } = this.props;
    const {
      getDate,
      state: { addNumber },
    } = this.chartTable;
    dispatch({
      type: 'dispatchPlatform/release',
      payload: {
        operationId: selectedProLineId,
        shiftDateFrom: getDate(addNumber),
        shiftDateTo: getDate(addNumber + 1),
        workcellIdList: WKCRangeList.map(item => item.workcellId),
      },
    }).then(res => {
      if (res && res.success) {
        this.filterForm.fetchTableList(tablePagination);
        this.chartTable.fetchChart(getDate(addNumber), getDate(addNumber + 1));
      }
    });
  };

  //  调度
  workshopDispatch = () => {
    this.setState({
      dispatchDrawerVisible: true,
    });
  };

  /**
   * 图表表格ref对象
   * @param {object} ref - ChartTable子组件对象
   */
  refChartTable = (ref = {}) => {
    this.chartTable = ref;
  };

  // 关闭抽屉
  handleDrawerCancel = () => {
    this.setState({
      dispatchDrawerVisible: false,
    });
  };

  //  切换页面
  changePage = () => {
    this.props.dispatch({
      type: 'dispatchPlatform/clear',
    });
    this.props.dispatch({
      type: 'dispatchPlatform/fetchUsersProLineOptions',
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { dispatchDrawerVisible } = this.state;
    const {
      dispatchPlatform: {
        showDispatchScopeFlag,
        selectedProLineName,
        selectedOperationName,
        tabsActiveKey,
        revokeRow,
        selectedRowId,
      },
    } = this.props;
    const chartCardTitle = (
      <div className={styles.chartCardTitle}>
        <div className={styles.title}>
          {intl.get('tarzan.workshop.dispatchPlatform.title.scheduledJobs').d('已调度执行作业')}
        </div>
        <ul className={styles.legend}>
          <li>
            <div className={styles.colorBlock} style={{ background: '#FFBF5C' }} />
            {intl.get(`${modelPrompt}.unpublished`).d('调度未发布')}
          </li>
          <li>
            <div className={styles.colorBlock} style={{ background: '#6299FF' }} />
            {intl.get(`${modelPrompt}.published`).d('调度已发布')}
          </li>
          <li>
            <div className={styles.colorBlock} style={{ background: '#47DBA5' }} />
            {intl.get(`${modelPrompt}.WKCCapacity`).d('WKC产能')}
          </li>
        </ul>
      </div>
    );
    const dispatchDrawerProps = {
      visible: dispatchDrawerVisible,
      onCancel: this.handleDrawerCancel,
    };
    const releaseDate = this.chartTable ? this.getReleaseDate() : 0;
    return (
      <>
        {showDispatchScopeFlag ? (
          <DispatchingScope />
        ) : (
          <>
            <Header
              title={intl
                .get('tarzan.workshop.dispatchPlatform.title.dispatchPlatform')
                .d('调度平台')}
            >
              <Popconfirm
                placement="bottomLeft"
                title={intl
                  .get(`tarzan.workshop.dispatchPlatform.confirm.release`, {
                    count: releaseDate,
                  })
                  .d(`确认发布${releaseDate}已调度的执行作业?`)}
                onConfirm={this.workshopRelease}
              >
                <Button type="primary">
                  {intl.get('tarzan.workshop.dispatchPlatform.button.release').d('发布')}
                </Button>
              </Popconfirm>
              <Button onClick={this.workshopDispatch} disabled={!selectedRowId}>
                {intl.get('tarzan.workshop.dispatchPlatform.button.dispatch').d('调度')}
              </Button>
              <Button onClick={this.workshopRevoke} disabled={!revokeRow.workcellCode}>
                {intl.get('tarzan.workshop.dispatchPlatform.button.revoke').d('撤销')}
              </Button>
              <ul className={styles.headerUl} onClick={this.changePage}>
                <li>{selectedProLineName}</li>
                <li>{selectedOperationName}</li>
              </ul>
            </Header>
            <Content>
              <Tabs activeKey={tabsActiveKey} onChange={this.changeTabsActiveKey}>
                <TabPane
                  tab={intl
                    .get('tarzan.workshop.dispatchPlatform.title.schedulableJobs')
                    .d('可调度执行作业')}
                  key="dispatchInfo"
                >
                  <FilterForm onRef={this.handleBindQueryRef} />
                  <ListTable onSearch={this.fetchTableList} />
                </TabPane>
                <TabPane
                  tab={intl
                    .get('tarzan.workshop.dispatchPlatform.title.scheduledJobs')
                    .d('已调度执行作业')}
                  key="subTableSort"
                >
                  <SortSubTable />
                </TabPane>
              </Tabs>
              <Card
                key="code-rule-header"
                title={chartCardTitle}
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
              >
                <ChartTable onRef={this.refChartTable} />
              </Card>
            </Content>
            {dispatchDrawerVisible && <DispatchDrawer {...dispatchDrawerProps} />}
          </>
        )}
      </>
    );
  }
}
