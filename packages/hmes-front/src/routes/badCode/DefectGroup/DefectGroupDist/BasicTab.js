import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Switch, InputNumber, Modal } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  FORM_COL_2_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT_MAX,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
// import TLEditor from '@/components/TLEditor';

const modelPrompt = 'tarzan.badCode.defectGroup.model.defectGroup';
// const { Option } = Select;
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
export default class BasicTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  canBePrimaryCode = val => {
    const {
      dispatch,
      defectGroup: { mtNcSecondaryCodeList = [] },
      form,
    } = this.props;
    if (!val) {
      this.props.form.setFieldsValue({
        secondaryReqdForClose: false,
      });
    }
    if (!val && mtNcSecondaryCodeList.length > 0) {
      Modal.confirm({
        title: intl.get(`tarzan.badCode.defectGroup.title.remind`).d('提醒'),
        content: intl.get(`tarzan.badCode.defectGroup.message.confirm.delete`).d('此操作会删除不良代码'),
        onOk: () => {
          const dto = {
            canBePrimaryCode: val,
            mtNcSecondaryCodeList: val ? mtNcSecondaryCodeList : [],
          };
          if (!val) {
            form.setFieldsValue({
              secondaryReqdForClose: false,
            });
          }
          dispatch({
            type: 'defectGroup/updateState',
            payload: dto,
          });
        },
      });
    } else {
      dispatch({
        type: 'defectGroup/updateState',
        payload: {
          canBePrimaryCode: val,
        },
      });
    }
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      defectGroup: { defectCodeItem = {}, canBePrimaryCode = true },
      canEdit,
    } = this.props;
    const {
      priority,
      maxNcLimit,
      closureRequired,
      autoCloseIncident,
      allowNoDisposition,
      autoClosePrimary,
      componentRequired,
      confirmRequired,
      validAtAllOperations,
      secondaryCodeSpInstr,
      secondaryReqdForClose,
      dispositionGroupDesc,
      dispositionGroupId,
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
                label={intl.get(`${modelPrompt}.priority`).d('优先级')}
              >
                {getFieldDecorator('priority', {
                  initialValue: priority,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.priority`).d('优先级'),
                      }),
                    },
                  ],
                })(
                  <InputNumber
                    precision={0}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dispositionGroupDesc`).d('默认处置组')}
              >
                {getFieldDecorator('dispositionGroupId', {
                  initialValue: dispositionGroupId,
                })(
                  <Lov
                    code="MT.DISPOSITION_GROUP"
                    disabled={!canEdit}
                    textValue={dispositionGroupDesc}
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.maxNcLimit`).d('最大限制值')}
              >
                {getFieldDecorator('maxNcLimit', {
                  initialValue: maxNcLimit,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.maxNcLimit`).d('最大限制值'),
                      }),
                    },
                  ],
                })(<InputNumber min={0} style={{ width: '100%' }} disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.closureRequired`).d('是否需要关闭')}
              >
                {getFieldDecorator('closureRequired', {
                  initialValue: closureRequired === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.autoCloseIncident`).d('自动关闭事务')}
              >
                {getFieldDecorator('autoCloseIncident', {
                  initialValue: autoCloseIncident === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.secondaryReqdForClose`).d('需要次级代码关闭')}
              >
                {getFieldDecorator('secondaryReqdForClose', {
                  initialValue: secondaryReqdForClose === 'Y',
                })(<Switch disabled={!canEdit || !canBePrimaryCode} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.canBePrimaryCode`).d('可以是主代码')}
              >
                <Switch
                  disabled={!canEdit}
                  checked={canBePrimaryCode}
                  onChange={this.canBePrimaryCode}
                />
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.autoClosePrimary`).d('自动关闭主代码')}
              >
                {getFieldDecorator('autoClosePrimary', {
                  initialValue: autoClosePrimary === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.validAtAllOperations`).d('对所有工艺有效')}
              >
                {getFieldDecorator('validAtAllOperations', {
                  initialValue: validAtAllOperations === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.allowNoDisposition`).d('允许无处置')}
              >
                {getFieldDecorator('allowNoDisposition', {
                  initialValue: allowNoDisposition === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.componentRequired`).d('是否需要组件')}
              >
                {getFieldDecorator('componentRequired', {
                  initialValue: componentRequired === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.confirmRequired`).d('是否需要复核')}
              >
                {getFieldDecorator('confirmRequired', {
                  initialValue: confirmRequired === 'Y',
                })(<Switch disabled={!canEdit} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_MAX}
              label={intl.get(`${modelPrompt}.secondaryCodeSpInstr`).d('次级代码特殊指令')}
            >
              {getFieldDecorator('secondaryCodeSpInstr', {
                initialValue: secondaryCodeSpInstr,
              })(<Input precision={0} disabled={!canEdit} />)}
            </Form.Item>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
