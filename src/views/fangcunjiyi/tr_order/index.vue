<template>
  <div class="app-container">
    <!-- ======================================= 查询框 ======================================= -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="方寸记忆订单号" prop="order_no">
        <el-input
          v-model="queryParams.order_no"
          placeholder="请填写方寸记忆订单号"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付通道订单号(微信)" prop="pay_trade_no">
        <el-input
          v-model="queryParams.pay_trade_no"
          placeholder="请填写支付通道订单号"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单创建时间" prop="create_time">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="订单支付状态" prop="pay_status">
        <el-select
          v-model="queryParams.pay_status"
          placeholder="状态"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in fangcun_trorder_pay_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="order_type">
        <el-select
          v-model="queryParams.order_type"
          placeholder="订单类型"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in fangcun_trorder_order_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- =======================================查询框 按钮======================================= -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- ======================================= 新增、修改、删除、导出 按钮======================================= -->
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
         <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['fangcunjiyi:collection:add']">新增</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['fangcunjiyi:collection:edit']">修改</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button>
       </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['fangcunjiyi:tr_order:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- ======================================= 列表页面 ======================================= -->
    <el-table
      v-loading="loading"
      :data="postList"
      stripe="true"
      highlight-current-row="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="方寸记忆订单号" align="center" prop="order_no" />
      <el-table-column label="支付通道订单号" align="center" prop="pay_trade_no" />
      <el-table-column label="商品名称" align="center" prop="ticket_name" />
      <el-table-column label="购买者手机" align="center" prop="buyer_mobile" />
      <el-table-column label="下单时间" align="center" prop="create_time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center" prop="expire_time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="数量" align="center" prop="amount" />
      <el-table-column label="实付金额" align="center" prop="total_price" />
      <el-table-column label="订单状态" align="center" prop="pay_status">
        <template #default="scope">
          <DictTag :options="fangcun_trorder_pay_status" :value="scope.row.pay_status" />
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="order_type">
        <template #default="scope">
          <DictTag :options="fangcun_trorder_order_type" :value="scope.row.order_type" />
        </template>
      </el-table-column>
      <!-- ======================================= 列表页最后一列的操作按钮 ======================================= -->
      <el-table-column
        label="操作"
        width="180"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <!-- <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fangcunjiyi:transfer:edit']"
            >查看</el-button
          >
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- ======================================= 添加或修改对话框 ======================================= -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="300px">
        <el-form-item label="id" prop="id">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="collection_name">
          <el-input v-model="form.collection.collection_name" disabled />
        </el-form-item>
      </el-form>
      <!-- ======================================= 编辑框 按钮 ======================================= -->
      <div class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Collection">
import {
  listTransfer,
  // addTransfer,
  // delTransfer,
  getTransfer,
  // updateTransfer,
} from "@/api/fangcunjiyi/trorder";
import { handleError, ref } from "vue";

const showPicViewer = ref();
const closePicViewer = () => (showPicViewer.value = false);
const showPicViwerx = () => (showPicViewer.value = true);

const { proxy } = getCurrentInstance();
const { fangcun_trorder_order_type } = proxy.useDict("fangcun_trorder_order_type");
const { fangcun_trorder_pay_status } = proxy.useDict("fangcun_trorder_pay_status");

const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([5]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const datetimerange = ref();

const radio1 = ref([5]);

// 时间选择框的快捷按钮
const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    },
  },
  {
    text: "最近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return [start, end];
    },
  },
];

const data = reactive({
  form: {
    order: "0",
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: undefined,
  },
  rules: {
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
    content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

const tickets = ref([]);

/** 查询 collection 列表 */
function getList() {
  loading.value = true;
  listTransfer(
    proxy.addDateRange(queryParams.value, datetimerange.value, "CreateTime")
  ).then((response) => {
    postList.value = response.rows;
    console.log(response.data);
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    status: "1",
    remark: undefined,
  };
  proxy.resetForm("postRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加资源";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getTransfer(id).then((response) => {
    form.value = response.data;
    form.value.status = "" + response.data.status; // 必选转为string，否则界面不显示
    open.value = true;
    title.value = "查看数据";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      form.value.status = parseInt(form.value.status);
      if (form.value.id != undefined) {
        updateTransfer(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTransfer(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  reset();
  const id = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除名称为"' + row.name + '"的数据项？')
    .then(function () {
      return delTransfer(id);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "fangcunjiyi/trorder/export",
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>

<style scoped>
/* .el-image {
   z-index: 20; /* 确保图片的层级高于其他可能遮挡的元素 
 } */
/* .el-table .el-image {
   overflow: visible;  确保图片可以正常显示 
 }*/

.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
  min-width: 300px;
}

.block:last-child {
  border-right: none;
}

.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .block {
    flex: 100%;
    border-right: none;
    border-bottom: solid 1px var(--el-border-color);
  }

  .block:last-child {
    border-bottom: none;
  }

  :deep(.el-date-editor.el-input) {
    width: 100%;
  }

  :deep(.el-date-editor.el-input__wrapper) {
    width: 100%;
    max-width: 300px;
  }
}
</style>
