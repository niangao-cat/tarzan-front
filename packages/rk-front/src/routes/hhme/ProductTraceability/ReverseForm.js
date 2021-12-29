/*
 * @Description: 逆向追溯查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-12 16:37:29
 * @LastEditTime: 2020-10-06 13:47:04
 */
import React, { PureComponent } from 'react';
import { Form, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';

@Form.create({ fieldNameProp: null })
export default class ReverseForm extends PureComponent {
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
  fetchReverse() {
    const { fetchReverse, form } = this.props;
    if (fetchReverse) {
      form.validateFields(err => {
        if (!err) {
          fetchReverse();
        }
      });
    }
  }

  /**
   * render
   * @returns
   * @memberof FilterForm
   */
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      fetchReverseLoading,
    } = this.props;
    const prefix = 'scon.leaseContractSearch.model.leaseContractSearch';
    return (
      <Form layout="inline" style={{ textAlign: 'end' }}>
        <Form.Item
          label={intl.get(`${prefix}.materialLotCode`).d('序列号')}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          {getFieldDecorator('materialLotCode')(<Input />)}
        </Form.Item>
        <Form.Item
          style={{ marginTop: '8px', marginBottom: '8px' }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => this.fetchReverse()}
            loading={fetchReverseLoading}
            disabled={!getFieldValue('materialLotCode')}
          >
            逆向追溯
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
