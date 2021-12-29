/*
 * @Description: 行明细数据
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */
import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

@connect(({ equipmentInspectionMaintenance }) => ({
  equipmentInspectionMaintenance,
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTableDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
        tenantId,
        loading,
        dataSource,
        onSearch,
        pagination,
        canEdit,
        handleCreatedetail,
        deleteDetailData,
        handleEditDetail,
        deleteDetailDataLoading,
        selectedLine,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={selectedLine.length === 0}
            onClick={() => handleCreatedetail()}
          />
        ),
        align: 'center',
        width: 50,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => deleteDetailData(record, index)}
            >
              <Button loading={deleteDetailDataLoading} icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '数据收集组编码',
        dataIndex: 'tagGroupCode',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagGroupId`, {
                  initialValue: record.tagGroupId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                      name: '检数据收集组编码',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.TAG_GROUP"
                    queryParams={{ tenantId }}
                    textValue={record.tagGroupCode}
                    onChange={(value, vals) => {
                      record.$form.setFieldsValue({
                        tagGroupDescription: vals.tagGroupDescription,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '数据收集组描述',
        dataIndex: 'tagGroupDescription',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupDescription`, {
                initialValue: record.tagGroupDescription,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => deleteDetailData(record, index)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditDetail(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <a onClick={() => handleEditDetail(record, true)}>编辑</a>
              ),
        fixed: 'right',
        width: 100,
      },
    ];
    return (
      <div className={styles['head-table']}>
        <EditTable
          bordered
          rowKey="ssnInspectDetailId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          onChange={page => onSearch(page)}
        />
      </div>
    );
  }
}
export default ListTableDetail;
