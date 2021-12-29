import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'hzero-ui';
// import { isEmpty } from 'lodash';
// import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.org.proline.model.proline';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ proline }) => ({
  proline,
}))
@formatterCollections({
  code: 'tarzan.org.proline',
})
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

  // componentDidMount() {
  //   const { dispatch, prodLineId } = this.props;
  //   if (prodLineId === 'create') {

  //   }
  // }

  handleSave = row => {
    // const {
    //     proline: { attributeList = [] },
    // } = this.props;
    const {
      proline: { prodLineAttrs = [] },
      dispatch,
    } = this.props;
    // const data = isEmpty(prodLineAttrs) ? attributeList : prodLineAttrs;
    const data = prodLineAttrs;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch({
      type: 'proline/updateState',
      payload: {
        prodLineAttrs: newData,
      },
    });
  };

  render() {
    // const {
    //     proline: { attributeList = [] },
    // } = this.props;
    const {
      proline: { prodLineAttrs = [] },
      prodLineId,
      canEdit,
    } = this.props;
    // const data = isEmpty(prodLineAttrs) ? attributeList : prodLineAttrs;
    const data = prodLineAttrs;
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
          editable: prodLineId !== 'create' ? (!canEdit ? false : col.editable) : col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_mod_production_line_attr',
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
