function s3upload(formData, callback) {

  $.post("/.netlify/functions/test-s3upload-88sachets", JSON.stringify(formData), function(response) {
    $(".result").html(response.message);
    if (response.error) {
      callback(response.message);
      return;
    }
    callback(null, response.sessionId);
  }, "json");
}
