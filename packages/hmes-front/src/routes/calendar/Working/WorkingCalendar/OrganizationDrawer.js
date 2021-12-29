/**
 * WorkingDrawer 分配组织抽屉
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Select, Modal, Row, Col, Button, Icon, Input } from 'hzero-ui';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import notification from 'utils/notification';
import { getSiteId, getSiteCode } from '@/utils/utils';
import OrganizationTree from './OrganizationTree';
import OrganizationTable from './OrganizationTable';
import styles from '../WorkingList/index.less';

const modelPrompt = 'tarzan.calendar.working.model.working';
const FormItem = Form.Item;

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.calendar.working',
})
export default class OrganizationDrawer extends React.PureComponent {
  state = {
    orgType: '',
    selectedSiteId: '',
  };

  componentDidMount() {
    const {
      dispatch,
      working: { displayList = {} },
    } = this.props;
    const { calendarId, calendarType } = displayList;
    const { selectedSiteId } = this.state;
    const siteId = getSiteId();
    dispatch({
      type: 'working/fetchOrgTypeList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CALENDAR_ORGANIZATION_TYPE',
      },
    });
    dispatch({
      type: 'working/fetchSiteList',
      payload: {
        calendarId,
        topSiteId: selectedSiteId || siteId,
      },
    });
    dispatch({
      type: 'working/fetchAreaList',
      payload: {
        calendarId,
        topSiteId: selectedSiteId || siteId,
      },
    });
    dispatch({
      type: 'working/fetchProlineList',
      payload: {
        calendarId,
        topSiteId: selectedSiteId || siteId,
      },
    });
    dispatch({
      type: 'working/fetchWorkcellList',
      payload: {
        calendarId,
        topSiteId: selectedSiteId || siteId,
      },
    });
    dispatch({
      type: 'working/fetchTreeList',
      payload: {
        isBtnQuery: 'Y',
        calendarId,
        parentOrganizationType: 'SITE',
        topSiteId: siteId,
        parentOrganizationId: siteId,
        calendarType,
      },
    });
  }

  componentWillUnmount() {
    this.setState({
      orgType: '',
      selectedSiteId: '',
    });
    this.props.dispatch({
      type: 'working/updateState',
      payload: {
        siteList: [],
        areaList: [],
        prolineList: [],
        workcellList: [],
        siteDeleteKeys: [],
        areaDeleteKeys: [],
        workcellDeleteKeys: [],
        prolineDeleteKeys: [],
        siteDeleteList: [],
        areaDeleteList: [],
        prolineDeleteList: [],
        workcellDeleteList: [],
        treeList: [],
      },
    });
  }

  onSearch = () => {
    const {
      dispatch,
      form,
      working: { displayList = {} },
    } = this.props;
    const { calendarId, calendarType } = displayList;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/fetchTreeList',
          payload: {
            isBtnQuery: 'Y',
            calendarId,
            calendarType,
            ...fieldsValue,
            parentOrganizationType:
              isUndefined(fieldsValue.parentOrganizationType) ||
              fieldsValue.parentOrganizationType === ''
                ? 'SITE'
                : fieldsValue.parentOrganizationType,
            parentOrganizationId:
              isUndefined(fieldsValue.parentOrganizationId) ||
              fieldsValue.parentOrganizationId === ''
                ? fieldsValue.topSiteId
                : fieldsValue.parentOrganizationId,
          },
        });
        const { selectedSiteId } = this.state;
        const siteId = getSiteId();
        dispatch({
          type: 'working/fetchOrgTypeList',
          payload: {
            module: 'CALENDAR',
            typeGroup: 'CALENDAR_ORGANIZATION_TYPE',
          },
        });
        dispatch({
          type: 'working/fetchSiteList',
          payload: {
            calendarId,
            topSiteId: selectedSiteId || siteId,
          },
        });
        dispatch({
          type: 'working/fetchAreaList',
          payload: {
            calendarId,
            topSiteId: selectedSiteId || siteId,
          },
        });
        dispatch({
          type: 'working/fetchProlineList',
          payload: {
            calendarId,
            topSiteId: selectedSiteId || siteId,
          },
        });
        dispatch({
          type: 'working/fetchWorkcellList',
          payload: {
            calendarId,
            topSiteId: selectedSiteId || siteId,
          },
        });
      }
    });
  };

  mapList = list =>
    list.map(item => {
      const {
        working: { checkedKeys = [] },
      } = this.props;
      if (checkedKeys.checked.indexOf(item.id) > -1 && !item.childrens) {
        return { ...item, alreadyDefined: true };
      } else if (checkedKeys.checked.indexOf(item.id) === -1 && item.childrens) {
        return { ...item, childrens: this.mapList(item.childrens) };
      } else if (checkedKeys.checked.indexOf(item.id) > -1 && item.childrens) {
        return { ...item, alreadyDefined: true, childrens: this.mapList(item.childrens) };
      } else {
        return item;
      }
    });

  changeList = list =>
    list.map(item => {
      const {
        working: {
          siteDeleteList = [],
          areaDeleteList = [],
          prolineDeleteList = [],
          workcellDeleteList = [],
        },
      } = this.props;
      const deleteListInit = siteDeleteList
        .concat(areaDeleteList)
        .concat(prolineDeleteList)
        .concat(workcellDeleteList);
      const deleteList = deleteListInit.map(v => v.organizationId);
      if ((deleteList || []).includes(item.id) && !item.childrens) {
        return { ...item, alreadyDefined: false };
      } else if (!(deleteList || []).includes(item.id) && item.childrens) {
        return { ...item, childrens: this.changeList(item.childrens) };
      } else if ((deleteList || []).includes(item.id) && item.childrens) {
        return { ...item, alreadyDefined: false, childrens: this.changeList(item.childrens) };
      } else {
        return item;
      }
    });

  filterList = (list, keys) => {
    const newArr = [];
    list.forEach(item => {
      if (!keys.includes(item.calendarOrgRelId.toString())) newArr.push(item);
    });
    return newArr || [];
  };

  // 点击向右按钮新增组织关系
  saveOrgRel = () => {
    const {
      dispatch,
      working: {
        checkedInfo = {},
        siteList = [],
        areaList = [],
        prolineList = [],
        workcellList = [],
        treeList = [],
        // checkedKeys = [],
        displayList = {},
      },
    } = this.props;
    const { calendarId } = displayList;
    const calendarOrgRelList = [];
    checkedInfo.checkedNodes.map(item => {
      calendarOrgRelList.push({
        organizationId: item.props.dataRef.id,
        organizationType: item.props.dataRef.type,
        organizationTypeDesc: item.props.dataRef.text,
        organizationCode: item.props.dataRef.code,
        enableFlag: 'Y',
      });
      return null;
    });
    dispatch({
      type: 'working/saveOrgRel',
      payload: {
        calendarId,
        enableFlag: 'Y',
        calendarOrgRelList,
      },
    }).then(res => {
      if (res && res.success) {
        const list = this.mapList(treeList);
        dispatch({
          type: 'working/updateState',
          payload: {
            treeList: list,
            checkedKeys: [],
            siteList: siteList.concat(res.rows.filter(item => item.organizationType === 'SITE')),
            areaList: areaList.concat(res.rows.filter(item => item.organizationType === 'AREA')),
            prolineList: prolineList.concat(
              res.rows.filter(item => item.organizationType === 'PROD_LINE')
            ),
            workcellList: workcellList.concat(
              res.rows.filter(item => item.organizationType === 'WORKCELL')
            ),
          },
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  // 点击向左按钮删除组织关系
  deleteOrgRel = () => {
    const {
      dispatch,
      working: {
        siteDeleteKeys = [],
        areaDeleteKeys = [],
        workcellDeleteKeys = [],
        prolineDeleteKeys = [],
        siteList = [],
        areaList = [],
        prolineList = [],
        workcellList = [],
        treeList = [],
      },
    } = this.props;
    const calendarOrgRelIdList = siteDeleteKeys
      .concat(areaDeleteKeys)
      .concat(prolineDeleteKeys)
      .concat(workcellDeleteKeys);
    dispatch({
      type: 'working/deleteOrgRel',
      payload: {
        calendarOrgRelIdList,
      },
    }).then(res => {
      if (res && res.success) {
        dispatch({
          type: 'working/updateState',
          payload: {
            treeList: this.changeList(treeList),
            siteList:
              siteDeleteKeys.length > 0 ? this.filterList(siteList, siteDeleteKeys) : siteList,
            areaList:
              areaDeleteKeys.length > 0 ? this.filterList(areaList, areaDeleteKeys) : areaList,
            prolineList:
              prolineDeleteKeys.length > 0
                ? this.filterList(prolineList, prolineDeleteKeys)
                : prolineList,
            workcellList:
              workcellDeleteKeys.length > 0
                ? this.filterList(workcellList, workcellDeleteKeys)
                : workcellList,
            siteDeleteKeys: [],
            workcellDeleteKeys: [],
            prolineDeleteKeys: [],
            areaDeleteKeys: [],
            siteDeleteList: [],
            areaDeleteList: [],
            prolineDeleteList: [],
            workcellDeleteList: [],
          },
        });
      }
    });
  };

  changeOrgType = val => {
    this.setState({ orgType: val });
    if (isUndefined(val) || val === '') {
      this.props.form.resetFields(['parentOrganizationId']);
    }
  };

  render() {
    const {
      form,
      visible,
      onCancel,
      working: {
        orgTypeList = [],
        checkedKeys = [],
        workcellDeleteKeys = [],
        prolineDeleteKeys = [],
        areaDeleteKeys = [],
        siteDeleteKeys = [],
        displayList = {},
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    const { orgType, selectedSiteId } = this.state;
    const { calendarCode, calendarId, calendarType } = displayList;
    const siteCode = getSiteCode();
    const siteId = getSiteId();
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.calendar.working.title.organization').d('分配组织')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={[
          <Button onClick={onCancel}>
            {intl.get('tarzan.calendar.working.button.return').d('返回')}
          </Button>,
        ]}
      >
        <div className={styles.organizationDrawerContent}>
          <Form className={SEARCH_FORM_CLASSNAME}>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.calendarCode`).d('日历编码')}
                >
                  {getFieldDecorator('calendarCode', {
                    initialValue: calendarCode,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.site`).d('站点')}
                >
                  {getFieldDecorator('topSiteId', {
                    initialValue: siteId,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.site`).d('站点'),
                        }),
                      },
                    ],
                  })(
                    <Lov
                      onChange={val => this.setState({ selectedSiteId: val })}
                      queryParams={{ tenantId }}
                      code="MT.SITE"
                      textValue={siteCode}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={4} className={SEARCH_COL_CLASSNAME}>
                <FormItem>
                  <Button type="primary" htmlType="submit" icon="search" onClick={this.onSearch}>
                    {intl.get('tarzan.calendar.working.button.search').d('查询')}
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col span={10}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.organizationType`).d('组织类型')}
                >
                  {getFieldDecorator('parentOrganizationType')(
                    <Select style={{ width: '100%' }} allowClear onChange={this.changeOrgType}>
                      {(orgTypeList || []).map(item => {
                        return (
                          <Select.Option value={item.typeCode} key={item.typeCode}>
                            {item.description}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.organizationCode`).d('组织编码')}
                >
                  {getFieldDecorator('parentOrganizationId', {
                    rules: [
                      {
                        required: orgType !== '' && !isUndefined(orgType),
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
                        organizationType: orgType,
                        topSiteId: selectedSiteId || siteId,
                      }}
                      disabled={orgType === '' || isUndefined(orgType)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles.bottomContent}>
            <div className={styles.leftTree}>
              <OrganizationTree calendarId={calendarId} calendarType={calendarType} />
            </div>
            <div className={styles.centerButton}>
              <Button onClick={this.saveOrgRel} disabled={checkedKeys.length === 0}>
                <Icon type="right" />
              </Button>
              <Button
                onClick={this.deleteOrgRel}
                disabled={
                  !(
                    siteDeleteKeys.length > 0 ||
                    areaDeleteKeys.length > 0 ||
                    prolineDeleteKeys.length > 0 ||
                    workcellDeleteKeys.length > 0
                  )
                }
              >
                <Icon type="left" />
              </Button>
            </div>
            <div className={styles.rightTable}>
              <OrganizationTable />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
