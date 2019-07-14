$(function(){
    $('.btn-info').click(function(){
        var creditCardStatusId = $(this).parent().parent().find('input').val();
        $.ajax({
            url: '/credit/find/' + creditCardStatusId,
            type: 'GET',
            success: function(response){
                $('#companyName').val(response.companyname);
                $('#availableCredit').val(response.availablecredit);
                $('#balance').val(response.balance);
                $('#dateEntered').val(response.dateentered);
                $('#nextDueDate').val(response.nextduedate);
            }
        });
    });
});