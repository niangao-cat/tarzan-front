const mockjs = require('mockjs');

module.exports = {
  'GET /mes/v1/mt-materials/0/property/10': (req, res) => {
    const d = mockjs.mock({
      rows: [
        {
          assembleAsMaterialFlag: "Y",
          autoRevisionFlag: "Y",
          bomId: "1.1",
          bomName: "BOM-10133",
          bomStatus: "CAN_RELEASE",
          bomType: "MATERIAL",
          cid: null,
          copiedFromBomId: "10133",
          currentFlag: "N",
          dateFrom: "2019-02-10 11:11:12",
          dateTo: "2019-12-01 11:16:19",
          description: "测试装配清单010",
          fromBomName: "BOM-010",
          fromBomType: "MATERIAL",
          fromRevision: "10",
          objectVersionNumber: null,
          primaryQty: 2,
          releasedFlag: "N",
          revision: "07",
          _token: "c6debdb6e6f33fcfb76cc04008b5d401",
          bomComponent: [{
            assembleAsReqFlag: "N",
            assembleMethod: "BACKLASH",
            attritionChance: null,
            attritionPolicy: null,
            attritionQty: 1,
            bomComponentId: "1.1",
            bomComponentType: "ASSEMBLING",
            bomId: "1.1",
            cid: 20154,
            copiedFromComponentId: null,
            dateFrom: "2019-02-01 00:00:00",
            dateTo: "2019-05-25 00:00:00",
            keyMaterialFlag: "Y",
            lineNumber: 1,
            materialCode: "M-Material_002-004",
            materialId: "10",
            materialName: "",
            objectVersionNumber: null,
            qty: 777,
            _token: "247c8cb8bde797c31b8e28a127e20d5c",
          }],
        },
      ],
    }).list[0];
    res.json(d);
  },
  'GET /hpfm/v1/users': (req, res) => {
    const d = mockjs.mock({
      'list|1-200': [
        {
          name: mockjs.mock('@name'),
          password: mockjs.mock('@password'),
        },
      ],
    }).list;
    res.json(d);
  },
};
