import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.org.workcell.model.workcell';

/**
 * 扩展属性表格展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
export default class AttrTab extends PureComponent {
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

  componentDidMount() {
    const { dispatch, workcellId } = this.props;
    if (workcellId === 'create') {
      dispatch({
        type: 'relationMaintainDrawer/fetchAttributeList',
        payload: {
          kid: null,
          tableName: 'mt_mod_workcell_attr',
        },
      });
    }
  }

  handleSave = row => {
    const {
      dispatch,
      relationMaintainDrawer: { attrList = [] },
    } = this.props;
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
    dispatch({
      type: 'relationMaintainDrawer/updateState',
      payload: {
        attrList: newData,
      },
    });
  };

  render() {
    const {
      relationMaintainDrawer: { attrList = [] },
      editFlag,
      workcellId,
    } = this.props;
    const { dataSource } = this.state;
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
          editable: workcellId !== 'create' ? (editFlag ? false : col.editable) : col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_mod_workcell_attr',
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
