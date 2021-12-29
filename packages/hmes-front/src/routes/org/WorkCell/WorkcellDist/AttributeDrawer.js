import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Icon } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import EditableCell from '@/components/EditCellTable';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.org.workcell.model.workcell';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ workcell }) => ({
  workcell,
}))
export default class AttributeDrawer extends PureComponent {
  componentDidMount() {
    const { dispatch, workcellId } = this.props;
    if (workcellId === 'create') {
      dispatch({
        type: 'workcell/fetchAttributeList',
        payload: {
          kid: null,
          tableName: 'mt_mod_workcell_attr',
        },
      });
    } else {
      dispatch({
        type: 'workcell/fetchAttributeList',
        payload: {
          kid: workcellId,
          tableName: 'mt_mod_workcell_attr',
        },
      });
    }
  }

  // 抽屉确认关闭并保存
  @Bind
  handleOk() {
    const { dispatch, onOk, workcellId } = this.props;
    const { dataSource } = this.state;
    if (dataSource.length > 0) {
      dispatch({
        type: 'workcell/saveAttribute',
        payload: {
          kid: workcellId,
          attrs: dataSource,
          tableName: 'mt_mod_workcell_attr',
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
  }

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

    this.state = {
      dataSource: [],
    };
  }

  handleSave = row => {
    const {
      workcell: { attrList = [] },
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
  };

  render() {
    const {
      visible,
      onCancel,
      workcellId,
      editFlag,
      workcell: { attrList = [] },
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
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.org.workcell.title.attribute').d('编辑扩展字段')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data}
          columns={columns}
        />
      </Modal>
    );
  }
}
