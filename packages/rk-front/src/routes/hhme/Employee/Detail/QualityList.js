/*
 * @Description: 人员资质
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-16 10:03:29
 */
import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Select, DatePicker, Input } from 'hzero-ui';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import moment from 'moment';
import { tableScrollWidth, getCurrentLanguage, getCurrentOrganizationId } from 'utils/utils';

@Form.create({ fieldNameProp: null })
export default class QualityList extends PureComponent {
  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource = [],
      onAdQuality,
      onDeleteQuality,
      onChange,
      proficiency = [],
      selectedQualityKeys = [],
      delLoading,
      employeeId,
      handleCleanLine,
      handleEditLine,
      pagination,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: '资质编码',
        dataIndex: 'qualityCode',
        width: 140,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qualityCode`, {
                rules: [
                  {
                    required: true,
                    message: '资质类型',
                  },
                ],
                initialValue: record.qualityCode,
              })(
                <Lov
                  code="HME.QUALIFICATION_EMPLOYEE"
                  queryParams={{ employeeId }}
                  textValue={record.qualityCode}
                  onChange={(_val, item) => {
                    record.$form.setFieldsValue({
                      qualityType: item.qualityType,
                      qualityName: item.qualityName,
                      remark: item.remark,
                      qualityTypeMeaning: item.qualityTypeMeaning,
                      qualityId: item.qualityId,
                    });
                  }}
                  te
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '资质类型',
        dataIndex: 'qualityTypeMeaning',
        width: 140,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`qualityTypeMeaning`, {
                  rules: [
                    {
                      required: true,
                      message: '资质类型',
                    },
                  ],
                  initialValue: record.qualityTypeMeaning,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{display: 'none'}}>
                {record.$form.getFieldDecorator(`qualityType`, {
                  initialValue: record.qualityType,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{display: 'none'}}>
                {record.$form.getFieldDecorator(`qualityId`, {
                  initialValue: record.qualityId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>

          ) : (
              val
            ),
      },
      {
        title: '资质名称',
        dataIndex: 'qualityName',
        width: 140,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qualityName`, {
                rules: [
                  {
                    required: true,
                    message: '资质类型',
                  },
                ],
                initialValue: record.qualityName,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '资质备注',
        dataIndex: 'remark',
        width: 140,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: record.remark,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '资质熟练度',
        dataIndex: 'proficiencyMeaning',
        width: 140,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`proficiency`, {
                rules: [
                  {
                    required: true,
                    message: '资质类型',
                  },
                ],
                initialValue: record.proficiency,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {proficiency.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialCode`, {
                initialValue: record.materialCode,
              })(
                <Lov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId: getCurrentOrganizationId(), local: getCurrentLanguage() }}
                  // lovOptions={{ displayField: 'materialCode', valueField: 'materialId'}}
                  textValue={record.materialCode}
                  onChange={(_val, item) => {
                    record.$form.setFieldsValue({
                      materialName: item.materialName,
                      materialId: item.materialId,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`materialName`, {
                  initialValue: record.materialName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{display: 'none'}}>
                {record.$form.getFieldDecorator(`materialId`, {
                  initialValue: record.materialId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '有效期起',
        dataIndex: 'dateFrom',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`dateFrom`, {
                initialValue: record.dateFrom ? moment(record.dateFrom, 'YYYY-MM-DD') : '',
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD"
                // disabledDate={currentDate =>
                //   record.$form.getFieldValue('dateTo') &&
                //   moment(record.$form.getFieldValue('dateTo')).isBefore(currentDate, 'day')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '有效期止',
        dataIndex: 'dateTo',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`dateTo`, {
                initialValue: record.dateTo ? moment(record.dateTo, 'YYYY-MM-DD') : '',
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD"
                  disabledDate={currentDate =>
                    record.$form.getFieldValue('dateFrom') &&
                    moment(record.$form.getFieldValue('dateFrom')).isAfter(currentDate, 'day')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 110,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => handleCleanLine(record)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <Fragment>
        <div className="table-operator">
          <Button
            onClick={onAdQuality}
          >
            新增资质
          </Button>
          <Button
            onClick={onDeleteQuality}
            loading={delLoading}
            disabled={selectedQualityKeys.length === 0}
          >
            删除资质
          </Button>
        </div>
        <EditTable
          bordered
          rowKey="employeeAssignId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
          onChange={page => onSearch(page)}
          rowSelection={{
            selectedRowKeys: selectedQualityKeys,
            onChange,
            getCheckboxProps: record => ({
              disabled: record._status === 'create' || record._status === 'update',
            }),
          }}
        />
      </Fragment>
    );
  }
}
