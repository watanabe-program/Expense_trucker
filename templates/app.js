//グローバル変数で定義しておく
let errorMessage = ""
let itemId = ""
let paidAt = ""
let amount = ""
let paymentMethodId = ""
let place = ""
let note = ""
let userId = ""
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

window.onload = async function() {
    // 1. まずユーザーデータを読み込む（awaitで完了を待つ）
    await loadUsers();
    // 2. データが入った状態でログイン画面を表示
    showLogin();
};

let itemsList = [];

let paymentMethodList = [];

let userList = [];

async function loadItems(){
    try{
        const res = await fetch("http://127.0.0.1:8000/items")
        const data = await res.json()

        itemsList = data
        console.log(itemsList)
    }catch(error){
        console.error("items取得失敗:",error)
    }
}

async function loadPaymentMethods(){
    try{
        const res = await fetch("http://127.0.0.1:8000/paymentMethods")
        const data = await res.json()

        paymentMethodList = data
        console.log(paymentMethodList)
    }catch(error){
        console.error("paymentMethods取得失敗:",error)
    }
}

async function loadUsers(){
    try{
        const res = await fetch("http://127.0.0.1:8000/users")
        const data = await res.json()

        userList = data
        console.log(userList)
    }catch(error){
        console.error("users取得失敗:",error)
    }
}

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


//ログインページ
function showLogin(){

    let optionsUser = createOptions(userList, userId, "userId", "userName");
  document.getElementById("app").innerHTML = `
    <div class="login_page">
    <h1 class="expencetracker">Expense Tracker</h1>

        <div class="login_card">
            <div class="form_area_login">
                <div class="input_group_login">
                    <div class="label_row">
                        <span class="label_text_login">ユーザー名</span>
                    </div>
                    <select id="user" class="input_field_login">
                    <option value="">選択してください</option>
                    ${optionsUser}
                    </select>
                </div>
                <div class="input_group_login">
                    <div class="label_row">
                        <span class="label_text_login">パスワード</span>
                    </div>
                    <input id = "password" type="text" class="input_field_login">
                </div>
            </div>
            <button onclick="loginTry()" class="input_submit_login btn btn_submit">ログイン</button>
        </div>
    </div>
    `
}

async function loginTry(){

    try{
        userId = document.getElementById("user").value;
        password = document.getElementById("password").value;

        const res = await fetch("http://127.0.0.1:8000/login",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                userId:userId,
                password:password
            })
        })

        const data = await res.json()
        console.log(data)

        //re.okはhtmlが200ならすべてokになる
        if(data.result == "ok"){
            showHome(userId)
        }else{
            errorMessage = "ユーザーIDまたはパスワードが違います。"
            showError(errorMessage)
        }
    }catch(error){
        console.error("ログインエラー:",error)
    }

}

//TOPページ
function showHome(userId){
    //ホーム画面に来たらリセット
    errorMessage = ""
    itemId = ""
    paidAt = ""
    amount = ""
    paymentMethodId = ""
    place = "",
    note = "",
    summaryCondition = {summaryFrom: "",summaryTo: "",place: "",paymentMethodId: ""};
    listCondition = {summaryFrom: "",summaryTo: "",place: "",paymentMethodId: ""};
  document.getElementById("app").innerHTML = `
    <div class="top">
    <h1 class="expencetracker">Expense Tracker</h1>

    <nav class="menu">
        <button onclick= "initInput('${itemId}','${paidAt}','${amount}','${paymentMethodId}','${place}','${note}','${userId}')" class="menu_button">
            <span class="button_text">支出入力</span>
        </button>
        <button onclick= "initSummary('${userId}')" class="menu_button">
            <span class="button_text">支出集計</span>
        </button>
        <button onclick= "initList('${userId}')" class="menu_button">
            <span class="button_text">支出一覧</span>
        </button>
    </nav>
    </div>
    `
}

//マスタデータ挿入
async function initInput(itemId,paidAt,amount,paymentMethodId,place,note,userId){
    await loadItems()
    await loadPaymentMethods()
    showInput(itemId,paidAt,amount,paymentMethodId,place,note,userId)
}

async function initSummary(userId){
    await loadItems()
    await loadPaymentMethods()
    showSummary(userId)
}

async function initList(userId){
    await loadItems()
    await loadPaymentMethods()
    showList(userId)
}


//支出入力ページ
function showInput(itemId,paidAt,amount,paymentMethodId,place,note,userId){


    //支出マスタ
    let optionsItem = createOptions(itemsList, itemId, "itemId", "name");
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");


  document.getElementById("app").innerHTML = `
    <div class="input">
        <div class="container">
            <button onclick="showHome('${userId}')" class="top_back btn btn_back ">戻る</button>
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
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">備考</span>
                    </div>
                    <input id = "note" type="text" class="input_field" value = "${note || ''}">
                </div>

                <button onclick="saveExpense('${userId}')" class="input_submit btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

function saveExpense(userId){
    itemId = document.getElementById("item").value;
    paidAt = document.getElementById("paid_at").value;
    amount = document.getElementById("amount").value;
    paymentMethodId = document.getElementById("payment_method").value;
    place = document.getElementById("place").value;
    note = document.getElementById("note").value;
    console.log(itemId,paidAt,amount,paymentMethodId, place)
    if (!itemId || !paidAt || !amount) { 
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    } else {
        showInputConfirm(itemId,paidAt,amount,paymentMethodId,place,note,userId)
    }
    
}

//入力確認ページ
function showInputConfirm(itemId,paidAt,amount,paymentMethodId,place,note,userId){
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
            <div class="confirm_item">
                <span class="item_label">備考</span>
                <span class="item_value">${note || "（未入力）"}</span>
            </div>
            <div class="button_group">
                <button onclick="showInput('${itemId}','${paidAt}','${amount}','${paymentMethodId}','${place}','${note}','${userId}')" class="btn btn_back">戻る</button>
                <button onclick="insertExpense('${itemId}','${paidAt}','${amount}','${paymentMethodId}','${place}','${note}','${userId}')" class="btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

async function insertExpense(itemId,paidAt,amount,paymentMethodId,place,note,userId){
    const data = {
        paidAt: paidAt,
        itemId: Number(itemId),
        amount: Number(amount),
        paymentMethodId: Number(paymentMethodId),
        place: place,
        note: note,
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
        showInput('','','','','','',userId)
    }catch(error){
        console.error("登録失敗:",error)
    }
    
}


//支出集計ページ
function showSummary(userId){
    const { summaryFrom, summaryTo, place, paymentMethodId } = summaryCondition; 
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");
    
  document.getElementById("app").innerHTML = `
    <div class="container">
        <button onclick="showHome('${userId}')" class="top_back btn btn_back">戻る</button>
        
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

            <button onclick="summaryExcecute('${userId}')" class="btn btn_submit" style="margin: 20px auto;">集計</button>
        </div>

        <hr class="separator">
        <div id = "result">
        </div>
    `

}

function summaryExcecute(userId){
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
        summaryResultShow(userId);
    }
}

//支出集計
async function summaryResultShow(userId){
  const { summaryFrom, summaryTo, place, paymentMethodId } = summaryCondition;


    const res = await fetch(`http://127.0.0.1:8000/expenses/${userId}`);
    const expensesList = await res.json();
    console.log(expensesList)

  const filtered = expensesList.filter(exp => {
    console.log(typeof userId, userId)
    console.log(typeof exp.userId, exp.userId)
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
function showList(userId){
    let { summaryFrom, summaryTo, place, paymentMethodId } = listCondition;
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");
    document.getElementById("app").innerHTML = `
    <div class="container">
    <button onclick="showHome('${userId}')" class="top_back btn btn_back">戻る</button>

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

        <button onclick = "listExcecute('${userId}')" class="btn btn_submit" style="margin: 20px auto;">検索</button>
    </div>

    <hr class="separator">

    <div id = "result">
    </div>
    `
}

function listExcecute(userId){
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
        listResultShow(userId)
    }
}

//一覧結果表示
async function listResultShow(userId){

    const { summaryFrom, summaryTo, place, paymentMethodId } = listCondition;
    const res = await fetch(`http://127.0.0.1:8000/expenses/${userId}`);
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
        exp.place,
        exp.note,
        userId
    );
}

//支出編集ページ
function showEdit(currentEditId,itemId,paidAt,amount,paymentMethodId,place,note,userId){
    //支出マスタ
    let optionsItem = createOptions(itemsList, itemId, "itemId", "name");
    //支払方法マスタ
    let optionsPaymentMethod = createOptions(paymentMethodList,paymentMethodId,"paymentMethodId","name");

  document.getElementById("app").innerHTML = `
    <div class="input">
        <div class="container">
            <button onclick="showList('${userId}')" class="top_back btn btn_back ">戻る</button>
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
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">備考</span>
                    </div>
                    <input id = "note" type="text" class="input_field" value = "${note || ''}">
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
    note = document.getElementById("note").value;
    console.log(itemId,paidAt,amount,paymentMethodId, place,note)
    if (!itemId || !paidAt || !amount) { 
        errorMessage = "必須項目が未入力です"
        showError(errorMessage)
    } else {
        showEditConfirm(currentEditId,itemId,paidAt,amount,paymentMethodId,place,note,userId)
    }
    
}

//編集確認ページ
function showEditConfirm(currentEditId,itemId,paidAt,amount,paymentMethodId,place,note,userId){
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
            <div class="confirm_item">
                <span class="item_label">備考</span>
                <span class="item_value">${note || "（未入力）"}</span>
            </div>
            <div class="button_group">
                <button onclick="showEdit('${currentEditId}','${itemId}','${paidAt}','${amount}','${paymentMethodId}','${place}','${note}','${userId}')" class="btn btn_back">戻る</button>
                <button onclick="updateExpense('${currentEditId}','${itemId}','${paidAt}','${amount}','${paymentMethodId}','${place}','${note}','${userId}')" class="btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

async function updateExpense(id, itemId, paidAt, amount, paymentMethodId, place,note,userId){
    const data = {
        paidAt: paidAt,
        itemId: Number(itemId),
        amount: Number(amount),
        paymentMethodId: Number(paymentMethodId),
        place: place,
        note: note,
        userId
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
        showList(userId)

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
        showList(userId);
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
        showList(userId)

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