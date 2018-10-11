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
                        <el-popover
                          placement="top-start"
                          width="400"
                          trigger="hover"
                        >
                          <div style="max-height: 400px; overflow-y: auto;">
                            <el-tag
                              :key="tag"
                              v-for="tag in alphaModules"
                              closable
                              :disable-transitions="false"
                              @close="handleCloseModule(tag)">
                              {{tag}}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="moduleInputVisible"
                              v-model="moduleInputValue"
                              ref="saveTagInputModule"
                              size="small"
                              @keyup.enter.native="handleInputConfirmModule"
                              @blur="handleInputConfirmModule"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInputModule">+ 新增模块</el-button>
                          </div>
                          <el-button slot="reference">模块维护</el-button>
                        </el-popover>
                        <el-popover
                          placement="top-start"
                          width="400"
                          trigger="hover"
                        >
                          <div style="max-height: 400px; overflow-y: auto;">
                            <el-tag
                              :key="tag"
                              v-for="tag in alphaTypes"
                              closable
                              :disable-transitions="false"
                              @close="handleCloseType(tag)">
                              {{tag}}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="typeInputVisible"
                              v-model="typeInputValue"
                              ref="saveTagInputType"
                              size="small"
                              @keyup.enter.native="handleInputConfirmType"
                              @blur="handleInputConfirmType"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInputType">+ 新增类别</el-button>
                          </div>
                          <el-button slot="reference">类别维护</el-button>
                        </el-popover>
                        <el-popover
                          placement="top-start"
                          width="400"
                          trigger="hover"
                        >
                          <div style="max-height: 400px; overflow-y: auto;">
                            <el-tag
                              :key="tag"
                              v-for="tag in alphaStates"
                              closable
                              :disable-transitions="false"
                              @close="handleCloseState(tag)">
                              {{tag}}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="stateInputVisible"
                              v-model="stateInputValue"
                              ref="saveTagInputState"
                              size="small"
                              @keyup.enter.native="handleInputConfirmState"
                              @blur="handleInputConfirmState"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInputState">+ 新增状态</el-button>
                          </div>
                          <el-button slot="reference">状态维护</el-button>
                        </el-popover>
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
                            <el-select v-if="scope.row.$$editable" filterable allow-create v-model="scope.row.module" placeholder="请选择模块">
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
                            <el-select v-if="scope.row.$$editable" filterable allow-create v-model="scope.row.type" placeholder="请选择类别">
                              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{ scope.row.type }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="type" label="状态">
                          <template slot-scope="scope">
                            <el-select v-if="scope.row.$$editable" filterable allow-create v-model="scope.row.state" placeholder="请选择状态">
                              <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <span v-else>{{ scope.row.state }}</span>
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
                            <pre class="detail-description" v-else>{{ scope.row.detail }}</pre>
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
  import WechatService from '../service/wechat-service';
  export default {
    name: 'bugs-page',
    data() {
      return {
        bugs: bugService.getBugs(),
        alphaModules: bugService.getModules(),
        moduleInputVisible: false,
        moduleInputValue: '',
        alphaTypes: bugService.getTypes(),
        typeInputVisible: false,
        typeInputValue: '',
        alphaStates: bugService.getStates(),
        stateInputVisible: false,
        stateInputValue: '',
      };
    },
    computed: {
      modules() {
        return this.alphaModules.map(module => ({ label: module, value: module }));
      },
      types() {
        return this.alphaTypes.map(type => ({ label: type, value: type }));
      },
      states() {
        return this.alphaStates.map(state => ({ label: state, value: state }));
      },
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
        bugService.setBugs(this.bugs);
      },
      handleCloseModule(tag) {
        this.alphaModules.splice(this.alphaModules.indexOf(tag), 1);
        bugService.setModules(this.alphaModules);
      },
      showInputModule() {
        this.moduleInputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInputModule.$refs.input.focus();
        });
      },
      handleInputConfirmModule() {
        const inputValue = this.moduleInputValue;
        if (inputValue) {
          this.alphaModules.push(inputValue);
          bugService.setModules(this.alphaModules);
        }
        this.moduleInputVisible = false;
        this.moduleInputValue = '';
      },
      handleCloseType(tag) {
        this.alphaTypes.splice(this.alphaTypes.indexOf(tag), 1);
        bugService.setTypes(this.alphaTypes);
      },
      showInputType() {
        this.typeInputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInputType.$refs.input.focus();
        });
      },
      handleInputConfirmType() {
        const inputValue = this.typeInputValue;
        if (inputValue) {
          this.alphaTypes.push(inputValue);
          bugService.setTypes(this.alphaTypes);
        }
        this.typeInputVisible = false;
        this.typeInputValue = '';
      },
      handleCloseState(tag) {
        this.alphaStates.splice(this.alphaStates.indexOf(tag), 1);
        bugService.setModules(this.alphaStates);
      },
      showInputState() {
        this.stateInputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInputState.$refs.input.focus();
        });
      },
      handleInputConfirmState() {
        const inputValue = this.stateInputValue;
        if (inputValue) {
          this.alphaStates.push(inputValue);
          bugService.setStates(this.alphaStates);
        }
        this.stateInputVisible = false;
        this.stateInputValue = '';
      },
    },
    mounted() {
      if (!WechatService.getSelectedBackupPath()) { // 如果没有选择目录
        this.$router.push('dashboard');
      }
    },
  };
</script>

<style>
  .bugs-page-main .ichat-detail {
    margin-left: 0;
  }
  .bugs-page-main .detail-description {
    white-space: pre-line;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 4px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>