/**
 * ProductTraceability - 产品溯源查询
 * @date: 2020/03/16 15:32:45
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Button, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import Upload from 'components/Upload';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import styles from '../index.less';

// const modelPrompt = 'tarzan.hmes.message.model.message';
@Form.create({ fieldNameProp: null })
export default class ProductionLines extends Component {

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if(onCreate) {
      onCreate();
    }
  }

  @Bind()
  handleClickJustice(value) {
    const { testRecord, resultRecord } = this.props;
    if(testRecord.standardType === 'VALUE') {
      notification.warning({
        description: '当前数据采集项为数值型，请重新选择',
      });
    } else if (value && !isEmpty(resultRecord)) {
      resultRecord.$form.setFieldsValue({
        result: value,
      });
    }
  }

  @Bind()
  handleClickRow(record) {
    const { resultRecord } = this.props;
    if (resultRecord.pqcDetailsId === record.pqcDetailsId) {
      return styles['inspectionPlatform_data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { resultRecord, onChangeResultRecord } = this.props;
        if(resultRecord.pqcDetailsId !== record.pqcDetailsId) {
          onChangeResultRecord(record);
        }
      },
    };
  }

  @Bind()
  onUploadSuccess() {
    const { testRecord, onUploadFile } = this.props;
    const attachmentUuid = this.props.form.getFieldValue('attachmentUUID');
    if(onUploadFile) {
      onUploadFile({...testRecord, attachmentUuid});
    }
  }

  @Bind()
  handleClickButton(value) {
    const { resultRecord } = this.props;
    const oldValue = isEmpty(resultRecord.$form.getFieldValue('result')) ? '' : resultRecord.$form.getFieldValue('result');
    if(!isEmpty(resultRecord) && !(isEmpty(oldValue) && value === '.') && !(oldValue.includes('.') && value === '.')) {
      resultRecord.$form.setFieldsValue({
        result: `${oldValue}${value}`,
      });
    }
  }

  @Bind()
  handleReset() {
    const { resultRecord } = this.props;
    if(!isEmpty(resultRecord)) {
      resultRecord.$form.setFieldsValue({
        result: undefined,
      });
    }
  }

  @Bind()
  handleClickDelete() {
    const { resultRecord = {} } = this.props;
    if(!isEmpty(resultRecord)) {
      const oldValue = resultRecord.$form.getFieldValue('result');
      resultRecord.$form.setFieldsValue({
        result: !isEmpty(oldValue) ? oldValue.slice(0, oldValue.length - 1) : undefined,
      });
    }
  }

  @Bind()
  handleClickEnter() {
    const { dataSource, resultRecord, onChangeResultRecord } = this.props;
    const pqcDetailsIds = dataSource.map(e => e.pqcDetailsId);
    const index = pqcDetailsIds.indexOf(resultRecord.pqcDetailsId);
    if(index + 1 < dataSource.length) {
      onChangeResultRecord(dataSource[index + 1]);
    }
  }

  @Bind()
  handleCleanLine(record) {
    const { onCleanLine, onDeleteLine } = this.props;
    if (record._status === 'create') {
      if (onCleanLine) {
        onCleanLine('resultList', 'resultPagination', 'pqcDetailsId', record);
      }
    } else {
      onDeleteLine(record);
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { loading, dataSource = [], testRecord, form: { getFieldDecorator }, pagination, onSearch, pqcInfo, resultRecord } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={isEmpty(testRecord) || pqcInfo.inspectionStatus !== 'NEW' || testRecord.standardType !== 'VALUE'}
            onClick={() => this.handleCreate()}
          />
        ),
        dataIndex: 'orderSeq',
        align: 'center',
        width: 60,
        render: (val, record) => (
          <Popconfirm
            title='是否确认删除?'
            onConfirm={() => this.handleCleanLine(record)}
          >
            <Button disabled={dataSource.length === 1} icon="minus" shape="circle" size="small" />
          </Popconfirm>
          ),
      },
      {
        title: '序列号',
        dataIndex: 'orderSeq',
        width: 60,
        render: (val, record, index) => index + 1,
      },
      {
        title: '结果值',
        dataIndex: 'result',
        width: 60,
        align: 'center',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('result', {
                initialValue: value,
              })(<Input id="inspectionPlatform_input" disabled={testRecord.standardType !== 'VALUE' || pqcInfo.inspectionStatus !== 'NEW'} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(<Input disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord)} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
    ];
    return (
      <div className={styles['test-content']}>
        <EditTable
          columns={columns}
          rowKey="pqcDetailsId"
          bordered
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          onRow={this.handleClickSelectedRows}
          scroll={{ x: tableScrollWidth(columns, 5), y: 45 }}
          rowClassName={this.handleClickRow}
          onChange={page => onSearch(page)}
        />
        <div className={styles['calculator-content']}>
          <Row>
            <Col span={6}>
              <div className={styles['calculator-btn']}>
                <Button disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord)} type="primary" onClick={() => this.handleClickJustice('OK')}>OK</Button>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['calculator-btn']}>
                <Button
                  disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord)}
                  style={{
                    backgroundColor: pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) ? '#f5f5f5' : '#D84949',
                    color: pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                  }}
                  onClick={() => this.handleClickJustice('NG')}
                >
                  NG
                </Button>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['calculator-btn']}>
                <Button disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'} icon="arrow-left" onClick={() => this.handleClickDelete()} />
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['calculator-btn']}>
                <Button disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'} onClick={() => this.handleReset()}>AC</Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(7)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      7
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(8)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      8
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(9)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      9
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(4)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      4
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(5)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      5
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(6)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      6
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(1)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      1
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(2)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      2
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(3)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      3
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <div className={styles['calculator-btn']}>
                <Button disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'} icon="enter" style={{ height: '83px' }} onClick={() => this.handleClickEnter()} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Row>
                <Col span={16}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton(0)}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      0
                    </Button>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles['calculator-btn']}>
                    <Button
                      onClick={() => this.handleClickButton('.')}
                      disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord) || testRecord.standardType !== 'VALUE'}
                    >
                      .
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: '10px' }} className="inspectionPlatform_button">
          <Button type="primary" style={{ marginRight: '10px' }}>
            图纸
          </Button>
          <Form.Item style={{ display: "inline-block"}}>
            {getFieldDecorator('attachmentUUID', {
              initialValue: testRecord.attachmentUuid,
            })(
              <Upload
                bucketName='file-mes'
                text="文件"
                disabled={pqcInfo.inspectionStatus !== 'NEW' || isEmpty(resultRecord)}
                attachmentUUID={testRecord.attachmentUuid}
                onUploadSuccess={this.onUploadSuccess}
              />
            )}
          </Form.Item>
        </div>
      </div>
    );
  }
}
