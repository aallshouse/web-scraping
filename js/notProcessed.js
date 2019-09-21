$(function(){
    $('.not-processed').click(function(e){
        e.preventDefault();
        var that = $(this);
        var transId = that.data('id');
        $.ajax({
            url: '/transactions/processed/' + transId,
            type: 'POST',
            success: function(){
                that.remove();
            }
        });
    });
});