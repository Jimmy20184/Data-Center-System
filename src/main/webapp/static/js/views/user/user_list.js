var dataTable;
var user_list_ = "#user_list_";
const key = CryptoJS.enc.Utf8.parse('reddatespartan25');
const iv = CryptoJS.enc.Utf8.parse('hongzao25spartan');
$(document).ready(function () {

    if(checkButState("insert_but_")) {
        $(".insert_but_").show();
    }


    $("#state").html(USER_HANDLE.getStateSelect());

    initUserList();

    $(".search_").click(function () {
        search();
    });

    $(".reset_").click(function () {
        resetSearch(dataTable);
    });

    $(".add_").click(function () {
        REQ_HANDLE_.location_("/user/add");
    });

    $("#addUserForm").validate(
        {
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: false,
            rules: {
                userName: {
                    required: true,
                    minlength: 4,
                    maxlength: 20,
                },
                email: {
                    required: true,
                },
                password: {
                    required: true,
                    minlength: 4,
                    maxlength: 10,
                }

            },
            messages: {
                userName: {
                    required: "Please enter userName"
                },
                email: {
                    required: "Please enter email"
                },
                password: {
                    required: "Please enter password"
                },
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                element.parent('div').append(error);
            }
        },
    );
    $("#add_user_btn").click(function () {
        addUser();
    })

});


var initUserList = function () {
    dataTable = $(user_list_).DataTable({
        "responsive": true,
        "destroy": true,
        "processing": true,
        "serverSide": true,
        "stateSave": false,
        "scrollCollapse": true,
        "bAutoWidth": false,
        "sAjaxSource": "/sys/user/queryUserList",
        "fnServerData": function (sSource, aoData, fnCallback) {
            var temp = dataTablesParam(datatableSearchInfo, JSON.stringify(aoData));
            $.ajax({
                "type": "post",
                "url": sSource,
                "dataType": "json",
                "contentType": "application/json",
                "data": JSON.stringify(temp),
                "success": function (data) {
                    if (data.code == 3) {
                        alert_success_login(data.msg);
                    } else {
                        handleDataTableResult(data, fnCallback);
                    }
                }
            });
        },
        "deferRender": true,
        "bSort": false,
        "fnDrawCallback": function () {
            initNumber(this.api());
        },
        "columns": [
            {data: null, "targets": 0, title: "No.", bSearchable: false, bSortable: false},
            {data: "contactsName", title: "Name", bSearchable: false, bSortable: false},
            {data: "contactsEmail", title: "Email", bSearchable: false, bSortable: false},
            {data: "createDate", title: "Created Time", bSearchable: false, bSortable: false},
            {data: "state", render: initState, title: "Status", bSearchable: false, bSortable: false},
            {render: initTableBut, title: "Options", bSortable: false}
        ]
    });

    cleanDataTableConf(user_list_);
};


var initState = function (data, type, row) {
    return USER_HANDLE.getStateName(data);
};


var initTableBut = function (data, type, row) {
    var state = row.state;

    var userId = row.userId;
    var loginName = row.contactsName;
    var butStr = '';
    if (state == 0) {
        if (checkButState("enable_but_")) {
            butStr += '<button type="button" class="btn-info btn-xs" onclick="updateUserState(' + userId + ',\'' + loginName + '\',\'enabled\',1)"><img src="/static/images/btn/btn_able_icon.png">&nbsp;Enabled</button>';
        }
    } else {
        if (checkButState("disable_but_")) {
            butStr += '<button type="button" class="btn-danger btn-xs" onclick="updateUserState(' + userId + ',\'' + loginName + '\',\'disabled\',0)"><img src="/static/images/btn/btn_unable_icon.png">&nbsp;Disabled</button>';
        }
    }
    if (checkButState("update_but_")) {
        butStr += '<button type="button" class="btn-info btn-xs" onclick="editUser(' + userId + ')"><img src="/static/images/btn/btn_edit_icon.png">&nbsp;Edit</button>';
    }
    if (checkButState("check_but_")) {
        butStr += '<button type="button" class="btn-info btn-xs" onclick="checkUser(' + userId + ')"><img src="/static/images/btn/btn_look_icon.png">&nbsp;Details</button>';
    }
    if (checkButState("reset_but_")) {
        butStr += '<button type="button" class="btn-info btn-xs" onclick="resetUserPassWord(' + userId + ',\'' + loginName + '\')"><img src="/static/images/btn/btn_reset_pass_icon.png">&nbsp;Reset Password</button>';
    }
    return butStr == "" ? "--" : butStr;
};

var checkUser = function (userId) {
    REQ_HANDLE_.location_("/user/check/" + userId);
};


var editUser = function (userId) {
    REQ_HANDLE_.location_("/user/edit/" + userId);
};



function resetUserPassWord(userId, userName) {
    alert_confirm("", "Confirm to \"" + userName + "\" user reset password？", function () {
        var data = {};
        data.userId = userId;
        resetPassWord(data)
    }, null);
}
function resetPassWord(data) {
    $.ajax({
        "type": "post",
        "url": "/sys/user/resetPassWord",
        "datatype": "json",
        "contentType": "application/json",
        "data": JSON.stringify(data),
        "success": function (data) {
            if (data.code == 1) {
                alert_success("", data.msg);
            } else if (data.code == 3) {
                alert_success_login(data.msg);
            } else {
                alert_error("", data.msg);
            }
        }
    });
}

function updateUserState(userId, loginName, stateName, state) {
    alert_confirm("", "Are you sure you want to " + stateName  + " the user of \"" + loginName + "\"？", function () {
        var data = {};
        data.userId = userId;
        data.userState = state;
        updateState(data)
    }, null);
}

function updateState(data) {
    $.ajax({
        "type": "post",
        "url": "/sys/user/updateUserState",
        "datatype": "json",
        "contentType": "application/json",
        "data": JSON.stringify(data),
        "success": function (data) {
            if (data.code == 1) {
                alert_success("", data.msg);
                search();
            } else if (data.code == 3) {
                alert_success_login(data.msg);
            } else {
                alert_error("", data.msg);
            }
        }
    });
}




var addUser = function () {
    $("#add_user_btn").prop('disabled', true)

    if ($("#addUserForm").valid()) {
        const userName = $("#userName").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const phone = $("#phone").val();

        var data = {};
        data.userName = getEncryptionData(userName);
        data.email = getEncryptionData(email);
        data.password = getEncryptionData(password);
        data.phone = phone;

        $.ajax({
            "type": "post",
            "url": "/sys/user/addUser",
            "dataType": "json",
            "contentType": "application/json",
            "data": JSON.stringify(data),
            "success": function (data) {
                if (data.code == 1) {
                    alert_success("", "Submitted successfully", function () {
                        $("#addModal").modal("hide");
                        // window.location.href = "user/add.html";
                        document.querySelector('#addUserForm').reset();
                        search();
                    });
                } else if (data.code == 3) {
                    alert_success_login(data.msg);
                } else {
                    alert_error("", data.msg);
                }
                $("#add_user_btn").prop('disabled', false)
            },
            error: function () {
                alert_error("", "Failed to add user");
            }
        });
    }

}

var search = function () {
    dataTable.ajax.reload();
};


var USER_HANDLE = {
    STATE_: [
        {"code": 1, "name": "Enabled"},
        {"code": 0, "name": "Disabled"}
    ],
    getStateSelect: function () {
        var op = '<option value="">All</option>';
        var stateList = USER_HANDLE.STATE_;
        for (var i = 0; i < stateList.length; i++) {
            op += '<option value="' + stateList[i].code + '">' + stateList[i].name + '</option>';
        }
        return op;
    },
    getStateName: function (code) {
        var stateList = USER_HANDLE.STATE_;
        for (var i = 0; i < stateList.length; i++) {
            if (stateList[i].code == code) {
                return stateList[i].name;
            }
        }
        return "";
    }
};


function getEncryptionData(data) {
    if (data == "" || data == null) return '';
    var srcs = CryptoJS.enc.Utf8.parse(data + '');
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    var encryptedStr = encrypted.ciphertext.toString().toUpperCase();
    return encryptedStr;
}


var search = function () {
    setDatatableSearchInfo($("#state").val(), "state");
    setDatatableSearchInfo($.trim($("#userName").val()), "userName");
    dataTable.ajax.reload();
};