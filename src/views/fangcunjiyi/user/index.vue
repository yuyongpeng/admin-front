<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="queryParams.realname" placeholder="请输入姓名" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

  

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['changcunjiyi:resource:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['changcunjiyi:resource:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['changcunjiyi:resource:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['changcunjiyi:resource:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="postList" stripe="true" highlight-current-row="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="openid" align="center" prop="wx_mini_openid" />
      <el-table-column label="unionid" align="center" prop="union_id" />
      <el-table-column label="手机" align="center" prop="mobile" />
      <el-table-column label="姓名" align="center" prop="realname" />
      <el-table-column label="昵称" align="center" prop="nick_name"/>
      <el-table-column label="头像" align="center" prop="avatar">
        <template #default="scope">
          <div v-if='scope.row.avatar != ""'>
            <el-image style="width: 100px; height: 100px" :src="scope.row.avatar" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.avatar]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
          </div>
          <div v-else>
            无
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="id_card_no" />
      <el-table-column label="daop account id" align="center" prop="daop_account_id" />
      <el-table-column label="daop user id" align="center" prop="daop_user_id" />
      <el-table-column label="address" align="center" prop="daop_user_address" />
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['changcunjiyi:user:edit']">查看</el-button>
          <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['changcunjiyi:resource:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="id" prop="id">
          <el-input v-model="form.id" disabled/>
        </el-form-item>
        <el-form-item label="openid" prop="wx_mini_openid">
          <el-input v-model="form.wx_mini_openid" disabled/>
        </el-form-item>
        <el-form-item label="unionid" prop="union_id">
          <el-input v-model="form.union_id"  disabled/>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="form.mobile" disabled/>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card_no">
          <el-input v-model="form.id_card_no" disabled/>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" disabled/>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-mode="form.nick_name" disabled/>
        </el-form-item>
        <el-form-item label="头图" prop="avatar">
          <el-avatar :src="form.avatar"/>
        </el-form-item>
        <el-form-item label="address" prop="daop_user_address">
          <el-input v-model="form.daop_user_address" disabled/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post">
import { listUser, addUser, delUser, getUser, updateUser, queryUserDayCount} from '@/api/fangcunjiyi/user';
import * as echarts from 'echarts';

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
  listUser(queryParams.value).then((response) => {
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
  title.value = '添加 用户';
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getUser(id).then((response) => {
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
        updateUser(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then((response) => {
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
      return delResource(id);
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
    'fangcunjiyi/user/export',
    {
      ...queryParams.value,
    },
    `post_${new Date().getTime()}.xlsx`,
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
</style>
