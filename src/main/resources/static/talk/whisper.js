

// 回车事件执行的任务
var Task = {
    isNameInput: true,
    isCodeInput: false,
    isCodeRepeatInput: false,
    isContentInput: false,
    inputName() {
        var un = $("#un");
        var cd = $("#cd");
        if (query("/whisper/l?n=" + un.val(), {}) === "true") {
            $("#cd_div").show();
            cd.focus();
            this.isNameInput = false;
            this.isCodeInput = true;
        } else {
            un.focus();
            $("#AccessDenied").show();
            return false;
        }
    },
    inputCode() {
        $("#cd_div_repeat").show();
        $("#cd_repeat").focus();
        this.isCodeInput = false;
        this.isCodeRepeatInput = true;
    },
    inputRepeatCode() {
        var cd = $("#cd");
        var cd_repeat = $("#cd_repeat");
        if (cd.val() === cd_repeat.val()) {
            $("#AccessGranted").show();
            $("#AccessDenied").hide();
            $("#d_text_e").show();
            $("#d_text").focus();
            this.isCodeRepeatInput = false;
            this.isContentInput = true;
            r();
        } else {
            $("#AccessDenied").show();
        }
    },
    inputContent() {
        var c = $("#d_text").val();
        var data = {};
        data.n = $("#un").val();
        data.c = encodeURI(encrypt(c));
        if (query("/whisper/s", data) === "ok") {
            $("#d_text").val("");
        }
    }
};

function doSth() {
    if (Task.isNameInput) {
        Task.inputName();
        return false;
    }
    if (Task.isCodeInput) {
        Task.inputCode();
        return false;
    }
    if (Task.isCodeRepeatInput) {
        Task.inputRepeatCode();
        return false;
    }
    if (Task.isContentInput) {
        Task.inputContent();
    }
}


// keyboard event:enter
document.onkeydown = function (e) {
    var ev = document.all ? window.event : e;
    if (ev.keyCode === 13) {
        doSth();
    }
};

// query content
function r() {
    setInterval(function () {
        doR()
    }, 1000);
}

function doR() {
    var c = query("/whisper/r?n=" + $("#un").val(), {});
    if (c) {
        var co = eval('(' + c + ')');
        for (var i = 0; i < co.length; i++) {
            var cos = co[i];
            cos = decodeURI(cos);
            var ran = rand(5);
            var dh = $("<div id='d_" + ran + "'></div>")
            var ch = $("<textarea class='r' id='r_" + ran + "' id='rc' readonly contenteditable='false'></textarea>").val(cos);
            var bh = $("<button ontouchstart=\"doRD('" + ran + "')\" ontouchend=\"doRDD('" + ran + "')\">DECRYPT &amp; CLEAR</button>")
            dh.append(ch);
            dh.append(bh);
            $("#rc").append(dh);
            createLocalPushMsg();
        }
    }
}


function createLocalPushMsg() {
    var options = {cover: false};
    plus.push.createMessage("YOU HAVE RECEIVED A NSIS MESSAGE.", "LocalMSG", options);
}

function doRD(id) {
    var obj = $("#r_" + id);
    var word = obj.val();
    obj.val(decrypt(word));
}

function doRDD(id) {
    var obj = $("#d_" + id);
    obj.remove();
}

// request d server
function query(url, data) {
    return $.ajax({url: url, async: false, data: data}).responseText;
}

// decrypt and encrypt
function decrypt(word) {
    var cd = $("#cd").val();
    return CryptoJS.AES.decrypt(word, cd).toString(CryptoJS.enc.Utf8)
}

function encrypt(word) {
    var cd = $("#cd").val();
    return CryptoJS.AES.encrypt(word, cd)
}


// watch
setInterval(function () {
    startTime()
}, 1000);

function startTime() {
    var d = new Date();
    document.getElementById('watch').innerHTML = d.toString() + " " + d.getDay();
}

function rand(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}