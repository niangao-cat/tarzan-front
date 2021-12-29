import React, { PureComponent } from 'react';
import { Form, Row, Col, Input } from 'hzero-ui';
// import { Bind } from 'lodash-decorators';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.badCode.defectCode.model.defectCode';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@Form.create({ fieldNameProp: null })
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      detailHead,
      defaultSite,
    } = this.props;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <React.Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteId`).d('站点')}
              >
                {getFieldDecorator('siteId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.siteId`).d('站点'),
                      }),
                    },
                  ],
                  initialValue: detailHead.siteId||defaultSite.siteId,
                })(
                  <Lov
                    code="MT.SITE"
                    onChange={this.changeSite}
                    queryParams={{ tenantId }}
                    textValue={detailHead.siteCode||defaultSite.siteCode}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dispositionGroup`).d('处置组编码')}
              >
                {getFieldDecorator('dispositionGroup', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dispositionGroup`).d('不良代码类型'),
                      }),
                    },
                  ],
                  initialValue: detailHead.dispositionGroup,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('处置组描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: detailHead.description,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
