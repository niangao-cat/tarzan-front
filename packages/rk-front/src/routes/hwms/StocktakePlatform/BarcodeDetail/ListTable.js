import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

import styles from '../index.less';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadTable extends React.Component {

  @Bind()
  handleClickRow(record) {
    if (record.duplicateFlag === 'Y') {
      return styles['duplicate-rows'];
    } else {
      return '';
    }
  }


  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.stocktakeNum`).d('盘点单号'),
        width: 140,
        align: 'center',
        dataIndex: 'stocktakeNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('实物条码'),
        width: 140,
        align: 'center',
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.stocktakeNum`).d('是否有效'),
        width: 140,
        align: 'center',
        dataIndex: 'materialLotEnableFlag',
        render: (val) => val === 'Y' ? '是' : '否',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('条码状态'),
        width: 100,
        align: 'center',
        dataIndex: 'materialLotStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 120,
        align: 'center',
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('物料版本'),
        width: 80,
        align: 'center',
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 80,
        align: 'center',
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.currentQty`).d('账面数量'),
        width: 120,
        align: 'center',
        dataIndex: 'currentQuantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.recountQuantity`).d('初盘数量'),
        width: 80,
        align: 'center',
        dataIndex: 'firstcountQuantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('复盘数量'),
        dataIndex: 'recountQuantity',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('差异数量'),
        dataIndex: 'differentQuantity',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('单位'),
        dataIndex: 'uomCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('账面货位'),
        dataIndex: 'locatorCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('初盘货位'),
        dataIndex: 'firstcountLocatorCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('复盘货位'),
        dataIndex: 'recountLocatorCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('容器条码'),
        dataIndex: 'containerCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        dataIndex: 'lotCode',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('质量状态'),
        dataIndex: 'qualityStatusMeaning',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('初盘备注'),
        dataIndex: 'firstcountRemark',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('初盘人'),
        dataIndex: 'firstcountByName',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('初盘时间'),
        dataIndex: 'firstcountDate',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('复盘备注'),
        dataIndex: 'recountRemark',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('复盘人'),
        dataIndex: 'recountByName',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.container`).d('复盘时间'),
        dataIndex: 'recountDate',
        align: 'center',
        width: 120,
      },
      // {
      //   title: intl.get(`${commonModelPrompt}.demandTime`).d('调整人'),
      //   width: 80,
      //   align: 'center',
      //   dataIndex: 'adjustByName',
      // },
      // {
      //   title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('调整时间'),
      //   dataIndex: 'adjustDate',
      //   align: 'center',
      //   width: 120,
      // },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        rowClassName={this.handleClickRow}
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
