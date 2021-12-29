import React, { PureComponent } from 'react';
import { Form, Col, Row, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import {
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import MultipleLov from '../../../components/MultipleLov';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: '/scon/lease-contract-search' })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * 条件查询
   * @memberof FilterForm
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  /**
   * 重置查询表单
   * @memberof FilterForm
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  /**
   * render
   * @returns
   * @memberof FilterForm
   */
  render() {
    const {
      form: { getFieldDecorator, getFieldValue, resetFields },
      tenantId,
    } = this.props;
    const prefix = 'scon.leaseContractSearch.model.leaseContractSearch';
    return (
      <Form className="more-fields-form">
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefix}.prodLine`).d('生产线')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('prodLineId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '生产线',
                    }),
                  },
                ],
              })(
                <Lov
                  code='MT.PRODLINE'
                  queryParams={{ tenantId }}
                  onChange={() => {
                    resetFields();
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${prefix}.prodLine`).d('工单')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工单',
                    }),
                  },
                ],
              })(
                <MultipleLov disabled={!getFieldValue('prodLineId')} code="HME.PROD_LINE_WORK_ORDER" queryParams={{ tenantId, prodLineId: getFieldValue('prodLineId') }} />
              )}
            </Form.Item>
          </Col>
          <Col span={4} className="search-btn-more">
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
          <Col span={8} style={{ lineHeight: '42px'}}>
            * 注释：
            <span style={{ display: 'inline-block', width: '10px', height: '10px', background: "#99ccff", margin: "0 5px 0 0" }} />
            蓝色底色为未保存数据，
            <span style={{ display: 'inline-block', width: '10px', height: '10px', background: "#99cc99", margin: "0 5px 0 0" }} />
            绿色底色为已生成配送单数据。
          </Col>
        </Row>
      </Form>
    );
  }
}
