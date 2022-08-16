import { mockQuery } from 'tests/setup/setupGraphQL';

import {
  GetCustomerQuery,
} from 'types/generated-types';

/**
 * Mock: GetCustomerQuery
 *
 * Origin: Description of how the mock was created
 */
// eslint-disable-next-line
export const GetCustomerResponse: GetCustomerQuery = JSON.parse('{"customer":{"id":"cl475x7mk0047943qgkvxwctd","name":"Club hades","slug":"club-hades","dialogue":{"id":"cl475xf9z10198943q6qhilvvn","title":"Female - U18 - Team2","slug":"Female-U18-Team2","publicTitle":null,"language":"ENGLISH","creationDate":"1654787796119","updatedAt":"1654787796455","postLeafNode":{"header":"Thank you for your input!","subtext":"Life should be fulfilling","__typename":"DialogueFinisherObjectType"},"leafs":[{"id":"cl4bi8w6p2195gt3qryviq89u","title":"test","isRoot":false,"isLeaf":true,"type":"REGISTRATION","extraContent":null,"children":[],"overrideLeaf":null,"share":null,"form":null,"links":[],"sliderNode":null,"options":[],"__typename":"QuestionNode"},{"id":"cl475xfay10231943q1k4bxuly","title":"Your feedback will always remain anonymous, unless you want to talk to someone.","isRoot":false,"isLeaf":true,"type":"FORM","extraContent":null,"children":[],"overrideLeaf":null,"share":null,"form":{"id":"cl475xfay10232943qrcxpggp3","helperText":null,"fields":[{"id":"cl475xfay10233943q6eq9s46j","label":"First name","type":"shortText","placeholder":null,"isRequired":false,"position":1,"__typename":"FormNodeField"},{"id":"cl475xfay10234943quu0mxp18","label":"Last name","type":"shortText","placeholder":null,"isRequired":false,"position":1,"__typename":"FormNodeField"},{"id":"cl475xfay10235943q7pg7vqt5","label":"Email","type":"email","placeholder":null,"isRequired":false,"position":1,"__typename":"FormNodeField"}],"__typename":"FormNodeType"},"links":[],"sliderNode":null,"options":[],"__typename":"QuestionNode"}],"customerId":"cl475x7mk0047943qgkvxwctd","rootQuestion":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","isRoot":true,"isLeaf":false,"type":"SLIDER","extraContent":null,"children":[{"id":"cl475xffn10400943qh3t97oez","conditions":[{"id":89,"conditionType":"valueBoundary","matchValue":null,"renderMin":70,"renderMax":100,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfct10354943qe9bkpdvw","title":"What\'s going well?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfgl10427943qnea7g8o7","conditions":[{"id":90,"conditionType":"valueBoundary","matchValue":null,"renderMin":55,"renderMax":70,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfdj10364943qjsbdvofw","title":"What\'s going well, but can be improved?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfhg10453943qnnm32q2u","conditions":[{"id":91,"conditionType":"valueBoundary","matchValue":null,"renderMin":25,"renderMax":55,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfe410374943qxfylutsk","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfi510479943qsv0m2dj3","conditions":[{"id":92,"conditionType":"valueBoundary","matchValue":null,"renderMin":0,"renderMax":25,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfex10387943qcndqxunx","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"}],"overrideLeaf":null,"share":null,"form":null,"links":[],"sliderNode":{"id":"cl475xfbz10291943qjn8q6ig9","happyText":null,"unhappyText":null,"markers":[{"id":"cl475xfbz10304943qpytm2syc","label":"Terrible","subLabel":"It\'s going terrible.","range":{"id":"cl475xfbz10305943qffxxe8fj","start":null,"end":3,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10301943qaz1ko7ub","label":"Bad","subLabel":"It\'s going bad.","range":{"id":"cl475xfbz10302943qpve3efh9","start":3,"end":5,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10298943qdpekdg5g","label":"Neutral!","subLabel":"It could be better.","range":{"id":"cl475xfbz10299943qfnodb4py","start":5,"end":6,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10295943q3tuu41m8","label":"Amazing!","subLabel":"It\'s going amazing.","range":{"id":"cl475xfbz10296943qzym8pgc4","start":9.5,"end":null,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10292943qak497k4b","label":"Good!","subLabel":"It\'s going well.","range":{"id":"cl475xfbz10293943qlql9uyha","start":6,"end":9.5,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"}],"__typename":"SliderNodeType"},"options":[],"__typename":"QuestionNode"},"questions":[{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","isRoot":true,"isLeaf":false,"type":"SLIDER","extraContent":null,"children":[{"id":"cl475xffn10400943qh3t97oez","conditions":[{"id":89,"conditionType":"valueBoundary","matchValue":null,"renderMin":70,"renderMax":100,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfct10354943qe9bkpdvw","title":"What\'s going well?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfgl10427943qnea7g8o7","conditions":[{"id":90,"conditionType":"valueBoundary","matchValue":null,"renderMin":55,"renderMax":70,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfdj10364943qjsbdvofw","title":"What\'s going well, but can be improved?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfhg10453943qnnm32q2u","conditions":[{"id":91,"conditionType":"valueBoundary","matchValue":null,"renderMin":25,"renderMax":55,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfe410374943qxfylutsk","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfi510479943qsv0m2dj3","conditions":[{"id":92,"conditionType":"valueBoundary","matchValue":null,"renderMin":0,"renderMax":25,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfex10387943qcndqxunx","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"}],"overrideLeaf":null,"share":null,"form":null,"links":[],"sliderNode":{"id":"cl475xfbz10291943qjn8q6ig9","happyText":null,"unhappyText":null,"markers":[{"id":"cl475xfbz10304943qpytm2syc","label":"Terrible","subLabel":"It\'s going terrible.","range":{"id":"cl475xfbz10305943qffxxe8fj","start":null,"end":3,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10301943qaz1ko7ub","label":"Bad","subLabel":"It\'s going bad.","range":{"id":"cl475xfbz10302943qpve3efh9","start":3,"end":5,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10298943qdpekdg5g","label":"Neutral!","subLabel":"It could be better.","range":{"id":"cl475xfbz10299943qfnodb4py","start":5,"end":6,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10295943q3tuu41m8","label":"Amazing!","subLabel":"It\'s going amazing.","range":{"id":"cl475xfbz10296943qzym8pgc4","start":9.5,"end":null,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"},{"id":"cl475xfbz10292943qak497k4b","label":"Good!","subLabel":"It\'s going well.","range":{"id":"cl475xfbz10293943qlql9uyha","start":6,"end":9.5,"__typename":"SliderNodeRangeType"},"__typename":"SliderNodeMarkerType"}],"__typename":"SliderNodeType"},"options":[],"__typename":"QuestionNode"},{"id":"cl475xfct10354943qe9bkpdvw","title":"What\'s going well?","isRoot":false,"isLeaf":false,"type":"CHOICE","extraContent":null,"children":[],"overrideLeaf":null,"share":null,"form":null,"links":[],"sliderNode":null,"options":[{"id":529,"value":"Physical & Mental","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":530,"value":"Coaching","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":531,"value":"Home","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":532,"value":"School","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":533,"value":"Team Members","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":534,"value":"Own Performance","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"}],"__typename":"QuestionNode"},{"id":"cl475xfdj10364943qjsbdvofw","title":"What\'s going well, but can be improved?","isRoot":false,"isLeaf":false,"type":"CHOICE","extraContent":null,"children":[],"overrideLeaf":null,"share":null,"form":null,"links":[],"sliderNode":null,"options":[{"id":535,"value":"Physical & Mental","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":536,"value":"Coaching","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":537,"value":"Home","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":538,"value":"School","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":539,"value":"Team Members","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":540,"value":"Own Performance","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"}],"__typename":"QuestionNode"},{"id":"cl475xfe410374943qxfylutsk","title":"What went wrong?","isRoot":false,"isLeaf":false,"type":"CHOICE","extraContent":null,"children":[],"overrideLeaf":{"id":"cl475xfay10231943q1k4bxuly","title":"Your feedback will always remain anonymous, unless you want to talk to someone.","type":"FORM","__typename":"QuestionNode"},"share":null,"form":null,"links":[],"sliderNode":null,"options":[{"id":541,"value":"Physical & Mental","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":542,"value":"Coaching","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":543,"value":"Home","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":544,"value":"School","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":545,"value":"Team Members","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":546,"value":"Own Performance","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"}],"__typename":"QuestionNode"},{"id":"cl475xfex10387943qcndqxunx","title":"What went wrong?","isRoot":false,"isLeaf":false,"type":"CHOICE","extraContent":null,"children":[],"overrideLeaf":{"id":"cl475xfay10231943q1k4bxuly","title":"Your feedback will always remain anonymous, unless you want to talk to someone.","type":"FORM","__typename":"QuestionNode"},"share":null,"form":null,"links":[],"sliderNode":null,"options":[{"id":547,"value":"Physical & Mental","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":548,"value":"Coaching","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":549,"value":"Home","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":550,"value":"School","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":551,"value":"Team Members","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"},{"id":552,"value":"Own Performance","publicValue":null,"overrideLeaf":null,"__typename":"QuestionOption"}],"__typename":"QuestionNode"}],"edges":[{"id":"cl475xffn10400943qh3t97oez","conditions":[{"id":89,"conditionType":"valueBoundary","matchValue":null,"renderMin":70,"renderMax":100,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfct10354943qe9bkpdvw","title":"What\'s going well?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfgl10427943qnea7g8o7","conditions":[{"id":90,"conditionType":"valueBoundary","matchValue":null,"renderMin":55,"renderMax":70,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfdj10364943qjsbdvofw","title":"What\'s going well, but can be improved?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfhg10453943qnnm32q2u","conditions":[{"id":91,"conditionType":"valueBoundary","matchValue":null,"renderMin":25,"renderMax":55,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfe410374943qxfylutsk","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"},{"id":"cl475xfi510479943qsv0m2dj3","conditions":[{"id":92,"conditionType":"valueBoundary","matchValue":null,"renderMin":0,"renderMax":25,"__typename":"EdgeCondition"}],"parentNode":{"id":"cl475xfbk10281943q4m9qv3bz","title":"How are you feeling?","__typename":"QuestionNode"},"childNode":{"id":"cl475xfex10387943qcndqxunx","title":"What went wrong?","isRoot":false,"children":[],"type":"CHOICE","__typename":"QuestionNode"},"__typename":"Edge"}],"__typename":"Dialogue"},"settings":{"id":"1","logoUrl":"https://res.cloudinary.com/haas-storage/image/upload/v1654981994/company_logos/stanford-cardinals-logo-black-and-white_nwfrpz.png","logoOpacity":100,"colourSettings":{"id":"1","primary":"#80221c","primaryAlt":null,"secondary":null,"__typename":"ColourSettings"},"__typename":"CustomerSettings"},"__typename":"Customer"}}');

export const mockQueryGetCustomer = (
  createResponse: (res: GetCustomerQuery) => GetCustomerQuery,
) => (
  mockQuery('GetCustomer', createResponse(GetCustomerResponse))
);
