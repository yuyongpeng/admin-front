<template>
  <div class="app-container home">
    <el-card class="update-log">
    <el-row>
      <div class="block">
      <span class="demonstration">选择日期范围</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        :size="size"
      />
    </div>

      <el-col :span="6">
        <el-statistic title="Daily active users" :value="268500" />
      </el-col>
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

    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Carole-admin后台管理框架</h2>
        <p>
          一款Nestjs+Prisma+Vue+Vite前后端分离的后台框架,
          前端基于<el-link type="primary" href='https://github.com/yangzongzhuan/RuoYi-Vue3'>若依</el-link>。
        </p>
        <p><el-link type="primary" href="https://github.com/Carole007/carole-admin?tab=readme-ov-file#%E6%96%87%E6%A1%A3" icon="document">查看文档</el-link></p>
        <ul style="list-style: circle;padding-left: 15px;">
          <li>前端采用Vue3、Element-Plus、Vite。</li>
          <li>后端采用Nest、Prisma、Redis &amp; Jwt。</li>
          <li>权限认证使用Jwt，支持多终端认证系统。</li>
          <li>支持加载动态权限菜单，多方式轻松权限控制。</li>
          <li>支持接口限流</li>
          <li>高效率开发，使用代码生成器可以一键生成前后端代码。</li>
        </ul>

        
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button type="primary" plain @click="goTarget('https://github.com/Carole007/carole-admin')"> <svg-icon
              icon-class="github" />github</el-button>
          <el-button type="primary" icon="Cloudy" plain
            @click="goTarget('https://gitee.com/Carole007/carole-admin')">gitee</el-button>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>Node</li>
              <li>Nestjs</li>
              <li>JWT</li>
              <li>Mysql</li>
              <li>Prisma</li>
              <li>Redis</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue3</li>
              <li>Vuex</li>
              <li>Element-plus</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>联系信息</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-user-solid"></i> QQ群：<el-link type="primary" href="https://qm.qq.com/q/CspBa2r6h2"
                target="_blank">952834924</el-link>
              <img src="@/assets/images/qun.jpg" style="width: 80%;object-fit:cover" alt="qun" />
            </p>
            <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a href="javascript:;">/ luotianyi_y</a>
            </p>
            <p>
              <i class="el-icon-money"></i> qq：<a href="javascript:;" class="qq信息">/ 2282169525</a>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>更新日志</span>
            </div>
          </template>
          <el-collapse accordion>
            <el-collapse-item title="v1.0.0 - 2024-06-11">
              <ol>
                <li>carole-admin系统发布</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import {queryUserDayCount, queryUserWeekCount, queryUserMonthCount} from '@/api/fangcunjiyi/user';
import { queryCollectionDayCount, queryCollectionTicketDayCount } from '@/api/fangcunjiyi/collection';
import {queryTransferDayCount, queryTransferTicketDayCount} from '@/api/fangcunjiyi/transfer';
import { listAllTickets } from '@/api/fangcunjiyi/ticket'
// import { eCharts } from 'vue-echarts'
import { onMounted } from 'vue';

// import {ref} from ''
const version = ref('1.0.0')
const tickets = ref([]);
const currentTicketId = ref();
const currentTicketName = ref('未选择'); // 当前选择的邮折名称
const currentTicketId2 = ref();
const currentTicketName2 = ref('未选择'); // 当前选择的邮折名称
const value1 = ref('');
const { proxy } = getCurrentInstance(); 

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
        name: '1234',
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
        name: '1234',
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
        name: '1234',
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
        name: '1234',
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
        name: '1234',
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
        name: '1234',
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
        name: '1234',
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
