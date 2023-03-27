<template>
  <div>
    <button @click="dbc()">전송</button>
  </div>
</template>

<script>
import axios from "axios";
// import * as tf from "@tensorflow/tfjs";

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
  methods: {
    async dbc() {
      const topo = await window.localStorage[
        "tensorflowjs_models/my-model/model_topology"
      ];
      const weightD = await window.localStorage[
        "tensorflowjs_models/my-model/weight_data"
      ];
      const weightS = await window.localStorage[
        "tensorflowjs_models/my-model/weight_specs"
      ];
      const info = await window.localStorage[
        "tensorflowjs_models/my-model/info"
      ];
      const meta = await window.localStorage[
        "tensorflowjs_models/my-model/model_metadata"
      ];

      this.topo = topo;
      this.weightD = weightD;
      this.weightS = weightS;
      this.info = info;
      this.meta = meta;

      axios
        .post("/dbc", {
          topo,
          weightD,
          weightS,
          info,
          meta,
        })
        .then((res) => console.log(res.data));
    },
  },
};
</script>

<style></style>
