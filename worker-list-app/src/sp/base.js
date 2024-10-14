(function () {
  "use strict";

  const AGE_FIELD_CODE = "年齢";
  const HISTORY_FIELD_CODE = "履歴";

  kintone.events.on(
    ["mobile.app.record.create.show", "mobile.app.record.edit.show"],
    function (event) {
      const record = event.record;

      if (record[AGE_FIELD_CODE]) {
        record[AGE_FIELD_CODE].disabled = true;
      }

      if (record[HISTORY_FIELD_CODE]) {
        record[HISTORY_FIELD_CODE].disabled = true;
      }

      return event;
    }
  );
})();
