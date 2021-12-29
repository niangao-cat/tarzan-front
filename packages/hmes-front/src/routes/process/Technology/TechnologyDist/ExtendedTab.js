import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'hzero-ui';
// import { isEmpty } from 'lodash';
// import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.process.technology.model.technology';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ technology }) => ({
  technology,
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

  // componentDidMount() {
  //   const { dispatch, operationId } = this.props;

  // }

  handleSave = row => {
    const {
      dispatch,
      technology: { attrTabList = [] },
    } = this.props;
    // const data = isEmpty(attrTabList) ? attrTabList : attrTabList;
    const data = attrTabList;
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
        attrTabList: newData,
      },
    });
  };

  render() {
    // const {
    //     technology: { attributeList = [] },
    // } = this.props;
    const {
      technology: { attrTabList = [] },
      canEdit,
      operationId,
    } = this.props;
    // const data = isEmpty(attributeList) ? attributeList : attributeList;
    const data = attrTabList;
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
          editable: operationId !== 'create' ? (!canEdit ? false : col.editable) : col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_material_attr',
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
