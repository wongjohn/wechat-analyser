<template>
    <li class="ichat-message">
        <div class="ichat-message-from">
            <img
              src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCK5PlaK1piamCgcc1kAFzt2BE8PFPcm5urnmUJGfj53hXH50PT0EGt28ZqicxU8Paria72ohkVUxzA/132?token=eyJhbGciOiJIUzI1NiJ9.eyJvZmZpY2VfaWQiOiI0ZDc5MmUzMTZhMDUxMWU2YWE3NjAwMTYzZTE2MmFkZCIsImRldmljZVR5cGUiOiJ0ZWFtIiwib2ZmaWNlX25hbWUiOiJpQ291cnQiLCJ1c2VyX2lkIjoiRDk5QkUxNTAyQ0FEMTFFODg0Nzk0NDZBMkVEOURDQkQiLCJsb2dpblR5cGUiOiIxIiwidXNlcl9uYW1lIjoi546L5aOr5rGfIiwiaXNzIjoiaUxhdy5jb20iLCJleHAiOjE1MzM2OTYwNzQ3NzAsImlhdCI6MTUzMzA5MTI3NDc3MCwib2ZmaWNlVHlwZSI6ImludGVncmF0aW9uIn0.8nmwzTETmiky4inHiGF3WlDMfKhPfVF0h4-wpU4moZc">
        </div>
        <div class="ichat-message-content withhover">
            <div class="ichat-message-content-h">
                <h4>王士江</h4>
                <div class="ichat-message-time">17:58</div>
                <div class="ichat-message-time-star">
                    <a class="starBox"><!----> <!---->
                        <i class="star iui-icon iui-icon-star"></i>
                    </a>
                </div>
                <div class="ichat-message-ope"><!---->
                    <a class="iui-tooltip">
                        <i class="iui-icon iui-icon-pin"></i>
                        <div class="iui-tooltip-c" style="margin-left: 0px;">钉</div>
                    </a>
                    <a class="iui-tooltip">
                        <i class="iui-icon iui-icon-task-pad"></i>
                        <div class="iui-tooltip-c" style="margin-left: 0px;">
                            转任务
                        </div>
                    </a>
                </div>
            </div>
            <div class="ichat-message-content-c">
                <section>
                    <div class="iui-paragraph selectable">
                        <pre class="">{{chat.Message}}</pre>
                    </div>
                </section>
            </div>
        </div>
    </li>
</template>

<script>
  export default {
    name: 'text-message',
    props: {
      chat: Object,
    },
  };
</script>

<style>

</style>