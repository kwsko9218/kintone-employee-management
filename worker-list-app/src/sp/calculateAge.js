(function () {
  "use strict";

  const BIRTHDAY_FIELD_CODE = "生年月日";

  // 生年月日から年齢を計算
  kintone.events.on(
    ["mobile.app.record.create.submit", "mobile.app.record.edit.submit"],
    function (event) {
      const record = event.record;

      const birthdayStr = record[BIRTHDAY_FIELD_CODE].value;
      if (!birthdayStr) {
        return event;
      }

      // 生年月日をDateオブジェクトに変換
      const birthday = new Date(birthdayStr);
      const today = new Date();

      // 年齢を計算
      let age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      const dayDiff = today.getDate() - birthday.getDate();

      // 誕生日がまだ来ていない場合、年齢を1引く
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      record.年齢.value = age;

      return event;
    }
  );
})();
