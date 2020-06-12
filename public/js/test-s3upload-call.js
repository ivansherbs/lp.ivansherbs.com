function s3upload(formdata) {

  console.log("michael");

  $.post("/.netlify/functions/test-s3upload", function(responsedata) {
    $(".result").html(responsedata);
  });

}
