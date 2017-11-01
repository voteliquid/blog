// Modified from https://github.com/amitu/amitu.github.com/blob/b1be50aaa32c177f740034b0e8a700a454140e59/static/kudos/parse-kudos.js

$(function(){
    var key = document.location.pathname.split('/').join('_')
    $("figure.kudoable").kudoable()

    // Get initial count of kudos
    $.ajax({
      url: 'https://api.united.vote/kudos/' + key,
      type: 'GET',
      accept: 'application/json',
      contentType: 'application/json',
      processData: false,
      success: function(response) {
        $(".num").html(response.count)
      },
      error: function(error) { console.log('kudos GET error', error) }
    })

    if ($.jStorage.get(key)) {
      $("figure.kudoable").removeClass("animate").addClass("complete")
    }

    // Increment kudos
    $("figure.kudo").bind("kudo:added", function(e) {
      $.ajax({
        url: 'https://api.united.vote/kudos/' + key,
        type: 'POST',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        success: function(response) {
          $.jStorage.set(key, true)
          $.jStorage.set(key + '__id', response.id)
          $(".num").html(response.count)
        },
        error: function(error) { console.log('kudos POST error', error) }
      })
    })

    // Decrement kudos
    $("figure.kudo").bind("kudo:removed", function(e) {
      $.ajax({
        url: 'https://api.united.vote/kudos/' + key,
        type: 'DELETE',
        data: JSON.stringify({
          id: $.jStorage.get(key + '__id'),
        }),
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        success: function(response) {
          $.jStorage.set(key, false)
          $.jStorage.deleteKey(key + '__id')
          $(".num").html(response.count)
        },
        error: function(error) { console.log('kudos DELETE error', error) }
      })
    })
})
