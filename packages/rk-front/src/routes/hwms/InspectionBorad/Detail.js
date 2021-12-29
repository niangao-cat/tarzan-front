/*
 * @Description: 明细
 * @version: 0.1.0
 * @Author: ywj
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: ywj
 * @LastEditTime: 2020-09-20 16:06:05
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import Table from 'components/EditTable';
import { Bind } from 'lodash-decorators';
// import ExcelExport from 'components/ExcelExport';
import { filterNullValueObject } from 'utils/utils';
@Form.create({ fieldNameProp: null })
export default class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}


  // 导出接口传参
  @Bind()
  handleGetFormValue() {
    const { record } = this.props;
    return filterNullValueObject({ ...record });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { visible, dataSource, pagination, fetchLoading, onColseDetail, onSearch } = this.props;

    const columns = [
      {
        title: '车间',
        dataIndex: 'areaName',
        width: 170,
        align: 'center',
      },
      {
        title: '工序',
        dataIndex: 'processName',
        width: 120,
        align: 'center',
      },
      {
        title: '检验员',
        dataIndex: 'lastUpdatedByName',
        width: 120,
        align: 'center',
      },
      {
        title: '问题点',
        dataIndex: 'attribute1',
        width: 120,
        align: 'center',
      },
      {
        title: '检验时间',
        dataIndex: 'inspectionFinishDate',
        width: 170,
        align: 'center',
      },
    ];

    return (
      <Modal
        width={1200}
        visible={visible}
        title='明细'
        // title={<ExcelExport
        //   exportAsync
        //   requestUrl={`/mes/v1/${tenantId}/qms-pqc-report/detail/excel-export`} // 路径
        //   otherButtonProps={{ type: 'primary' }}
        //   queryParams={this.handleGetFormValue()}
        // />}
        onCancel={() =>onColseDetail()}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <Table
          loading={fetchLoading}
          rowKey="detailId"
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
