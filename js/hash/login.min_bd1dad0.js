$("#submit").click(function(){var a=$("[name\x3d'username']").val(),c=$("[name\x3d'password']").val(),d=$("[name\x3d'isRemember']").is(":checked");if(0==a.length||0==c.length)return $(".my-modal-body").html("\u7528\u6237\u540d\u6216\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a\uff01"),$("#myModal").modal("show"),setTimeout(function(){$("#myModal").modal("hide")},1200),!1;var b=document.referrer;query("./api/checkLogin.php",{username:a,password:c,isRemember:d,submit:"submit"},"post",!0,function(a){1==a||0==
a?"register.php"===b.substring(b.lastIndexOf("/")+1)?location.href="index.php":location.href=b:($(".my-modal-body").html("\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef"),$("#myModal").modal("show"),setTimeout(function(){$("#myModal").modal("hide")},1200))});return!1});