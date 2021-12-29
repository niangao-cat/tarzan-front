import React from "react";
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';

import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

import { getDateFormat } from 'utils/utils';
import moment from 'moment';
import Lov from 'components/Lov';

const { Option } = Select;
const modelPromt = 'tarzan.hmes.purchaseOrder';

@formatterCollections({
  code: 'tarzan.hmes.staffManufacturingAttributeReport',
})
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expandForm: false,
    };
    props.onRef(this);
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  };

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form, onSearch } = this.props;
    form.resetFields();
    if (onSearch) {
      onSearch();
    }
  };

  render() {

    const { expandForm } = this.state;
    const {form, tenantId, qualityType, proficiency, onSearch  } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.employeeNum`).d('员工编码')}
            >
              {getFieldDecorator('employeeNum', {})(<Input trim inputChinese={false} />)}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.name`).d('员工姓名')}
            >
              {getFieldDecorator('name', {})(<Input />)}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.qualityCode`).d('资质编码')}
            >
              {getFieldDecorator("qualityId")(
                <Lov code="	HME.QUALIFICATION_EMPLOYEE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch.bind(this)}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.qualityType`).d('资质类型')}
            >
              {getFieldDecorator('qualityType')(
                <Select allowClear style={{ width: '100%' }}>
                  {qualityType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT} >
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov code="Z.MATERIALCODE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.proficiency`).d('资质熟练度')}
            >
              {getFieldDecorator('proficiency')(
                <Select allowClear style={{ width: '100%' }}>
                  {proficiency.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.dateFrom`).d('有效期起')}
            >
              {getFieldDecorator('dateFrom')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      value-format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('dateTo') &&
                        moment(getFieldValue('dateTo')).isBefore(currentDate, 'day')
                      }
                    />
              )}

            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.dateTo`).d('有效期止')}
            >
              {getFieldDecorator('dateTo')(
                    <DatePicker
                      placeholder=""
                      style={{ width: '100%' }}
                      value-format="YYYY-MM-DD"
                      disabledDate={currentDate =>
                        getFieldValue('dateFrom') &&
                        moment(getFieldValue('dateFrom')).isAfter(currentDate, 'day')
                      }

                    />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

}
