# 注册

加入等待列表！注册后，我们将在产品向更广泛用户推出时第一时间通知您。

<div class="signup-form" style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <!
-
- 新的 HubSpot 联系人表单 -->
    <div id="hubspot-form" style="margin-bottom: 20px;"></div>

<!
-
- HubSpot 表单脚本 -->
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
    // 现有邮箱注册表单的 JavaScript（如果保留该表单则可选）
    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        document.getElementById("errorMessage").style.display = "block";
    });
</script>
