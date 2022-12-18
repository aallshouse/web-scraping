$(function(){
  $('#test').on('click', (e) => {
    e.preventDefault();
    // call an API route that uses Sequelize to query the db
    // /testsequelize
    $.ajax({
      url: '/testsequelize',
      type: 'GET',
      success: function(response){
          console.log(response);
      }
    });
  });
});