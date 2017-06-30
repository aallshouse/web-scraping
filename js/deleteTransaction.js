$(function(){
    $('#deleteTransaction').click(function(){
        var transId = $(this).data('id');
        $.ajax({
            url: '/transactions/' + transId,
            type: 'DELETE',
            success: function(){
                console.log('transaction has been deleted');
                $('#success-alert').removeClass('hidden')
                    .fadeIn(1500).fadeOut(3000);
                $('#deleteConfirmation').modal('hide');
            }
        });
    });
});