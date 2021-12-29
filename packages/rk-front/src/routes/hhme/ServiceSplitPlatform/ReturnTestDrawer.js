/*
 * @Description: 退库检测查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-05 19:39:28
 * @LastEditTime: 2021-01-20 15:24:07
 */

import React, { PureComponent } from 'react';
import UploadModal from 'components/Upload/index';
import { Bind } from 'lodash-decorators';
import { Modal, Form, Table, Input, Checkbox, Row, Col, Tooltip } from 'hzero-ui';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

@Form.create({ fieldNameProp: null })
export default class ReturnTestDrawer extends PureComponent {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
  }

  @Bind()
  onChange(e) {
    const { onSearch } = this.props;
    onSearch(e.target.checked);
  }

  render() {
    const {
      visible,
      onCancel,
      loading,
      form,
      snNum,
      dataSource,
      onSearch,
    } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '接收批次',
        width: 120,
        dataIndex: 'batchNumber',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}`);
          const first = productionList.indexOf(`${record.batchNumber}`);
          const all = dataSource.filter(e => `${e.batchNumber}` === `${record.batchNumber}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '检验项目编码',
        width: 140,
        dataIndex: 'tagGroupCode',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '检验项目描述',
        width: 140,
        dataIndex: 'tagGroupDescription',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '检验结果',
        width: 140,
        dataIndex: 'tag',
        render: (val, record) => {
          return (
            <Tooltip title={val}>
              <Checkbox
                checkedValue='Y'
                unCheckedValue='N'
                disabled
                value={record.result}
                style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {val}
              </Checkbox>
            </Tooltip>
          );
        },
      },
      {
        title: '备注',
        width: 100,
        dataIndex: 'remark',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: (
              <Tooltip title={val}>
                <div style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{val}</div>
              </Tooltip>
            ),
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '附件',
        width: 120,
        dataIndex: 'itemGroupDescription',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: <UploadModal
              bucketName="file-mes"
              attachmentUUID={record.attachmentUuid}
              viewOnly
              btnText="附件"
              icon="paper-clip"
            />,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          ;
          return obj;
        },
      },
      {
        title: '最后更新人',
        width: 110,
        dataIndex: 'lastUpdatedByName',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: '最后更新时间',
        width: 140,
        dataIndex: 'lastUpdateDate',
        render: (val, record, index) => {
          const productionList = dataSource.map(e => `${e.batchNumber}${e.tagGroupCode}`);
          const first = productionList.indexOf(`${record.batchNumber}${record.tagGroupCode}`);
          const all = dataSource.filter(e => `${e.batchNumber}${e.tagGroupCode}` === `${record.batchNumber}${record.tagGroupCode}`).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1200}
        title='退库检测查询'
        visible={visible}
        onCancel={() => onCancel(false)}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label='组件SN' labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('snNum', {
                  initialValue: snNum,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label='是否展示所有检测历史' labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('allFlag', {})(
                  <Checkbox checkedValue='Y' unCheckedValue='N' onChange={this.onChange} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 450 }}
          onChange={page => onSearch(page)}
          loading={loading}
          rowKey="materialId2"
        />
      </Modal>
    );
  }
}
