$(function(){
    $('#deleteTransaction').click(function(){
        var transId = $('#transId').val();
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

    $('#deleteConfirmation').on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var transId = button.data('id');
        $('#transId').val(transId);
    });
});