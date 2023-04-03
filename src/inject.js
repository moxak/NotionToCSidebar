// TODO: 見出しを折り畳む処理    

// main processing
// 3秒に1回リロードする
const RELOAD_INTERVAL = 3000;

let content_header_hash;

(() => {
    const timerId = setInterval(() => {
        const notion_page_main_element = document.getElementsByTagName('main');
        
        
        // wait until page loads
        if (notion_page_main_element !== undefined) {
            try {
                // ハッシュ値が変わったら更新を行う
                if (check_update()) {
                    insert_toc();
                } 
                // clearInterval(timerId);
            } catch {

            }
        }
    }, RELOAD_INTERVAL);
})();

// 文字列をハッシュ値に変換する
String.prototype.hashCode = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const check_update = function() {
    const headers = document.querySelectorAll(
        '.notion-header-block, .notion-sub_header-block, .notion-sub_sub_header-block');
    const headers_array_str = Array.from(headers).join(',');

    if (content_header_hash != headers_array_str.hashCode()) {
        content_header_hash = headers_array_str.hashCode();
        console.log('ToC will be updated');
        return true;
    }
    return false;
} 

// ToCの追加
const insert_toc = function() {

    const create_header_block = function(header_text, header_uri, level, min_level=2) {
        // NOTE: 折り畳み機能を保留中のため、ToCの左側には「-」を表示するようにしている
        let block;

        const fold_button_html = `
            <div style="flex-shrink: 0; flex-grow: 0; border-radius: 3px; color: rgba(55, 53, 47, 0.65); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; margin-right: 0px;">
                <div role="button" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 3px;">
                    <svg viewBox="0 0 12 12" class="chevronDownRoundedThick" style="width: 12px; height: 12px; display: block; fill: rgba(55, 53, 47, 0.35); flex-shrink: 0; backface-visibility: hidden; transition: transform 200ms ease-out 0s; transform: rotateZ(-90deg); opacity: 1;">
                        <path d="M6.02734 8.80274C6.27148 8.80274 6.47168 8.71484 6.66211 8.51465L10.2803 4.82324C10.4268 4.67676 10.5 4.49609 10.5 4.28125C10.5 3.85156 10.1484 3.5 9.72363 3.5C9.50879 3.5 9.30859 3.58789 9.15234 3.74902L6.03223 6.9668L2.90722 3.74902C2.74609 3.58789 2.55078 3.5 2.33105 3.5C1.90137 3.5 1.55469 3.85156 1.55469 4.28125C1.55469 4.49609 1.62793 4.67676 1.77441 4.82324L5.39258 8.51465C5.58789 8.71973 5.78808 8.80274 6.02734 8.80274Z"></path>
                    </svg>
                </div>
            </div>`;
                    
        const bullet_list_dot_html = `
            <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; flex-grow: 0; width: 22px; height: 18px; margin-left: -3px; margin-right: 4px; position: relative;">
                <div style="font-size: 12px; font-weight: 500; margin-left: 5px; color: rgba(55, 53, 47, 0.65);">
                •
                </div>
            </div>`;

        if (level == 0) {
            block = `
            <div role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; width: calc(100% - 8px); border-radius: 3px; margin-left: 4px; margin-right: 4px;">
                <div style="display: flex; align-items: center; width: 100%; font-size: 14px; min-height: 27px; padding: 2px 10px 2px 5px; margin-top: 1px; margin-bottom: 1px; border-radius: 3px;">
                    ${bullet_list_dot_html}
                    <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center;">
                        <div class="notranslate" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"> 
                            ${header_text}
                        </div>
                    </div>
                </div>
            </div>`;
        } else if (level == 1) {
            block = `
            <div role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; width: calc(100% - 8px); border-radius: 3px; margin-left: 4px; margin-right: 4px;">
                <div style="display: flex; align-items: center; width: 100%; font-size: 14px; min-height: 27px; padding: 2px 10px 2px 19px; margin-top: 1px; margin-bottom: 1px;">
                    ${bullet_list_dot_html}
                    <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                        ${header_text}
                    </div>
                </div>
            </div>`;
        } else if (level == 2) {
            block = `
            <div role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; width: calc(100% - 8px); border-radius: 3px; margin-left: 4px; margin-right: 4px;">
                <div style="display: flex; align-items: center; width: 100%; font-size: 14px; min-height: 27px; padding: 2px 10px 2px 19px; margin-top: 1px; margin-bottom: 1px;">
                    <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; flex-grow: 0; width: 22px; height: 18px; margin-left: -3px; margin-right: 4px; position: relative;">
                        <div style="font-size: 12px; font-weight: 500; margin-left: 5px; color: rgba(55, 53, 47, 0.65);">
                        </div>
                    </div>
                    ${bullet_list_dot_html}
                    <div style="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: hidden; text-overflow: ellipsis;">
                        ${header_text}
                    </div>
                </div>
            </div>`;
        }
        return `
        <a href="${header_uri}" rel="noopener noreferrer" style="display: block; color: inherit; text-decoration: none; width: 100%;">
            ${block}
        </a>`;
    }

    const create_toc_tree = function() {
        // 本文からヘッダー行を取得
        //  header level 1: notion-header-block
        //  header level 2: notion-sub_header-block
        //  header level 3: notion-sub_sub_header-block
        const headers = document.querySelectorAll(
            '.notion-header-block, .notion-sub_header-block, .notion-sub_sub_header-block');

        // ヘッダーテキストのみの配列を作成
        const header_text_array = Array.from(headers).map(header => header.textContent);

        const page_uri = document.URL.split('#')[0].replace(BASE_URL, '');
        // uriのみの配列を作成
        // data-block-id属性を取得し、'-'を消して、page-uriの後ろに'page-uri#data-block-id'とくっつける
        const header_block_uri_array = Array.from(headers).map(header => {
            return page_uri + '#' + header.getAttribute('data-block-id').replaceAll('-', '')
            // return header.baseURI
        });

        const header_level_array = Array.from(headers).map(header => {
            const className2Level = {
                'notion-header-block': 0,
                'notion-sub_header-block': 1,
                'notion-sub_sub_header-block': 2
            }
            return className2Level[header.classList[1]];
        });
        
        // Math.min or Math.max functions expect distinct variables and not an array. 
        const max_header_level = Math.min(...header_level_array)
        const min_header_level = Math.max(...header_level_array)

        // ToCツリーを作成
        let toc_tree_html = `<div class="notion-selectable notion-collection_view_page-block">`;
        let previous_level = 0;
        for (let i=0; i < header_text_array.length; i++) {
            // 見出し文字がないならばスキップ
            if (header_text_array[i] === "") {
                continue;
            } 
            const header_block_html = create_header_block(
                header_text_array[i], 
                header_block_uri_array[i],
                header_level_array[i]-max_header_level,
                min_header_level);
            if (previous_level < header_level_array[i]) {
                toc_tree_html += header_block_html;
            } else {
                toc_tree_html += `
                <div>
                    ${header_block_html}
                </div>
                `
            }
        }
        toc_tree_html += `</div>`
        return toc_tree_html
    }
    
    const create_header_button = function(header_string) {
        const xmlString = `
            <div class="notion-toc-header" style="display: flex; align-items: center; width: 100%; font-size: 14px; min-height: 24px; padding: 0px 14px 0px 15px; margin-top: 6px; margin-bottom: 2px;">
                <div stlye="flex: 1 1 auto; white-space: nowrap; min-width: 0px; overflow: visible; text-overflow: clip;">
                    <div style="display: flex; align-items: center;">
                        <div role="button" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: flex; align-items: center; border-radius: 3px; padding: 2px 4px; margin-left: -4px;">
                            <span style="text-transform: initial; font-size: 12px; line-height: 1; color: rgba(55, 53, 47, 0.5); font-weight: 600; transition: color 100ms ease-out 0s;">
                            ${header_string}
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;
        const dom_element = new DOMParser().parseFromString(xmlString, "text/html");
        return dom_element.getElementsByClassName('notion-toc-header')[0];
    }

    const create_toc_elements = function(header_html) {
        const xmlString = `
            <div class="notion-toc" style="display: block;">
                <div style>
                    ${header_html}
                </div>
            </div>`;
        const dom_element = new DOMParser().parseFromString(xmlString, "text/html");
        return dom_element.getElementsByClassName('notion-toc')[0];
    }

    const create_sidebar_container = function(header_button, toc_content) {
        const xmlString = `
            <div class="notion-toc-header-container" stlye="margin-bottom: 18px; width: 100%;">
            </div>`;
        // htmlをDOM Elementに変換
        const body = new DOMParser().parseFromString(xmlString, "text/html");
        const sidebar_toc = body.getElementsByClassName('notion-toc-header-container')[0];
        sidebar_toc.appendChild(header_button);
        sidebar_toc.appendChild(toc_content);
        return sidebar_toc;
    }

    const create_toc = function () {
        const toc_tree_html = create_toc_tree();

        // ToC表示用のNodeを作成
        const header_button = create_header_button(HEADER_STRING);
        const toc_contents = create_toc_elements(toc_tree_html);
        // const sidebar_toc = create_sidebar_element(HEADER_STRING, toc_html);
    
        // EventHandlerを追加
        const sidebar_toc_header_button = header_button.querySelector('div[role="button"]');
        sidebar_toc_header_button.addEventListener('click', e => {
            // 表示/非表示をToggle化
            toc_contents.style.display = toc_contents.style.display === 'none' ? 'block' : 'none';
        });
    
        const sidebar_toc_container = create_sidebar_container(header_button, toc_contents);
        return sidebar_toc_container;
    }

    // ToCのDOM Elementのヘッダーテキストを指定
    const HEADER_STRING = "Table of Content";

    // TODO: 自動で取得
    const BASE_URL = "https://www.notion.so";

    // Sidebar Elementを取得
    // サイドバーを囲む領域、class="notion-sidebar-container"
    const sidebar_container = document.getElementsByClassName("notion-sidebar-container")[0];

    // サイドバーの実態全体、class="notion-sidebar"
    const sidebar = sidebar_container.getElementsByClassName("notion-sidebar")[0];

    // サイドバーの中のスクロール可能な領域、class="notion-scroller"
    const sidebar_scroller = sidebar.getElementsByClassName("notion-scroller")[0];

    // サイドバー上にnotion-toc-header-containerが存在するかチェック
    const cnt = sidebar_scroller.getElementsByClassName('notion-toc-header-container').length;
    const sidebar_toc_container = create_toc();

    if (cnt === 1) {
        // 既にnotion-toc-header-containerが存在するならば、置き換える
        sidebar_scroller.firstChild.replaceWith(sidebar_toc_container);
    } else {
        // notion-toc-header-containerを新規作成
        // .insertBefore + .firstChild: sidebar_tocを追加対象Elementの先頭に追加している
        sidebar_scroller.insertBefore(sidebar_toc_container, sidebar_scroller.firstChild);
    } 
};