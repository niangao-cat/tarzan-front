import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Switch, Select, Input } from 'hzero-ui';
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

const modelPrompt = 'tarzan.badCode.defectCode.model.defectCode';
const { Option } = Select;
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ defectCode, loading }) => ({
  defectCode,
  fetchListLoading: loading.effects['defectCode/fetchDataSourceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.badCode.defectCode',
})
export default class DisplayForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  changeSite = val => {
    const {
      dispatch,
      defectCode: { mtNcSecondaryCodeList = [], mtNcValidOperList = [] },
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
      type: 'defectCode/updateStateSelf',
      payload: {
        limitSiteId: val,
        mtNcSecondaryCodeList,
        mtNcValidOperList,
      },
    }).finally(() => {
      if (middle1 || middle2) {
        notification.info({
          message: intl.get(`tarzan.badCode.defectCode.message.deleteMessage`).d('因更换站点，已删除次级不良代码与工艺维护里面的所有新增状态数据'),
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
      ncCodeId,
      defectCode: { defectCodeItem = {}, ncTypeList = [] },
      canEdit,
    } = this.props;
    const {
      siteId,
      siteName,
      ncType,
      ncGroupCode,
      ncGroupId,
      ncCode,
      enableFlag,
      description,
    } = defectCodeItem;
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
                label={intl.get(`${modelPrompt}.ncType`).d('不良代码类型')}
              >
                {getFieldDecorator('ncType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncType`).d('不良代码类型'),
                      }),
                    },
                  ],
                  initialValue: ncType,
                })(
                  <Select style={{ width: '100%' }} allowClear disabled={!canEdit}>
                    {ncTypeList.map(ele => (
                      <Option value={ele.typeCode}>{ele.description}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ncGroupDesc`).d('不良代码组')}
              >
                {getFieldDecorator('ncGroupId', {
                  initialValue: ncGroupId,
                })(
                  <Lov
                    code="MT.NC_GROUP"
                    disabled={!canEdit}
                    textValue={ncGroupCode}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ncCode`).d('不良代码编码')}
              >
                {getFieldDecorator('ncCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncCode`).d('不良代码编码'),
                      }),
                    },
                  ],
                  initialValue: ncCode,
                })(
                  <Input disabled={ncCode} inputChinese={false} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.ncCodeDesc`).d('不良代码描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.ncCodeDesc`).d('不良代码描述'),
                      }),
                    },
                  ],
                })(
                  <TLEditor
                    label={intl.get(`${modelPrompt}.ncCodeDesc`).d('不良代码描述')}
                    field="description"
                    disabled={!canEdit}
                    dto="tarzan.method.domain.entity.MtNcCode"
                    pkvalue={{ ncCodeId: ncCodeId === 'create' ? null : ncCodeId }}
                    inputSize={{ zh: 64, en: 64 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get('tarzan.common.label.enableFlag').d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
