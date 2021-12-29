/*
 * @Description: 总需求数量明细
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-31 15:34:43
 * @LastEditTime: 2020-08-31 15:49:20
 */
import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { Table } from 'choerodon-ui';

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



  /**
   * render
   * @returns React.element
   */
  render() {
    // eslint-disable-next-line no-empty-pattern
    const {
    } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrder',
        width: 100,
        align: 'left',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'left',
      },
      {
        title: '主键需求数',
        dataIndex: 'dispatchQty',
        width: 100,
        align: 'left',
      },
      {
        title: '标准用量',
        dataIndex: 'componentQty',
        width: 100,
        align: 'center',
      },
      {
        title: '需求数量',
        dataIndex: 'qty',
        align: 'left',
        width: 100,
      },
      {
        title: '是否全局替代',
        dataIndex: 'enableReplaceFlag',
        width: 100,
      },
      {
        title: '配送单号',
        dataIndex: 'distributionNum',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <Header title="总需求数量明细" />
        <Content>
          <div className="haps-c7n-table">
            <Table
              columns={columns}
              dataSource={[]}
              size="small"
              filterBar={false}
              highLightRow={false}
              pagination={false}
              bordered
              // scroll={{ y: defaultTableHeight, x: tableScrollWidth(this.renderColumns(columns)) }}
            />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
