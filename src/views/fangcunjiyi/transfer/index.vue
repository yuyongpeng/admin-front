<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="NFT id" prop="collection_id">
         <el-input v-model="queryParams.collection_id" placeholder="请填写collectio id" clearable style="width: 200px" @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="token id" prop="token_id">
         <el-input v-model="queryParams.token_id" placeholder="请填写token id" clearable style="width: 200px" @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="接收者手机号" prop="receiver_mobile">
         <el-input v-model="queryParams.receiver_mobile" placeholder="请填写接受者手机号" clearable style="width: 200px" @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="区块链 txid" prop="tx_id">
         <el-input v-model="queryParams.tx_id" placeholder="请填写区块链tx_id" clearable style="width: 200px" @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item label="上链状态" prop="mint_chain_status">
         <el-select v-model="queryParams.mint_chain_status" placeholder="状态" clearable style="width: 200px">
           <el-option v-for="dict in fangcun_transfer_chain_status" :key="dict.value" :label="dict.label" :value="dict.value" />
         </el-select>
      </el-form-item>

      <el-form-item label="交易类型" prop="transfer_type">
         <el-select v-model="queryParams.transfer_type" placeholder="交易类型" clearable style="width: 200px">
           <el-option v-for="dict in fangcun_transfer_type" :key="dict.value" :label="dict.label" :value="dict.value" />
         </el-select>
      </el-form-item>           
      <el-form-item>
         <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
     </el-form>
 
     <!-- <el-row :gutter="10" class="mb8">
       <el-col :span="1.5">
         <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['fangcunjiyi:collection:add']">新增</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['fangcunjiyi:collection:edit']">修改</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['fangcunjiyi:collection:export']">导出</el-button>
       </el-col>
       <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
     </el-row> -->
 
     <el-table v-loading="loading" :data="postList" stripe="true" highlight-current-row="true" @selection-change="handleSelectionChange">
       <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="collection id" align="center" prop="collection_id" />
       <el-table-column label="名称" align="center" prop="collection_name" >
         <template #default="scope">
            <span>{{ scope.row.collection.collection_name }}</span>
         </template>
       </el-table-column>
       <el-table-column label="token id" align="center" prop="token_id" />
       <el-table-column label="接收人手机" align="center" prop="receiver_mobile"/>
       <el-table-column label="TXID" align="center" prop="transfer_tx_id"/>
       <el-table-column label="上链状态" align="center" prop="chain_status"/>
       <el-table-column label="交易类型" align="center" prop="transfer_type" />
       <el-table-column label="创建时间" align="center" prop="create_time" width="180">
         <template #default="scope">
           <span>{{ parseTime(scope.row.create_time) }}</span>
         </template>
       </el-table-column>
       <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
         <template #default="scope">
           <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['fangcunjiyi:transfer:edit']">查看</el-button>
           <!-- <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['fangcunjiyi:collection:del']">删除</el-button> -->
         </template>
       </el-table-column>
     </el-table>
 
     <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
 
     <!-- 添加或修改对话框 -->
     <el-dialog :title="title" v-model="open" width="800px" append-to-body>
       <el-form ref="postRef" :model="form" :rules="rules" label-width="300px">
         <el-form-item label="id" prop="id">
            <el-input v-model="form.id" disabled />
         </el-form-item>
         <el-form-item label="名称" prop="collection_name">
           <el-input v-model="form.collection.collection_name"  disabled/>
         </el-form-item>
         <el-form-item label="藏品ID(collection_id)" prop="collection_id">
           <el-input v-model="form.collection_id"   disabled/>
         </el-form-item>
         <el-form-item label="藏品存证uuid(collection_credential)" prop="collection_credential">
           <el-input v-model="form.collection_credential"   disabled/>
         </el-form-item>
         <el-form-item label="藏品最后交易存证uuid" prop="collection_last_credential">
           <el-input v-model="form.collection_last_credential"   disabled/>
         </el-form-item>
         <el-form-item label="token id" prop="token_id">
          <el-input v-model="form.ticket_id"   disabled/>
         </el-form-item>
         <el-form-item label="订单号(order_id)" prop="order_id">
          <el-input v-model="form.order_id"   disabled/>
         </el-form-item>
         <el-form-item label="转出人用户ID(transfer_uid)" prop="transfer_uid">
          <el-input v-model="form.transfer_uid"   disabled/>
         </el-form-item>
         <el-form-item label="转出人姓名(transfer_name)" prop="transfer_name">
          <el-input v-model="form.transfer_name"   disabled/>
         </el-form-item>
         <el-form-item label="接收人用户ID(receiver_uid)" prop="receiver_uid">
          <el-input v-model="form.receiver_uid"   disabled/>
         </el-form-item>
         <el-form-item label="接收人姓名(receiver_name)" prop="receiver_name">
          <el-input v-model="form.receiver_name"   disabled/>
         </el-form-item>
         <el-form-item label="接收人手机(receiver_mobile)" prop="receiver_mobile">
          <el-input v-model="form.receiver_mobile"   disabled/>
         </el-form-item>
         <el-form-item label="上链交易 TX ID(tx_id)" prop="tx_id">
          <el-input v-model="form.tx_id"   disabled/>
         </el-form-item>
         <el-form-item label="上链状态(chain_status)" prop="chain_status">
          <el-input v-model="form.chain_status"   disabled/>
         </el-form-item>
         <el-form-item label="上链时间(chain_time)" prop="chain_time">
          <el-input v-model="form.chain_time"   disabled/>
         </el-form-item>
         <el-form-item label="交易类型(transfer_type)" prop="transfer_type">
          <el-input v-model="form.transfer_type"   disabled/>
         </el-form-item>
         <el-form-item label="最后修改时间(modify_time)" prop="modify_time">
          <el-input v-model="form.modify_time"   disabled/>
         </el-form-item>
         <el-form-item label="区块号(block_number)" prop="block_number">
          <el-input v-model="form.block_number"   disabled/>
         </el-form-item>
       </el-form>
      <div class="dialog-footer">
           <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
           <el-button @click="cancel">取 消</el-button>
         </div>
     </el-dialog>
   </div>
 </template>
 
 <script setup name="Collection">
 import { listTransfer, addTransfer, delTransfer, getTransfer, updateTransfer } from '@/api/fangcunjiyi/transfer';
import { handleError } from 'vue';
 
 const imageType = ref(["png", "jpg", "jpeg", "gif"])
 
 const showPicViewer = ref()
 const closePicViewer = () => showPicViewer.value = false;
 const showPicViwerx = () => showPicViewer.value = true;
 
 const { proxy } = getCurrentInstance();
const { fangcun_transfer_chain_status } = proxy.useDict('fangcun_transfer_chain_status');
const { fangcun_transfer_type } = proxy.useDict('fangcun_transfer_type');
 
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
   listTransfer(queryParams.value).then((response) => {
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
   getTransfer(id).then((response) => {
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
         updateTransfer(form.value).then((response) => {
           proxy.$modal.msgSuccess('修改成功');
           open.value = false;
           getList();
         });
       } else {
         addTransfer(form.value).then((response) => {
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
       return delTransfer(id);
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
     'fangcunjiyi/transfer/export',
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
 