//グローバル変数で定義しておく
let errorMessage = ""
let itemId = ""
let paidAt = ""
let amount = ""
let paymentMethodId = ""
let place = ""
let summaryFrom = ""
let summaryTo = ""


let expensesList = [
  {
    id: 1,
    date: "2025-02-02",
    itemId: 1,
    amount: 5000,
    paymentMethodId: 1,
    place: "スーパー"
  },
  {
    id: 2,
    date: "2025-02-02",
    itemId: 3,
    amount: 1200,
    paymentMethodId: 2,
    place: "ドラッグストア"
  }
];

let itemsList = [
  { itemId: 1, name: "食費" },
  { itemId: 2, name: "水光熱費" },
  { itemId: 3, name: "その他" }
];

let paymentMethodList = [
  { paymentMethodId: 1, name: "現金" },
  { paymentMethodId: 2, name: "クレジットカード" },
  { paymentMethodId: 3, name: "コード決済" },
  { paymentMethodId: 4, name: "その他" }
];


//TOPページ
function showHome(){
    //ホーム画面に来たらリセット
    errorMessage = ""
    itemId = ""
    paidAt = ""
    amount = ""
    paymentMethodId = ""
    place = ""
    summaryFrom = ""
    summaryTo = ""
  document.getElementById("app").innerHTML = `
    <div class="top">
    <h1 class="expencetracker">Expense Tracker</h1>

    <nav class="menu">
        <button onclick= "showInput(itemId,paidAt,amount,paymentMethodId,place)" class="menu_button">
            <span class="button_text">支出入力</span>
        </button>
        <button onclick= "showSummary(summaryFrom,summaryTo,place,paymentMethodId)" class="menu_button">
            <span class="button_text">支出集計</span>
        </button>
        <button onclick= "showList(summaryFrom,summaryTo,place,paymentMethodId)" class="menu_button">
            <span class="button_text">支出一覧</span>
        </button>
    </nav>
    </div>
    `
}

//支出入力ページ
function showInput(itemId,paidAt,amount,paymentMethodId,place){
    //支出マスタ
    let optionsItem = createOptions(itemsList, itemId, "itemId", "name");
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");


  document.getElementById("app").innerHTML = `
    <div class="input">
        <div class="container">
            <button onclick="showHome()" class="top_back btn btn_back ">戻る</button>
            <div class="header">
                <h1 class="title">支出入力</h1>
            </div>
            <div class="form_area">
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">費用名</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <select id="item" class="input_field">
                    <option value="">選択してください</option>
                    ${optionsItem}
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払日時</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <input id = "paid_at" type="date" class="input_field" value = "${paidAt || ''}">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">金額</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <div class="amount_row">
                        <input id = "amount" type="number" class="input_field" placeholder="0" value = "${amount || ''}">
                        <span class="currency">円</span>
                    </div>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select id = "payment_method" class="input_field">
                        <option value="">選択してください</option>
                        ${optionsPaymentMethod}
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input id = "place" type="text" class="input_field" placeholder="例：スーパー" value = "${place || ''}">
                </div>

                <button onclick="saveExpense()" class="input_submit btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

function saveExpense(){
    itemId = document.getElementById("item").value;
    paidAt = document.getElementById("paid_at").value;
    amount = document.getElementById("amount").value;
    paymentMethodId = document.getElementById("payment_method").value;
    place = document.getElementById("place").value;
    console.log(itemId,paidAt,amount,paymentMethodId, place)
    if (!itemId || !paidAt || !amount) { 
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    } else {
        showInputConfirm(itemId,paidAt,amount,paymentMethodId,place)
    }
    
}

//入力確認ページ
function showInputConfirm(itemId,paidAt,amount,paymentMethodId,place){
    let foundItem = itemsList.find(m => String(m.itemId) === String(itemId));
    let item = foundItem ? foundItem.name : "";
    let foundPaymentMethod = paymentMethodList.find(m2 => String(m2.paymentMethodId) === String(paymentMethodId));
    let paymentMethod = foundItem ? foundPaymentMethod.name : "";
    

  document.getElementById("app").innerHTML = `
    <div class="container_confirm">
        <div class="confirm_box">
            <div class="header">
                <p class="confirm_title">以下の内容で登録してよろしいですか？</p>
            </div>
            <div class="confirm_item">
                <span class="item_label">費用名</span>
                <span class="item_value">${item}</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">支払日時</span>
                <span class="item_value">${paidAt}</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">金額</span>
                <span class="item_value">${amount}</span>
                <span class="currency">円</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">支払方法</span>
                <span class="item_value">${paymentMethod || "（未入力）"}</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">場所</span>
                <span class="item_value">${place || "（未入力）"}</span>
            </div>
            <div class="button_group">
                <button onclick="showInput(itemId,paidAt,amount,paymentMethodId,place)" class="btn btn_back">戻る</button>
                <button onclick="insertExpense(itemId,paidAt,amount,paymentMethodId,place)" class="btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

function insertExpense(itemId,paidAt,amount,paymentMethodId,place){
    console.log(itemId,paidAt,amount,paymentMethodId,place)
    showInput()
    
}


//支出集計ページ
function showSummary(summaryFrom,summaryTo,place,paymentMethodId){
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");
  document.getElementById("app").innerHTML = `
    <div class="container">
        <button onclick="showHome()" class="top_back btn btn_back">戻る</button>
        
        <div class="header">
            <h1 class="title">支出集計</h1>
        </div>

        <div class="form_area summary_controls">
            <div class="input_group">
                <div class="label_row">
                    <span class="label_text">集計期間</span>
                    <span class="required_tag">必須</span>
                </div>
                <div class="flex_row">
                    <input id = "summary_from" type="date" class="input_field" value = "${summaryFrom || ''}">
                    <span class="range_separator">～</span>
                    <input id = "summary_to" type="date" class="input_field" value = "${summaryTo || ''}">
                </div>
            </div>

            <div class="flex_row">
                <div class="input_group flex_1">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input id = "place" type="text" class="input_field" placeholder="例：スーパー" value = "${place || ""}">
                </div>
                <div class="input_group flex_1">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select id = "payment_method" class="input_field">
                    <option value="">すべて</option>
                    ${optionsPaymentMethod}
                    </select>
                </div>
            </div>

            <button onclick="summaryExcecute(summaryFrom,summaryTo,place,paymentMethod)" class="btn btn_submit" style="margin: 20px auto;">集計</button>
        </div>

        <hr class="separator">
        <div id = "result">
        </div>
    `

}

function summaryExcecute(summaryFrom,summaryTo,place,paymentMethodId){
    summaryFrom = document.getElementById("summary_from").value;
    summaryTo = document.getElementById("summary_to").value;
    place = document.getElementById("place").value;
    paymentMethodId = document.getElementById("payment_method").value;

    if(!summaryFrom || !summaryTo){
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    }else{
        summaryResultShow(summaryFrom,summaryTo,place,paymentMethodId)
    }
}

//支出集計
function summaryResultShow(summaryFrom,summaryTo,place,paymentMethodId){
  document.getElementById("result").innerHTML = `
        <div class="result_section">
            <h2 class="label_text" style="margin-bottom: 20px;">集計結果</h2>
            
            <div class="result_grid">
                <div class="result_item">
                    <span class="category_name">食費</span>
                    <span class="category_amount">25,000 <small>円</small></span>
                </div>
                <div class="result_item">
                    <span class="category_name">日用品</span>
                    <span class="category_amount">8,200 <small>円</small></span>
                </div>
                <div class="result_item">
                    <span class="category_name">交際費</span>
                    <span class="category_amount">12,000 <small>円</small></span>
                </div>
                <div class="result_item">
                    <span class="category_name">その他</span>
                    <span class="category_amount">3,500 <small>円</small></span>
                </div>
            </div>

            <div class="total_row">
                <span class="total_label">総合計</span>
                <span class="total_amount">48,700 <small>円</small></span>
            </div>
        </div>
    </div>
    `
    console.log(summaryFrom,summaryTo,place,paymentMethodId)
}


//支出一覧ページ
function showList(summaryFrom,summaryTo,place,paymentMethodId){
let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");
  document.getElementById("app").innerHTML = `
    <div class="container">
    <button onclick="showHome()" class="top_back btn btn_back">戻る</button>

    <div class="header">
        <h1 class="title">支出一覧</h1>
    </div>

    <div class="form_area summary_controls">
        <div class="input_group">
        <div class="label_row">
            <span class="label_text">検索期間</span>
            <span class="required_tag">必須</span>
        </div>
        <div class="flex_row">
            <input id = "summary_from" type="date" class="input_field" value = "${summaryFrom || ''}">
            <span class="range_separator">～</span>
            <input id = "summary_to" type="date" class="input_field" value = "${summaryTo || ''}">
        </div>
        </div>

        <div class="flex_row">
        <div class="input_group flex_1">
            <div class="label_row"><span class="label_text">場所</span></div>
            <input id = "place" type="text" class="input_field" placeholder="例：スーパー" value = "${place || ""}">
        </div>
        <div id = "payment_method" class="input_group flex_1">
            <div class="label_row"><span class="label_text">支払方法</span></div>
            <select id = "payment_method" class="input_field">
            <option value="">すべて</option>
            ${optionsPaymentMethod}
            </select>
        </div>
        </div>

        <button onclick = "listExcecute(summaryFrom,summaryTo,place,paymentMethodId)" class="btn btn_submit" style="margin: 20px auto;">検索</button>
    </div>

    <hr class="separator">

    <div id = "result">
    </div>
    `
}

function listExcecute(summaryFrom,summaryTo,place,paymentMethodId){
    summaryFrom = document.getElementById("summary_from").value;
    summaryTo = document.getElementById("summary_to").value;
    place = document.getElementById("place").value;
    paymentMethodId = document.getElementById("payment_method").value;

    if(!summaryFrom || !summaryTo){
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    }else{
        listResultShow(summaryFrom,summaryTo,place,paymentMethodId)
    }
}

//一覧結果表示
function listResultShow(){
  let rows = "";
  
  expensesList.forEach(exp => {
    let item = itemsList.find(m => m.itemId == exp.itemId);
    rows += `
      <div class="list_row">
        <div class="col_date">${exp.date}</div>
        <div class="col_category">${item ? item.name : ""}</div>
        <div class="col_amount">${exp.amount}<small>円</small></div>
        <div class="col_action">
          <button onclick="goEdit(${exp.id})" class="btn_edit_small">編集</button>
        </div>
      </div>
    `;
  });

  document.getElementById("result").innerHTML = `
    <div class="result_section">
      <h2 class="label_text">検索結果</h2>

      <div class="list_container">
        <div class="list_header">
          <div class="col_date">日付</div>
          <div class="col_category">経費</div>
          <div class="col_amount">金額</div>
          <div class="col_action"></div>
        </div>

        ${rows}
      </div>
    </div>
  `;
}

function goEdit(id){
  const data = expensesList.find(e => e.id === id);

    showEdit(
    data.itemId,
    data.date,
    data.amount,
    data.paymentMethodId,
    data.place
  );
}

//支出編集ページ
function showEdit(itemId,paidAt,amount,paymentMethodId,place){
    //支出マスタ
    let optionsItem = createOptions(itemsList, itemId, "itemId", "name");
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");

  document.getElementById("app").innerHTML = `
    <div class="input">
        <div class="container">
            <button onclick="showList()" class="top_back btn btn_back ">戻る</button>
            <div class="header">
                <h1 class="title">支出編集</h1>
            </div>
            <div class="form_area">
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">費用名</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <select id="item" class="input_field">
                    <option value="">選択してください</option>
                    ${optionsItem}
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払日時</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <input id = "paid_at" type="date" class="input_field" value = "${paidAt || ''}">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">金額</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <div class="amount_row">
                        <input id = "amount" type="number" class="input_field" placeholder="0" value = "${amount || ''}">
                        <span class="currency">円</span>
                    </div>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select id = "payment_method" class="input_field">
                        <option value="">選択してください</option>
                        ${optionsPaymentMethod}
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input id = "place" type="text" class="input_field" placeholder="例：スーパー" value = "${place || ''}">
                </div>
                <div class="button_group_edit">
                    <button onclick="showDeleteConfirm()" class="input_submit btn btn_delete">削除</button>
                    <button onclick="showInputConfirm()" class="input_submit btn btn_submit">登録</button>
                </div>
            </div>
        </div>
    </div>
    `
}

//削除確認ページ
function showDeleteConfirm(){
  document.getElementById("dialog").innerHTML = `
    <div class="overlay">
        <div class="confirm_card">
            <p class="confirm_text">本当に削除してよろしいですか？</p>
            
            <div class="confirm_buttons">
            <button onclick="closeDialog()" class="btn btn_back ">戻る</button>
            <button id = delete_button class="btn btn_delete">削除</button>
            </div>
        </div>
    </div>
    `
    let deleteButton = document.getElementById('delete_button');

    deleteButton.addEventListener('click', function(){
        closeDialog();
        showList();
    });
}

function closeDialog(){
  document.getElementById("dialog").innerHTML = ""
}

function expenceDelete(){
  closeDialog()
}


//エラー表示ページ
function showError(){
  document.getElementById("dialog").innerHTML = `
    <div class="overlay">
    <div class="error_card">
        <p class="error_text">${errorMessage}</p>
        <button onclick="closeDialog()" class="btn error_button">戻る</button>          
    </div>
    </div>
    `
}

//関数
function createOptions(list, selectedId, valueKey, nameKey){
  let options = '';

  list.forEach(m => {
    options += `
      <option value="${m[valueKey]}" ${String(selectedId) === String(m[valueKey]) ? "selected" : ""}>
        ${m[nameKey]}
      </option>
    `;
  });

  return options;
}

window.onload = function(){
    showHome()
}