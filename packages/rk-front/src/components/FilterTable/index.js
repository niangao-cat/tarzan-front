import React from 'react';
import { Form, Checkbox, Col, Row, InputNumber } from 'hzero-ui';
import { isEmpty, isEqual } from 'lodash';
import intl from 'utils/intl';

const FormItem = Form.Item;
@Form.create({ fieldNameProp: null })
export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterColum: props.record,
      saveFlag: false,
      modelPrompt: props.modelPrompt,
    };
  }

  // 当监听到可见属性变为true时
  componentWillReceiveProps(newProps) {
    if (!isEqual(this.state.filterColum, newProps.record)) {
      this.setState({ filterColum: [...newProps.record] });
    }
  }

  saveTableSite = () => {
    // const { dispatch, entityType } = this.props;
    if (this.state.saveFlag) {
      // dispatch({
      //   type: 'Communal/saveTableSite',
      //   tableType: entityType,
      //   data: this.state.filterColum,
      // }).then(res => {
      //   if (!isEmpty(res)) {
      //     // this.setState({ filterColum: res });
      //     this.props.getfilterData(res);
      //   }
      // });
      this.setState({ saveFlag: false });
    }
    this.filterClose();
  };

  filterClose = () => {
    const { filterClose = e => e } = this.props;
    filterClose();
  };

  handleSave = (value, index, fieledName) => {
    const {
      form: { getFieldsValue = e => e },
    } = this.props;
    const { filterColum } = this.state;
    const filterStateData = this.state.filterColum;
    const values = getFieldsValue();
    if (!isEmpty(values)) {
      const data = {
        ...filterColum[index],
        ...{
          hidden: fieledName === `hidden${index}` ? value.target.checked : values[`hidden${index}`],
          fixedLeft:
            fieledName === `fixedLeft${index}` ? value.target.checked : values[`fixedLeft${index}`],
          orderSeq: fieledName === `orderSeq${index}` ? value : values[`orderSeq${index}`],
        },
      };
      filterStateData[index] = { ...data };
      this.setState({ filterColum: [...filterStateData], saveFlag: true });
      this.props.getfilterData(filterStateData);
    }
  };

  siteTable = record => {
    const { modelPrompt } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { entityKey } = this.props;
    const res = [];
    if (!isEmpty(record)) {
      res.push(
        <Row>
          <Col span={4}>{intl.get(`hzero.common.view.title.display`).d('显示')}</Col>
          <Col span={9}>{intl.get(`hzero.common.view.title.column`).d('列名')}</Col>
          <Col span={5}>{intl.get(`hzero.common.view.title.lock`).d('LOCK')}</Col>
          <Col span={6}>{intl.get(`hzero.common.view.title.order`).d('排序')}</Col>
        </Row>
      );
      record.forEach((e, index) => {
        res.push(
          <Row>
            <Col span={4}>
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(`hidden${index}`, {
                  initialValue: e.hidden,
                })(
                  <Checkbox
                    disabled={entityKey === e.fieldKey}
                    checkedValue={0}
                    unCheckedValue={1}
                    onChange={event => this.handleSave(event, index, `hidden${index}`)}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              {/* <FormItem style={{ margin: 0 }}>
        {getFieldDecorator(`${e.fieldKey}${index}`, {
                        initialValue: e.fieldName,
                      })(
                        <Checkbox
                          checkedValue={1}
                          unCheckedValue={0}
                          onPressEnter={this.save}
                        />
                      )}
      </FormItem> */}
              <FormItem style={{ margin: 0 }}>
                {intl.get(`${modelPrompt}.${e.fieldKey}`).d(`${e.fieldName}`)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(`fixedLeft${index}`, {
                  initialValue: e.fixedLeft,
                })(
                  <Checkbox
                    checkedValue={1}
                    unCheckedValue={0}
                    onChange={event => this.handleSave(event, index, `fixedLeft${index}`)}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(`orderSeq${index}`, {
                  initialValue: e.orderSeq,
                })(
                  <InputNumber
                    style={{ width: 60 }}
                    onChange={value => this.handleSave(value, index, `orderSeq${index}`)}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        );
      });
    }
    return res;
  };

  render() {
    const { filterColum } = this.state;
    return (
      <div
        onMouseLeave={() => this.saveTableSite()}
        style={{
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
          height: 350,
        }}
      >
        {this.siteTable(filterColum)}
      </div>
    );
  }
}
