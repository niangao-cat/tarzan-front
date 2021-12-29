import React from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import PoorPerformanceDrawer from './PoorPerformanceDrawer';
import DataCollectionDrawer from './DataCollectionDrawer';
import styles from './index.less';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
/**
 * 执行作业关系
 * @extends {PureComponent} - React.Component
 * @return React.element
 */

@connect(({ execute }) => ({
  execute,
}))
export default class StepTab extends React.Component {
  state = {
    poorPerformanceDrawerVisible: false,
    initPoorPerformanceData: {},
    dataCollectionDrawerVisible: false,
    initDataCollectionData: {},
  };

  componentDidMount() {
    this.onSearch();
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, eoId } = this.props;
    if (nextProps.eoId !== eoId) {
      dispatch({
        type: 'execute/fetchStepList',
        payload: {
          eoId: nextProps.eoId,
        },
      });
    }
  }

  onSearch = (pagination = {}) => {
    const { dispatch, eoId } = this.props;
    dispatch({
      type: 'execute/fetchStepList',
      payload: {
        eoId,
        page: {
          ...pagination,
        },
      },
    });
  };

  showPoorPerformance = record => {
    this.setState({
      poorPerformanceDrawerVisible: true,
      initPoorPerformanceData: record,
    });
  };

  cancelPoorPerformance = () => {
    this.setState({
      poorPerformanceDrawerVisible: false,
      initPoorPerformanceData: {},
    });
  };

  showDataCollection = record => {
    this.setState({
      dataCollectionDrawerVisible: true,
      initDataCollectionData: record,
    });
  };

  cancelDataCollection = () => {
    this.setState({
      dataCollectionDrawerVisible: false,
      initDataCollectionData: {},
    });
  };

  rowExpand = record => {
    if (record.wkcActualList && record.wkcActualList.length > 0) {
      return styles.expandVisible;
    } else {
      return styles.expandHidden;
    }
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      execute: { stepList = [], stepPagination = {} },
    } = this.props;
    const newList = stepList.filter(item => item.wkcActualList && item.wkcActualList.length > 0);
    const {
      poorPerformanceDrawerVisible,
      initPoorPerformanceData = {},
      dataCollectionDrawerVisible,
      initDataCollectionData = {},
    } = this.state;
    const poorPerformanceDrawerProps = {
      visible: poorPerformanceDrawerVisible,
      initData: initPoorPerformanceData,
      onCancel: this.cancelPoorPerformance,
      onOk: this.cancelPoorPerformance,
    };
    const dataCollectionDrawerProps = {
      visible: dataCollectionDrawerVisible,
      initData: initDataCollectionData,
      onCancel: this.cancelDataCollection,
      onOk: this.cancelDataCollection,
    };
    const expandedRowRender = record => {
      const columns = [
        {
          title: intl.get(`${modelPrompt}.workcellCode`).d('工作单元编码'),
          width: 100,
          dataIndex: 'workcellCode',
        },
        {
          title: intl.get(`${modelPrompt}.workcellName`).d('工作单元名称'),
          width: 100,
          dataIndex: 'workcellName',
        },
        {
          title: intl.get(`${modelPrompt}.queueQty`).d('排队数量'),
          width: 120,
          dataIndex: 'queueQty',
          render: (_, records) => {
            return (
              <span>
                {records.queueQty}/{records.totalQueueQty}
              </span>
            );
          },
        },
        {
          title: intl.get(`${modelPrompt}.workingQty`).d('加工数量'),
          width: 120,
          dataIndex: 'workingQty',
          render: (_, records) => {
            return (
              <span>
                {records.workingQty}/{records.totalWorkingQty}
              </span>
            );
          },
        },
        {
          title: intl.get(`${modelPrompt}.completePendingQty`).d('完成暂存数量'),
          width: 120,
          dataIndex: 'completePendingQty',
          render: (_, records) => {
            return (
              <span>
                {records.completePendingQty}/{records.totalCompletePendingQty}
              </span>
            );
          },
        },
        {
          title: intl.get(`${modelPrompt}.completeQty`).d('完成数量'),
          width: 120,
          dataIndex: 'completeQty',
          render: (_, records) => {
            return (
              <span>
                {records.completeQty}/{records.totalCompleteQty}
              </span>
            );
          },
        },
        {
          title: intl.get(`${modelPrompt}.scrappedQty`).d('报废数量'),
          width: 120,
          dataIndex: 'scrappedQty',
          render: (_, records) => {
            return (
              <span>
                {records.scrappedQty}/{records.totalScrappedQty}
              </span>
            );
          },
        },
      ];
      return (
        <Table
          columns={columns}
          rowKey="workcellId"
          dataSource={record.wkcActualList}
          pagination={false}
        />
      );
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.sequence`).d('步骤顺序'),
        width: 100,
        dataIndex: 'sequence',
      },
      {
        title: intl.get(`${modelPrompt}.stepName`).d('步骤识别码'),
        width: 100,
        dataIndex: 'stepName',
      },
      {
        title: intl.get(`${modelPrompt}.routerStepDesc`).d('步骤描述'),
        width: 100,
        dataIndex: 'routerStepDesc',
      },
      {
        title: intl.get(`${modelPrompt}.operationDesc`).d('工艺'),
        dataIndex: 'operationDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.queueQty`).d('排队数量'),
        dataIndex: 'queueQty',
        width: 120,
        render: (_, records) => {
          return (
            <span>
              {records.totalQueueQty}/{records.queueQty}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.workingQty`).d('加工数量'),
        dataIndex: 'workingQty',
        width: 120,
        render: (_, records) => {
          return (
            <span>
              {records.totalWorkingQty}/{records.workingQty}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.completePendingQty`).d('完成暂存数量'),
        dataIndex: 'completePendingQty',
        width: 120,
        render: (_, records) => {
          return (
            <span>
              {records.totalCompletePendingQty}/{records.completePendingQty}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.completeQty`).d('完成数量'),
        dataIndex: 'completeQty',
        width: 120,
        render: (_, records) => {
          return (
            <span>
              {records.totalCompleteQty}/{records.completeQty}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.scrappedQty`).d('报废数量'),
        dataIndex: 'scrappedQty',
        width: 120,
        render: (_, records) => {
          return (
            <span>
              {records.totalScrappedQty}/{records.scrappedQty}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.reworkStepFlag`).d('返修标识'),
        dataIndex: 'reworkStepFlag',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.poorPerformance`).d('不良实绩'),
        dataIndex: 'poorPerformance',
        width: 150,
        render: (_, record) => {
          return (
            <a onClick={() => this.showPoorPerformance(record)}>
              {intl.get(`${modelPrompt}.poorPerformance`).d('不良实绩')}
            </a>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.dataCollection`).d('数据收集组'),
        dataIndex: 'dataCollection',
        width: 150,
        render: (_, record) => {
          return (
            <a onClick={() => this.showDataCollection(record)}>
              {intl.get(`${modelPrompt}.dataCollection`).d('数据收集组')}
            </a>
          );
        },
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          expandedRowRender={newList.length > 0 ? expandedRowRender : null}
          dataSource={stepList}
          pagination={stepPagination}
          onChange={this.onSearch}
          rowKey="eoStepActualId"
          bordered
          rowClassName={this.rowExpand}
        />
        {poorPerformanceDrawerVisible && <PoorPerformanceDrawer {...poorPerformanceDrawerProps} />}
        {dataCollectionDrawerVisible && <DataCollectionDrawer {...dataCollectionDrawerProps} />}
      </>
    );
  }
}
