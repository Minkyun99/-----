<template>
  <div>
    <button @click="aiSearch()">이전 모델로 분석하기</button>
  </div>
</template>

<script>
const modelCheck =
  window.localStorage["tensorflowjs_models/my-model/model_topology"] ?? 0;

import axios from "axios";
import * as tf from "@tensorflow/tfjs";

export default {
  name: "app",
  data() {
    return {
      topo: "",
      weightD: "",
      weightS: "",
      info: "",
      meta: "",
    };
  },
  mounted() {
    if (modelCheck == 0) {
      axios.post("/dbr").then((res) => {
        // 로컬 스토리지에 모델이 없으면 업로드.
        window.localStorage["tensorflowjs_models/my-model/model_topology"] =
          res.data[0].topo;
        window.localStorage["tensorflowjs_models/my-model/weight_data"] =
          res.data[0].weightD;
        window.localStorage["tensorflowjs_models/my-model/weight_specs"] =
          res.data[0].weightS;
        window.localStorage["tensorflowjs_models/my-model/info"] =
          res.data[0].info;
        window.localStorage["tensorflowjs_models/my-model/model_metadata"] =
          res.data[0].meta;
      });
    } else {
      console.log("이미 있습니다.");
    }
  },
  methods: {
    async aiSearch() {
      if (localStorage["tensorflowjs_models/my-model/model_topology"]) {
        const model = await tf.loadLayersModel("localstorage://my-model");
        let pred_array = [];
        const predict = await model
          .predict("검색한 텐서 데이터")
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
          });
      }
    },
  },
};
</script>

<style></style>
