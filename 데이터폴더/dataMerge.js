// 3개의 데이터 병합.
const data_1 = require("./data/hobby_202210.json");
const data_2 = require("./data/hobby_202211.json");
const data_3 = require("./data/hobby_202212.json");

const data = [...data_1, ...data_2, ...data_3];

// 필요한 요소만 추출.
let arr = [];

for (const da of data) {
  let {
    sexdstn_flag_cd: gen,
    agrde_flag_nm: age,
    hshld_income_dgree_nm: pay,
    one_year_within_expr_lsr_cltur_value: exper,
    wt3m_expr_lsr_cltur_value: target,
  } = da;
  // 수입 항목 "무응답" 데이터 제외하기.
  if (pay !== "무응답") {
    arr.push({ gen, age, exper, target });
    // arr.push({ gen, age, pay, exper, target });
  }
}

// 데이터 변환.
for (const ar of arr) {
  if (ar.gen == "M") {
    ar.gen = 0;
  } else {
    ar.gen = 1;
  }

  if (ar.age == "60대") {
    ar.age = 4;
  } else if (ar.age == "50대") {
    ar.age = 3;
  } else if (ar.age == "40대") {
    ar.age = 2;
  } else if (ar.age == "30대") {
    ar.age = 1;
  } else {
    ar.age = 0;
  }

  // if (ar.pay == "700만원 이상") {
  //   ar.pay = 3;
  // } else if (ar.pay == "500이상700만원 미만") {
  //   ar.pay = 2;
  // } else if (ar.pay == "300이상500만원 미만") {
  //   ar.pay = 1;
  // } else if (ar.pay == "300만원 미만") {
  //   ar.pay = 0;
  // }

  ar.exper = ar.exper.split(",");

  if (ar.exper[0] == "오락-휴식" || ar.exper[0] == "자기계발-자기관리") {
    ar.exper = 4;
  } else if (ar.exper[0] == "사회교류") {
    ar.exper = 3;
  } else if (
    ar.exper[0] == "운동-스포츠 직접하기" ||
    ar.exper[0] == "스포츠 관람하기"
  ) {
    ar.exper = 2;
  } else if (ar.exper[0] == "관광-여행") {
    ar.exper = 1;
  } else {
    ar.exper = 0;
  }

  ar.target = ar.target.split(",");

  if (ar.target[0] == "오락-휴식" || ar.target[0] == "자기계발-자기관리") {
    ar.target = 4;
  } else if (ar.target[0] == "사회교류") {
    ar.target = 3;
  } else if (
    ar.target[0] == "운동-스포츠 직접하기" ||
    ar.target[0] == "스포츠 관람하기"
  ) {
    ar.target = 2;
  } else if (ar.target[0] == "관광-여행") {
    ar.target = 1;
  } else {
    ar.target = 0;
  }
}
// console.log(arr); // 4개의 데이터와 1개 타겟 추출 및 변환 완료.

// 데이터 CJS 모듈로 내보내기.
exports.data = arr;
