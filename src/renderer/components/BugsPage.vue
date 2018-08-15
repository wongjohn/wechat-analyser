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
                    </div>
                  </div>
                </div>
                <div class="ichat-detail-c">
                  <section>
                    <div class="ichat-messages ichattypegroup" ref="ichatMessagesRef">
                      没有Bug
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
  export default {
    name: 'bugs-page',
    data() {
      return {};
    },
    methods: {},
    mounted() {},
  };
</script>

<style>
  .bugs-page-main .ichat-detail {
    margin-left: 0;
  }
</style>