/*
 * @Description: 资质列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-15 13:49:52
 */
import React, { Component } from 'react';
import { Form, Button, Table } from 'hzero-ui';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limit = value => {
    return value.replace(/^(0+)|[^\d]+/g, '');
  };

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      fetchQualityLoadingSave,
      onSearch,
      addQuality,
      delQuality,
      onChange,
      selectedRowKeys,
      qualityListSave=[],
      qualityPaginationSave={},
      canEdit,
      operationId,
    } = this.props;
    const columns = [
      {
        title: '资质类型',
        dataIndex: 'qualityTypeMeaning',
        align: 'center',
      },
      {
        title: '资质编码',
        dataIndex: 'qualityCode',
        align: 'center',
      },
      {
        title: '资质名称',
        dataIndex: 'qualityName',
        align: 'center',
      },
      {
        title: '资质备注',
        dataIndex: 'remark',
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <div style={{ textAlign: 'end', marginBottom: '16px' }}>
          <Button style={{ marginRight: '10px' }} onClick={delQuality} disabled={!canEdit|| operationId === 'create'}>删除资质</Button>
          <Button
            onClick={addQuality}
            disabled={!canEdit|| operationId === 'create'}
          >
            维护资质
          </Button>
        </div>
        <Table
          bordered
          rowKey="letterId"
          columns={columns}
          loading={fetchQualityLoadingSave}
          dataSource={qualityListSave}
          pagination={qualityPaginationSave}
          onChange={page => onSearch(page)}
          rowSelection={{
            selectedRowKeys,
            onChange,
          }}
        />
      </React.Fragment>
    );
  }
}
export default ListTable;
