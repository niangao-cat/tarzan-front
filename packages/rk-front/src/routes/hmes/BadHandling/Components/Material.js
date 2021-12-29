/*
 * @Description: 材料不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-29 20:21:00
 */

import React, { Component } from 'react';
import { Form, Input, Button, Radio, Row, Col, Tooltip, InputNumber, Popconfirm } from 'hzero-ui';
import UploadModal from 'components/Upload/index';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import EditTable from 'components/EditTable';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import SecondTitle from './SecondTitle';
import MultipleLov from './MultipleLov';
import { limitDecimals } from '@/utils/utils';
import styles from './index.less';
// import add from '@/assets/add.png';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create({ fieldNameProp: null })
export default class Material extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  // 不良类型-更多
  @Bind()
  moreMaterialBad() {
    const { moreBadType } = this.props;
    moreBadType(true, 'MATERIAL');
  }


  /**
   * @description: 提交工序不良
   * @param {type} params
   */
  @Bind()
  materialBadCommit() {
    const { materialBadCommit, form } = this.props;
    if (materialBadCommit) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          materialBadCommit(values);
        }
      });
    }
  }

  @Bind()
  handleRenderRow(record) {
    if (record.color === 'Green') {
      return styles['badhanding_row-color'];
    }
  }


  render() {
    const {
      materialBadTypeData = {},
      form: { getFieldDecorator, getFieldValue },
      dataSource = [],
      badType = {},
      selectedRowKeys = [],
      onSelectRow,
      clearMoreBadType,
      onSearch,
      materialBadCommitLoading,
      changeApplyQty,
      handleApplicationDrawer,
      handleCosLocationModal,
      handleCheckBarCodeLoading,
    } = this.props;
    const {
      hmeNcDisposePlatformDTO8List = [],
    } = badType;
    const columns = [
      {
        title: '组件料号',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 90,
      },
      {
        title: '条码号',
        dataIndex: 'materialLotCode',
        width: 140,
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 90,
      },
      {
        title: '投入',
        dataIndex: 'releaseQty',
        width: 50,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a onClick={() => handleApplicationDrawer(true, record, index)} disabled={!record.detailList || record.detailList.length === 0}>
              {val}
            </a>
          </span>
        ),
      },
      {
        title: '报废',
        dataIndex: 'scrapQty',
        width: 50,
        align: 'center',
      },
      {
        title: '待审核',
        dataIndex: 'waitAuditQty',
        width: 50,
        align: 'center',
      },
      {
        title: '申请',
        dataIndex: 'applyQty',
        width: 70,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.applyQty,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.primaryUomQty < value || value === 0) {
                        callback(
                          value === 0 ? '不可为0' : `申请数应小于等于 ${record.primaryUomQty}`
                        );
                        changeApplyQty(value, index, record, true);
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`}
                  parser={value => limitDecimals(value, 3)}
                  disabled={record.detailList && record.detailList.length > 0}
                  min={0}
                  onChange={value => changeApplyQty(value, index, record, false)}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
    ];
    return (
      <Row>
        <Col span={17} style={{ width: '68.833333%' }} className={styles['material-table-list']}>
          <EditTable
            columns={columns}
            dataSource={dataSource}
            rowKey="rowkeyUuid"
            bordered
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectRow,
              getCheckboxProps: record => ({
                disabled: record.applyQty === 0 ? false : !record.applyQty || record.selected && record.selected,
              }),
            }}
            rowClassName={this.handleRenderRow}
            onChange={page => onSearch(page)}
            scroll={{ y: 430 }}
          />
          <Button
            type="primary"
            onClick={() => handleCosLocationModal(true)}
            disabled={selectedRowKeys.length !== 1}
            loading={handleCheckBarCodeLoading}
            style={{ marginTop: '8px' }}
          >
            芯片装载信息记录
          </Button>
        </Col>
        <Col span={7} style={{ marginLeft: '8px', width: '30.16%' }}>
          <Form className={styles['material-bad-form']}>
            <SecondTitle titleValue="不良代码组" />
            <div style={{ marginTop: '5px' }}>
              <Form.Item>{getFieldDecorator('ncCodeId', {
                rules: [
                  {
                    required: true,
                    message: '不良代码不能为空',
                  },
                ],
              })(
                <Radio.Group buttonStyle="solid">
                  {hmeNcDisposePlatformDTO8List.map((item) => {
                    return (
                      <Radio.Button onClick={() => clearMoreBadType('MATERIAL')} style={{ margin: '0px 5px 5px 0px' }} value={item.ncCodeId}>
                        <div className={styles['bad-type-radio']}>
                          <Tooltip title={item.description}>{item.description}</Tooltip>
                        </div>
                      </Radio.Button>
                    );
                  })}
                  <Radio.Button onClick={() => this.moreMaterialBad()} style={{ margin: '0px 5px 5px 0px' }} value={materialBadTypeData.ncCodeId}>
                    <div className={styles['bad-type-radio']}>更多</div>
                  </Radio.Button>
                </Radio.Group>
              )}
              </Form.Item>
            </div>
            <SecondTitle titleValue="不良代码" />
            <div style={{ marginTop: '5px' }}>
              <Form.Item>{getFieldDecorator('childNcCodeIdList', {
                rules: [
                  {
                    required: true,
                    message: '不良代码不能为空',
                  },
                ],
              })(
                <MultipleLov
                  disabled={!getFieldValue('ncCodeId')}
                  code="HME.NC_RECORD_LOV"
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                    ncObjectId: getFieldValue('ncCodeId'),
                  }}
                />
              )}
              </Form.Item>
            </div>
            <SecondTitle titleValue="备注" />
            <Form.Item>{getFieldDecorator('comments')(<TextArea />)}</Form.Item>
            <SecondTitle titleValue="附件" />
            <div className={styles['attachment-button']}>
              <Form.Item>{getFieldDecorator('uuid')(
                <UploadModal
                  bucketName="file-mes"
                />)}
              </Form.Item>
            </div>
            {/* <Form.Item>{getFieldDecorator('freeze')(
              <Switch
                checkedValue="Y"
                unCheckedValue="N"
                checkedChildren="冻结"
                unCheckedChildren="解冻"
                size="small"
              />
            )}
            </Form.Item> */}
            <Form.Item>{getFieldDecorator('flag')(
              <RadioGroup>
                <Radio value='1'>直接报废</Radio>
                <Radio value='2'>通知工艺判定</Radio>
              </RadioGroup>
            )}
            </Form.Item>
            <Row>
              <Col style={{ textAlign: 'end' }}>
                <Button
                  style={{ marginRight: '5px' }}
                  onClick={() => this.handleFormReset()}
                >
                  重置
                </Button>
                {getFieldValue('flag') === '1' ? (
                  <Popconfirm
                    title='是否确认直接报废'
                    onConfirm={() => this.materialBadCommit()}
                  >
                    <Button
                      type="primary"
                      loading={materialBadCommitLoading}
                    >
                      提交
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    type="primary"
                    loading={materialBadCommitLoading}
                    onClick={() => this.materialBadCommit()}
                  >
                    提交
                  </Button>
                  )}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}
