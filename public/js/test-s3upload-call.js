function s3upload(formData) {

  $.post("/.netlify/functions/test-s3upload", JSON.stringify(formData), function(response) {
    $(".result").html(response.message);
  }, "json");

}
