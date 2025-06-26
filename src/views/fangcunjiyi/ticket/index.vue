<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
       <el-form-item label="有效状态" prop="status">
         <el-select v-model="queryParams.available_status" placeholder="有效状态" clearable style="width: 200px">
           <el-option v-for="dict in fangcun_ticket_available_status" :key="dict.value" :label="dict.label" :value="dict.value" />
         </el-select>
       </el-form-item>
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
       <el-table-column type="selection" width="20" align="center" />
       <el-table-column label="邮折" width="120"  align="center" prop="ticket_name" />
       <el-table-column label="封面图片" align="center" prop="cover_uri">
         <template #default="scope">
         <div v-if="scope.row.ticket_type===3">
            <video width="100" height="100" :src="scope.row.cover_uri" controls></video>
         </div>
         <div v-else>
            <el-image style="width: 100px; height: 100px" :src="scope.row.cover_uri" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.cover_uri]" show-progress :initial-index="1" fit="contain" preview-teleported="true"/>
         </div>
         </template>
       </el-table-column>
       <el-table-column label="logo" align="center" prop="publisher_logo">
         <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.publisher_logo" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.publisher_logo]" show-progress :initial-index="1" fit="contain" preview-teleported="true"/>
         </template>
       </el-table-column>
       <el-table-column label="详情页" align="center" prop="description">
         <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.description" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.description]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
         </template>
       </el-table-column>
       <el-table-column label="扫码着陆页" align="center" prop="loading_uri">
         <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.loading_uri" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.loading_uri]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
         </template>
       </el-table-column>
       <el-table-column label="NFT原图" align="center" prop="origin_uri">
         <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.origin_uri" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.origin_uri]" show-progress :initial-index="1" fit="cover" preview-teleported="true"/>
         </template>
       </el-table-column>
       <el-table-column label="铸造数量" width="80" align="center" prop="amount" />
       <el-table-column label="已销售数量" width="100" align="center" prop="sold_amount" />
       <el-table-column label="剩余数量" width="80" align="center" prop="sku_balance" />
       <el-table-column label="售卖价格" width="80" align="center" prop="price" />
       <el-table-column label="DAR登记ID" align="center" prop="registration_id" />
       <el-table-column label="销售状态" align="center" prop="sale_status">
         <template #default="scope">
           <DictTag :options="fangcun_ticket_sale_status" :value="scope.row.sale_status" />
         </template>
       </el-table-column>
       <el-table-column label="有效状态" align="center" prop="available_status">
         <template #default="scope">
           <DictTag :options="fangcun_ticket_available_status" :value="scope.row.available_status" />
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
     <el-dialog :title="title" v-model="open" width="700px" append-to-body :close-on-press-escape=false :close-on-click-modal=false>
       <el-form ref="postRef" :model="form" :rules="rules" label-width="200px">
         <el-form-item label="邮折名称" prop="ticket_name">
           <el-input v-model="form.ticket_name" placeholder="请输入 邮折名称" />
         </el-form-item>
         <el-form-item label="数字藏品类型" prop="ticket_type">
           <el-radio-group v-model="form.ticket_type">
            <!-- <el-radio :value="1">头像</el-radio> -->
            <el-radio key=2 label=2 border>图片</el-radio>
            <el-radio key=3 label=3 border>视频</el-radio>
            <!-- <el-radio :value="4">微博</el-radio> -->
            <!-- <el-radio :value="5">3D</el-radio> -->
             <!-- <el-radio v-for='dict in [{id:2, name:"图片"}, {id:3, name:"视频"},] ' :key="dict.id" :label="dict.id">{{ dict.name }}</el-radio> -->
           </el-radio-group>
         </el-form-item>
         <div v-if="form.ticket_type == 2">
         <el-form-item label="列表页图片" prop="cover_uri">
           <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.cover_uri"  ></ImageUpload>
         </el-form-item>
         </div>
         <div v-if="form.ticket_type == 3">
         <el-form-item label="列表页视频" prop="cover_uri">
            <FileUpload :fileType='["png", "jpg", "jpeg", "gif", "mp4"]' v-model="form.cover_uri"></FileUpload>
         </el-form-item>
         </div>
         <el-form-item label="扫码着陆页图片" prop="landing_uri">
           <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.landing_uri"  ></ImageUpload>
         </el-form-item>
         <el-form-item label="数字藏品 原图" prop="landing_uri">
           <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.origin_uri"  ></ImageUpload>
         </el-form-item>
         <el-form-item label="发行方企业logo" prop="publisher_logo">
           <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.publisher_logo"  ></ImageUpload>
         </el-form-item>
         <el-form-item label="详情页图片" prop="description">
           <ImageUpload limit="1" fileSize="5" :fileType="imageType" isShowTip="true" isFormat="true" v-model="form.description"  ></ImageUpload>
         </el-form-item>
         <el-form-item label="发行方名称" prop="publisher_name">
           <el-input v-model="form.publisher_name" type="text" placeholder="请输入 发行方名称" />
         </el-form-item>
         <el-form-item label="价格" prop="price">
           <!-- <el-input v-model="form.price" type="text" placeholder="请输入价格" /> -->
           <el-input-number v-model="form.price" :min="0" :max="10000"/>&nbsp元
         </el-form-item>
         <el-form-item label="发行数量" prop="amount">
           <!-- <el-input v-model="form.amount" type="text" placeholder="请输入发行数量" /> -->
           <el-input-number v-model="form.amount" :min="1" :max="50000"/>
         </el-form-item>
         <el-form-item label="DAR登记ID" prop="registration_id">
           <el-input v-model="form.registration_id" type="text" placeholder="请输入 DAR登记ID" />
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
 import { listTicket } from '@/api/fangcunjiyi/ticket'
 import { listAllTickets } from '@/api/fangcunjiyi/ticket';
 
 const imageType = ref(["png", "jpg", "jpeg", "gif"])
 
 const showPicViewer = ref()
 const closePicViewer = () => showPicViewer.value = false;
 const showPicViwerx = () => showPicViewer.value = true;
 
 const { proxy } = getCurrentInstance();
 const { sys_data_status } = proxy.useDict('sys_data_status');
const { fangcun_ticket_sale_status } = proxy.useDict('fangcun_ticket_sale_status');
const { fangcun_ticket_available_status } = proxy.useDict('fangcun_ticket_available_status');

 const postList = ref([]);
 const open = ref(false);
 const loading = ref(true);
 const showSearch = ref(true);
 const ids = ref([5]);
 const single = ref(true);
 const multiple = ref(true);
 const total = ref(0);
 const title = ref('');

 
 const data = reactive({
   form: {
      order: '0',
      price: 0,
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
 
 /** 查询岗位列表 */
 function getList() {
   loading.value = true;
   listTicket(queryParams.value).then((response) => {
     postList.value = response.rows;
     console.log(response.data);
     total.value = response.total;
     // total.value = 12;
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
   getResource(id).then((response) => {
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
         updateResource(form.value).then((response) => {
           proxy.$modal.msgSuccess('修改成功');
           open.value = false;
           getList();
         });
       } else {
         addResource(form.value).then((response) => {
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
     'system/post/export',
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
 /* .el-table .el-image {
   overflow: visible;  确保图片可以正常显示 
 }*/
 </style>
 