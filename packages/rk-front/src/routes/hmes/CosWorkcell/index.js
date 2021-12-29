/*
 * @Description: cos工位加工汇总表
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-05 10:25:46
 * @LastEditTime: 2020-01-06 13:47:10
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table} from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT} from 'utils/constants';
import { isEmpty, isUndefined } from 'lodash';
import ExcelExport from '@/components/ExcelExport';
import FilterForm from './FilterForm';

@connect(({ cosWorkcell, loading }) => ({
  cosWorkcell,
  tenantId: getCurrentOrganizationId(),
  fetchCosWorkcellLoading: loading.effects['cosWorkcell/fetchCosWorkcell'],
}))
export default class CosWorkcell extends Component {

  constructor(props) {
    super(props);
    this.initData();
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
   // 查询独立值集
    dispatch({
      type: 'cosWorkcell/init',
      payload: {
        tenantId,
      },
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosWorkcell/updateState',
      payload: {
        reportData: [],
        reportDataPagination: {},
      },
    });
  }

  @Bind
  fetchCosWorkcell(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = this.handleGetFormValue();
    if(filterValues) {
      dispatch({
        type: 'cosWorkcell/fetchCosWorkcell',
        payload: {
          ...filterValues,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  // 数据导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { creationDateFrom, creationDateTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            creationDateFrom: isUndefined(creationDateFrom)
                ? null
                : `${moment(creationDateFrom).format(DEFAULT_DATE_FORMAT) } 00:00:00`,
            creationDateTo: isUndefined(creationDateTo)
              ? null
              : `${moment(creationDateTo).format(DEFAULT_DATE_FORMAT) } 23:59:29`,
          });
        }
      });
    }
    return queryParams;
  }

  // 渲染 界面布局
  render() {
    const {
      fetchCosWorkcellLoading,
      tenantId,
      cosWorkcell: { reportData = [], reportDataPagination = {}, cosTypeMap = [], defaultDate = []},
    } = this.props;
    const filterFormProps = {
      defaultDate,
      cosTypeMap,
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetchCosWorkcell,
    };
    const columns = [
      {
        title: '工单',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 150,
      },
      {
        title: '版本描述',
        dataIndex: 'productionVersionDescription',
        width: 150,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '工单量',
        dataIndex: 'woQty',
        width: 150,
      },
      {
        title: 'WAFER',
        dataIndex: 'wafer',
        width: 150,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 150,
      },
      {
        title: 'WAFER来料总数',
        dataIndex: 'waferNum',
        width: 150,
      },
      {
        title: '加工数量',
        dataIndex: 'snQty',
        width: 150,
      },
      {
        title: '合格芯片数',
        dataIndex: 'okQty',
        width: 150,
      },
      {
        title: '不良芯片数',
        dataIndex: 'ngQty',
        width: 150,
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 150,
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 150,
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: 150,
      },
      {
        title: '工序描述',
        dataIndex: 'workcellProcessName',
        width: 150,
      },
      {
        title: '工段描述',
        dataIndex: 'workcellLineName',
        width: 150,
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineCode',
        width: 150,
      },
      {
        title: '时间',
        dataIndex: 'creationDate',
        width: 150,
      },
      {
        title: '工位设备',
        dataIndex: 'equipment',
        width: 150,
      },
      {
        title: '工艺编码',
        dataIndex: 'operationCode',
        width: 150,
      },
      {
        title: '工艺描述',
        dataIndex: 'operationName',
        width: 150,
      },
    ];
    return (
      <React.Fragment>
        <Header title='cos工位加工汇总报表'>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${tenantId}/cos-workcell-summary/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS工位加工汇总报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={reportData}
            columns={columns}
            loading={fetchCosWorkcellLoading}
            pagination={reportDataPagination}
            onChange={page => this.fetchCosWorkcell(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}
