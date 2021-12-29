import React, { PureComponent } from 'react';
import { Form, Col, Row, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import CacheComponent from 'components/CacheComponent';
import Lov from 'components/Lov';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
@CacheComponent({ cacheKey: '/scon/lease-contract-search' })
export default class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
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
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  }

  /**
   * 重置查询表单
   * @memberof FilterForm
   */
  @Bind()
  handleFormReset() {
    const { onReset } = this.props;
    onReset();
    this.props.form.resetFields();
  }

  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if(onCreate) {
      onCreate();
    }
  }

  /**
   * render
   * @returns
   * @memberof FilterForm
   */
  render() {
    const {
      form: { getFieldDecorator },
      tenantId,
    } = this.props;
    const prefix = 'scon.leaseContractSearch.model.leaseContractSearch';
    const formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <div className={styles['filter-content']}>
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label={intl.get(`${prefix}.department`).d('事业部')} {...formLayout}>
                {getFieldDecorator('departmentId')(
                  <Lov allowClear code="HME.BUSINESS_AREA" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={intl.get(`${prefix}.workshop`).d('车间')} {...formLayout}>
                {getFieldDecorator('workshopId')(
                  <Lov allowClear code="HME_WORK_SHOP" queryParams={{ tenantId }} />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={intl.get(`${prefix}.contractNumber`).d('生产线')} {...formLayout}>
                {getFieldDecorator('prodLineId')(
                  <Lov
                    allowClear
                    code="Z.PRODLINE"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={intl.get(`${prefix}.contractNumber`).d('SN号')} {...formLayout}>
                {getFieldDecorator('snNum', {
                  rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'SN号',
                    }),
                  },
                ],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button
                  data-code="reset"
                  onClick={this.handleFormReset}
                  style={{ marginLeft: '1vw' }}
                >
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                <Button
                  data-code="search"
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSearch}
                  style={{ marginLeft: '1vw' }}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
                <Button
                  onClick={() => this.handleCreate()}
                  style={{ marginLeft: '1vw' }}
                >
                  {intl.get('hzero.common.button.create').d('新建')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
