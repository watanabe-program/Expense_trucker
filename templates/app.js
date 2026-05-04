//グローバル変数で定義しておく
let errorMessage = ""
let itemId = ""
let paidAt = ""
let amount = ""
let paymentMethodId = ""
let place = ""
let userId = 1
let currentEditId = null;
let expensesList = []; 
let summaryCondition = {
  summaryFrom: "",
  summaryTo: "",
  place: "",
  paymentMethodId: ""
};
let listCondition = {
  summaryFrom: "",
  summaryTo: "",
  place: "",
  paymentMethodId: ""
};
const today = new Date();

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

async function fetchExpenses(){
    try{
        const res = await fetch("http://127.0.0.1:8000/expenses");
        const data = await res.json();
        return data;
    }catch(error){
        console.error('支出一覧を取得できませんでした',error);
        return [];
    }

}


//TOPページ
function showHome(){
    //ホーム画面に来たらリセット
    errorMessage = ""
    itemId = ""
    paidAt = ""
    amount = ""
    paymentMethodId = ""
    place = "",
    summaryCondition = {summaryFrom: "",summaryTo: "",place: "",paymentMethodId: ""};
    listCondition = {summaryFrom: "",summaryTo: "",place: "",paymentMethodId: ""};
  document.getElementById("app").innerHTML = `
    <div class="top">
    <h1 class="expencetracker">Expense Tracker</h1>

    <nav class="menu">
        <button onclick= "showInput(itemId,paidAt,amount,paymentMethodId,place)" class="menu_button">
            <span class="button_text">支出入力</span>
        </button>
        <button onclick= "showSummary()" class="menu_button">
            <span class="button_text">支出集計</span>
        </button>
        <button onclick= "showList()" class="menu_button">
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

async function insertExpense(itemId,paidAt,amount,paymentMethodId,place){
    const data = {
        paidAt: paidAt,
        itemId: Number(itemId),
        amount: Number(amount),
        paymentMethodId: Number(paymentMethodId),
        place: place,
        userId: userId
    }
    try{
        const res = await fetch("http://127.0.0.1:8000/expenses",{
            method : "POST",
            headers : {"Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        } )
        const result = await res.json()
        console.log(result)
        showInput()
    }catch(error){
        console.error("登録失敗:",error)
    }
    
}


//支出集計ページ
function showSummary(){
    const { summaryFrom, summaryTo, place, paymentMethodId } = summaryCondition; 
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

            <button onclick="summaryExcecute()" class="btn btn_submit" style="margin: 20px auto;">集計</button>
        </div>

        <hr class="separator">
        <div id = "result">
        </div>
    `

}

function summaryExcecute(){
    let summaryFrom = document.getElementById("summary_from").value;
    let summaryTo = document.getElementById("summary_to").value;
    let place = document.getElementById("place").value;
    let paymentMethodId = document.getElementById("payment_method").value;

    if(!summaryFrom || !summaryTo){
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    }else if(summaryFrom > summaryTo){
        errorMessage = "終了日は開始日以降の日付を選んでください"
        showError(errorMessage)
    }else{
        summaryCondition = {
            summaryFrom,
            summaryTo,
            place,
            paymentMethodId
        };
        summaryResultShow();
    }
}

//支出集計
async function summaryResultShow(){
  const { summaryFrom, summaryTo, place, paymentMethodId } = summaryCondition;

    const res = await fetch("http://127.0.0.1:8000/expenses");
    const expensesList = await res.json();

  const filtered = expensesList.filter(exp => {
    return (
      exp.paidAt >= summaryFrom &&
      exp.paidAt <= summaryTo &&
      (!place || exp.place.includes(place)) &&
      (!paymentMethodId || exp.paymentMethodId == paymentMethodId)
    );
  });

  const categoryTotals = {};

  filtered.forEach(exp => {
    const item = itemsList.find(m => m.itemId == exp.itemId);
    const name = item ? item.name : "不明";

    if(!categoryTotals[name]){
      categoryTotals[name] = 0;
    }

    categoryTotals[name] += Number(exp.amount);
  });

  const total = filtered.reduce((sum, exp) => sum + Number(exp.amount), 0);

  let categoryHtml = "";

  for(const key in categoryTotals){
    categoryHtml += `
      <div class="result_item">
        <span>${key}</span>
        <span>${categoryTotals[key]}円</span>
      </div>
    `;
  }

  document.getElementById("result").innerHTML = `
    ${categoryHtml}
    <div>合計：${total}円</div>
  `;
}

//支出一覧ページ
function showList(){
    let { summaryFrom, summaryTo, place, paymentMethodId } = listCondition;
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
        <div class="input_group flex_1">
            <div class="label_row"><span class="label_text">支払方法</span></div>
            <select id = "payment_method" class="input_field">
            <option value="">すべて</option>
            ${optionsPaymentMethod}
            </select>
        </div>
        </div>

        <button onclick = "listExcecute()" class="btn btn_submit" style="margin: 20px auto;">検索</button>
    </div>

    <hr class="separator">

    <div id = "result">
    </div>
    `
}

function listExcecute(){
    let summaryFrom = document.getElementById("summary_from").value;
    let summaryTo = document.getElementById("summary_to").value;
    let place = document.getElementById("place").value;
    let paymentMethodId = document.getElementById("payment_method").value;

    if(!summaryFrom || !summaryTo){
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    }else if(summaryFrom > summaryTo){
        errorMessage = "終了日は開始日以降の日付を選んでください"
        showError(errorMessage)
    }
    else{
        listCondition = {
            summaryFrom,
            summaryTo,
            place,
            paymentMethodId
        };
        listResultShow()
    }
}

//一覧結果表示
async function listResultShow(){

    const { summaryFrom, summaryTo, place, paymentMethodId } = listCondition;
    const res = await fetch("http://127.0.0.1:8000/expenses");
    expensesList = await res.json();

  // 絞り込み
  const filtered = expensesList.filter(exp => {
    return (
      exp.paidAt >= summaryFrom &&
      exp.paidAt <= summaryTo &&
      (!place || exp.place.includes(place)) &&
      (!paymentMethodId || exp.paymentMethodId == paymentMethodId)
    );
  });
        console.log(expensesList);
        console.log(filtered);

  let rows = "";
  
  filtered.forEach(exp => {
    let item = itemsList.find(m => m.itemId == exp.itemId);
    rows += `
      <div class="list_row">
        <div class="col_date">${exp.paidAt}</div>
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
    currentEditId = id;
    const exp = expensesList.find(e => e.id == id);
    console.log(exp)
    console.log(expensesList)
    console.log(typeof id)
    console.log(typeof expensesList[0].id)
    showEdit(
        currentEditId,
        exp.itemId,
        exp.paidAt,
        exp.amount,
        exp.paymentMethodId,
        exp.place
    );
}

//支出編集ページ
function showEdit(currentEditId,itemId,paidAt,amount,paymentMethodId,place){
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
                    <button onclick="showDeleteConfirm(${currentEditId})" class="input_submit btn btn_delete">削除</button>
                    <button onclick="goEditExpensePage(${currentEditId})" class="input_submit btn btn_submit">登録</button>
                </div>
            </div>
        </div>
    </div>
    `
}

//編集ページから編集確認ページへ
function goEditExpensePage(currentEditId){
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
        showEditConfirm(currentEditId,itemId,paidAt,amount,paymentMethodId,place)
    }
    
}

//編集確認ページ
function showEditConfirm(currentEditId,itemId,paidAt,amount,paymentMethodId,place){
    let foundItem = itemsList.find(m => String(m.itemId) === String(itemId));
    let item = foundItem ? foundItem.name : "";
    let foundPaymentMethod = paymentMethodList.find(m2 => String(m2.paymentMethodId) === String(paymentMethodId));
    let paymentMethod = foundPaymentMethod ? foundPaymentMethod.name : "";
    

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
                <button onclick="showEdit(${currentEditId},itemId,paidAt,amount,paymentMethodId,place)" class="btn btn_back">戻る</button>
                <button onclick="updateExpense(${currentEditId},itemId,paidAt,amount,paymentMethodId,place)" class="btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

async function updateExpense(id, itemId, paidAt, amount, paymentMethodId, place){
    const data = {
        paidAt: paidAt,
        itemId: Number(itemId),
        amount: Number(amount),
        paymentMethodId: Number(paymentMethodId),
        place: place,
        userId:userId
    }

    try{
        const res = await fetch(`http://127.0.0.1:8000/expenses/${id}`,{
            method : "PATCH",
            headers : {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await res.json()
        console.log(result)
        showList()

    }catch(error){
        console.error("更新失敗:",error)
    }
}

//削除確認ページ
function showDeleteConfirm(currentEditId){
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
        deleteExpense(currentEditId);
        closeDialog();
        showList();
    });
}

async function deleteExpense(id){
    const data = {}

    try{
        const res = await fetch(`http://127.0.0.1:8000/expenses/delete/${id}`,{
            method : "PATCH",
        })

        const result = await res.json()
        console.log(result)
        showList()

    }catch(error){
        console.error("削除失敗:",error)
    }
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