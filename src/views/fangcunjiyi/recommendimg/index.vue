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
      <!-- <el-form-item label="邮折" prop="ticket_id">
        <el-select v-model="queryParams.ticket_id" placeholder="选择邮折" >
          <el-option v-for="item in tickets" :key="item.id" :label="item.ticket_name" :value="item.id" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['changcunjiyi:resource:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['changcunjiyi:resource:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['changcunjiyi:resource:remove']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['changcunjiyi:resource:export']">导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" stripe="true" highlight-current-row="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <!-- <el-table-column label="邮折" align="center" prop="ticket.ticket_name" /> -->
      <el-table-column label="图片" align="center" prop="img">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.img" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.img]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
        </template>
      </el-table-column>
      <el-table-column label="跳转着陆图片" align="center" prop="link" >
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.link" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.link]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="order" />
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['changcunjiyi:resource:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['changcunjiyi:resource:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="图片URL" prop="img">
          <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.img"  ></ImageUpload>
        </el-form-item>
        <el-form-item label="跳转着陆图片" prop="link">
          <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.link"></ImageUpload>
        </el-form-item>
        <el-form-item label="排序(数字小的在上面)" prop="order">
          <el-input-number v-model="form.order" controls-position="right" :min="0" default />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
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
import { listResource, addResource, delResource, getResource, updateResource } from '@/api/fangcunjiyi/resource';
import { listRecommendImg,getRecommendImg,addRecommendImg,updateRecommendImg,delRecommendImg } from '@/api/fangcunjiyi/recommendimg';

const imageType = ref(["png", "jpg", "jpeg", "gif"])

const showPicViewer = ref()
const closePicViewer = () => showPicViewer.value = false;
const showPicViwerx = () => showPicViewer.value = true;

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
  form: {
    order: '0',
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: 0,
    // img:"",
  },
  rules: {
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  },
});


const { queryParams, form, rules } = toRefs(data);

const tickets = ref([]);

/** 查询 recommend_img 列表 */
function getList() {
  loading.value = true;
  listRecommendImg(queryParams.value).then((response) => {
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
  title.value = '添加资源';
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getSuit(id).then((response) => {
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
        updateSuit(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addSuit(form.value).then((response) => {
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
      return delSuit(id);
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
    'system/recommendimg/export',
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`,
  );
}

function getTicket() {
  listAllTickets().then((resp) => {
    tickets.value = resp.data;
  });
}
// getTicket();

getList();
</script>
<style scoped>
/* .el-image {
  z-index: 20; /* 确保图片的层级高于其他可能遮挡的元素 
} */
/* .el-table .el-image {
  overflow: visible;  确保图片可以正常显示 
}*/
</style>
