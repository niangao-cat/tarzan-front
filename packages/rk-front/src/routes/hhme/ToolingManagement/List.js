import React from 'react';
import { Form, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';


// import { enableRender } from '../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class List extends React.Component {

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
    const { loading, dataSource, onSearch, pagination } = this.props;
    const columns = [
      {
        title: '工具名称',
        width: 100,
        dataIndex: 'toolName',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('品牌'),
        width: 100,
        dataIndex: 'brandName',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('规格型号'),
        width: 100,
        dataIndex: 'specification',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('频率'),
        width: 100,
        dataIndex: 'rate',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('单位'),
        width: 100,
        dataIndex: 'uomName',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('应用类型'),
        width: 100,
        dataIndex: 'applyTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('数量'),
        width: 100,
        dataIndex: 'qty',
        render: (value, record) =>
          ['update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('qty', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionName`).d('数量'),
                    }),
                  },
                ],
              })(
                <InputNumber style={{ width: '100%' }} disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ y: 400, x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
