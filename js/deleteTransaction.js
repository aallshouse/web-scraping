//const $ = require('jquery');

$(function(){
    $('.btn-danger').click(function(){
        var transId = $(this).data('id');
        $.ajax({
            url: '/transactions/' + transId,
            type: 'DELETE',
            success: function(){
                console.log('transaction has been deleted');
            }
        });
    });
});