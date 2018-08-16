<template>
  <main class="main-c bugs-page-main">
    <section>
      <div class="ichat">
        <div class="ichat-content">
          <div class="ichat-content-w">
            <div class="ichat-chat">
              <div class="ichat-detail">
                <div class="ichat-detail-h-w">
                  <div class="ichat-header">
                    <div class="ichat-header-user">
                      <h2>
                        Bug列表
                      </h2>
                      <div class="operations">
                        <el-button icon="el-icon-download" type="primary" @click="exportBugs" :disabled="!bugs.length">导出Bug列表</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ichat-detail-c">
                  <section>
                    <div class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
                      <el-table :data="bugs" border stripe
                                @selection-change="handleSelectionChange"
                                height="calc(100vh - 60px)" style="width: 100%;">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="module" label="模块">
                          <template slot-scope="scope">
                            <el-select v-if="scope.row.$$editable" v-model="scope.row.module" placeholder="请选择模块">
                              <el-option v-for="item in modules" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{ scope.row.module }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="title" label="标题">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.$$editable" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="scope.row.title"></el-input>
                            <span v-else>{{ scope.row.title }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="type" label="类别">
                          <template slot-scope="scope">
                            <el-select v-if="scope.row.$$editable" v-model="scope.row.type" placeholder="请选择类别">
                              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{ scope.row.type }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="source" label="来源">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.$$editable" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="scope.row.source"></el-input>
                            <span v-else>{{ scope.row.source }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="detail" label="详细描述">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.$$editable" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="scope.row.detail"></el-input>
                            <pre v-else>{{ scope.row.detail }}</pre>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button v-if="!scope.row.$$editable" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                            <el-button v-else type="success" icon="el-icon-check" circle @click="handleClose(scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
  import bugService from '../service/bug-service';
  export default {
    name: 'bugs-page',
    data() {
      return {
        bugs: bugService.getBugs(),
        modules: bugService.getModules(),
        types: bugService.getTypes(),
      };
    },
    methods: {
      exportBugs() {
        bugService.exportBugs()
          .then(() => {
            this.bugs = bugService.getBugs();
          }, (error) => {
            this.$message.error(error);
          });
      },
      handleSelectionChange() {},
      handleDelete(index) {
        this.bugs.splice(index, 1);
      },
      handleEdit(row) {
        this.$set(row, '$$editable', true);
      },
      handleClose(row) {
        this.$set(row, '$$editable', false);
      },
    },
    mounted() {},
  };
</script>

<style>
  .bugs-page-main .ichat-detail {
    margin-left: 0;
  }
</style>