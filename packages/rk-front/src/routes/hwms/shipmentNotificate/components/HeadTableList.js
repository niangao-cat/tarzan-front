/*
 * @Description: 头数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 13:45:36
 * @LastEditTime: 2020-12-14 20:56:57
 */
import React from "react";
import { Table, Popconfirm } from 'hzero-ui';
import { Button as ButtonPermission } from 'components/Permission';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.shipmentMotificate';

export default class HeadTableList extends React.PureComponent {

  render() {
    const {
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
      handleHeadCancel,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('序号'),
        dataIndex: 'cosRuleCode',
        // width: 50,
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPrompt}.cosRuleCode`).d('工厂'),
        dataIndex: 'siteCode',
        align: 'center',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('单据号'),
        dataIndex: 'instructionDocNum',
        align: 'center',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('单据类型'),
        dataIndex: 'instructionDocTypeMeaning',
        align: 'center',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('客户编码'),
        dataIndex: 'customerCode',
        align: 'center',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('客户名称'),
        dataIndex: 'customerName',
        align: 'center',
        width: 180,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('创建人'),
        dataIndex: 'createdByName',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('创建时间'),
        dataIndex: 'creationDate',
        align: 'center',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('更新人'),
        dataIndex: 'lastUpdatedUserName',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productType`).d('更新时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        align: 'center',
        with: 120,
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            <Popconfirm
              title='是否取消当前头数据？'
              onConfirm={() => handleHeadCancel(record)}
            >
              <ButtonPermission
                type="text"
                disabled={record.instructionDocStatusMeaning !== '下达'}
                permissionList={[
                  {
                    code: `hzero.hzero.wms.tarzan.query.shipmentnotificate.ps.hzero.system.shipment.headcancle`,
                    type: 'button',
                    meaning: '取消',
                  },
                ]}
              >
                  取消
              </ButtonPermission>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="inspectionSchemeId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          width: 50,
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }

}