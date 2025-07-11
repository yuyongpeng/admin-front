<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="dict in sys_data_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['changcunjiyi:declare:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['changcunjiyi:declare:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['changcunjiyi:declare:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['changcunjiyi:declare:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" stripe="true" highlight-current-row="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="类型" align="center" prop="types" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="sys_data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['changcunjiyi:declare:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['changcunjiyi:declare:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="form.content" placeholder="请输入内容" style="width: 300px" row="100" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input-number v-model="form.types" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <!-- <el-radio label="1">1111</el-radio>
            <el-radio label="0">0000</el-radio> -->
            <el-radio v-for="dict in sys_data_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>


</template>

<script setup name="Post">
import { listDeclare, addDeclare, delDeclare, getDeclare, updateDeclare } from '@/api/fangcunjiyi/declare';

const { proxy } = getCurrentInstance();
const { sys_data_status } = proxy.useDict('sys_data_status');

const postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([5]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');

const radio1 = ref([5]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postCode: undefined,
    postName: undefined,
    status: undefined,
  },
  rules: {
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listDeclare(queryParams.value).then((response) => {
    postList.value = response.data;
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
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: '1',
    remark: undefined,
  };
  proxy.resetForm('postRef');
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
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
  title.value = '添加岗位';
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getDeclare(id).then((response) => {
    form.value = response.data;
    form.value.status = '' + response.data.status; // 必选转为string，否则界面不显示
    open.value = true;
    title.value = '修改数据';
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['postRef'].validate((valid) => {
    if (valid) {
      form.value.status = parseInt(form.value.status);
      if (form.value.id != undefined) {
        updateDeclare(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addDeclare(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
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
      return delDeclare(id);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'system/post/export',
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`,
  );
}

getList();
</script>
