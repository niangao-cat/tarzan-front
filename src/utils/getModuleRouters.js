import { getModuleRouters } from 'utils/utils';
import * as hzeroFrontHagdRouters from 'hzero-front-hagd/lib/utils/router';
import * as hzeroFrontHcnfRouters from 'hzero-front-hcnf/lib/utils/router';
import * as hzeroFrontHdttRouters from 'hzero-front-hdtt/lib/utils/router';
import * as hzeroFrontHfileRouters from 'hzero-front-hfile/lib/utils/router';
import * as hzeroFrontHiamRouters from 'hzero-front-hiam/lib/utils/router';
import * as hzeroFrontHimpRouters from 'hzero-front-himp/lib/utils/router';
import * as hzeroFrontHitfRouters from 'hzero-front-hitf/lib/utils/router';
import * as hzeroFrontHmsgRouters from 'hzero-front-hmsg/lib/utils/router';
import * as hzeroFrontHrptRouters from 'hzero-front-hrpt/lib/utils/router';
import * as hzeroFrontHsdrRouters from 'hzero-front-hsdr/lib/utils/router';
import * as hzeroFrontHwfpRouters from 'hzero-front-hwfp/lib/utils/router';
import * as hzeroFrontHresRouters from 'hzero-front-hres/lib/utils/router';
import * as hzeroFrontHimsRouters from 'hzero-front-hims/lib/utils/router';
import * as hzeroFrontHpfmRouters from 'hzero-front-hpfm/lib/utils/router';
import * as hippiusFrontAnalyse from 'hippius-front-analyse/lib/utils/router';
import * as hippiusFrontApp from 'hippius-front-app/lib/utils/router';
import * as hippiusFrontContact from 'hippius-front-contact/lib/utils/router';
import * as hippiusFrontMsggroup from 'hippius-front-msggroup/lib/utils/router';
import * as hippiusFrontSubapp from 'hippius-front-subapp/lib/utils/router';
import * as hmesFrontRouters from 'hmes-front/lib/utils/router';
import * as rkFrontRouters from 'rk-front/lib/utils/router';

export default app =>
  getModuleRouters(app, [
    hzeroFrontHagdRouters,
    hzeroFrontHcnfRouters,
    hzeroFrontHdttRouters,
    hzeroFrontHfileRouters,
    hzeroFrontHiamRouters,
    hzeroFrontHimpRouters,
    hzeroFrontHitfRouters,
    hzeroFrontHmsgRouters,
    hzeroFrontHpfmRouters,
    hzeroFrontHrptRouters,
    hzeroFrontHsdrRouters,
    hzeroFrontHwfpRouters,
    hzeroFrontHresRouters,
    hzeroFrontHimsRouters,
    hippiusFrontAnalyse,
    hippiusFrontApp,
    hippiusFrontContact,
    hippiusFrontMsggroup,
    hippiusFrontSubapp,
    hmesFrontRouters,
    rkFrontRouters,
  ]);
