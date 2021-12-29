/**
 * FilterForm - 搜索框
 * date: 2019-12-4
 * @author: xubiting <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { Icon, Form, Row, Col, Input, Select, Switch, Tooltip } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import { connect } from 'dva';
import intl from 'utils/intl';

const { Option } = Select;

const modelPrompt = 'tarzan.hagd.containerType.model';

const MIXEDOWNEROPTIONS = [
  {
    type: 'mixedMaterialFlag',
    text: intl.get(`${modelPrompt}.material`).d('物料'),
  },
  {
    type: 'mixedEoFlag',
    text: intl.get(`${modelPrompt}.eo`).d('EO'),
  },
  {
    type: 'mixedWoFlag',
    text: intl.get(`${modelPrompt}.wo`).d('WO'),
  },
  {
    type: 'mixedOwnerFlag',
    text: intl.get(`${modelPrompt}.ownerType`).d('所有者类型'),
  },
];

@connect(({ containerType }) => ({ containerType }))
@Form.create()
export default class ConForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  fetchQueryList = () => {
    const { onSearch = c => c, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  };

  handleFormReset = () => {
    const { handleFormReset = c => c, form } = this.props;
    form.resetFields();
    handleFormReset();
  };

  changeLocal = checked => {
    const {
      dispatch,
      containerType: { containerItem = {} },
    } = this.props;

    // 选择位置则展示行列
    dispatch({
      type: 'containerType/updateState',
      payload: {
        containerItem: { ...containerItem, locationEnabledFlag: checked },
      },
    });
  };

  render() {
    const {
      form,
      containerType: { packingLevel = [], containerItem = {} },
      canEdit,
    } = this.props;

    const {
      containerTypeCode,
      containerTypeDescription,
      locationEnabledFlag,
      packingLevel: packingLevelInit,
      enableFlag,
      flagValues,
    } = containerItem;

    const { getFieldDecorator } = form;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.containerTypeCode`).d('容器类型编码')}
            >
              {getFieldDecorator('containerTypeCode', {
                initialValue: containerTypeCode,
                rules: [
                  {
                    required: true,
                    message: intl.get(`${modelPrompt}.select`, {
                      name: intl.get(`${modelPrompt}.containerTypeCode`).d('容器类型编码'),
                    }),
                  },
                ],
              })(<Input disabled={!canEdit} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.containerTypeDescription`).d('容器类型描述')}
            >
              {getFieldDecorator('containerTypeDescription', {
                initialValue: containerTypeDescription,
                rules: [
                  {
                    required: true,
                    message: intl.get(`${modelPrompt}.select`, {
                      name: intl.get(`${modelPrompt}.containerTypeCodes`).d('容器类型描述'),
                    }),
                  },
                ],
              })(<Input disabled={!canEdit} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              style={{ position: 'relative' }}
              label={intl.get(`${modelPrompt}.packingLevel`).d('包装等级')}
            >
              {getFieldDecorator('packingLevel', {
                initialValue: packingLevelInit,
              })(
                <>
                  <Select style={{ width: '100%' }} allowClear disabled={!canEdit}>
                    {packingLevel.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                  </Select>
                  <Tooltip
                    placement="topLeft"
                    title={intl
                      .get(`${modelPrompt}.infocircle`)
                      .d(
                        '限制该类型的容器只能装载特定对象，对象包括执行作业，物料批，容器，当不指定对象时表示不做限制'
                      )}
                  >
                    <Icon
                      type="question-circle-o"
                      style={{
                        position: 'absolute',
                        theme: 'outlined',
                        top: 2,
                        right: '-20px',
                        fontSize: 14,
                      }}
                    />
                  </Tooltip>
                </>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag || 'Y',
              })(<Switch checkedValue="Y" unCheckedValue="N" disabled={!canEdit} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locationEnabledFlag`).d('位置管理')}
            >
              {getFieldDecorator('locationEnabledFlag', {
                initialValue: locationEnabledFlag || 'N',
              })(
                <Switch
                  checkedValue="Y"
                  unCheckedValue="N"
                  disabled={!canEdit}
                  onChange={this.changeLocal}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.flagValues`).d('允许混合装载对象')}
            >
              {getFieldDecorator('flagValues', {
                initialValue: flagValues || ['mixedEoFlag', 'mixedWoFlag'],
              })(
                <Select
                  mode="multiple"
                  defaultValue={['mixedEoFlag', 'mixedWoFlag']}
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!canEdit}
                >
                  {MIXEDOWNEROPTIONS.map(item => (
                    <Option value={item.type} key={item.type}>
                      {item.text}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
