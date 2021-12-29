import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { tableScrollWidth, getCurrentLanguage, getDateTimeFormat } from 'utils/utils';

class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materialFlag: false, // 选择的物料编码关联的供应商编码是否必输
    };
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      tenantId,
      statusMap,
      enableMap,
      qualityStatusMap,
      siteMap,
      onSearch,
      onEditLine,
    } = this.props;
    const { materialFlag = false } = this.state;
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('实物条码'),
        dataIndex: 'materialLotCode',
        width: 240,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialLotCode', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialLotCode`).d('实物条码'),
                    }),
                  },
                ],
              })(<Input trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
        dataIndex: 'enableFlagMeaning',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enableFlag', {
                initialValue: record.enableFlag,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('status', {
                initialValue: record.status,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {statusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
        dataIndex: 'qualityStatusMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('qualityStatus', {
                initialValue: record.qualityStatus,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {qualityStatusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 160,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.materialId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.MATERIAL"
                  textValue={record.materialCode}
                  queryParams={{ tenantId, local: getCurrentLanguage() }}
                  onChange={(value, records) => {
                    record.$form.setFieldsValue({
                      materialName: !isEmpty(records) ? records.materialName : undefined,
                      supplierId: undefined,
                      supplierName: undefined,
                      gradeCode: undefined,
                      colorBin: undefined,
                      lightBin: undefined,
                      voltageBin: undefined,
                      materialEnableFlag: records.enableFlag === 'Y',
                      materialId: !isEmpty(records) ? records.materialId : undefined,
                    });
                    this.setState({ materialFlag: records.enableFlag === 'Y' });
                  }}
                />
              )}
              {record.$form.getFieldDecorator(`materialEnableFlag`, {
                initialValue: record.materialEnableFlag === 'Y' || false,
              })}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialName', {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 150,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: record.materialVersion,
                rules: [{}],
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 150,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('supplierId', {
                initialValue: record.supplierId,
                rules: [
                  {
                    required: record.$form.getFieldValue('materialEnableFlag') || materialFlag,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="Z.SUPPLIER"
                  queryParams={{
                    tenantId,
                    materialId:
                      record.$form.getFieldValue('materialEnableFlag') || materialFlag
                        ? record.$form.getFieldValue('materialId')
                        : null,
                  }}
                  textValue={record.supplierCode}
                  onChange={(val, records) => {
                    record.$form.setFieldsValue({
                      supplierName: isEmpty(records) ? undefined : records.supplierName,
                      gradeCode: undefined,
                      colorBin: undefined,
                      lightBin: undefined,
                      voltageBin: undefined,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商描述'),
        dataIndex: 'supplierName',
        width: 200,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('supplierName', {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      // {
      //   title: intl.get(`${modelPrompt}.gradeCode`).d('等级编码'),
      //   dataIndex: 'gradeCode',
      //   width: 150,
      //   render: (val, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`gradeCode`, {
      //           initialValue: record.gradeCode,
      //           rules: [
      //             {
      //               required: record.$form.getFieldValue('materialEnableFlag') || materialFlag,
      //               message: intl.get('hzero.common.validation.notNull', {
      //                 name: intl.get(`${modelPrompt}.gradeCode`).d('等级编码'),
      //               }),
      //             },
      //           ],
      //         })(
      //           <Lov
      //             code="Z_MATERIAL_BIN"
      //             textValue={record.gradeCode}
      //             queryParams={{
      //               tenantId,
      //               materialId: record.$form.getFieldValue('materialId'),
      //               supplierId: record.$form.getFieldValue('supplierId'),
      //             }}
      //             disabled={
      //               !(
      //                 (record.$form.getFieldValue('materialEnableFlag') || materialFlag) &&
      //                 record.$form.getFieldValue('supplierId')
      //               )
      //             }
      //             onChange={(value, records) => {
      //               if (!isEmpty(records)) {
      //                 record.$form.setFieldsValue({
      //                   colorBin: records.colorBin,
      //                   lightBin: records.lightBin,
      //                   voltageBin: records.voltageBin,
      //                 });
      //               } else {
      //                 record.$form.setFieldsValue({
      //                   colorBin: undefined,
      //                   lightBin: undefined,
      //                   voltageBin: undefined,
      //                 });
      //               }
      //             }}
      //           />
      //         )}
      //       </Form.Item>
      //     ) : (
      //       val
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.colorBin`).d('色温bin'),
      //   dataIndex: 'colorBin',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('colorBin', {
      //           initialValue: value,
      //         })(<Input disabled />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.lightBin`).d('亮度bin'),
      //   dataIndex: 'lightBin',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('lightBin', {
      //           initialValue: value,
      //         })(<Input disabled />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.voltageBin`).d('电压bin'),
      //   dataIndex: 'voltageBin',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('voltageBin', {
      //           initialValue: value,
      //         })(<Input disabled />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.stickerNumber`).d('不干胶号'),
      //   dataIndex: 'stickerNumber',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('stickerNumber', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`lot`, {
                initialValue: val,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 100,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('primaryUomQty', {
                initialValue: value,
              })(<InputNumber min={0} style={{width: '100%'}} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
        render: (val, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`uomId`, {
                initialValue: record.uomId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
                    }),
                  },
                ],
              })(<Lov code="WMS.UOM" textValue={record.uomCode} queryParams={{ tenantId }} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteName',
        width: 150,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('siteId', {
                initialValue: record.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('工厂'),
                    }),
                  },
                ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.wareHouse`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: 150,
        /* render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('warehouseId', {
                initialValue: record.warehouseId,
              })(
                <Lov
                  code="MT.WARE.HOUSE"
                  queryParams={{ tenantId }}
                  textValue={record.warehouseCode}
                />
              )}
            </Form.Item>
          ) : (
            value
          ), */
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 150,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('locatorId', {
                initialValue: record.locatorId,
              })(
                <Lov
                  code="MT.MTL_LOCATOR"
                  queryParams={{ tenantId }}
                  textValue={record.locatorCode}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      // {
      //   title: intl.get(`${modelPrompt}.instructionId`).d('指令ID'),
      //   dataIndex: 'instructionId',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('instructionId', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      {
        title: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
        dataIndex: 'productDate',
        width: 200,
        align: 'center',
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('productDate', {
                initialValue: value ? moment(value, getDateTimeFormat()) : null,
              })(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableDate`).d('启用时间'),
        dataIndex: 'enableDate',
        width: 200,
        align: 'center',
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enableDate', {
                initialValue: value ? moment(value, getDateTimeFormat()) : null,
              })(
                <DatePicker
                  showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    record.$form.getFieldValue('deadlineDate') &&
                    moment(record.$form.getFieldValue('deadlineDate')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.deadlineDate`).d('截止时间'),
        dataIndex: 'deadlineDate',
        width: 200,
        align: 'center',
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('deadlineDate', {
                initialValue: value ? moment(value, getDateTimeFormat()) : null,
              })(
                <DatePicker
                  showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    record.$form.getFieldValue('enableDate') &&
                    moment(record.$form.getFieldValue('enableDate')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      // {
      //   title: intl.get(`${modelPrompt}.overdueInspectionDate`).d('超期检验日期'),
      //   dataIndex: 'overdueInspectionDate',
      //   width: 200,
      //   align: 'center',
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('overdueInspectionDate', {
      //           initialValue: value ? moment(value, getDateTimeFormat()) : null,
      //         })(
      //           <DatePicker
      //             showTime
      //             placeholder=""
      //             style={{ width: '100%' }}
      //             format={getDateTimeFormat()}
      //           />
      //         )}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.woIssueDate`).d('工单发料时间'),
      //   dataIndex: 'woIssueDate',
      //   width: 200,
      //   align: 'center',
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('woIssueDate', {
      //           initialValue: value ? moment(value, getDateTimeFormat()) : null,
      //         })(
      //           <DatePicker
      //             showTime
      //             placeholder=""
      //             style={{ width: '100%' }}
      //             format={getDateTimeFormat()}
      //           />
      //         )}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.printing`).d('印字内容'),
      //   dataIndex: 'printing',
      //   width: 150,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('printing', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.msl`).d('湿敏等级'),
      //   dataIndex: 'msl',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('msl', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.expansionCoefficients`).d('膨胀系数'),
      //   dataIndex: 'expansionCoefficients',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('expansionCoefficients', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.reservedObjectId`).d('预留工单号'),
      //   dataIndex: 'reservedObjectId',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('reservedObjectId', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      {
        title: intl.get(`${modelPrompt}.poNum`).d('采购订单号'),
        dataIndex: 'poNum',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('poNum', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行号'),
        dataIndex: 'poLineNum',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('poLineNum', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      // {
      //   title: intl.get(`${modelPrompt}.poLineLocationNum`).d('采购订单发运行号'),
      //   dataIndex: 'poLineLocationNum',
      //   width: 150,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('poLineLocationNum', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.soNum`).d('销售订单头号'),
      //   dataIndex: 'soNum',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('soNum', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.soLineNum`).d('销售订单行号'),
      //   dataIndex: 'soLineNum',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('soLineNum', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      // {
      //   title: intl.get(`${modelPrompt}.wbsNum`).d('WBS元素'),
      //   dataIndex: 'wbsNum',
      //   width: 120,
      //   render: (value, record) =>
      //     ['update'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator('wbsNum', {
      //           initialValue: value,
      //         })(<Input trim />)}
      //       </Form.Item>
      //     ) : (
      //       value
      //     ),
      // },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.containerCode`).d('容器条码'),
        dataIndex: 'containerCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        width: 120,
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('labCode', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
