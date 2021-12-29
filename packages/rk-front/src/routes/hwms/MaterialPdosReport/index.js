/*
 * @Description: 仓库物料进销存报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-19 10:24:33
 * @LastEditTime: 2020-11-22 16:34:41
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import { tableScrollWidth, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Table, Button } from 'hzero-ui';
import { DEFAULT_DATETIME_FORMAT, DATETIME_MIN, DATETIME_MAX } from 'utils/constants';
import moment from 'moment';
import FilterForm from './FilterForm';
import JournalQueryHistory from './JournalQueryHistory';
import styles from './index.less';

@connect(({ materialPdosReport, loading }) => ({
  materialPdosReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['materialPdosReport/handleSearch'],
  fetchDetailLoading: loading.effects['materialPdosReport/fetchDetail'],
  handleExportLoading: loading.effects['materialPdosReport/handleExport'],
}))
export default class MaterialPdosReport extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      rowRecord: {}, // 行记录
      fetchType: '',
      fetchDate: '', // 点击入库、出库所在列的日期
    };
  }

  componentDidMount() {
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const fieldsValue = (this.formDom && filterNullValueObject(this.formDom.getFieldsValue())) || {};
    dispatch({
      type: 'materialPdosReport/handleSearch',
      payload: {
        ...fieldsValue,
        dateFrom: isUndefined(fieldsValue.dateFrom)
          ? null
          : moment(fieldsValue.dateFrom).format(DEFAULT_DATETIME_FORMAT),
        dateTo: isUndefined(fieldsValue.dateTo)
          ? null
          : moment(fieldsValue.dateTo).format(DEFAULT_DATETIME_FORMAT),
        tenantId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 打开抽屉
  @Bind
  openDetailDrawer(flag, record, type, fetchDate) {
    const { dispatch } = this.props;
    this.setState({ visible: flag, rowRecord: record, fetchType: type, fetchDate },
      () => {
        if (flag) {
          this.fetchDetail();
        } else {
          this.setState({ rowRecord: {}, fetchType: '' });
          dispatch({
            type: 'materialPdosReport/updateState',
            payload: {
              detailList: [],
              detailPagination: {},
            },
          });
        }
      });
  }

  // 查询明细
  @Bind
  fetchDetail(fields = {}) {
    const { dispatch } = this.props;
    const { rowRecord, fetchType, fetchDate } = this.state;
    dispatch({
      type: 'materialPdosReport/fetchDetail',
      payload: {
        siteId: rowRecord.siteId,
        warehouseId: rowRecord.warehouseId,
        materialId: rowRecord.materialId,
        startTime: isUndefined(fetchDate)
          ? null
          : moment(fetchDate).format(DATETIME_MIN),
        endTime: isUndefined(rowRecord.showDate)
          ? null
          : moment(fetchDate).format(DATETIME_MAX),
        typeCode: fetchType,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind
  handleExport() {
    const { dispatch, tenantId } = this.props;
    this.formDom.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'materialPdosReport/handleExport',
          payload: {
            ...fieldsValue,
            tenantId,
            dateFrom: isUndefined(fieldsValue.dateFrom)
              ? null
              : moment(fieldsValue.dateFrom).format(DEFAULT_DATETIME_FORMAT),
            dateTo: isUndefined(fieldsValue.dateTo)
              ? null
              : moment(fieldsValue.dateTo).format(DEFAULT_DATETIME_FORMAT),
          },
        }).then(res => {
          if (res) {
            const file = new Blob(
              [res],
              { type: 'application/vnd.ms-excel' }
            );
            const fileURL = URL.createObjectURL(file);
            const fileName = '每日进销存报表.xls';
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = fileURL;
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          }
        });
      }
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      materialPdosReport: {
        list = [],
        pagination = {},
        detailList = [],
        detailPagination = {},
        col = [],
      },
      tenantId,
      fetchLoading,
      handleExportLoading,
      fetchDetailLoading,
    } = this.props;
    const { visible } = this.state;
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const journalQueryHistoryProps = {
      visible,
      loading: fetchDetailLoading,
      dataSource: detailList,
      pagination: detailPagination,
      onCancel: this.openDetailDrawer,
    };
    const columns = [
      {
        title: '站点',
        width: 90,
        dataIndex: 'siteCode',
      },
      {
        title: '站点描述',
        width: 120,
        dataIndex: 'siteName',
      },
      {
        title: '仓库',
        width: 90,
        dataIndex: 'warehouseCode',
      },
      {
        title: '仓库描述',
        width: 120,
        dataIndex: 'warehouseName',
      },
      {
        title: '物料',
        width: 90,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 120,
        dataIndex: 'materialName',
      },
    ];
    const dynamicColumns = [];
    if (col.length > 0) {
      col[0].qtyRecordDTO3List.forEach(ele => {
        dynamicColumns.push({
          title: `${moment(ele.showDate).format('YYYY-MM-DD')}`,
          width: 240,
          align: 'center',
          children: [
            {
              title: `入库`,
              dataIndex: `${moment(ele.showDate).format('YYYYMMDD')}IN`,
              align: 'center',
              width: 80,
              render: (val, record) => (
                <a onClick={() => this.openDetailDrawer(true, record, 'IN', val.split('/')[1])}>{val.split('/')[0]}</a>
              ),
            },
            {
              title: '出库',
              dataIndex: `${moment(ele.showDate).format('YYYYMMDD')}OUT`,
              align: 'center',
              width: 80,
              render: (val, record) => (
                <a onClick={() => this.openDetailDrawer(true, record, 'OUT', val.split('/')[1])}>{val.split('/')[0]}</a>
              ),
            },
            {
              title: '库存',
              dataIndex: `${moment(ele.showDate).format('YYYYMMDD')}IRQTY`,
              align: 'center',
              width: 80,
            },
          ],
        });
      });
    }
    return (
      <React.Fragment>
        <Header title="仓库物料进销存报表">
          <Button
            type="primary"
            icon='export'
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['material-pdos-report-table']}>
            <Table
              loading={fetchLoading}
              rowKey="calendarShiftId"
              dataSource={list}
              scroll={{ x: tableScrollWidth(columns) }}
              columns={columns.concat(dynamicColumns)}
              pagination={pagination}
              onChange={page => this.handleSearch(page)}
              bordered
              size='small'
            />
          </div>
          {visible && <JournalQueryHistory {...journalQueryHistoryProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
