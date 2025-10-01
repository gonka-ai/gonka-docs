# 注册

加入候补名单！注册后，我们将在面向更广泛用户开放时第一时间通知你。

<div class="signup-form" style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <!-- HubSpot 联系表单 -->
    <div id="hubspot-form" style="margin-bottom: 20px;"></div>

<!-- HubSpot Form Script -->
<script>
  var script = document.createElement('script');
  script.src = "https://js.hsforms.net/forms/v2.js";
  script.onload = function() {
    if (window.hbspt) {
      window.hbspt.forms.create({
        portalId: "21332124",
        formId: "bb643442-f16c-415c-904e-0af99c759f09",
        target: "#hubspot-form"
      });
    }
  };
  document.body.appendChild(script);
</script>


<script>
    // 可选：若你还保留了自定义表单，可在此处处理提交逻辑
    var el = document.getElementById("signupForm");
    if (el) {
      el.addEventListener("submit", function(event) {
        event.preventDefault(); 
        var err = document.getElementById("errorMessage");
        if (err) err.style.display = "block";
      });
    }
</script>
