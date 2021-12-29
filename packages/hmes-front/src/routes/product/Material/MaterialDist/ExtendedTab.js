import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'hzero-ui';
// import { isEmpty } from 'lodash';
// import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ materialManager }) => ({
  materialManager,
}))
@formatterCollections({ code: 'tarzan.product.materialManager' })
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
            {!this.props.editFlag && (
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
  }

  componentDidMount() {
    const { dispatch, materialId } = this.props;
    dispatch({
      type: 'materialManager/fetchAttrCreate',
      payload: {
        kid: materialId,
        tableName: 'mt_material_attr',
      },
    });
  }

  // 抽屉确认关闭并保存
  /* eslint-disable */
  handleOk = () => {
    const { dispatch, onOk } = this.props;
    const { dataSource } = this.state;
    if (dataSource.length > 0) {
      dispatch({
        type: 'materialManager/saveAttribute',
        payload: {
          kid: materialId,
          attrs: dataSource,
          tableName: 'mt_material_attr',
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.setState({ dataSource: undefined });
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    onOk();
  };
  /* eslint-disable */

  // componentDidMount() {
  //   const { dispatch, materialId } = this.props;

  // }

  handleSave = row => {
    const {
      dispatch,
      materialManager: { attributeTabList = [] },
    } = this.props;
    // const data = isEmpty(attributeTabList) ? attributeTabList : attributeTabList;
    const data = attributeTabList;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch({
      type: 'materialManager/updateState',
      payload: {
        attributeTabList: newData,
      },
    });
  };

  render() {
    // const {
    //     materialManager: { attributeList = [] },
    // } = this.props;
    const {
      materialManager: { attributeTabList = [] },
      canEdit,
      materialId,
    } = this.props;
    // const data = isEmpty(attributeList) ? attributeList : attributeList;
    const data = attributeTabList;
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
          editable: materialId !== 'create' ? (!canEdit ? false : col.editable) : col.editable,
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
