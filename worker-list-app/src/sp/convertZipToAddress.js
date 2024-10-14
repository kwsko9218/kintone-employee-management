(function () {
  "use strict";

  const ZIP_FIELD_CODE = "郵便番号";
  const ADDRESS_FIELD_CODE = "住所";
  const API_URL = "https://api.zipaddress.net/?zipcode=";

  kintone.events.on(
    [
      "mobile.app.record.create.change." + ZIP_FIELD_CODE,
      "mobile.app.record.edit.change." + ZIP_FIELD_CODE,
    ],
    function (event) {
      // レコード追加または編集画面でzipcodeが変更された時
      const record = event.record;
      const zipcode = record[ZIP_FIELD_CODE].value;
      record[ADDRESS_FIELD_CODE].error = null;
      $.ajax({
        //非同期通信
        url: API_URL + zipcode,
        dataType: "json",
        async: false,
        success: function (response) {
          if (response && response.data) {
            record[ADDRESS_FIELD_CODE].value = response.data.fullAddress;
          } else {
            console.error("Invalid response format:", response);
            record[ADDRESS_FIELD_CODE].error = "住所が見つかりませんでした。";
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("API request failed:", textStatus, errorThrown);
          record[ADDRESS_FIELD_CODE].error = "通信エラーが発生しました。";
        },
      });

      return event;
    }
  );
})();
