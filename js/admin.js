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
    });
  });

  $('#testSubmit').click((e) => {
    e.preventDefault();
    console.log('test protected route clicked');
    let emailAddress = $('#testEmail').val();
    $.ajax({
      url: '/test/protected',
      method: 'POST',
      data: JSON.stringify({
        testEmail: emailAddress
      }),
      contentType: 'application/json',
    }).done(result => {
      console.log('test protected route result', result);
    });
  });
});