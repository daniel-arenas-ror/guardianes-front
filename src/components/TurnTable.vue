<template>
  <div class="flex flex-row">
    <table class="table-fixed m-5" v-for="group, key in turnGrouped" :key="key">
      <caption class="caption-top bg-amber-300">
        {{key}}
      </caption>
      <tr v-for="turn in group" :key="turn.id">
        <td class="border p-1" :style="{ backgroundColor: bgColorHour(turn) }" > {{turn.hour}} - {{turn.hour + 1}} </td>
        <td class="border p-1" :style="{ backgroundColor: bgColorWorker(turn.worker_id) }" > {{ dataWorker(turn.worker_id) }} </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "TurnTable",
    props: {
      turns: Array,
      workers: Array
    },
    methods: {
      bgColorWorker(workerId) {
        if(workerId === null || workerId === ""){
          return
        }

        return this.workers.find(worker => worker.id == workerId)?.color
      },
      dataWorker(workerId) {
        if(workerId === null){
          return "⚠️"
        }

        return this.workers.find(worker => worker.id == workerId)?.name
      },
      bgColorHour(turn){
        if(turn.worker_id === null){
          return "rgb(232 203 202)"
        }

        return "rgb(209 229 201)"
      }
    },
    computed: {
      turnGrouped(){
        return _.groupBy(this.turns, turn => turn.turn_date);
      }
    }
  };
</script>