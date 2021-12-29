/*
 * @Description: 退库检测
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-12 23:46:46
 * @LastEditTime: 2021-03-02 11:34:22
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Checkbox, Tooltip } from 'hzero-ui';
import EditTable from 'components/EditTable';
import UploadModal from 'components/Upload/index';
import { tableScrollWidth } from 'utils/utils';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 构建每行三个勾选框的数据
  @Bind
  renderCheckBox(record) {
    const cols = [];
    for (let i = 0; i <= record.tagList.length - 1;) {
      const element = [];
      let j = 0;
      for (; j < 3 && i <= record.tagList.length - 1; j++, i++) {
        element.push(
          <Tooltip title={record.tagList[i].tagDescription}>
            <Checkbox
              value={record.tagList[i].tagId}
              style={{ width: '31%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left' }}
            >
              {record.tagList[i].tagDescription}
            </Checkbox>
          </Tooltip>
        );
      }
      cols.push(<Col>{element}</Col>);
    }
    return <Row>{cols}</Row>;
  }


  // 渲染数组中的数据，使其每个后面跟一个逗号
  @Bind()
  renderResult(record) {
    // const arr = [];
    // record.tagDescList.forEach(item => {
    //   arr.push(`${item}, `);
    // });
    // return arr;
    return (
      <Checkbox.Group defaultValue={record.tagIdList} disabled>
        {
          this.renderCheckBox(record)
        }
      </Checkbox.Group>
    );
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      dataSource,
      handleEditData,
      info,
    } = this.props;
    const columns = [
      {
        title: '检验项目',
        dataIndex: 'tagGroupDescription',
        width: 120,
      },
      {
        title: '检验结果',
        dataIndex: 'result',
        width: 260,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagIdList`, {
                initialValue: record.tagIdList.length > 0 ? record.tagIdList : record.result,
              })(
                record.tagList.length > 0 ? (
                  <Checkbox.Group style={{ width: '100%' }}>
                    {
                      this.renderCheckBox(record)
                    }
                  </Checkbox.Group>
                ) : <Input />
              )}
            </Form.Item>
          ) : (
              record.tagList.length > 0 ? this.renderResult(record) : (
                <Tooltip title={val}>
                  <div style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{record.result}</div>
                </Tooltip>
            )),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 260,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: record.remark,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
            <Tooltip title={val}>
              <div style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{val}</div>
            </Tooltip>
            ),
      },
      {
        title: '图像上传',
        dataIndex: 'attachmentUuid',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`attachmentUuid`, {
                initialValue: record.attachmentUuid,
              })(
                <UploadModal
                  bucketName="file-mes"
                  attachmentUUID={record.attachmentUuid}
                />
              )}
            </Form.Item>
          ) : (
            <UploadModal
              bucketName="file-mes"
              attachmentUUID={record.attachmentUuid}
              viewOnly
            />
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => handleEditData(record, true)} disabled={info.receiveStatus!=='RECEIVE'}>
                编辑
              </a>
            )}
            {record._status === 'update' && (
              <a onClick={() => handleEditData(record, false)}>
                取消
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="serviceDataRecordId"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={false}
      />
    );
  }
}
export default ListTable;
