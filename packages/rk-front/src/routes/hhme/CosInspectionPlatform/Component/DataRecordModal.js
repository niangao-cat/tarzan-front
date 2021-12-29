/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isNull } from 'lodash';

import intl from 'utils/intl';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';

import styles from '../index.less';

export default class DataRecordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectedRecord: {},
    };
  }

  /**
   * 批量删除
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleDelete() {
    const { onDelete } = this.props;
    const { selectedRows } = this.state;
    if (onDelete) {
      onDelete(selectedRows, 'addDataRecordList', 'jobRecordId', 'deleteAddDataRecordList');
    }
  }

  /**
   * 校验并缓存当前数据
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleSave() {
    const { onSave } = this.props;
    if(onSave) {
      onSave();
    }
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键名称id
   * @param {object} record 当前行数据
   * @memberof ElevatorInfo
   */
  @Bind()
  handleCleanLine(record) {
    const { onCleanLine } = this.props;
    if (onCleanLine) {
      onCleanLine('addDataRecordList', 'jobRecordId', record);
    }
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof ElevatorInfo
   */
  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('addDataRecordList', 'jobRecordId', record, flag);
    }
  }

  /**
   * 新建
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('addDataRecordList', 'jobRecordId', { isSupplement: '1', groupPurpose: 'DATA' });
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
  }

  @Bind()
  handleGetData(data) {
    const { onGetData } = this.props;
    if(onGetData) {
      onGetData(data);
    }
  }

  @Bind()
  handleEnterClick(value, record, index) {
    const { onEnterClick } = this.props;
    if (onEnterClick && value) {
      record.$form.validateFields((err, val) => {
        if(!err) {
          let info = {};
          if(record._status === 'create') {
            info = { ...record, ...val, resultType: val.valueType };
          } else {
            info = { ...record, ...val };
          }
          onEnterClick(val.result, info, true, 'addDataRecordList').then(res => {
            if(res) {
              const dom = document.getElementsByClassName('data-collection-modal-result');
              if(index + 1 < dom.length ) {
                dom[index + 1].focus();
              }
            }
          });
        }
      });
    }
  }


  @Bind()
  handleClickJustice(value) {
    const { selectedRecord } = this.state;
    const { onEnterClick } = this.props;
    if(selectedRecord.resultType !== 'DECISION_VALUE') {
      notification.warning({
        description: '当前数据采集项不是判定型，请重新选择',
      });
    } else if (onEnterClick && value) {
      onEnterClick(value, selectedRecord, 'addDataRecordList');
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        if(record._status !== 'create') {
          this.setState({ selectedRecord: record });
        }
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRecord } = this.state;
    if (selectedRecord.jobRecordId === record.jobRecordId) {
      return styles['cosInspectionPlatform_data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  renderForm(record, index) {
    const val = record.result;
    const className =
      record.result ? (!isNull(record.minimumValue) && isNull(record.maximalValue) && record.result >= record.minimumValue)
      || (!isNull(record.maximalValue) && record.result <= record.maximalValue && isNull(record.minimumValue))
      || record.result === 'OK'
      || (isNull(record.maximalValue) && isNull(record.minimumValue) && record.resultType !== 'DECISION_VALUE')
      || (!isNull(record.maximalValue) && !isNull(record.minimumValue) && record.result >= record.minimumValue && record.result <= record.maximalValue)
        ? 'cosInspectionPlatform_data-between'
        : 'cosInspectionPlatform_data-out'
        : 'cosInspectionPlatform_data-null';
    return (record.resultType === 'VALUE' || (['create', 'update'].includes(record._status) && record.$form.getFieldValue('valueType') === 'VALUE')) ? (
      <Form.Item className={styles[className]}>
        {record.$form.getFieldDecorator('result', {
          initialValue: val,
          rules: [
            {
              // eslint-disable-next-line no-useless-escape
              pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
              message: '请输入数字',
            },
          ],
        })(
          <Input className="data-collection-result" onPressEnter={e => this.handleEnterClick(e.target.value, record, index)} />
        )}
      </Form.Item>
    ) : record.equipmentCategory || ['create', 'update'].includes(record._status) ? (
      <Form.Item className={styles[className]}>
        {record.$form.getFieldDecorator('result', {
          initialValue: val,
        })(
          <Input className="data-collection-result" onPressEnter={e => this.handleEnterClick(e.target.value, record, index)} />
        )}
      </Form.Item>
    ) : record.resultType === 'DECISION_VALUE' ? (
      <div className={styles[className]}>
        <Input disabled className="data-collection-modal-result" value={record.result} />
      </div>
    ) : record.result;
  }

  render() {
    const { dataSource = [], visible, loading, tenantId } = this.props;
    const { selectedRows } = this.state;
    const rowSelection = {
      columnWidth: 10,
      selectedRowKeys: selectedRows.map(e => e.jobRecordId),
      onChange: (keys, records) => {
        this.setState({ selectedRows: records });
      },
      getCheckboxProps: record => ({
        disabled: record.isSupplement !== '1',
      }),
    };
    const columns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      // {
      //   title: '位置',
      //   width: 30,
      //   dataIndex: 'position',
      // },
      {
        title: '数据项',
        width: 80,
        dataIndex: 'tagCode',
        onCell: this.cellRender,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('tagId', {
                initialValue: record.tagId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '数据采集项编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.TAG"
                  textValue={record.tagCode}
                  queryParams={{ tenantId }}
                  onChange={(val, data) => {
                    record.$form.setFieldsValue({
                      tagDescription: data.tagDescription,
                      tagCode: data.tagCode,
                      maximalValue: data.maximalValue,
                      minimumValue: data.minimumValue,
                      valueType: data.valueType,
                      uomCode: data.uomCode,
                      valueAllowMissing: data.valueAllowMissing,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
            record.tagCode
          ),
      },
      {
        title: '数据采集项描述',
        dataIndex: 'tagDescription',
        width: 120,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('tagDescription', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('tagCode', {
                  initialValue: record.tagCode,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('valueType', {
                  initialValue: record.resultType,
                })(<Input disabled />)}
              </Form.Item>
            </Fragment>
          ) : (
            value
          ),
      },
      {
        title: '下限',
        width: 30,
        dataIndex: 'minimumValue',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('minimumValue', {
                initialValue: value,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: '标准值',
        width: 40,
        dataIndex: 'standardValue',
      },
      {
        title: '上限',
        width: 30,
        dataIndex: 'maximalValue',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('maximalValue', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: '结果',
        width: 50,
        dataIndex: 'result',
        render: (val, record, index) => {
          return this.renderForm(record, index);
        },
      },
      {
        title: '单位',
        width: 60,
        dataIndex: 'uomCode',
        align: 'center',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomCode', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            record.uomCode
          ),
      },
      {
        title: '允许缺失值',
        width: 60,
        dataIndex: 'valueAllowMissing',
        align: 'center',
        render: (val, record) => ['create', 'update'].includes(record._status) && record.isEdit ? (
          <Form.Item>
            {record.$form.getFieldDecorator('valueAllowMissing', {
              initialValue: val === 'Y',
            })(<Checkbox disabled />)}
          </Form.Item>
        ) : (
          <Checkbox disabled checked={val === 'Y'} />
        ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 60,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && record.isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: '获取',
        width: 30,
        dataIndex: 'result',
        align: 'center',
        render: (val, record) => ['EC-0003', 'EC-0027', 'EC-0032'].includes(record.equipmentCategory) ? (
          <a onClick={() => this.handleGetData(record)}>
            获取
          </a>
        ) : (''),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 40,
        align: 'center',
        render: (value, record) =>
          record._status === 'create' ? (
            <a onClick={() => this.handleCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' && record.isEdit ? (
            <a onClick={() => this.handleEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : record.isSupplement === '1' ? ( // 非补充数据采集不允许编辑
            <a onClick={() => this.handleEditLine( record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          ) : '',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1100}
        title='补充数据采集'
        visible={visible}
        onCancel={this.handleCloseModal}
        footer={(
          <Fragment>
            <Button
              className={styles['cosInspectionPlatform_data-button-ok']}
              onClick={() => this.handleClickJustice('OK')}
            >
              OK
            </Button>
            <Button
              style={{ marginRight: '12px'}}
              className={styles['cosInspectionPlatform_data-button-ng']}
              onClick={() => this.handleClickJustice('NG')}
            >
              NG
            </Button>
            <Button
              style={{ marginRight: '12px'}}
              onClick={() => this.handleCloseModal()}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => this.handleSave()}
            >
              确定
            </Button>
          </Fragment>
        )}
      >
        <Fragment>
          <Button
            type="primary"
            style={{
                marginRight: 8,
                marginBottom: 12,
              }}
            onClick={this.handleCreate}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            style={{
                marginRight: 8,
                marginBottom: 12,
              }}
            onClick={this.handleDelete}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
        </Fragment>
        <div className={styles['cosInspectionPlatform_head-table']}>
          <EditTable
            scroll={{
                x: tableScrollWidth(columns),
              }}
            bordered
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            rowKey='jobRecordId'
            dataSource={dataSource}
            pagination={false}
            onRow={this.handleClickSelectedRows}
            rowClassName={this.handleClickRow}
          />
        </div>
      </Modal>
    );
  }
}
