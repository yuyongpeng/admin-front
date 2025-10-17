<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="邮折" prop="ticket_id">
        <el-select v-model="queryParams.ticket_id" placeholder="选择邮折">
          <el-option v-for="item in tickets" :key="item.id" :label="item.ticket_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="请输入 ticket id" prop="ticket_id">
         <el-input v-model="queryParams.ticket_id" placeholder="请输入 ticket id" clearable style="width: 200px" @keyup.enter="handleQuery" />
       </el-form-item> -->
      <el-form-item label="藏品铸造上链状态" prop="mint_chain_status">
        <el-select v-model="queryParams.mint_chain_status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="dict in fangcun_mint_chain_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="藏品销售上链状态" prop="transfer_chain_status">
        <el-select v-model="queryParams.transfer_chain_status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="dict in fangcun_transfer_chain_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="销售状态" prop="sale_status">
        <el-select v-model="queryParams.sale_status" placeholder="状态" clearable style="width: 200px">
          <el-option v-for="dict in fangcun_sale_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="藏品链上交易ID" prop="transfer_tx_id">
        <el-input v-model="queryParams.transfer_tx_id" placeholder="请输入交易ID" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['fangcunjiyi:collection:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['fangcunjiyi:collection:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
         <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['fangcunjiyi:collection:export']">导出</el-button>
       </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" stripe="true" highlight-current-row="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="collection_name" />
      <el-table-column label="ticket id" align="center" prop="ticket_id" />
      <el-table-column label="NFT类型" align="center" prop="ticket_type" />
      <el-table-column label="上链类型" align="center" prop="chain_type" />
      <el-table-column label="持有人address" align="center" prop="daop_user_address" />
      <el-table-column label="token_id" align="center" prop="token_id" />
      <el-table-column label="TXID" align="center" prop="transfer_tx_id" />
      <el-table-column label="证书" align="center" prop="certificate_url">
        <template #default="scope">
          <el-image style="height: 50px" :src="scope.row.certificate_url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.certificate_url]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
        </template>
      </el-table-column>
      <el-table-column label="藏品销售上链状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :options="fangcun_transfer_chain_status" :value="scope.row.transfer_chain_status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fangcunjiyi:collection:edit']">查看</el-button>
          <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button> -->
          <el-button link type="primary" icon="Delete" @click="handleDeleteSJT(scope.row)" v-hasPermi="['fangcunjiyi:collection:del']">删除证书</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="300px">
        <el-form-item label="名称" prop="collection_name">
          <el-input v-model="form.collection_name" placeholder="请输入名称" disabled />
        </el-form-item>
        <el-form-item label="ticket id" prop="ticket_id">
          <el-input v-model="form.ticket_id" placeholder="请输入ticket id" disabled />
        </el-form-item>
        <el-form-item label="ticket type" prop="ticket_type">
          <el-input v-model="form.ticket_type" placeholder="请输入 ticket type" disabled />
        </el-form-item>
        <el-form-item label="上链类型 chain type" prop="chain_type">
          <el-input v-model="form.chain_type" placeholder="请输入 上链类型。1-普通，2-三合一" disabled />
        </el-form-item>
        <el-form-item label="铸造人用户ID  casting_uid" prop="casting_uid">
          <el-input v-model="form.casting_uid" placeholder="请输入 铸造人用户ID" disabled />
        </el-form-item>
        <el-form-item label="铸造人用户名  casting_name" prop="casting_name">
          <el-input v-model="form.casting_name" placeholder="请输入 铸造人用户名" disabled />
        </el-form-item>
        <el-form-item label="铸造人在daop平台用户ID  daop_casting_id" prop="daop_casting_id">
          <el-input v-model="form.daop_casting_id" placeholder="请输入 铸造人在daop平台用户ID" disabled />
        </el-form-item>
        <el-form-item label="铸造人的address  daop_casting_address" prop="daop_casting_address">
          <el-input v-model="form.daop_casting_address" placeholder="请输入 铸造人的address" disabled />
        </el-form-item>
        <el-form-item label="持有人用户ID  owner_uid" prop="owner_uid">
          <el-input v-model="form.owner_uid" placeholder="请输入 持有人用户ID" disabled />
        </el-form-item>
        <el-form-item label="持有人名称  owner_name" prop="owner_name">
          <el-input v-model="form.owner_name" placeholder="请输入 持有人名称" disabled />
        </el-form-item>
        <el-form-item label="持有人在daop的id  daop_user_id" prop="daop_user_id">
          <el-input v-model="form.daop_user_id" placeholder="请输入 持有人在daop的id" disabled />
        </el-form-item>
        <el-form-item label="持有人在daop的address  daop_user_address" prop="daop_user_address">
          <el-input v-model="form.daop_user_address" placeholder="请输入 持有人在daop的address" disabled />
        </el-form-item>
        <el-form-item label="授权许可ID  license_id" prop="license_id">
          <el-input v-model="form.license_id" placeholder="请输入 授权许可ID" disabled />
        </el-form-item>
        <el-form-item label="分享人用户id  shared_uid" prop="shared_uid">
          <el-input v-model="form.shared_uid" placeholder="请输入 分享人用户id" disabled />
        </el-form-item>
        <el-form-item label="购买价格  price" prop="price">
          <el-input v-model="form.price" placeholder="请输入 购买价格" disabled />
        </el-form-item>
        <el-form-item label="购买时间  trade_time" prop="trade_time">
          <el-input v-model="form.trade_time" placeholder="请输入 购买时间" disabled />
        </el-form-item>
        <el-form-item label=" daop 藏品id  daop_collection_id" prop="daop_collection_id">
          <el-input v-model="form.daop_collection_id" placeholder="请输入 daop 藏品id" disabled />
        </el-form-item>
        <el-form-item label="票系统对应的门票ID  out_ticket_id" prop="out_ticket_id">
          <el-input v-model="form.out_ticket_id" placeholder="请输入 票系统对应的门票ID" disabled />
        </el-form-item>
        <el-form-item label="token_id" prop="token_id">
          <el-input v-model="form.token_id" placeholder="请输入 token_id" disabled />
        </el-form-item>
        <el-form-item label="藏品的hash  collection_hash" prop="collection_hash">
          <el-input v-model="form.collection_hash" placeholder="请输入 藏品的hash" disabled />
        </el-form-item>
        <el-form-item label="藏品铸造 上链交易ID  mint_tx_id" prop="mint_tx_id">
          <el-input v-model="form.mint_tx_id" placeholder="请输入 藏品铸造 上链交易ID" disabled />
        </el-form-item>
        <el-form-item label="藏品铸造上链状态(mint_chain_status)" prop="mint_chain_status">
          <el-input v-model="form.mint_chain_status" placeholder="请输入 藏品铸造上链状态" disabled />
        </el-form-item>
        <el-form-item label="藏品铸造上链时间(mint_chain_time)" prop="mint_chain_time">
          <el-input v-model="form.mint_chain_time" placeholder="请输入 藏品铸造上链时间" disabled />
        </el-form-item>
        <el-form-item label="藏品transfer TX ID(transfer_tx_id)" prop="transfer_tx_id">
          <el-input v-model="form.transfer_tx_id" placeholder="请输入 藏品transfer TX ID" disabled />
        </el-form-item>
        <el-form-item label="transfer状态(transfer_chain_status)" prop="transfer_chain_status">
          <el-input v-model="form.transfer_chain_status" placeholder="请输入 transfer状态" disabled />
        </el-form-item>
        <el-form-item label="transfer 上链时间(transfer_chain_time)" prop="transfer_chain_time">
          <el-input v-model="form.transfer_chain_time" placeholder="请输入 transfer 上链时间" disabled />
        </el-form-item>
        <el-form-item label="checkIn_tx_id" prop="checkIn_tx_id">
          <el-input v-model="form.checkIn_tx_id" placeholder="请输入 checkIn_tx_id" disabled />
        </el-form-item>
        <el-form-item label="checkIn 上链状态(checkIn_chain_status)" prop="checkIn_chain_status">
          <el-input v-model="form.checkIn_chain_status" placeholder="请输入 checkIn 上链状态" disabled />
        </el-form-item>
        <el-form-item label="checkIn 上链时间(checkIn_chain_time)" prop="checkIn_chain_time">
          <el-input v-model="form.checkIn_chain_time" placeholder="请输入 checkIn 上链时间" disabled />
        </el-form-item>
        <el-form-item label="数字藏品存证UUID(credential)" prop="credential">
          <el-input v-model="form.credential" placeholder="请输入 数字藏品存证UUID" disabled />
        </el-form-item>
        <el-form-item label="数字藏品最后交易存证UUID(last_credential)" prop="last_credential">
          <el-input v-model="form.last_credential" placeholder="请输入 数字藏品最后交易存证UUID" disabled />
        </el-form-item>
        <el-form-item label="销售状态(sale_status)" prop="sale_status">
          <el-input v-model="form.sale_status" placeholder="请输入 销售状态" disabled />
        </el-form-item>
        <el-form-item label="检票状态(available_status)" prop="available_status">
          <el-input v-model="form.available_status" placeholder="请输入 检票状态" disabled />
        </el-form-item>
        <el-form-item label="第一次检票时间(available_time)" prop="available_time">
          <el-input v-model="form.available_time" placeholder="请输入 第一次检票时间" disabled />
        </el-form-item>
        <el-form-item label="检票失效时间(available_expire_time)" prop="available_expire_time">
          <el-input v-model="form.available_expire_time" placeholder="请输入 检票失效时间" disabled />
        </el-form-item>
        <el-form-item label="藏品兑换code(check_code)" prop="check_code">
          <el-input v-model="form.check_code" placeholder="请输入 藏品兑换code" disabled />
        </el-form-item>
        <el-form-item label="授权ID(authorization_id)" prop="authorization_id">
          <el-input v-model="form.authorization_id" placeholder="请输入 授权ID" disabled />
        </el-form-item>
        <el-form-item label="版权授权码(authorization_code)" prop="authorization_code">
          <el-input v-model="form.authorization_code" placeholder="请输入 版权授权码" disabled />
        </el-form-item>
        <el-form-item label="最后更新时间(modify_time)" prop="modify_time">
          <el-input v-model="form.modify_time" placeholder="请输入 最后更新时间" disabled />
        </el-form-item>
        <el-form-item label="创建时间(create_time)" prop="create_time">
          <el-input v-model="form.create_time" placeholder="请输入 创建时间" disabled />
        </el-form-item>
        <el-form-item label="上报后返回的状态(dar_status)" prop="dar_status">
          <el-input v-model="form.dar_status" placeholder="请输入 上报后返回的状态" disabled />
        </el-form-item>
        <el-form-item label="是否为老数据(old_status)" prop="old_status">
          <el-input v-model="form.old_status" placeholder="请输入 是否为老数据" disabled />
        </el-form-item>
        <el-form-item label="NFT证书(certificate_url)" prop="certificate_url">
          <el-input v-model="form.certificate_url" placeholder="请输入 NFT证书" disabled />
        </el-form-item>
        <el-form-item label="区块号(block_number)" prop="block_number">
          <el-input v-model="form.block_number" placeholder="请输入 区块号" disabled />
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

<script setup name="Collection">
import { addCollection, delCollection, getCollection, listCollection, updateCollection } from '@/api/fangcunjiyi/collection';
import { sjtHide } from '@/api/fangcunjiyi/resource';
import { listAllTickets } from '@/api/fangcunjiyi/ticket';

const imageType = ref(['png', 'jpg', 'jpeg', 'gif']);

const showPicViewer = ref();
const closePicViewer = () => (showPicViewer.value = false);
const showPicViwerx = () => (showPicViewer.value = true);

const { proxy } = getCurrentInstance();
const { sys_data_status } = proxy.useDict('sys_data_status');
const { fangcun_mint_chain_status } = proxy.useDict('fangcun_mint_chain_status');
const { fangcun_transfer_chain_status } = proxy.useDict('fangcun_transfer_chain_status');
const { fangcun_sale_status } = proxy.useDict('fangcun_sale_status');

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

const tickets = ref([]);

/** 查询 collection 列表 */
function getList() {
  loading.value = true;
  listCollection(queryParams.value).then((response) => {
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
  getCollection(id).then((response) => {
    form.value = response.data;
    form.value.status = '' + response.data.status; // 必选转为string，否则界面不显示
    open.value = true;
    title.value = '查看数据';
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['postRef'].validate((valid) => {
    if (valid) {
      form.value.status = parseInt(form.value.status);
      if (form.value.id != undefined) {
        updateCollection(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addCollection(form.value).then((response) => {
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
      return delCollection(id);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}

/** 删除证书按钮操作 */
function handleDeleteSJT(row) {
  reset();
  const id = row.id || ids.value;

  proxy.$modal
    .confirm('是否确认删除名称为:"' + row.collection_name + '" 的证书？')
    .then(function () {
      return sjtHide(row.asset_number);
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
    'fangcunjiyi/collection/export',
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
getTicket();

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
