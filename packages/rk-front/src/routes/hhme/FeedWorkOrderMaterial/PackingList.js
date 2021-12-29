import React, { Fragment } from 'react';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';
import Lov from 'components/Lov';


// import { enableRender } from '../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class PackingList extends React.Component {

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前对象
   * @memberof FloorInfo
   */
  @Bind()
  handleCleanLine(record) {
    const { onCleanLine } = this.props;
    if (onCleanLine) {
      onCleanLine(record);
    }
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof FloorInfo
   */
  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('headList', 'exceptionId', record, flag);
    }
  }

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('headList', 'pagination', 'exceptionId');
    }
  }

  @Bind()
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record);
    }
  }

  @Bind()
  handleTurnToNextLine(e, index) {
    const dom = document.getElementsByClassName('exception-code-input');
    if( index + 1 < dom.length) {
      dom[index + 1].focus();
    }
  }

  render() {
    const { loading, dataSource, onSearch, onOpenModal, tenantId } = this.props;
    const columns = [
      {
        title: '预留项目号',
        width: 100,
        dataIndex: 'relatedProjectNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('序号'),
        width: 40,
        dataIndex: 'lineNumber',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('组件编码'),
        width: 120,
        dataIndex: 'materialCode',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialId', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.MDM.RPT.MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={(val, data) => {
                    record.$form.setFieldsValue({ materialName: data.materialName, materialCode: data.materialCode });
                  }}
                />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('组件描述'),
        width: 150,
        dataIndex: 'materialName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('materialName', {
                initialValue: value,
              })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none'}}>
                {record.$form.getFieldDecorator('materialCode', {
                initialValue: record.materialName,
              })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('组件版本'),
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('单位用量'),
        width: 80,
        dataIndex: 'unitDosage',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('需求数量'),
        width: 90,
        dataIndex: 'demandQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('装配数量'),
        dataIndex: 'assembleQty',
        width: 80,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('单位'),
        dataIndex: 'uomCode',
        width: 60,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('反冲标识'),
        dataIndex: 'recoilFlag',
        width: 80,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('上级虚拟件'),
        dataIndex: 'parentVirtualPart',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('装配虚拟件标识'),
        dataIndex: 'virtualPartFlag',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 100,
        fixed: 'right',
        render: (value, record) => (
          <div className="action-link">
            {record._status === 'create' && (
              <a onClick={() => this.handleCleanLine(record)}>
                {intl.get('hzero.common.button.clean').d('清除')}
              </a>
            )}
            <a onClick={() => onOpenModal(record)}>
                投料/退料
            </a>
          </div>
          ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 400, x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
