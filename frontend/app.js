//forontend処理
//TOPページ
function showHome(){
  document.getElementById("app").innerHTML = `
    <div class="top">
    <h1 class="expencetracker">Expense Tracker</h1>

    <nav class="menu">
        <button onclick= "showInput()" class="menu_button">
            <span class="button_text">支出入力</span>
        </button>
        <button onclick= "showSummery()" class="menu_button">
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
function showInput(){
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
                    <input type="text" class="input_field" placeholder="例：食費">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払日時</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <input type="date" class="input_field">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">金額</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <div class="amount_row">
                        <input type="number" class="input_field" placeholder="0">
                        <span class="currency">円</span>
                    </div>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select class="input_field">
                        <option value="">選択してください</option>
                        <option value="cash">現金</option>
                        <option value="card">クレジットカード</option>
                        <option value="qr">QR決済</option>
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input type="text" class="input_field" placeholder="例：スーパー">
                </div>

                <button onclick="showInputConfirm()"class="input_submit btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

//入力確認ページ
function showInputConfirm(){
  document.getElementById("app").innerHTML = `
    <div class="container_confirm">
        <div class="confirm_box">
            <div class="header">
                <p class="confirm_title">以下の内容で登録してよろしいですか？</p>
            </div>
            <div class="confirm_item">
                <span class="item_label">費用名</span>
                <span class="item_value">電気代・水道代</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">支払日時</span>
                <span class="item_value">2025/02/19</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">金額</span>
                <span class="item_value">6,000</span>
                <span class="currency">円</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">支払方法</span>
                <span class="item_value">クレジットカード</span>
            </div>
            <div class="confirm_item">
                <span class="item_label">場所</span>
                <span class="item_value">（未入力）</span>
            </div>
            <div class="button_group">
                <button onclick="showInput()" class="btn btn_back">戻る</button>
                <button onclick="showInput()" class="btn btn_submit">登録</button>
            </div>
        </div>
    </div>
    `
}

//支出集計ページ
function showSummery(){
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
                    <input type="date" class="input_field">
                    <span class="range_separator">～</span>
                    <input type="date" class="input_field">
                </div>
            </div>

            <div class="flex_row">
                <div class="input_group flex_1">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input type="text" class="input_field" placeholder="例：スーパー">
                </div>
                <div class="input_group flex_1">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select class="input_field">
                        <option value="">すべて</option>
                        <option value="cash">現金</option>
                        <option value="card">クレジットカード</option>
                        <option value="qr">QR決済</option>
                    </select>
                </div>
            </div>

            <button onclick="summeryExcecute()" class="btn btn_submit" style="margin: 20px auto;">集計</button>
        </div>

        <hr class="separator">
        <div id = "result">
        </div>
    `
}

//支出集計
function summeryExcecute(){
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
}

//支出一覧ページ
function showList(){
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
            <input type="date" class="input_field">
            <span class="range_separator">～</span>
            <input type="date" class="input_field">
        </div>
        </div>

        <div class="flex_row">
        <div class="input_group flex_1">
            <div class="label_row"><span class="label_text">場所</span></div>
            <input type="text" class="input_field" placeholder="例：スーパー">
        </div>
        <div class="input_group flex_1">
            <div class="label_row"><span class="label_text">支払方法</span></div>
            <select class="input_field">
            <option value="">すべて</option>
            <option value="cash">現金</option>
            <option value="card">カード</option>
            <option value="qr">QR決済</option>
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

//一覧結果表示
function listExcecute(){
  document.getElementById("result").innerHTML = `
    <div class="result_section">
        <h2 class="label_text" style="margin-bottom: 20px;">検索結果</h2>
        
        <div class="list_container">
        <div class="list_header">
            <div class="col_date">日付</div>
            <div class="col_category">経費</div>
            <div class="col_amount">金額</div>
            <div class="col_action"></div>
        </div>

        <div class="list_row">
            <div class="col_date">2025/02/02</div>
            <div class="col_category">食費</div>
            <div class="col_amount">5,000<small>円</small></div>
            <div class="col_action">
            <button onclick = "showEdit()" class="btn_edit_small">編集</button>
            </div>
        </div>

        <div class="list_row">
            <div class="col_date">2025/02/02</div>
            <div class="col_category">日用品</div>
            <div class="col_amount">1,200<small>円</small></div>
            <div class="col_action">
            <button onclick = "showEdit()" class="btn_edit_small">編集</button>
            </div>
        </div>
        </div>
    </div>
    </div>
    `
}

//支出編集ページ
function showEdit(){
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
                    <input type="text" class="input_field" placeholder="例：食費">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払日時</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <input type="date" class="input_field">
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">金額</span>
                        <span class="required_tag">必須</span>
                    </div>
                    <div class="amount_row">
                        <input type="number" class="input_field" placeholder="0">
                        <span class="currency">円</span>
                    </div>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">支払方法</span>
                    </div>
                    <select class="input_field">
                        <option value="">選択してください</option>
                        <option value="cash">現金</option>
                        <option value="card">クレジットカード</option>
                        <option value="qr">QR決済</option>
                    </select>
                </div>
                <div class="input_group">
                    <div class="label_row">
                        <span class="label_text">場所</span>
                    </div>
                    <input type="text" class="input_field" placeholder="例：スーパー">
                </div>
                <div class="button_group_edit">
                    <button onclick="showDeleteConfirm()" class="input_submit btn btn_delete">削除</a></button>
                    <button onclick="showInputConfirm()" class="input_submit btn btn_submit">登録</a></button>
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
        <p class="error_text">必須項目で未入力の項目があります<br>入力し直してください</p>
        <button onclick="closeDialog()" class="btn error_button">戻る</button>          
    </div>
    </div>
    `
}

window.onload = function(){
    showHome()
}