$(function() {
  $('#login').click((e) => {
    e.preventDefault();
    console.log('admin login button clicked');
    $.ajax({
      url: '/admin/user/verify',
      method: 'POST',
      data: JSON.stringify({
        loginEmail: $('#loginEmail').val(),
        loginPassword: $('#loginPassword').val()
      }),
      contentType: 'application/json'
    }).done(result => {
      console.log('auth login result', result);
      window.location = '/transactions/view?page=1';
    });
  });
});