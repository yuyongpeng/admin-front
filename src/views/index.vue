<template>
  <div class="app-container home">
    <el-card class="update-log">
      <el-row>
        <div class="block">
        <span class="demonstration">选择查询日期范围         </span>&nbsp;
        <el-date-picker
          v-model="pickDateValue"    
          type="daterange"
          range-separator="=>"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :size="size"
        />
      </div>
      &nbsp; <el-button type="primary" @click="queryForm">确 定</el-button>
      </el-row>
      <el-row>
      
      <el-card class="update-log" style="width: 50%;">
        <el-table v-loading="loading" :data="ticketGetCountList" stripe="true" highlight-current-row="true" show-summary>
        <el-table-column label="藏品领取数量统计" align="center">
          <el-table-column label="邮折名称" align="center" prop="ticket_name" />
          <!-- <el-table-column label="藏品数量" align="center" prop="ticket_id" /> -->
          <el-table-column label="领取数量" align="center" prop="sum" />
        </el-table-column>
        </el-table>
      </el-card>
      <el-card class="update-log" style="width: 50%;">
        <el-table v-loading="loading" :data="ticketTransferCountList" stripe="true" highlight-current-row="true" show-summary>
        <el-table-column label="藏品转增数量统计"  align="center">
          <el-table-column label="邮折名称" align="center" prop="ticket_name" />
          <!-- <el-table-column label="藏品数量" align="center" prop="ticket_id" /> -->
          <el-table-column label="转增数量" align="center" prop="sum" />
        </el-table-column>
        </el-table>
      </el-card>

      </el-row>
    </el-card>
    <br>
    <el-card class="update-log">
      <el-row :gutter="20" :align="middle" :justify="center">
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <template v-slot:header>
              <div class="clearfix">
                <span>不区分邮折，所有藏品领取统计</span>
              </div>
            </template>
            <div class="grid-content ep-bg-purple-dark" >
            <e-charts class="chart" :option="collectionDayCountOption" autoresize="true"/>
          </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <template v-slot:header>
              <div class="clearfix">
                <el-select v-model="currentTicketId" value-key="id" placeholder="选择邮折" @change='changeTicket'>
                  <el-option v-for="item in tickets" :key="item.id" :label="item.ticket_name" :value="item.id" />
                </el-select>
              </div>
            </template>
            <div class="grid-content ep-bg-purple-dark" >
              <e-charts class="chart" :option="collectionTicketDayCountOption" autoresize="true"/>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card class="update-log">
      <el-row :gutter="20" :align="middle" :justify="center">
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div class="grid-content ep-bg-purple-dark" >
            <e-charts class="chart" :option="transferDayCountOption" autoresize="true"/>
          </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <template v-slot:header>
              <div class="clearfix">
                <el-select v-model="currentTicketId2" value-key="id" placeholder="选择邮折" @change='changeTicket2'>
                  <el-option v-for="item in tickets" :key="item.id" :label="item.ticket_name" :value="item.id" />
                </el-select>
              </div>
            </template>
            <div class="grid-content ep-bg-purple-dark" >
              <e-charts class="chart" :option="transferTicketDayCountOption" autoresize="true"/>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card class="update-log">
      <el-row :gutter="20" :align="middle" :justify="center">
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div class="grid-content ep-bg-purple-dark" >
              <e-charts class="chart" :option="userDayCountOption" autoresize="true"/>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div class="grid-content ep-bg-purple-dark" >
              <e-charts class="chart" :option="userWeekCountOption" autoresize="true"/>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <el-card class="update-log">
            <div class="grid-content ep-bg-purple-dark" >
              <e-charts class="chart" :option="userMonthCountOption" autoresize="true"/>
            </div>
          </el-card>
        </el-col>        
      </el-row>
    </el-card>
  </div>
</template>

<script setup name="Index">
import {queryUserDayCount, queryUserWeekCount, queryUserMonthCount} from '@/api/fangcunjiyi/user';
import { queryCollectionDayCount, queryCollectionTicketDayCount, queryCollectionTicketCount } from '@/api/fangcunjiyi/collection';
import {queryTransferDayCount, queryTransferTicketDayCount, queryTransferTicketCount } from '@/api/fangcunjiyi/transfer';
import { listAllTickets } from '@/api/fangcunjiyi/ticket'

// import {ref} from ''
const version = ref('1.0.0')
const tickets = ref([]);
const currentTicketId = ref();
const currentTicketName = ref('未选择'); // 当前选择的邮折名称
const currentTicketId2 = ref();
const currentTicketName2 = ref('未选择'); // 当前选择的邮折名称
const pickDateValue = ref();
const { proxy } = getCurrentInstance(); 
const ticketGetCount = ref(0);
const ticketTransferCount = ref(0);
const ticketGetCountList = ref([]);
const ticketTransferCountList = ref([]);


//模拟数据value的字段对应Y轴，name字段对应X轴
const dataDay = ref([]);
const userDayCountOption=computed(()=>{
  return{
    title: {
        text: '用户注册（日统计）',
        subtext: '每一天的注册用户数统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataDay.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 人'
      }
    },
    series:[
      {
        type: 'line',
        name: '注册数',
        smooth: true,
        data:dataDay.value.map(v=>v.y)
      }
    ]
  }
});

const dataWeek = ref([]);
const userWeekCountOption=computed(()=>{
  return{
    title: {
        text: '用户注册（周统计）',
        subtext: '每一周的注册用户数统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataWeek.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 人'
      }
    },
    series:[
      {
        type: 'line',
        name: '注册数',
        smooth: true,
        data:dataWeek.value.map(v=>v.y)
      }
    ]
  }
});
const dataMonth = ref([]);
const userMonthCountOption=computed(()=>{
  return{
    title: {
        text: '用户注册（月统计）',
        subtext: '每一月的注册用户数统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataMonth.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 人'
      }
    },
    series:[
      {
        type: 'line',
        name: '注册数',
        smooth: true,
        data:dataMonth.value.map(v=>v.y)
      }
    ]
  }
});


const dataDayCollectionCount = ref([]);
const collectionDayCountOption=computed(()=>{
  return{
    title: {
        text: '领取数字藏品（日统计）',
        subtext: '每一天领取数字藏品数量统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataDayCollectionCount.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 个'
      }
    },
    series:[
      {
        type: 'line',
        name: '领取数',
        smooth: true,
        data:dataDayCollectionCount.value.map(v=>v.y)
      }
    ]
  }
});

const dataCollectionTicketDayCount = ref([]);
const collectionTicketDayCountOption=computed(()=>{
  return{
    title: {
        text: '领取数字藏品（日统计）',
        subtext: '每一天领取数字藏品 ( '+currentTicketName.value+' ) 数量统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataCollectionTicketDayCount.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 个'
      }
    },
    series:[
      {
        type: 'line',
        name: '领取数',
        smooth: true,
        data:dataCollectionTicketDayCount.value.map(v=>v.y)
      }
    ]
  }
});

// transfer 的统计
const dataDayTransferCount = ref([]);
const transferDayCountOption=computed(()=>{
  return{
    title: {
        text: '数字藏品流转（日统计）',
        subtext: '每一天流转统字藏品数量统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataDayTransferCount.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 个'
      }
    },
    series:[
      {
        type: 'line',
        name: '转增次数',
        smooth: true,
        data:dataDayTransferCount.value.map(v=>v.y)
      }
    ]
  }
});

const dataTransferTicketDayCount = ref([]);
const transferTicketDayCountOption=computed(()=>{
  return{
    title: {
        text: '数字藏品流转（日统计）',
        subtext: '每一天流转数字藏品 ( '+currentTicketName.value+' ) 数量统计',
        left: 'center'
    },
    toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          saveAsImage: {}
        }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#333',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    xAxis:{
      type: 'category',
      name: '日期',
      data:dataTransferTicketDayCount.value.map(v=>v.x)
    },
    yAxis:{
      type:'value',
      axisLabel: {
        formatter: '{value} 个'
      }
    },
    series:[
      {
        type: 'line',
        name: '转增次数',
        smooth: true,
        data:dataTransferTicketDayCount.value.map(v=>v.y)
      }
    ]
  }
});

function getTicket() {
   listAllTickets().then((resp) => {
     tickets.value = resp.data;
   });
 }

function queryForm() {
  let x = {
    start_date: pickDateValue.value[0],
    end_date: pickDateValue.value[1],
  }
  queryCollectionTicketCount(x).then((resp) => {
    ticketGetCount.value = 0;
    // ticketGetCountList.value = resp.data;
    ticketGetCountList.value = resp.data.map((val) => {
      ticketGetCount.value += val._sum.sum;
      return { ticket_id: val.ticket_id, ticket_name: val.ticket_name, sum: val._sum.sum }
    })
  });

  queryTransferTicketCount(x).then((resp) => {
    ticketTransferCount.value = 0;
    // ticketGetCountList.value = resp.data;
    ticketTransferCountList.value = resp.data.map((val) => {
      ticketTransferCount.value += val._sum.sum;
      return {ticket_id:val.ticket_id, ticket_name: val.ticket_name, sum: val._sum.sum}
    })
  });
}

/** 按照“天“查询用户的注册数 */
async function getUserDayCount() {
  await queryUserDayCount().then((response) => {
    let data = response.data.map((val) => {
      return { x: val.c_day, y: val.sum }
    });
    dataDay.value= data;
  });
}
/** 按照“周“查询用户的注册数 */
async function getUserWeekCount() {
  await queryUserWeekCount().then((response) => {
    let data = response.data.map((val) => {
      return { x: val.c_week, y: val.sum }
    });
    dataWeek.value= data;
  });
}
/** 按照”月”查询用户的注册数 */
async function getUserMonthCount() {
  await queryUserMonthCount().then((response) => {
    let data = response.data.map((val) => {
      return { x: val.c_year + '-' + val.c_month, y: val.sum }
    });
    dataMonth.value= data;
  });
}

/** 按照”日”查询 数字藏品 领取数 */
async function getCollectionDayCount() {
  await queryCollectionDayCount().then((response) => {
    let data = response.data.map((val) => {
      return { x: val.t_day, y: val.sum }
    });
    dataDayCollectionCount.value= data;
  });
}
/** 查询指定邮折的，照”日”查询 数字藏品 领取数 */
async function getCollectionTicketDayCount(ticketId){
  await queryCollectionTicketDayCount(ticketId).then((response) => {
    let data = response.data.map((val) => {
      return { x: val.t_day, y: val.sum }
    });
    dataCollectionTicketDayCount.value= data;
  });
}

/** 按照”日”查询 数字藏品 流转 数 */
async function getTransferDayCount() {
  await queryTransferDayCount().then((response) => {
    let data = response.data.map((val) => {
      return { x: val.t_day, y: val.sum }
    });
    dataDayTransferCount.value= data;
  });
}
/** 查询指定邮折的，照”日”查询 数字藏品 流转 数 */
async function getTransferTicketDayCount(ticketId){
  await queryTransferTicketDayCount(ticketId).then((response) => {
    let data = response.data.map((val) => {
      return { x: val.t_day, y: val.sum }
    });
    dataTransferTicketDayCount.value= data;
  });
}

// 变更了 邮折 的下拉框，提取对应的 名称，用于显示
function changeTicket(){
  tickets.value.map((val)=>{
    if(val.id == currentTicketId.value){
      currentTicketName.value = val.ticket_name;
    }
  });
  getCollectionTicketDayCount(currentTicketId.value);
}
// 变更了 邮折 的下拉框，提取对应的 名称，用于显示
function changeTicket2(){
  tickets.value.map((val)=>{
    if(val.id == currentTicketId2.value){
      currentTicketName2.value = val.ticket_name;
    }
  });
  getTransferTicketDayCount(currentTicketId2.value);
}
function goTarget(url) {
  window.open(url, '__blank')
}

getUserDayCount();
getUserWeekCount();
getUserMonthCount();

getCollectionDayCount();
getTransferDayCount();
getTicket();
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.chart{
  height: 400px;
  // width: 800px;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
