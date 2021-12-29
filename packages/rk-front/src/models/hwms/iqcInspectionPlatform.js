/**
 * @Description: IQC检验平台
 * @author: ywj
 * @date 2020/5/15 9:44
 * @version 1.0
 */

// 引入必要
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import { updateMaterialLotCode, queryBaseData, queryInspectHeadData, queryInspectLineData, queryInspectDetailData, queryInspectShowData, deleteInspectLineData, saveInspectLineData, queryInspectLineTwoData, queryInspectLineByLovForData, saveInspectAllData, submitInspectAllData, queryBadNumberBarcode, saveBadNumberBarcode, deleteBadNumberBarcode, fetchMaterialLotCode, fetchMaterialLotCodeSL, queryBook, bookShowOne } from '@/services/hwms/IqcInspectionPlatformService';
import { ergodicData } from '@/utils/utils';
import uuid from 'uuid/v4';

// 输出状态
export default {
  // 命名空间
  namespace: 'iqcInspectionPlatform',
  // 静态状态
  state: {
    dataList: [], // 日期
    pagination: {}, // 分页
    dealStatusMap: [], // 处理状态
    isStatusMap: [], // 是否加急
    resultMap: [], // 检验状态
    typeOptionsMap: [], // 检验项别
    defectLevelMap: [], // 	缺陷等级
    aqlMap: [], // AQL值
    inspectLevelMap: [], // 检验水平
    inspectToolMap: [], // 检验工具
    inspectTypeMap: [], // 检验类型
    sampleTypeMap: [], // 检验工具
    specificalTypeMap: [], // 规格类型
    inspectHeadData: {}, // 头信息
    inspectLineData: [], // 行信息
    inspectLineBeforeData: [], // 行信息
    paginationLine: {}, // 分页
    inspectDetailData: [], // 明细信息
    paginationDetail: {}, // 分页
    inspectShowData: [], // 质检单数据
    inspectShowPagination: {}, // 分页
    inspectShowLineData: [], // 质检单数据
    inspectShowLinePagination: {}, // 分页
    inspectLineSelect: {},
    badNumberBarcodeList: [], // 条码不良数查询数据
    badNumberBarcodePagination: {}, // 条码不良数分页
    materialLotCodeList: [],
    materialLotCodePagination: {},
    materialLotCodeSLListPagination: {},
    materialLotCodeSLList: [],
    bookList: [],
    bookDetailList: [],
    bookDetailPagination: {},
  },
  // 调用接口
  effects: {
    // 获取下拉框的值
    *init(_, { call, put }) {
      // 调用状态接口
      const result = getResponse(
        yield call(queryMapIdpValue, {
          dealStatusMap: 'QMS.INSPECTION_DOC_STATUS',
          isStatusMap: 'QMS.IDENTIFICATION',
          resultMap: 'QMS.INSPECTION_RESULT',
          typeOptionsMap: "QMS.INSPECTION_CONTENT_TYPE", // 检验项别
          defectLevelMap: "QMS.DEFECT_LEVEL", // 	缺陷等级
          aqlMap: "QMS.IQC_AQL", // AQL值
          inspectLevelMap: "QMS.IQC_INSPECTION_LEVELS", // 检验水平
          specificalTypeMap: "QMS.STANDARD_TYPE", // 规格类型
          inspectToolMap: "QMS.INSPECTION_TOOL", // 检验工具
          sampleTypeMap: "QMS.IQC_SAMPLE_TYPE",
          inspectTypeMap: "QMS.DOC_INSPECTION_TYPE",
        })
      );
      if (result) {
        // 返回成功状态赋值
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }

      // 获取自定义的值集
      const resultMap = getResponse(
        yield call(queryUnifyIdpValue, "QMS.STANDARD_TYPE", // 规格类型
        )
      );
      if (resultMap) {
        // 返回成功状态赋值
        yield put({
          type: 'updateState',
          payload: {
            specificalTypeMap: resultMap,
          },
        });
      }
    },
    // 查询数据
    *queryBaseData({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryBaseData, payload));

      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },

    // 查询数据
    *queryBook({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryBook, payload));

      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            bookList: result,
          },
        });
      }
    },

    // 查询数据
    *bookShowOne({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(bookShowOne, payload));

      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            bookDetailList: result.content,
            bookDetailPagination: createPagination(result),
          },
        });
      }
    },

    // 查询数据
    *queryInspectData({ payload }, { call, put }) {

      // 清空民明细
      yield put({
        type: 'updateState',
        payload: {
          inspectLineSelect: {},
        },
      });

      // 调用接口
      const result = getResponse(yield call(queryInspectHeadData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectHeadData: result.content[0],
            inspectLineData: [],
            paginationLine: {},
          },
        });
        // 同时查询行信息
        if (result.content.length > 0) {
          const resultLine = getResponse(yield call(queryInspectLineData, { iqcHeaderId: result.content[0].iqcHeaderId }));
          if (resultLine) {
            //  遍历 为没有uuid的加上uuid
            for (let i = 0; i < resultLine.length; i++) {

              resultLine[i].sampleSizeTem = resultLine[i].sampleSize;
              // 设置对应的行是否能被修改
              if (result.content[0].inspectionStatusMeaning !== "完成") {
                resultLine[i]._status = 'update';
              }

              if (resultLine[i].attachmentUuid) {
                resultLine[i].attachmentUuid = resultLine[i].attachmentUuid;
              } else {
                resultLine[i].attachmentUuid = uuid();
              }

              if (resultLine[i].detailList !== undefined && resultLine[i].detailList.length > 0) {
                // 明细下对应的主键设置为唯一数据
                for (let j = 0; j <= resultLine[i].detailList.length - 1; j++) {
                  // 设置对应的明细是否能被修改
                  if (result.content[0].inspectionStatusMeaning !== "完成") {
                    resultLine[i].detailList[j]._status = 'update';
                  }
                  if (resultLine[i].detailList[j].iqcDetailsId) {
                    resultLine[i].detailList[j].detailId = `${resultLine[i].iqcLineId}-${resultLine[i].detailList[j].number}`;
                  } else {
                    resultLine[i].detailList[j].detailId = `${resultLine[i].detailList[j].iqcLineId}-${resultLine[i].detailList[j].number}`;
                  }
                  resultLine[i].detailList[j].$form = {};
                }
              }
              resultLine[i].$form = {};
            }

            yield put({
              type: 'updateState',
              payload: {
                inspectLineData: resultLine,
                inspectLineBeforeData: JSON.parse(JSON.stringify(resultLine)),
              },
            });
          }
        } else {
          yield put({
            type: 'updateState',
            payload: {
              inspectLineData: [],
              paginationLine: {},
              inspectHeadData: {},
            },
          });
        }
      }
    },

    // 查询数据
    *queryInspectLineData({ payload }, { call, put }) {
      // 调用接口
      const resultLine = getResponse(yield call(queryInspectLineData, payload));
      if (resultLine) {
        //  遍历 为没有uuid的加上uuid
        for (let i = 0; i < resultLine.content.length; i++) {
          if (resultLine.content[i].attachmentUuid) {
            resultLine.content[i].attachmentUuid = resultLine.content[i].attachmentUuid;
          } else {
            resultLine.content[i].attachmentUuid = uuid();
          }

          // 明细下对应的主键设置为唯一数据
          if (resultLine.content[i].detailList !== undefined && resultLine.content[i].detailList.length > 0) {
            // 明细下对应的主键设置为唯一数据
            for (let j = 0; j <= resultLine.content[i].detailList.length - 1; j++) {
              if (resultLine.content[i].detailList[j].iqcDetailsId) {
                resultLine.content[i].detailList[j].detailId = `${resultLine.content[i].iqcLineId}-${resultLine.content[i].detailList[j].number}`;
              } else {
                resultLine.content[i].detailList[j].detailId = `${resultLine.content[i].detailList[j].iqcLineId}-${resultLine.content[i].detailList[j].number}`;

              }
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            inspectLineData: resultLine.content,
            paginationLine: createPagination(resultLine),
          },
        });
      }
    },

    // 查询明细数据
    *queryInspectDetailData({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          inspectDetailData: [],
          paginationDetail: {},
        },
      });
      // 调用接口
      const result = getResponse(yield call(queryInspectDetailData, payload));
      if (result) {
        // 初始化抽样个数
        const sampleCount = Number(payload.sampleSize);
        // 设置要增加的数量
        let setIncreaseData = [];
        if (sampleCount > result.content.length) {
          for (let i = 0; i < (sampleCount - result.content.length); i++) {
            if (result.content.length > 0) {
              const number = result.content[result.content.length - 1].number === "" ? 0 : Number(result.content[result.content.length - 1].number);
              setIncreaseData = [...setIncreaseData, { number: number + 1 }];
            } else {
              setIncreaseData = [...setIncreaseData, { number: i + 1 }];
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            inspectDetailData: [...result.content, ...setIncreaseData],
            paginationDetail: createPagination(result),
          },
        });
      }
    },

    // 查询质检单数据
    *queryInspectShowData({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryInspectShowData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectShowData: result.content,
            inspectShowPagination: createPagination(result),
          },
        });
      }
    },

    // 删除行信息
    *deleteInspectLineData({ payload }, { call }) {
      // 调用接口
      const result = yield call(deleteInspectLineData, ergodicData(payload));
      return getResponse(result);
    },

    // 保存行信息
    *saveInspectLineData({ payload }, { call }) {
      // 调用接口
      const result = yield call(saveInspectLineData, ergodicData(payload));
      return getResponse(result);
    },

    // 查询行新增数据
    *queryInspectLineTwoData({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryInspectLineTwoData, payload));

      if (result) {
        if (result.content.length > 0) {
          for (let i = 0; i < result.content.length; i++) {
            result.content[i].defectLevels = "";
            result.content[i]._status = "update";
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            inspectShowLineData: result.content,
            inspectShowLinePagination: createPagination(result),
          },
        });
      }
    },

    // 检验方案类型数据回填
    *queryInspectLineByLovForData({ payload }, { call }) {
      // 调用接口
      const result = yield call(queryInspectLineByLovForData, payload);
      return getResponse(result);
    },

    // 检验界面数据回填
    *saveInspectAllData({ payload }, { call }) {
      // 调用接口
      const result = yield call(saveInspectAllData, payload);
      return getResponse(result);
    },

    // 检验界面数据回填
    *submitInspectAllData({ payload }, { call }) {
      // 调用接口
      const result = yield call(submitInspectAllData, payload);
      return getResponse(result);
    },

    // 条码不良数查询
    *queryBadNumberBarcode({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryBadNumberBarcode, payload));
      for (let i = 0; i < result.content.length; i++) {
        result.content[i]._status = 'update';
      }
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            badNumberBarcodeList: result.content,
            badNumberBarcodePagination: createPagination(result),
          },
        });
      }
    },

    // 条码不良数保存
    *saveBadNumberBarcode({ payload }, { call }) {
      // 调用接口
      const result = yield call(saveBadNumberBarcode, ergodicData(payload));
      return getResponse(result);
    },

    // 条码不良数删除
    *deleteBadNumberBarcode({ payload }, { call }) {
      // 调用接口
      const result = yield call(deleteBadNumberBarcode, ergodicData(payload));
      return getResponse(result);
    },
    *fetchMaterialLotCode({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialLotCode, payload));
      if (result) {
        const arr = [];
        result.content.forEach(ele => {
          arr.push({
            ...ele,
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            materialLotCodeList: arr,
            materialLotCodePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *updateMaterialLotCode({ payload }, { call }) {
      // 调用接口
      const result = yield call(updateMaterialLotCode, payload);
      return getResponse(result);
    },
    // 查询物料批及供应商批次
    *fetchMaterialLotCodeSL({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialLotCodeSL, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialLotCodeSLList: result.content,
            materialLotCodeSLListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
  },
  // 更改状态
  reducers: {
    // 更新状态
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
