import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col } from 'hzero-ui';
import { isUndefined } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.org.workcell.model.workcell';

@connect(({ workcell }) => ({
  workcell,
}))
@formatterCollections({ code: ['tarzan.org.workcell'] }) // code 为 [服务].[功能]的字符串数组
@Form.create({ fieldNameProp: null })
export default class FunctionalAttributesTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, workcellId, editFlag, organizationUnit } = this.props;
    const { unitName, unitId } = organizationUnit;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.unitId`).d('职能部门')}
            >
              {getFieldDecorator('unitId', {
                initialValue: unitId,
              })(
                <Lov
                  style={{ width: '100%' }}
                  queryParams={{ tenantId }}
                  code="HPFM.UNIT.ORGANIZATION"
                  textValue={unitName}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
