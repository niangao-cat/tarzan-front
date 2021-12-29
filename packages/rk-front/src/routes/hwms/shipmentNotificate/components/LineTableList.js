/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 13:45:36
 * @LastEditTime: 2020-12-10 15:54:13
 */
import React from "react";
import { Form, InputNumber, Popconfirm } from 'hzero-ui';
import { Button as ButtonPermission } from 'components/Permission';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import {
  tableScrollWidth,
  getCurrentOrganizationId,
} from 'utils/utils';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.shipmentMotificate';

const tenantId = getCurrentOrganizationId();

export default class LineTableList extends React.PureComponent {

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onViewDetail,
      onLineCancel,
      onEdit,
      selectedHead,
      onSave,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('行号'),
        dataIndex: 'instructionLineNum',
        align: 'center',
        width: 60,
        render: (text, record) => {
          return <a onClick={() => onViewDetail(true, record)}>{text}</a>;
        },
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('行状态'),
        dataIndex: 'instructionStatusMeaning',
        align: 'center',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('物料描述'),
        dataIndex: 'materialName',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('制单数量'),
        dataIndex: 'demandQty',
        align: 'center',
        width: 80,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`quantity`, {
                initialValue: record.demandQty,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '制单数量',
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if(value > record.demandQty || value < record.actualQty){
                        callback('制单数量须小于等于原制单数量并且大于等于执行数量');
                      }
                      callback();
                    },
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, 6)}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('执行数量'),
        dataIndex: 'actualQty',
        align: 'center',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('单位'),
        dataIndex: 'uomCode',
        align: 'center',
        width: 80,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('目标仓库'),
        dataIndex: 'fromWarehouseCode',
        width: 120,
        render: (value, record) => ['create', 'update'].includes(record._status) ? (
          <React.Fragment>
            <Form.Item>
              {record.$form.getFieldDecorator(`fromLocatorCode`, {
              initialValue: record.fromWarehouseCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '目标仓库',
                  }),
                },
              ],
            })(
              <Lov
                code="WMS.ADJUST_WAREHOUSE"
                queryParams={{ tenantId, siteId: selectedHead.length > 0 && selectedHead[0].siteId || ''}}
                disabled={record.instructionStatusMeaning !== '下达'}
                isInput
                onChange={(val, item) => {
                  record.$form.setFieldsValue({
                    fromLocatorId: item.locatorId,
                  });
                }}
              />
            )}
            </Form.Item>
            <Form.Item>
              {record.$form.getFieldDecorator(`fromLocatorId`, {
                 initialValue: record.fromLocatorId,
              })}
            </Form.Item>
          </React.Fragment>

        ) : (
            value
          ),
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('销售订单-销售订单行号'),
        dataIndex: 'sourceOrderId',
        align: 'center',
        width: 120,
        render: (text, record) => `${record.soNum || ''}${record.soNum && record.soLineNum ? '-' : ''}${record.soLineNum || ''}`,
      },
      {
        title: intl.get(`${modelPrompt}.specStockFlag`).d('特殊库存标识'),
        dataIndex: 'specStockFlag',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('指定SN'),
        dataIndex: 'sn',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('备注'),
        dataIndex: 'remark',
        width: 140,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('创建人'),
        dataIndex: 'createdByName',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('创建时间'),
        dataIndex: 'creationDate',
        align: 'center',
        width: 180,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('更新人'),
        dataIndex: 'lastUpdatedUserName',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('更新时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
        width: 180,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 140,
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            {
              record._status === 'update'
                ? (
                  <React.Fragment>
                    <a onClick={() => onEdit(record, false)}>
                        取消编辑
                    </a>
                    <a onClick={() => onSave(record)}>
                        保存
                    </a>
                  </React.Fragment>
                  )
                : (
                  <ButtonPermission
                    onClick={() => onEdit(record, true)}
                    type="text"
                    disabled={record.instructionStatusMeaning !== '下达' && record.instructionStatusMeaning !== '拣配中'}
                    permissionList={[
                      {
                        code: `hzero.hzero.wms.tarzan.query.shipmentnotificate.ps.hzero.system.shipment.lineedit`,
                        type: 'button',
                        meaning: '编辑',
                      },
                    ]}
                  >
                编辑
                  </ButtonPermission>
                )
            }
            { record._status !== 'update'
              ? (
                <Popconfirm
                  title='是否取消当前行？'
                  onConfirm={() => onLineCancel(record)}
                >
                  <ButtonPermission
                    disabled={record.instructionStatusMeaning !== '下达'}
                    type="text"
                    permissionList={[
                      {
                        code: `hzero.hzero.wms.tarzan.query.shipmentnotificate.ps.hzero.system.shiment.linecancel`,
                        type: 'button',
                        meaning: '取消',
                      },
                    ]}
                  >
                    取消
                  </ButtonPermission>
                </Popconfirm>
)
            : ''
          }
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        // rowSelection={{
        //   selectedRowKeys: selectedLineKeys,
        //   onChange: onSelectLine,
        //   // columnWidth: 50,
        // }}
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={page => onSearch(page)}
      />
    );
  }

}
