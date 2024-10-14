(function () {
  "use strict";

  const HISTORY_APP_CODE = 15;
  const EMPLOYEE_APP_CODE = 17;
  const HISTORY_FIELD_CODE = "履歴";
  const EMPLOYEE_FIELD_CODE = "労働者コード";

  async function updateEmployeeHistory(employeeId) {
    try {
      // 労働履歴を取得
      const historyRecords = await kintone.api("/k/v1/records", "GET", {
        app: HISTORY_APP_CODE,
        query: `${EMPLOYEE_FIELD_CODE} = "${employeeId}" order by 日付 asc`,
      });

      // 労働履歴を文字列に変換
      const historyText = historyRecords.records
        .map((record) => `${record.日付.value}: ${record.内容.value}`)
        .join("\n");

      // 労働者名簿のレコードを取得・更新
      const employeeRecord = (
        await kintone.api("/k/v1/records", "GET", {
          app: EMPLOYEE_APP_CODE,
          query: `${EMPLOYEE_FIELD_CODE} = "${employeeId}"`,
        })
      ).records[0];

      if (!employeeRecord) {
        console.error(
          `従業員コード: ${employeeId} に該当する労働者名簿が見つかりません`
        );
        return;
      }

      await kintone.api("/k/v1/record", "PUT", {
        app: EMPLOYEE_APP_CODE,
        id: employeeRecord.$id.value,
        record: {
          [HISTORY_FIELD_CODE]: {
            value: historyText,
          },
        },
      });
    } catch (error) {
      console.error("従業員履歴の更新に失敗しました:", error);
    }
  }

  kintone.events.on(
    [
      "mobile.app.record.create.submit.success",
      "mobile.app.record.edit.submit.success",
      "mobile.app.record.delete.submit",
    ],
    async (event) => {
      const employeeId = event.record[EMPLOYEE_FIELD_CODE].value;
      try {
        await updateEmployeeHistory(employeeId);
      } catch (error) {
        event.error = "従業員履歴の更新中にエラーが発生しました。";
      }
      return event;
    }
  );
})();
