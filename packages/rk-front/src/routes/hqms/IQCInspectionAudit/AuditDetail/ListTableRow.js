import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import UploadModal from 'components/Upload/index';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const {
      loading,
      onSearch,
      selectedHeadKeys,
      onSelectTableRow,
      iqcLine,
      iqcLinePagination,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.number`).d('序号'),
        width: 65,
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '检验项类别',
        width: 110,
        dataIndex: 'inspectionTypeMeaning',
        align: 'center',
      },
      {
        title: '检验项',
        dataIndex: 'inspection',
        width: 85,
        align: 'center',
      },
      {
        title: '缺陷等级',
        dataIndex: 'defectLevelsMeaning',
        width: 95,
        align: 'center',
      },
      {
        title: '抽样方案类型',
        dataIndex: 'sampleType',
        width: 105,
        align: 'center',
      },
      {
        title: '抽样数量',
        width: 85,
        dataIndex: 'sampleSize',
        align: 'center',
      },
      {
        title: 'AC/RE',
        dataIndex: 'acAndRe',
        width: 80,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        width: 95,
        align: 'center',
      },
      {
        title: '规格范围',
        dataIndex: 'standardRange',
        width: 85,
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'standardUomCode',
        width: 85,
        align: 'center',
      },
      {
        title: '不良数',
        dataIndex: 'ngQty',
        width: 75,
        align: 'center',
      },
      {
        title: '合格数',
        dataIndex: 'okQty',
        width: 75,
        align: 'center',
      },
      {
        title: '结论',
        dataIndex: 'inspectionResult',
        width: 60,
        align: 'center',
      },
      {
        title: '附件',
        dataIndex: 'remark',
        width: 110,
        align: 'center',
        render: (_text, record) => {
          return (
            <UploadModal
              bucketName="file-mes"
              attachmentUUID={record.attachmentUuid}
              viewOnly
              btnText="附件"
              icon="paper-clip"
            />
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={iqcLine}
        columns={columns}
        pagination={iqcLinePagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          onChange: onSelectTableRow,
          fixed: 'left',
        }}
      />
    );
  }
}

export default ListTableRow;
