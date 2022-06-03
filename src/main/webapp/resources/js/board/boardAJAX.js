window.onload = function () {
    if (wish === true) {
        document.getElementById("wish_btn").style.color = 'red';
        wishCount++;
    }
    commentList();
};

let wishCount = 0;
$(".wish_btn").click(function () {
    if (loginedId == false) {
        alert("로그인 후 이용해주세요!")
        return;
    }

    if (wishCount === 0) {
        let result = plusWish(oneBoardId);
        if(result === true){
            document.getElementById("wish_btn").style.color = 'red';
            wishCount++;
        }
    } else {
        let result = cancelWish(oneBoardId);
        if (result === true) {
            document.getElementById("wish_btn").style.color = 'rgba(0, 0, 0, 0.44)';
            wishCount = 0;
        }
    }
});

function plusWish(id) {
    let result = false;
    $.ajax({
        type: "POST",
        url: "/user/board/wish?id="+oneBoardId,
        async: false,
        data: {'id': id},
        success: function (data) {
            if (data.result === "200") {
                alert("위시 리스트에 추가하였습니다");
                result = true;
            } else if(data.result === "300") {
                alert("로그인 후 이용해주세요!");
            } else{
                alert("서버내 오류로 처리가 지연되고있습니다. 잠시 후 다시 시도해주세요");
            }
        },
        errors: function () {
            alert("error")
        }
    });
    return result;
}
function cancelWish(id) {
    let result = false

    $.ajax({
        type: "POST",
        url: "/user/board/cancelWish?id="+oneBoardId,
        async: false,
        data: {'id': id},
        success: function (data) {
            if (data.result === "200") {
                alert("위시 리스트에서 제거하였습니다");
                result = true;
            } else {
                alert("서버내 오류로 처리가 지연되고있습니다. 잠시 후 다시 시도해주세요");
            }
        },
        errors: function () {
            // alert("error")
        }
    });
    return result;
}

$('.report').on('click', function () {
    if(reportReult === true){
        alert("이미 신고한 게시물입니다.");
        return;
    }
    reportPageOpen();
});

function reportPageOpen() {
    var url = "/board/content/report?id="+oneBoardId;
    window.open(url, "신고하기", 'width=500,height=600, scrollbars=no, resizable=no');
}
/////////////////////////////////////////////////////////////////////////





///////comment list
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
let bid = getParameter("id");

function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);
    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '방금전';
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }

    const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay >= 2) {
            return `${timeValue.toLocaleDateString()+" "+timeValue.toLocaleTimeString()}`;
        } else {
            return `${betweenTimeDay}일전`;
        }
}

function commentList() {
    let bid = getParameter("id");

    $.ajax({
        type: "POST",
        url: "/board/content",
        data: {'id': bid},
        success: function (data) {
            var htmls = "";

            $.each(data, function (index, comments) {
                let date = new Date();
                let aa = new Date(comments.createTime);
                let abc = timeForToday(aa);
                htmls += '<div class="media text-muted pt-3" id="rid' + comments.id + '">';
                htmls += '<div class="d-flex">';
                htmls += '<div class="ms-3" id="">';
                htmls += '<div class="flex-shrink-0"><a href="/user/userLink?id='+comments.memberId+'"><img class="rounded-circle" src="'+comments.memberPicture +'"alt="..."/></a></div>'
                htmls += '<div class="test112">';
                htmls += '<div class="fw-bold" id="nametack">';
                htmls += '<div class="comment_Name"><a href="/user/userLink?id='+comments.memberId+'" style="text-decoration: none; color:black;">' + comments.nickname + '</a></div>';
                htmls += '<div class="comment_address">' + comments.admNm + '</div>';
                htmls += '</div>';
                htmls += '<div id="updateBtnArea"><button onclick="commentsUpdateVal('+comments.memberId+')" class="updateComment"><i class="ri-edit-line"></i></button></div>';
                htmls += '<div id="deleteBtnArea"><button onclick="commentsDeleteVal('+comments.memberId+')" id="' + comments.id + '" class="deleteComment" ><i class="ri-delete-bin-line"></i></button>';
                htmls += '</div>';
                htmls += '</div>';
                htmls += '<div class="comment_content">' + comments.contents + '</div>';
                htmls += '<div class="comment_createTime">' + abc + '</div>';
                htmls += '</div>';
                htmls += '</div>';
                htmls += '</div>';
                htmls += '<hr class="bottom_line">';
            });
            $("#contentsWrap").append(htmls);
            // startNum += 12;
        },
        error: function () {
            // alert("Error");
        }
    });
}


/////comment Write
//댓글 저장 버튼 클릭 이벤트

$(document).on('click', '#btnCommentSave', function () {
    let bid = getParameter("id");
    var replyContent = $('#content').val();
    if (fn_checkByte(replyContent) === false|| replyContent === "" ) {
        alert("댓글 공백은 허용되지 않습니다.");
        return;
    }
    // var replyReg_id = $('#reg_id').val();
    $.ajax({
        url: "/user/board/content/new"
        , data: {
            'content': replyContent, 'id': bid
        }
        , type: 'POST'
        , success: function (data) {
            getParameter("id");
            $('#content').val('');
            let aa = new Date(data.createTime);
            let cc = timeForToday(aa);
            var htmls = "";
            htmls += '<div class="media text-muted pt-3" id="rid' + data.id + '">';
            htmls += '<div class="d-flex">';
            htmls += '<div class="ms-3" id="">';
            htmls += '<div class="flex-shrink-0"><a href="/user/userLink?id='+data.memberId+'"><img class="rounded-circle" src="'+data.memberPicture +'" alt="dd"/></a></div>'
            htmls += '<div class="test112">';
            htmls += '<div class="fw-bold" id="nametack">';
            htmls += '<div class="comment_Name" value="' + data.nickname + '"><a href="/user/userLink?id='+data.memberId+'" style="text-decoration: none; color:black;">' + data.nickname + '</a></div>';
            htmls += '<div class="comment_address">' + data.admNm + '</div>';
            htmls += '</div>';
            htmls += '<div id="updateBtnArea"><button onclick="commentsUpdateVal('+data.memberId+')" class="updateComment"><i class="ri-edit-line"> </i></button></div>';
            htmls += '<div id="updateBtnArea"><button onclick="commentsDeleteVal('+data.memberId+')" id="' + data.id + '" class="deleteComment" ><i class="ri-delete-bin-line"></i></button></div>';
            htmls += '</div>';
            htmls += '<div class="comment_content">' + data.contents + '</div>';
            htmls += '<div class="comment_createTime">'+cc+'</div>';
            htmls += '</div>';
            htmls += '</div>';
            htmls += '</div>';
            htmls += '<hr class="bottom_line">';
            $("#contentsWrap").append(htmls);
            // startNum += 12;
        }
        , error: function (error) {
            // alert("로그인 후 이용해주세요")
            console.log("에러 : " + error);
        }
    });
});


// 각 댓글의 삭제 버튼 클릭
function commentDelete(){
$(document).on('click', '.deleteComment', function () {

    let bid = getParameter("id");
    let id = this.id;
    $.ajax({
        url: "/user/board/content/delete",
        type: 'POST',
        data: {'id': id},
        success: function (data) {
            if(data.result === '200'){
                alert("삭제완료");
                $("#contentsWrap").html('');
                commentList();
            }else if (data.result === '400'){
                alert("로그인이 필요합니다.");
            }else {
                alert("댓글의 작성자가 아닙니다.");

            }
        },
        error: function (error) {
            console.log("에러 : " + error);
        }
    });
})
}


// 각 댓글의 수정 버튼 클릭
function commentUpdate(){
$(document).on('click', '.updateComment', function () {
    var htmls = "";
    let parentNode = $(this).parent().parent().parent().parent().parent().attr('id');
    let name = this.parentNode.parentNode.childNodes[0].childNodes[0].textContent;
    let addr = this.parentNode.parentNode.childNodes[0].childNodes[1].textContent;
    let img = this.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].src;
    let comment = this.parentNode.parentNode.parentNode.childNodes[2].textContent;
    let createTime = this.parentNode.parentNode.parentNode.childNodes[3].textContent;
    let replace = parentNode.replace('rid', '');
    let memberId = this.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].href;
    // memberId.

    if (loginedId === false) {
        return false;
    }

    //닉네임 , 주소 , 내용


    htmls += '<div class="media text-muted pt-3" id="rid' + replace + '">';
    htmls += '<div class="d-flex">';
    htmls += '<div class="ms-3" id="">';
    htmls += '<div class="flex-shrink-0"><a href="'+memberId+'"><img class="rounded-circle" src="'+ img +'"alt="..."/></a></div>'
    htmls += '<div class="test112">';
    htmls += '<div class="fw-bold" id="nametack">';
    htmls += '<div class="comment_Name"><a href="'+ memberId+'" style="text-decoration: none; color:black;">' + name + '</a></div>';
    htmls += '<div class="comment_address">' + addr + '</div>';
    htmls += '</div>';
    htmls += '<div id="updateBtnArea"><button type="button" class="updateSaveComment"><i class="ri-edit-line"> </i></button></div>';
    htmls += '<div id="updateBtnArea"><button type="button" id="' + replace + '" class="deleteComment" ><i class="ri-delete-bin-line"></i></button></div>';
    htmls += '</div>';
    // htmls += '<div class="comment_content">'+data.contents+'</div>';
    htmls += '<textarea class="form-control" id="king" name="content">';
    htmls += comment;
    htmls += '</textarea>';
    htmls += '<div></div>';
    htmls += '</div>';
    htmls += '</div>';
    htmls += '</div>';
    htmls += '<hr class="bottom_line>';
    $('#rid' + replace).replaceWith(htmls);
})
}


$(document).on('click', '.updateSaveComment', function () {

    let hiid = $(this).parent().parent().parent().parent().parent().attr('id');
    let textContent = $('#king').val();

    let comment_id = hiid.replace('rid', '');
    if (fn_checkByte(textContent) === false|| textContent === "" ) {
        alert("댓글 공백은 허용되지 않습니다.");

        return location.href = "";
    }
    if (loginedId === false) {
        return false;
    }

    $.ajax({
        url: "/user/board/content/update",
        type: 'POST',
        data: {'id': comment_id, 'content': textContent},
        success: function (data) {
            if(data.result === '200'){
                $("#contentsWrap").html('');
                commentList();
                alert('수정이 완료되었습니다!');
                loginedId = false;
            }else if (data.result === "100") {
                alert("본인의 댓글만 수정할 수 있습니다.");
                return location.href = "/board/content?id="+oneBoardId;
                // return ;
            }else {
                alert("로그인 후 이용해주세요!");
            }
        },
        error: function (error) {
            // console.log("에러 : " + error);
        }
    });
});



//textarea 바이트 수 체크하는 함수
function fn_checkByte(text_val) {
    const maxByte = 1000; //최대 100바이트
    // const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수

    let totalByte = 0;
    for (let i = 0; i < text_len; i++) {
        const each_char = text_val.charAt(i);
        const uni_char = escape(each_char); //유니코드 형식으로 변환
        if (uni_char.length > 4) {
            // 한글 : 2Byte
            totalByte += 2;
        } else {
            // 영문,숫자,특수문자 : 1Byte
            totalByte += 1;
        }
    }

    if (totalByte > maxByte) {
        alert('최대 1000Byte까지만 입력가능합니다.');
        // document.getElementById("content").value = "";
        return false;
    }
}


function sendMessageModal(memberId) {
    if(loginedId === false){
        alert("로그인 후 이용해주세요!");
        return false;
    }

    var url = "/user/userLink/sendMessage?id="+memberId;
    window.open(url, "쪽지보내기", 'width=500,height=600, scrollbars=no, resizable=no');
}

function moveToDelete(memberId) {
    if (loginedId === false) {
        alert("로그인 후 이용해주세요");
        return false;
    } else {
        if (boardMemberId === loginedIdString) {
            location.href = "/user/board/delete?id=" + memberId;

        } else {
            alert("본인이 작성한 글만 삭제 할 수 있습니다.");
            return false;
        }
    }
}

function moveToUpdate(memberId) {
    if (loginedId === false) {
        alert("로그인 후 이용해주세요");
        return false;
    } else {
        if (boardMemberId === loginedIdString) {
            location.href = "/user/board/update?id=" + memberId;

        } else {
            alert("본인이 작성한 글만 수정 할 수 있습니다.");
            return false;
        }
    }
}

function commentsUpdateVal(memberId) {
    if (loginedId === false) {
        alert("로그인 후 이용해주세요");
        return false;
    } else {
        if (memberId != loginedIdString) {
            alert("본인이 작성한 댓글만 수정할 수 있습니다.");
            return false;
        } else {
            commentUpdate();
        }
    }
}

function commentsDeleteVal(memberId) {
    if (loginedId === false) {
        alert("로그인 후 이용해주세요");
        return false;
    }else {
        if (memberId != loginedIdString) {
            alert("본인이 작성한 댓글만 삭제 할 수 있습니다.");
            return false;
        } else {
            commentDelete();
        }


        htmls += '<div class="allCommentWrap" id="rid' + item.id + '">';
        htmls += '<div class="media text-muted pt-3" id="com">';
        htmls += '<div class="d-flex">';
        htmls += '<div class="flex-shrink-0"><a href="/user/userLink?id='+item.memberId+'"><img class="author-thumb" id="comment_img' + item.id + '" src="' + item.memberPicture + '" alt="..."/></a></div>'
        htmls += '<div class="ms-3" id="for_append_textarea' + item.id + '">';
        htmls += '<div class="test112">';
        htmls += '<div class="fw-bold" id="nametack">';
        htmls += '<div class="comment_Name" id="comment_Name' + item.id + '"><a class="link-dark" href="/user/userLink?id='+item.memberId+'">' + item.memberNickname + '</a></div>';
        htmls += '<div class="comment_address" id="comment_Time' + item.id + '">' + item.createTime + '</div>';
        htmls += '</div>';
        htmls += '<div id="updateBtnArea"><button type="button" class="updateComment" onclick="updateComment(' + item.id + ','+ item.memberId +','+ item.nowUserId +')"><i class="ri-edit-line"></i></input></div>';
        htmls += '<div id="deleteBtnArea"><button type="button" class="deleteComment" onclick="deleteComment(' + item.id + ','+ item.memberId +','+ item.nowUserId +')"><i class="ri-delete-bin-line"></i></input></div>';
        htmls += '</div>';
        htmls += '<div class="comment_content" id="comment_detail' + item.id + '">' + item.contents + '</div>';
        htmls += '</div>';
        htmls += '</div>';
        htmls += '</div>';
        htmls += '<hr>';
        htmls += '</div>';
        $("#marketComment_comments").append(htmls);
    }
}