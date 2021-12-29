/*
 * @Description: sn替换
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-04 10:13:57
 * @LastEditTime: 2020-12-03 15:38:08
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Spin, Input, Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

@connect(({ snReplace, loading }) => ({
  snReplace,
  snReplaceLoading: loading.effects['snReplace/snReplace'],
}))
@Form.create({ fieldNameProp: null })
export default class SnReplace extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  @Bind
  snReplace(){
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (values.oldMaterialLotCode===values.newMaterialLotCode) {
          return notification.error({
            message: '存在相同条码，请确认！',
          });
        }
        dispatch({
          type: 'snReplace/snReplace',
          payload: [{...values }],
        }).then(res=>{
          if (res) {
            notification.success();
            form.resetFields();
          }
        });
      }
    });
  }

  /**
   * 批量导入
   */
  @Bind()
  handleBatchImport() {
    openTab({
      key: '/hhme/sn-replace/HME.SN_REPLACE',
      search: queryString.stringify({
        key: '/hhme/sn-replace/HME.SN_REPLACE',
        title: 'hzero.common.title.batchImport',
        action: 'hzero.common.title.batchImport',
        auto: true,
      }),
    });
  }

  render() {
    const {
      form,
      snReplaceLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Header title="SN替换">
          <Button
            icon="to-top"
            onClick={this.handleBatchImport}
          >
            批量导入
          </Button>
        </Header>
        <Content>
          <Spin spinning={false}>
            <Form className={SEARCH_FORM_CLASSNAME}>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col span={6}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="原SN条码">
                    {getFieldDecorator('oldMaterialLotCode', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '原SN条码',
                          }),
                        },
                      ],
                    })(<Input trimAll />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col span={6}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="新SN条码">
                    {getFieldDecorator('newMaterialLotCode', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '新SN条码',
                          }),
                        },
                      ],
                    })(<Input trimAll />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Form.Item wrapperCol={{ span: 6 }} style={{textAlign: 'center'}}>
                  <Button
                    type="primary"
                    onClick={()=>this.snReplace()}
                    loading={snReplaceLoading}
                    style={{width: '50%', marginLeft: '37%'}}
                  >
                    替换
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
