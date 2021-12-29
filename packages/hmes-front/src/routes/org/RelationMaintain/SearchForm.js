import React from 'react';
import { Form, Button, Col, Row, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import Lov from 'components/Lov';

import FormItem from 'hzero-ui/lib/form/FormItem';
import styles from './index.less';


const modelPrompt = 'tarzan.hmes.purchaseOrder';

@formatterCollections({ code: 'tarzan.hmes.abnormalCollection' })
@Form.create({ fieldNameProp: null })
export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSiteId: null,
    };
    props.onRef(this);
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  }

  @Bind()
  resetSearch() {
    const { form: { resetFields }, onResetTreeData } = this.props;
    resetFields();
    if(onResetTreeData) {
      onResetTreeData();
    }
  }

  @Bind()
  changeOrgType() {
    const { form: { resetFields } } = this.props;
    resetFields(['organizationId']);
  }

  // 渲染
  render() {
    const { form, tenantId, siteInfo, organizationTypeList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { selectedSiteId } = this.state;
    return (
      <Form className={styles.content}>
        <Row className={styles.nomalRow}>
          <Col span={8} className={styles.titleCol}>
            组织类型
          </Col>
          <Col span={16} className={styles.componmentCol}>
            <Form.Item>
              {getFieldDecorator('organizationType')(
                <Select style={{ width: '100%' }} allowClear onChange={() => this.changeOrgType()}>
                  {(organizationTypeList || []).map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.nomalRow}>
          <Col span={8} className={styles.titleCol}>
            组织编码
          </Col>
          <Col span={16} className={styles.componmentCol}>
            <FormItem>
              {getFieldDecorator('organizationId', {
                rules: [
                  {
                    required: getFieldValue('organizationType'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.organizationCode`).d('组织编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.ORGANIZATION_REL"
                  queryParams={{
                    tenantId,
                    organizationType: getFieldValue('organizationType'),
                    topSiteId: selectedSiteId || siteInfo.siteId,
                  }}
                  disabled={!getFieldValue('organizationType')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row className={styles.nomalRow}>
          <Col span={18} style={{ marginLeft: 20}}>
            <Form.Item>
              <Button onClick={() => this.resetSearch()} style={{ marginRight: 12}}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
