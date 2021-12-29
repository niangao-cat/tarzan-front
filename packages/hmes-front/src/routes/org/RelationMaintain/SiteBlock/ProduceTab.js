import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select } from 'hzero-ui';
import { isUndefined, isNull } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT_FORDRAWER,
  DRAWER_FORM_ITEM_LAYOUT_FORDRAWER,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.org.site.model.site';
/**
 * 生产属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@Form.create({ fieldNameProp: null })
export default class ProduceTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, relationMaintainDrawer, editFlag, siteId } = this.props;
    const { attritionCalculateStrategyList = [] } = relationMaintainDrawer;
    let { produceList } = relationMaintainDrawer;
    if (isNull(produceList)) {
      produceList = {};
    }
    const { attritionCalculateStrategy } = produceList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.attritionCalculateStrategy`).d('损耗计算策略')}
            >
              {getFieldDecorator('attritionCalculateStrategy', {
                initialValue: attritionCalculateStrategy || undefined,
              })(
                <Select
                  style={{ width: '100%' }}
                  disabled={siteId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false}
                  allowClear
                >
                  {attritionCalculateStrategyList instanceof Array &&
                    attritionCalculateStrategyList.length !== 0 &&
                    attritionCalculateStrategyList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
