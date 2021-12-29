import React from 'react';
import { Form, Input } from 'hzero-ui';
import AttrTLEditor from '@/components/AttrTLEditor';
import intl from 'utils/intl';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing && this.input) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  saveTLEditor = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  onRef(node) {
    this.input = node;
  }

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, tableName } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
        })(
          record.tlFlag === 'Y' ? (
            <AttrTLEditor
              onPressEnter={this.save}
              onBlur={this.saveTLEditor}
              label={intl.get(`hzero.common.attrName`).d('扩展字段')}
              field={record.attrName}
              tableName={tableName}
              keyId={record.kid}
            />
          ) : (
            <Input ref={node => this.onRef(node)} onPressEnter={this.save} onBlur={this.save} />
          )
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      tableName,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

EditableCell.EditableFormRow = EditableFormRow;
