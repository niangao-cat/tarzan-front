import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';
import styles from './index.less';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch, downloadLogFile } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.areaName`).d('制造部'),
        width: 60,
        dataIndex: 'areaName',
      },
      {
        title: intl.get(`${commonModelPrompt}.workshopName`).d('车间'),
        width: 80,
        dataIndex: 'workshopName',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('产线'),
        width: 80,
        dataIndex: 'prodLineName',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellName`).d('工位'),
        width: 60,
        dataIndex: 'workcellName',
      },
      {
        title: intl.get(`${commonModelPrompt}.shiftName`).d('班组'),
        width: 80,
        dataIndex: 'shiftName',
      },
      {
        title: intl.get(`${commonModelPrompt}.shiftCode`).d('班次'),
        width: 40,
        dataIndex: 'shiftCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('异常产品所属工单'),
        width: 120,
        dataIndex: 'workOrderNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.identification`).d('异常产品序列号'),
        dataIndex: 'identification',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('异常类型'),
        width: 60,
        dataIndex: 'exceptionTypeName',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
        width: 100,
        dataIndex: 'exceptionName',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('异常物料'),
        width: 110,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('异常物料条码'),
        width: 130,
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.assetEncoding`).d('异常设备'),
        width: 80,
        dataIndex: 'assetEncoding',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionRemark`).d('异常备注'),
        width: 120,
        dataIndex: 'exceptionRemark',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionStatus`).d('异常状态'),
        width: 80,
        dataIndex: 'exceptionStatusName',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionLevel`).d('异常等级'),
        dataIndex: 'exceptionLevel',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.attachmentName`).d('附件名称'),
        width: 180,
        dataIndex: 'attachmentName',
        render: (val, record) => (
          <span className="action-link">
            {(record.fileList !== null) && (
              record.fileList.map(function download (item){
                return (
                  <div>
                    <a onClick={() => downloadLogFile(item)}>
                      {item.fileName}
                    </a>
                  </div>
                );})
            )}
          </span>
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.createdByName`).d('发起人'),
        width: 60,
        dataIndex: 'createdByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('发起时间'),
        width: 150,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.respondedBy`).d('响应人'),
        width: 60,
        dataIndex: 'respondedByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.respondTime`).d('响应时间'),
        width: 150,
        dataIndex: 'respondTime',
      },
      {
        title: intl.get(`${commonModelPrompt}.respondRemark`).d('响应备注'),
        width: 120,
        dataIndex: 'respondRemark',
      },
      {
        title: intl.get(`${commonModelPrompt}.closedBy`).d('关闭人'),
        width: 60,
        dataIndex: 'closedByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.closeTime`).d('关闭时间'),
        dataIndex: 'closeTime',
        width: 150,
      },
    ];

    return (
      <div className={styles['head-table']}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          loading={loading}
          rowKey="exceptionId"
        />
      </div>
    );
  }
}
