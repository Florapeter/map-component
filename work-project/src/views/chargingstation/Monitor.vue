<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input v-model="formParams.input" placeholder="请输入站点名称/id">
          <template #append>
            <el-select v-model="select" style="width: 115px">
              <el-option label="按名称查询" value="name" />
              <el-option label="按ID查询" value="id" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="formParams.value" placeholder="充电站状态">
          <el-option :value="1" label="全部"></el-option>
          <el-option :value="2" label="使用中"></el-option>
          <el-option :value="3" label="空闲中"></el-option>
          <el-option :value="4" label="维护中"></el-option>
          <el-option :value="5" label="待维修"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt">
    <el-row>
      <el-col :span="6"><el-statistic title="累计充电量(度)" :value="268900" /></el-col>
      <el-col :span="6"><el-statistic title="累计充电次数(次)" :value="1389" /></el-col>
      <el-col :span="6"><el-statistic title="服务区域(个)" :value="88" /></el-col>
      <el-col :span="6"><el-statistic title="累计效益(元)" :value="5622178" /></el-col>
    </el-row>
  </el-card>
  <el-card class="mt">
    <el-button type="primary">
      <el-icon style="margin-right: 5px;">
        <Plus />
      </el-icon>
      新增充电站
    </el-button>
  </el-card>
  <el-table :data="tableData" style="width: 100%" class="mt">
    <!-- :data绑定后端传过来的table数据 -->
    <el-table-column type="index" width="60" label="序号" />
    <el-table-column prop="name" label="站点名称" width="200" />
    <!-- prop绑定table内对应的数据 -->
    <el-table-column prop="id" label="站点id" />
    <el-table-column prop="city" label="所属城市" />
    <el-table-column prop="fast" label="快充数" />
    <el-table-column prop="slow" label="慢充数" />
    <el-table-column prop="status" label="状态">
      <template #default="scope">
        <!-- scope 是一个包含当前行数据的对象，通常包含：scope.row：当前行的完整数据对象。 -->
        <el-tag v-if="scope.row.status == 2" type="primary">使用中</el-tag>
        <el-tag v-else-if="scope.row.status == 3" type="success">空闲中</el-tag>
        <el-tag v-else-if="scope.row.status == 4" type="warning">维护中</el-tag>
        <el-tag v-else-if="scope.row.status == 5" type="danger">待维修</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="now" label="正在充电" />
    <el-table-column prop="fault" label="故障数" />
    <el-table-column prop="person" label="站点负责人" />
    <el-table-column prop="tel" label="负责人电话" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button type="primary" size="small">编辑</el-button>
        <el-popconfirm title="确定要删除吗">
          <!-- 这是一个气泡确认框，可以在此绑定对应的事件 -->
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="fr mt mb" 
                       v-model:current-page="pageInfo.page" 
                       v-model:page-size="pageInfo.pageSize"
                       :page-sizes="[10, 20, 30, 40]" 
                       :background="true" 
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totals" 
                       @size-change="handleSizeChange" 
                       @current-change="handleCurrentChange" />
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue';
import { listApi } from '@/api/chargingstation';
const formParams = reactive({
  input: '',
  value: 1
})
const select = ref('name')
const tableData = ref([])
const loading = ref(false)
const pageInfo = ref({
  page: 1,
  pageSize: 10,
})
const totals = ref(0)
const loadData = async () => {
  loading.value = true
  const { data: { list, total } } = await listApi({ ...pageInfo.value, [select.value]: formParams.input, status: formParams.value })
  totals.value = total
  tableData.value = list
  loading.value = false
}
onMounted(() => {
  loadData()
})
const handleSizeChange = (size: number) => {
    pageInfo.value.pageSize = size
    loadData()
}
const handleCurrentChange = (page: number) => {
    pageInfo.value.page = page;
    loadData()
}
const reset = () => {
  pageInfo.value.page = 1;
    pageInfo.value.pageSize = 10;
    formParams.input = ""
    formParams.value = 1
    select.value = "name"
    loadData()
}
</script>

<style scoped lang='less'></style>