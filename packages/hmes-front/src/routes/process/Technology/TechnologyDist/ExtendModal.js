import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon, Modal } from 'hzero-ui';
import intl from 'utils/intl';
import EditableCell from '@/components/EditCellTable';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.process.technology.model.technology';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ technology, loading }) => ({
  technology,
  loading: loading.effects['technology/fetchMaterialCategoryList'],
}))
@formatterCollections({ code: 'tarzan.process.technology' })
export default class ExtendedTab extends PureComponent {
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
      technology: { attrList = [] },
      dispatch,
    } = this.props;
    // const { dataSource } = this.state;
    // const data = isEmpty(dataSource) ? attrList : dataSource;
    const data = attrList;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch({
      type: 'technology/updateState',
      payload: {
        attrList: newData,
      },
    });
  };

  render() {
    const {
      visible,
      handleOnOk,
      onCancel,
      technology: { attrList = [] },
    } = this.props;
    // const data = isEmpty(dataSource) ? attrList : dataSource;
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
          tableName: 'mt_operation_substep_attr',
        }),
      };
    });
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.process.technology.title.extendAttrs').d('扩展字段')}
        visible={visible}
        onCancel={onCancel}
        onOk={handleOnOk}
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
