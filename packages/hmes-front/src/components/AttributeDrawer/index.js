/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Icon, Button } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.common.components.model.components';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @param {Boolean} visible - 是否关闭抽屉
 * @param {Boolean} canEdit - 是否可以编辑
 * @param {Array} - attribute List
 * @param {Function} onSave - 保存抽屉数据
 * @param {Function} onCancle - 关闭抽屉
 * @return React.element
 */
@connect()
@formatterCollections({
  code: 'tarzan.common.components',
})
export default class AttributeDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: intl.get(`${modelPrompt}.attrMeaning`).d('扩展字段属性描述'),
        dataIndex: 'attrMeaning',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.attrValue`).d('扩展字段属性值'),
        dataIndex: 'attrValue',
        editable: true,
        width: 200,
        render: val => (
          <div>
            {val}
            {this.props.canEdit && (
              <>
                <span style={{ color: '#548FFC', marginLeft: '10px' }}>
                  <Icon type="edit" theme="twoTone" />
                </span>
              </>
            )}
          </div>
        ),
      },
    ];

    this.state = {
      dataSource: [],
    };
  }

  handleSave = row => {
    const { attrList } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attrList : dataSource;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  onOk = () => {
    const { onSave = e => e } = this.props;
    const { dataSource } = this.state;
    onSave(dataSource);
  };

  render() {
    const {
      visible = false,
      onCancel = e => e,
      canEdit,
      attrList = [],
      tableName = '',
    } = this.props;

    const { dataSource = [] } = this.state;
    const data = isEmpty(dataSource) ? attrList : dataSource;

    const components = {
      body: {
        row: EditableCell.EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: !canEdit ? false : col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName,
        }),
      };
    });

    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get(`${modelPrompt}.editExpandTitle`).d('编辑扩展字段')}
        visible={visible}
        onCancel={onCancel}
        // onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
        footer={
          canEdit ? (
            <>
              <Button onClick={() => onCancel()}>
                {intl.get(`${modelPrompt}.cancel`).d('取消')}
              </Button>
              <Button type="primary" onClick={() => this.onOk()}>
                {intl.get(`${modelPrompt}.certain`).d('确定')}
              </Button>
            </>
          ) : (
            <Button onClick={() => onCancel()}>
              {intl.get(`${modelPrompt}.return`).d('返回')}
            </Button>
          )
        }
      >
        <Table
          components={components}
          pagination={false}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data}
          columns={columns}
        />
      </Modal>
    );
  }
}
