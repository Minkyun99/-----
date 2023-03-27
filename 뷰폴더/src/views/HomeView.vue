<template>
  <!-- <div>{{ ar }}</div> -->
</template>

<script>
import * as tf from "@tensorflow/tfjs";
import arr from "../../public/dataMerge";

// 데이터 라벨 정의.
const HOBBY_CLASSES = [
  "고궁·문화유산",
  "관광특구",
  "공원",
  "발달상권",
  "인구밀집지역",
];
const HOBBY_NUM_CLASSES = HOBBY_CLASSES.length;
const HOBBY_DATA = arr.data;

// 텐서 변환 함수 작성.
function convertToTensors(data, targets, testSplit) {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error("데이터와 타깃의 길이가 다릅니다.");
  }

  // indices로 데이터와 타겟 셔플.
  const indices = [];
  for (let i = 0; i < numExamples; i++) {
    indices.push(i);
  }
  tf.util.shuffle(indices);

  const shuffledData = [];
  const shuffledTargets = [];
  for (let i = 0; i < numExamples; i++) {
    shuffledData.push(data[indices[i]]);
    shuffledTargets.push(targets[indices[i]]);
  }

  // 테스트스플릿을 기준으로 데이터를 훈련 세트/테스트 세트로 분리.
  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;
  const xDims = shuffledData[0].length;

  // 특성 데이터 2D 텐서로 변환.
  const xs = tf.tensor2d(shuffledData);
  // 레이블 원핫 인코딩 이용 텐서로 변환.
  const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), HOBBY_NUM_CLASSES);

  // slice로 훈련/테스트 세트 분리.
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, HOBBY_NUM_CLASSES]);
  const yTest = ys.slice(
    [numTrainExamples, 0],
    [numTestExamples, HOBBY_NUM_CLASSES]
  );

  return [xTrain, yTrain, xTest, yTest];
}

// 구동 함수 작성.
function getHobbyData(testSplit) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];

    for (const example of HOBBY_DATA) {
      const target = example.target;

      delete example.target;

      const data = example;
      const arr = [];
      arr.push(data.gen);
      arr.push(data.age);
      arr.push(data.exper);
      dataByClass.push(arr);
      targetsByClass.push(target);
    }
    const [xTrain, yTrain, xTest, yTest] = convertToTensors(
      dataByClass,
      targetsByClass,
      testSplit
    );

    return [xTrain, yTrain, xTest, yTest];
  });
}

(async function () {
  const [xTrain, yTrain, xTest, yTest] = await getHobbyData(0.15);

  const input = tf.input({
    shape: [3],
  });
  const A = tf.layers
    .dense({
      units: 50,
      activation: "relu",
    })
    .apply(input);
  const B = tf.layers
    .dense({
      units: 5,
      activation: "softmax",
    })
    .apply(A);

  const model = tf.model({ inputs: input, outputs: B });
  /* 1. validationData 2. 데이터 정규화로 최종 실험 해보고 안 되면 80~84%로 만족! */

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const fitParam = {
    epochs: 200,
    batchSize: 32,
    callbacks: {
      onEpochEnd: function (epoch, logs) {
        console.log("epoch : ", epoch, logs, "RMSE => ", Math.sqrt(logs.loss));
      },
    },
    validationData: [xTest, yTest],
  };

  let pred_array = [];
  const pred_arr = [];
  model.fit(xTrain, yTrain, fitParam).then((_) => {
    model
      .predict(xTest)
      .array()
      .then((array) => (pred_array = [...array]))
      .then((_) => {
        pred_array.map((v) => {
          v[v.indexOf(Math.max(...v))] = 1;
          for (const val of v) {
            if (val != 1) {
              v[v.indexOf(val)] = 0;
            }
          }
          pred_arr.push(v);
        });
      })
      .then((_) => {
        let real_arr = [];
        const total_num = pred_arr.length;
        let coinci_num = 0;
        yTest
          .array()
          .then((array) => (real_arr = [...array]))
          .then((_) => {
            pred_arr.forEach((v, i) => {
              if (JSON.stringify(v) == JSON.stringify(real_arr[i])) {
                coinci_num++;
              }
            });
            const accur_num = Number((coinci_num / total_num).toFixed(2)) * 100;
            const predict_per = accur_num + " %";
            console.log(predict_per);
            if (accur_num >= 10) {
              model.save("localstorage://my-model");
              console.log("모델 저장 완료.");
            }
          });
      });
  });
})();
export default {
  name: "app",
  data() {
    return {
      ar: arr,
    };
  },
  methods: {},
};
</script>

<style></style>
