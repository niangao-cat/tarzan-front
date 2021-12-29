import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import EditableCell from '@/components/EditCellTable';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.product.produce.model.produce';

/**
 * 扩展属性表格展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */
@formatterCollections({ code: 'tarzan.product.produce' })
@connect(({ produce }) => ({
  produce,
}))
export default class AttrTable extends PureComponent {
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

    this.state = {
      dataSource: [],
    };
  }

  handleSave = row => {
    const {
      dispatch,
      produce: { attributeTabList = [] },
    } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attributeTabList : dataSource;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    dispatch({
      type: 'produce/updateState',
      payload: {
        attributeTabList: newData,
      },
    });
  };

  render() {
    const {
      produce: { attributeTabList = [] },
      keyType,
    } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attributeTabList : dataSource;
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
          tableName:
            keyType === 'material' ? 'mt_pfep_manufacturing_attr' : 'mt_pfep_mfg_catg_attr',
        }),
      };
    });
    return (
      <Table
        components={components}
        pagination={false}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={data}
        columns={columns}
      />
    );
  }
}
