import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Switch } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import TLEditor from '@/components/TLEditor';
import notification from 'utils/notification';
import { get as chainGet } from 'lodash';

const modelPrompt = 'tarzan.badCode.defectGroup.model.defectGroup';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ defectGroup, loading }) => ({
  defectGroup,
  fetchListLoading: loading.effects['defectGroup/fetchDataSourceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.badCode.defectGroup',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  changeSite = val => {
    const {
      dispatch,
      defectGroup: { mtNcSecondaryCodeList = [], mtNcValidOperList = [] },
    } = this.props;
    const middle1 = chainGet(mtNcSecondaryCodeList, `[0]["_status"]`, '') === 'create';

    const middle2 = chainGet(mtNcValidOperList, `[0]["_status"]`, '') === 'create';
    if (middle1) {
      mtNcSecondaryCodeList.shift();
    }
    if (middle2) {
      mtNcValidOperList.shift();
    }
    dispatch({
      type: 'defectGroup/updateStateSelf',
      payload: {
        limitSiteId: val,
        mtNcSecondaryCodeList,
        mtNcValidOperList,
      },
    }).finally(() => {
      if (middle1 || middle2) {
        notification.info({
          message: intl.get(`tarzan.badCode.defectGroup.message.deleteMessage`).d('因更换站点，已删除次级不良代码与工艺维护里面的所有新增状态数据'),
        });
      }
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      ncGroupId,
      defectGroup: { defectCodeItem = {} },
      canEdit,
    } = this.props;
    const { siteId, siteName, ncGroupCode, description, enableFlag } = defectCodeItem;
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
                  initialValue: siteId,
                })(
                  <Lov
                    code="MT.SITE"
                    disabled={siteId}
                    textValue={siteName}
                    onChange={this.changeSite}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ncGroupCode`).d('不良代码组编码')}
              >
                {getFieldDecorator('ncGroupCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncGroupCode`).d('不良代码组编码'),
                      }),
                    },
                  ],
                  initialValue: ncGroupCode,
                })(<Input disabled={ncGroupCode} trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ncGroupCodeDesc`).d('不良代码组描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncGroupCodeDesc`).d('不良代码组描述'),
                      }),
                    },
                  ],
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.ncGroupCodeDesc`).d('不良代码组描述')}
                    field="description"
                    disabled={!canEdit}
                    dto="tarzan.method.domain.entity.MtNcGroup"
                    pkvalue={{ ncGroupId: ncGroupId === 'create' ? null : ncGroupId }}
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get('tarzan.common.label.enableFlag').d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag || 'Y',
                })(<Switch disabled={!canEdit} checkedValue="Y" unCheckedValue="N" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
