$(function(){
    $('.btn-info').click(function(){
        var transId = $(this).parent().parent().find('input').val();
        $.ajax({
            url: '/transactions/find/' + transId,
            type: 'GET',
            success: function(response){
                $('#transactionDescription').val(response.description);
                $('#transactionAmount').val(response.amount);
                $('#transactionDate').val(response.transactiondate);
            }
        });
    });
});