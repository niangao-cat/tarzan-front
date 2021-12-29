import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon, Modal } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import EditableCell from '@/components/EditCellTable';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.org.area.model.area';

/**
 * 扩展属性表格展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ area }) => ({
  area,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
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
    const { dispatch, areaId } = this.props;
    dispatch({
      type: 'area/fetchAttributeList',
      payload: {
        kid: areaId === 'create' ? '' : areaId,
        tableName: 'mt_mod_area_attr',
      },
    });
  }

  handleSave = row => {
    const {
      dispatch,
      area: { attrList = [] },
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
      type: 'area/updateState',
      payload: {
        attrList: newData,
      },
    });
  };

  handleOk = () => {
    const { dispatch, onCancel, areaId } = this.props;
    const { dataSource } = this.state;
    if (dataSource.length > 0) {
      dispatch({
        type: 'area/saveAttribute',
        payload: {
          kid: areaId === 'create' ? '' : areaId,
          attrs: dataSource,
          tableName: 'mt_mod_area_attr',
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
    onCancel();
  };

  render() {
    const {
      componentDisabled,
      onCancel,
      visible,
      area: { attrList = [] },
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
          editable: componentDisabled ? false : col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_mod_area_attr',
        }),
      };
    });
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get(`${modelPrompt}.attribute`).d('编辑扩展字段')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOk}
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
