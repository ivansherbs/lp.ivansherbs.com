function s3upload(formData) {

  console.log("michael");

  $.post("/.netlify/functions/test-s3upload", function(responseStr) {
    var responseJson = JSON.parse(responseStr);
    $(".result").html(JSON.stringify(responseJson, null, 4));
  });

}
