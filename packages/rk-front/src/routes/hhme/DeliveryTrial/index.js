/*
 * @Description: 交期试算
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-27 16:37:21
 * @LastEditTime: 2020-09-10 13:59:58
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Table, Tooltip } from 'hzero-ui';
import { connect } from 'dva';
import { unionBy, isUndefined } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject, tableScrollWidth } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import FilterForm from './FilterForm';
import StartEndModal from './StartEndModal';
import styles from './index.less';


@connect(({ deliveryTrial, loading }) => ({
  deliveryTrial,
  fetchLoading: loading.effects['deliveryTrial/fetchWo'],
  changeDateLoading: loading.effects['deliveryTrial/changeDate'],
  tenantId: getCurrentOrganizationId(),
}))
export default class DeliveryTrial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      woRecord: {},
      visible: false,
      fixColnum: false, // 固定列
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'deliveryTrial/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'deliveryTrial/batchLovData',
      payload: {
        tenantId,
      },
    });
  }

  @Bind
  fetchWo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryTrial/updateState',
      payload: {
        dynamicColumns: [],
        footerColumns: [],
        dynamicDataSource: [],
        foterDataSource: [],
      },
    });
    this.setState({fixColnum: false});
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'deliveryTrial/fetchWo',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res) {
        const { woList = [], prodLineAbilityList = [], prodLineAbilityRateList = [] } = res;
        const columns = [];
        const footerColumns = [];
        const dataSource = [];
        // 组件dataSource
        for (let index = 0; index < woList.length; index++) {
          const value = {};
          woList[index].detailList.forEach(element => {
            value[element.shiftDate] = element.trialQty;
          });
          dataSource.push({
            workOrderNum: woList[index].workOrderNum,
            materialCode: woList[index].materialCode,
            materialName: woList[index].materialName,
            workOrderTypeDesc: woList[index].workOrderTypeDesc,
            qty: woList[index].qty,
            dueDate: woList[index].dueDate,
            dateFrom: woList[index].dateFrom,
            dateTo: woList[index].dateTo,
            workOrderId: woList[index].workOrderId,
            ...value,
          });
        }
        const foterDataSource = [];
        // 构建最后两行数据
        for (let i = 0; i < 2; i++) {
          if (i === 0) {
            const value = {};
            prodLineAbilityList.forEach(element => {
              value[element.shiftDate] = element.ability;
            });
            foterDataSource.push({
              name: '产线负荷',
              ...value,
            });
          } else {
            const value = {};
            prodLineAbilityRateList.forEach(element => {
              value[element.shiftDate] = element.abilityRate;
            });
            foterDataSource.push({
              name: '产线负荷比例',
              ...value,
            });
          }
        }
        woList.forEach((item) => {
          item.detailList.forEach(e => {
            columns.push({
              title: `${moment(e.shiftDate).format('MM-DD')}`,
              width: 50,
              dataIndex: `${e.shiftDate}`,
              align: 'center',
              onCell: () => ({
                style: {
                  borderRight: 'none',
                },
              }),
              render: (val) => {
                // 后两行不显示div，只显示数字即可
                if (typeof (val) !== "string") {
                  if (val !== 0) {
                    return (
                      <div style={{ height: '25px', width: '100%', backgroundColor: '#29BECE' }} />
                    );
                  } else {
                    return (
                      <div style={{ height: '25px', width: '100%' }} />
                    );
                  }
                } else {
                  return <span>{val}</span>;
                }
              },
            });
          });
        });
        const dynamicColumns = unionBy(columns, 'dataIndex');
        dispatch({
          type: 'deliveryTrial/updateState',
          payload: {
            dynamicColumns,
            footerColumns,
            dynamicDataSource: dataSource,
            foterDataSource,
          },
        });
        this.setState({fixColnum: true});
      }
    });
  }

  // 打开调整开始和结束时间的模态框
  @Bind()
  openStartEndDate(record, flag) {
    this.setState({ woRecord: record, visible: flag });
  }

  // 更改开始和结束时间
  @Bind()
  changeDate(val) {
    const { dispatch, tenantId } = this.props;
    const { woRecord = {} } = this.state;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'deliveryTrial/changeDate',
      payload: {
        tenantId,
        dateFrom: isUndefined(val.dateFrom)
          ? null
          : moment(val.dateFrom).format('YYYY-MM-DD'),
        dateTo: isUndefined(val.dateTo)
          ? null
          : moment(val.dateTo).format('YYYY-MM-DD'),
        workOrderId: woRecord.workOrderId,
        productionLineId: fieldsValue.productionLineId,
      },
    }).then(res => {
      if (res) {
        this.openStartEndDate({}, false);
        this.fetchWo();
      }
    });
  }

  renderContent = (value, row, index) => {
    const {
      deliveryTrial: {
        dynamicDataSource = [],
      },
    } = this.props;
    const obj = {
      children: value,
      props: {},
    };
    if (index === dynamicDataSource.length - 1 || index === dynamicDataSource.length - 2) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  render() {
    const {
      tenantId,
      deliveryTrial: {
        defaultSite = {},
        lovData = {},
        dynamicColumns = [],
        // footerColumns = [],
        dynamicDataSource = [],
        foterDataSource = [],
      },
      fetchLoading,
      changeDateLoading,
    } = this.props;
    const { visible, woRecord = {} } = this.state;
    const { woType = [] } = lovData;
    const filterProps = {
      tenantId,
      defaultSite,
      woType,
      onSearch: this.fetchWo,
      onRef: node => {
        this.filterForm = node.props.form;
      },
    };
    const startEndModalProps = {
      visible,
      woRecord,
      changeDateLoading,
      onCancel: this.openStartEndDate,
      changeDate: this.changeDate,
    };
    const columns = [
      {
        title: '工单号',
        width: 100,
        dataIndex: 'workOrderNum',
        align: 'center',
        fixed: 'left',
        // render: (val, record, index) => {
        //   if (index < dynamicDataSource.length - 2) {
        //     return (
        //       <a className="action-link" onClick={() => this.openStartEndDate(record, true)}>
        //         {val}
        //       </a>
        //     );
        //   }
        //   return {
        //     children: <a className="action-link">{val}</a>,
        //     props: {
        //       colSpan: 8,
        //     },
        //   };
        // },
        render: (val, record) => {
          return (
            <a className="action-link" onClick={() => this.openStartEndDate(record, true)}>
              {val}
            </a>
          );
        },
      },
      {
        title: '物料编码',
        width: 80,
        dataIndex: 'materialCode',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
      {
        title: '物料名称',
        width: 100,
        dataIndex: 'materialName',
        align: 'center',
        fixed: 'left',
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>{val}</Tooltip>
        ),
        // render: this.renderContent,
      },
      {
        title: '工单类型',
        width: 80,
        dataIndex: 'workOrderTypeDesc',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
      {
        title: '工单总数',
        width: 70,
        dataIndex: 'qty',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
      {
        title: '交付时间',
        width: 100,
        dataIndex: 'dueDate',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
      {
        title: '开始时间',
        width: 100,
        dataIndex: 'dateFrom',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
      {
        title: '结束时间',
        width: 100,
        dataIndex: 'dateTo',
        align: 'center',
        fixed: 'left',
        // render: this.renderContent,
      },
    ];
    const newColumns = columns.concat(dynamicColumns);
    const footerColumn = [
      {
        width: 730,
        dataIndex: 'name',
        align: 'center',
        fixed: 'left',
        render: (val) => {
          return <a>{val}</a>;
        },
      },
    ];
    const newFooterColumns = footerColumn.concat(dynamicColumns);
    return (
      <Fragment>
        <Header title="交期试算" />
        <Content style={{ padding: '8px' }}>
          <FilterForm {...filterProps} />
          <div className={styles['delivery-trial-table']}>
            <Table
              columns={newColumns}
              dataSource={dynamicDataSource}
              pagination={false}
              loading={fetchLoading}
              scroll={{ x: tableScrollWidth(newColumns), y: 420 }}
              resizable={this.state.fixColnum}
              // scroll={{ x: tableScrollWidth(newColumns) }}
              bordered
            />
            <div>
              <Table
                    // showHeader={false}
                columns={newFooterColumns}
                dataSource={foterDataSource}
                resizable={this.state.fixColnum}
                pagination={false}
                loading={fetchLoading}
                scroll={{ x: tableScrollWidth(newColumns) }}
              />
            </div>
          </div>
          {/* <Spin spinning={false}>
            <div className="gantt-container">
              <Gantt tasks={data} />
            </div>
          </Spin> */}
          <StartEndModal {...startEndModalProps} />
        </Content>
      </Fragment>
    );
  }
}