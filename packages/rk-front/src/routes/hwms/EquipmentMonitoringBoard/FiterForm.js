/**
 * 查询条件
 */
import React from 'react';
import { Form, Button, Col, Row, Select, Icon } from 'hzero-ui';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_FIELD_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

const { Option } = Select;

// model 层连接
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {

  // 渲染
  render() {
    const { form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={5} className="filterName">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`siteId`).d('站点')}
              style={{fontSize: '1vw'}}
            >
              {getFieldDecorator('siteId')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {[].map(e => (
                    <Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col span={5} className="filterName">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`document`).d('事业部')}
            >
              {getFieldDecorator('document')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {[].map(e => (
                    <Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col span={5} className="filterName">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`workshop`).d('车间')}
            >
              {getFieldDecorator('workshop')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {[].map(e => (
                    <Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col span={5} className="filterName">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`prodLineId`).d('生产线')}
            >
              {getFieldDecorator('prodLineId')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {[].map(e => (
                    <Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col span={4} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button style={{fontSize: '0.9vw'}}>
                {intl.get(`hzero.common.button.clear`).d('清空')}
              </Button>
              <Button type="primary" htmlType="submit" style={{fontSize: '0.9vw', backgroundColor: 'rgba(83,107,215)'}}>
                <Icon type="search" style={{ fontSize: '0.9vw', color: 'white' }} />
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

