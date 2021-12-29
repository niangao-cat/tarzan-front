/**
 * StatusDrawer 类型编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Icon, Table } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.org.locatorGroup.model.locatorGroup';
// const FormItem = Form.Item;

@connect(({ loading, locatorGroup }) => ({
  locatorGroup,
  loading: loading.effects['locatorGroup/saveAttr'],
}))
@formatterCollections({
  code: 'tarzan.org.locatorGroup',
})
export default class AttrDrawer extends React.PureComponent {
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
            <span style={{ color: '#548FFC', marginLeft: '10px' }}>
              <Icon type="edit" theme="twoTone" />
            </span>
          </div>
        ),
      },
    ];
  }

  handleSave = row => {
    const {
      locatorGroup: { attrList = [] },
      dispatch,
    } = this.props;
    // const data = isEmpty(attrList) ? attributeList : attrList;
    const data = attrList;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch({
      type: 'locatorGroup/updateState',
      payload: {
        attrList: newData,
      },
    });
  };

  render() {
    const {
      visible,
      onCancel,
      loading,
      locatorGroup: { attrList = [] },
      handleOK,
    } = this.props;
    const data = attrList;
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_mod_locator_group_attr',
        }),
      };
    });
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get(`${modelPrompt}.field`).d('扩展字段')}
        visible={visible}
        onCancel={onCancel}
        onOk={handleOK}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
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
